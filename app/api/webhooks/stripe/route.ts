import { connectDB } from "@/lib/mongodb";
import { Booking } from "@/lib/models/Booking";
import { getStripe } from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const sig = req.headers.get("stripe-signature");

    if (!sig) {
      return NextResponse.json({ message: "No signature found" }, { status: 400 });
    }

    const stripe = getStripe();
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err.message);
      return NextResponse.json({ message: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as any;
      const bookingId = session.metadata?.bookingId;

      if (bookingId) {
        await connectDB();
        const booking = await Booking.findById(bookingId);
        
        if (booking && booking.status !== "confirmed") {
          booking.status = "confirmed";
          booking.stripeSessionId = session.id;
          await booking.save();
          console.log(`Booking ${bookingId} confirmed via Stripe Webhook`);
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
