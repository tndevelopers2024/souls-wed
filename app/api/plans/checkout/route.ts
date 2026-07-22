import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "@/lib/session";
import { getStripe } from "@/lib/stripe";
import {
  findPlan,
  PLAN_TEST_MODE,
  TEST_PRICE_INR,
  SUBSCRIPTION_PLANS,
} from "@/lib/config/plans";

/**
 * Creates a Stripe Checkout Session for a subscription or advertisement plan.
 *
 * While PLAN_TEST_MODE is on the charge is TEST_PRICE_INR (₹30 / ₹50) rather
 * than the real amount, so the client can verify the payment flow end to end
 * before the real prices go live.
 */
export async function POST(req: Request) {
  try {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);

    if (!session.isLoggedIn) {
      return NextResponse.json(
        { message: "Please log in to continue to payment." },
        { status: 401 }
      );
    }

    const { planId } = await req.json();
    const plan = typeof planId === "string" ? findPlan(planId) : undefined;

    if (!plan) {
      return NextResponse.json({ message: "Unknown plan." }, { status: 400 });
    }

    if (plan.offerPriceUSD <= 0) {
      return NextResponse.json(
        { message: "This plan is free — no payment required." },
        { status: 400 }
      );
    }

    const isSubscription = SUBSCRIPTION_PLANS.some((p) => p.id === plan.id);
    const label = "name" in plan ? plan.name : plan.title;

    // Amount is resolved on the server from the plan id — never trust a price
    // sent by the browser.
    const currency = PLAN_TEST_MODE ? "inr" : "usd";
    const amountMinorUnits = PLAN_TEST_MODE
      ? TEST_PRICE_INR[plan.testTier] * 100
      : Math.round(plan.offerPriceUSD * 100);

    const origin = new URL(req.url).origin;
    const returnPath = isSubscription ? "subscribe" : "advertise";

    const checkoutSession = await getStripe().checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: isSubscription
                ? `SoulsWed ${label} subscription`
                : `SoulsWed advertising — ${label}`,
              ...(PLAN_TEST_MODE
                ? { description: "Test transaction — reduced amount for payment verification" }
                : {}),
            },
            unit_amount: amountMinorUnits,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      customer_email: session.email,
      success_url: `${origin}/${returnPath}?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/${returnPath}?canceled=true`,
      metadata: {
        planId: plan.id,
        planType: isSubscription ? "subscription" : "advertisement",
        vendorId: session.userId,
        testMode: String(PLAN_TEST_MODE),
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error: unknown) {
    console.error("Plan checkout error:", error);
    return NextResponse.json(
      { message: "Could not start payment. Please try again." },
      { status: 500 }
    );
  }
}
