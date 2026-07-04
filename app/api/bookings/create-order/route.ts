import { connectDB } from "@/lib/mongodb";
import { Booking } from "@/lib/models/Booking";
import { getStripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "@/lib/session";
import { convertINRTo } from "@/lib/currency";

export async function POST(req: Request) {
  try {
    const session = await getIronSession<SessionData>(
      await cookies(),
      sessionOptions
    );

    if (!session.isLoggedIn) {
      return NextResponse.json(
        { message: "Authentication required." },
        { status: 401 }
      );
    }

    const { bookingId } = await req.json();
    if (!bookingId) {
      return NextResponse.json(
        { message: "Booking ID is required." },
        { status: 400 }
      );
    }

    await connectDB();

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return NextResponse.json(
        { message: "Booking not found." },
        { status: 404 }
      );
    }

    // Verify the booking belongs to this user
    if (booking.userId.toString() !== session.userId) {
      return NextResponse.json(
        { message: "You don't have permission to pay for this booking." },
        { status: 403 }
      );
    }

    if (booking.status !== "pending") {
      return NextResponse.json(
        { message: `Booking is already ${booking.status}. Cannot create a new payment.` },
        { status: 400 }
      );
    }

    const currency = booking.currency || "INR";
    const origin = new URL(req.url).origin;

    const stripe = getStripe();
    const convertedAmount = convertINRTo(booking.advanceAmount, currency);

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: `Booking Advance for ${booking.venueName}`,
            },
            unit_amount: Math.round(convertedAmount * 100), // cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/venues/${booking.venueId}?success=true&session_id={CHECKOUT_SESSION_ID}&booking_id=${booking._id}`,
      cancel_url: `${origin}/venues/${booking.venueId}?canceled=true`,
      metadata: {
        bookingId: booking._id.toString(),
      },
    });

    // Store the Stripe Checkout Session ID for later verification
    booking.stripeSessionId = checkoutSession.id;
    await booking.save();

    return NextResponse.json({
      url: checkoutSession.url,
    });
  } catch (error: unknown) {
    console.error("Create order error:", error);
    return NextResponse.json(
      { message: "Failed to create payment order." },
      { status: 500 }
    );
  }
}
