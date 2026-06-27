/**
 * 🎓 CREATE RAZORPAY ORDER — POST /api/bookings/create-order
 * 
 * This is STEP 1 of the 3-step payment flow:
 * 
 * STEP 1 (this file): Server creates a Razorpay "order"
 *   - Tells Razorpay: "I need to collect ₹X for booking ABC"
 *   - Razorpay returns an order_id
 *   - We save this order_id on the booking
 * 
 * STEP 2 (frontend): Opens Razorpay popup with the order_id
 *   - User enters card/UPI details
 *   - Razorpay processes the payment
 * 
 * STEP 3 (verify-payment): Server verifies the payment
 *   - Confirms the payment actually happened
 *   - Updates booking status to "confirmed"
 * 
 * WHY CREATE AN ORDER FIRST?
 * If you just let the frontend collect money directly, the user could
 * change the amount in DevTools (₹50,000 → ₹1). By creating the order
 * server-side, Razorpay enforces the correct amount.
 */

import { connectDB } from "@/lib/mongodb";
import { Booking } from "@/lib/models/Booking";
import { getStripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "@/lib/session";
import { convertINRTo, CURRENCIES } from "@/lib/currency";

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

    const { bookingId } = await req.json();
    if (!bookingId) {
      return NextResponse.json(
        { message: "Booking ID is required." },
        { status: 400 }
      );
    }

    await connectDB();

    // ─── Find the booking ───
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return NextResponse.json(
        { message: "Booking not found." },
        { status: 404 }
      );
    }

    // ─── Security: verify the booking belongs to this user ───
    if (booking.userId.toString() !== session.userId) {
      return NextResponse.json(
        { message: "You don't have permission to pay for this booking." },
        { status: 403 }
      );
    }

    // ─── Check booking is in "pending" status ───
    if (booking.status !== "pending") {
      return NextResponse.json(
        { message: `Booking is already ${booking.status}. Cannot create a new payment.` },
        { status: 400 }
      );
    }

    const currency = booking.currency || "INR";

    const requestUrl = new URL(req.url);
    const origin = requestUrl.origin;

    // ─── Developer Mock mode bypass ───
    const isStripeMock = process.env.STRIPE_SECRET_KEY === "sk_test_placeholder" || process.env.STRIPE_SECRET_KEY?.includes("placeholder");

    if (isStripeMock) {
      // Return a mock checkout success redirect URL
      return NextResponse.json({
        gateway: "stripe",
        url: `${origin}/venues/${booking.venueId}?success=true&session_id=session_mock_${booking._id}&booking_id=${booking._id}`,
      });
    }

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
            unit_amount: Math.round(convertedAmount * 100), // cents/paise
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

    // Save the stripe session ID so we can verify it later
    booking.razorpayOrderId = checkoutSession.id; 
    await booking.save();

    return NextResponse.json({
      gateway: "stripe",
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
