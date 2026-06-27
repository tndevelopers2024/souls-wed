import { connectDB } from "@/lib/mongodb";
import { Booking } from "@/lib/models/Booking";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "@/lib/session";
import { getStripe } from "@/lib/stripe";

export async function POST(req: Request) {
  try {
    // ─── Authentication check ───
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

    const {
      payment_intent_id,
      bookingId,
    } = await req.json();

    if (!bookingId) {
      return NextResponse.json(
        { message: "Booking ID is required." },
        { status: 400 }
      );
    }

    if (!payment_intent_id) {
      return NextResponse.json(
        { message: "Missing Stripe session ID." },
        { status: 400 }
      );
    }

    // Bypass verification for Stripe mock sessions
    if (payment_intent_id.startsWith("session_mock_")) {
      // Mock success
    } else {
      const stripe = getStripe();
      const sessionObj = await stripe.checkout.sessions.retrieve(payment_intent_id);

      if (sessionObj.payment_status !== "paid") {
        return NextResponse.json(
          { message: "Stripe payment not successful." },
          { status: 400 }
        );
      }
    }

    // ─── Step 2: Update booking status ───
    await connectDB();

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return NextResponse.json(
        { message: "Booking not found." },
        { status: 404 }
      );
    }

    // Security: verify ownership
    if (booking.userId.toString() !== session.userId) {
      return NextResponse.json(
        { message: "Permission denied." },
        { status: 403 }
      );
    }

    // Save payment details and update status
    booking.razorpayPaymentId = payment_intent_id; // Store Stripe Session ID
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
