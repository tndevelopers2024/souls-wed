import { connectDB } from "@/lib/mongodb";
import { Booking } from "@/lib/models/Booking";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "@/lib/session";
import { getStripe } from "@/lib/stripe";

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

    const { stripe_session_id, bookingId } = await req.json();

    if (!bookingId) {
      return NextResponse.json(
        { message: "Booking ID is required." },
        { status: 400 }
      );
    }

    if (!stripe_session_id) {
      return NextResponse.json(
        { message: "Missing Stripe session ID." },
        { status: 400 }
      );
    }

    // Verify the payment with Stripe
    const stripe = getStripe();
    const stripeSession = await stripe.checkout.sessions.retrieve(stripe_session_id);

    if (stripeSession.payment_status !== "paid") {
      return NextResponse.json(
        { message: "Stripe payment not completed." },
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

    // Verify ownership
    if (booking.userId.toString() !== session.userId) {
      return NextResponse.json(
        { message: "Permission denied." },
        { status: 403 }
      );
    }

    // Cross-check: the session ID must match what we stored when creating the order
    if (booking.stripeSessionId && booking.stripeSessionId !== stripe_session_id) {
      return NextResponse.json(
        { message: "Session ID mismatch. Payment cannot be verified." },
        { status: 400 }
      );
    }

    // Prevent double-confirmation
    if (booking.status === "confirmed") {
      return NextResponse.json({
        success: true,
        message: "Booking is already confirmed.",
        booking: { id: booking._id, status: booking.status, venueName: booking.venueName },
      });
    }

    booking.stripeSessionId = stripe_session_id;
    booking.status = "confirmed";
    await booking.save();

    return NextResponse.json({
      success: true,
      message: "Payment verified! Your booking is confirmed.",
      booking: {
        id: booking._id,
        status: booking.status,
        venueName: booking.venueName,
      },
    });
  } catch (error: unknown) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { message: "Payment verification failed." },
      { status: 500 }
    );
  }
}
