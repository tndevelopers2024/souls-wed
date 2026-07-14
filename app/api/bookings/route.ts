/**
 * 🎓 BOOKINGS API — POST + GET /api/bookings
 * 
 * POST: Create a new booking
 *   - Requires authenticated user (checks iron-session)
 *   - Validates all required fields
 *   - Calculates advance amount (30% of total)
 *   - Creates booking with status "pending"
 * 
 * GET: List bookings for the current user
 *   - Returns all bookings for the logged-in user
 *   - Sorted by creation date (newest first)
 *   - Used by the user dashboard to show their bookings
 * 
 * WHY 30% ADVANCE?
 * In the Indian wedding industry, venues typically charge 20-50% advance
 * to confirm a booking, with the rest paid on the event day.
 * 30% is a common middle ground.
 */

import { connectDB } from "@/lib/mongodb";
import { Booking } from "@/lib/models/Booking";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "@/lib/session";

// ─── Advance percentage ───
const ADVANCE_PERCENTAGE = 0.3; // 30%

// ════════════════════════════════════════════════════════════
// POST — Create a new booking
// ════════════════════════════════════════════════════════════
export async function POST(req: Request) {
  try {
    // ─── Step 1: Check authentication ───
    const session = await getIronSession<SessionData>(
      await cookies(),
      sessionOptions
    );

    // STRICT LOGIN REQUIREMENT
    if (!session.isLoggedIn) {
      return NextResponse.json(
        { message: "You must be logged in to make a booking." },
        { status: 401 }
      );
    }

    // ─── Step 2: Parse request body ───
    const body = await req.json();
    const {
      providerId,
      providerName,
      bookingType,
      eventDate,
      checkIn,
      checkOut,
      guestCount,
      roomCount,
      totalAmount,
      functionType,
      functionTime,
      specialRequests,
      notifyWhatsapp,
      userPhone,
      currency,
    } = body;

    // ─── Step 3: Validate required fields ───
    if (!providerId || !providerName || !bookingType || !totalAmount) {
      return NextResponse.json(
        { message: "Missing required booking fields." },
        { status: 400 }
      );
    }

    if (specialRequests && specialRequests.length > 1000) {
      return NextResponse.json(
        { message: "Special requests must be 1000 characters or fewer." },
        { status: 400 }
      );
    }

    // Validate booking-type-specific dates
    if (bookingType !== "room" && !eventDate) {
      return NextResponse.json(
        { message: "Event date is required for this booking." },
        { status: 400 }
      );
    }

    if (bookingType === "room" && (!checkIn || !checkOut)) {
      return NextResponse.json(
        { message: "Check-in and check-out dates are required for room bookings." },
        { status: 400 }
      );
    }

    // ─── Step 4: Check for conflicts ───
    // Make sure the requested date(s) aren't already booked
    await connectDB();

    let conflictQuery: Record<string, unknown> = {
      providerId,
      status: { $in: ["pending", "confirmed"] },
    };

    if (bookingType === "room") {
      // A room range conflicts if: existing.checkIn < new.checkOut AND existing.checkOut > new.checkIn
      conflictQuery.bookingType = "room";
      conflictQuery.checkIn = { $lt: new Date(checkOut) };
      conflictQuery.checkOut = { $gt: new Date(checkIn) };
    } else {
      conflictQuery.eventDate = new Date(eventDate);
    }


    const existingBooking = await Booking.findOne(conflictQuery);
    if (existingBooking) {
      return NextResponse.json(
        { message: "This date is already booked. Please select a different date." },
        { status: 409 }
      );
    }

    // ─── Step 5: Calculate advance amount ───
    const advanceAmount = Math.round(totalAmount * ADVANCE_PERCENTAGE);

    // ─── Step 6: Create the booking ───
    const newBooking = new Booking({
      userId: session.userId,
      userName: session.name,
      userEmail: session.email,
      userPhone: userPhone || "",
      providerId,
      providerName,
      bookingType,
      eventDate: bookingType !== "room" ? new Date(eventDate) : undefined,
      checkIn: bookingType === "room" ? new Date(checkIn) : undefined,
      checkOut: bookingType === "room" ? new Date(checkOut) : undefined,
      guestCount,
      roomCount,
      totalAmount,
      advanceAmount,
      status: "pending",
      functionType,
      functionTime,
      specialRequests,
      notifyWhatsapp: notifyWhatsapp || false,
      currency: currency || "INR",
    });

    await newBooking.save();

    return NextResponse.json(
      {
        message: "Booking created successfully.",
        booking: {
          id: newBooking._id,
          status: newBooking.status,
          totalAmount: newBooking.totalAmount,
          advanceAmount: newBooking.advanceAmount,
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Booking creation error:", error);
    const errMsg = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { message: "Failed to create booking.", error: errMsg },
      { status: 500 }
    );
  }
}

// ════════════════════════════════════════════════════════════
// GET — List bookings for current user
// ════════════════════════════════════════════════════════════
export async function GET() {
  try {
    // ─── Check authentication ───
    const session = await getIronSession<SessionData>(
      await cookies(),
      sessionOptions
    );

    if (!session.isLoggedIn) {
      return NextResponse.json(
        { message: "You must be logged in to view bookings." },
        { status: 401 }
      );
    }

    await connectDB();

    // Users see only their own bookings.
    // Admins see all bookings. Vendors have their own dedicated endpoint.
    let query: Record<string, unknown> = { userId: session.userId };
    if (session.role === "admin") {
      query = {};
    }

    const bookings = await Booking.find(query)
      .sort({ createdAt: -1 })
      .limit(50);

    return NextResponse.json({ bookings });
  } catch (error: unknown) {
    console.error("Bookings list error:", error);
    return NextResponse.json(
      { message: "Failed to fetch bookings." },
      { status: 500 }
    );
  }
}

// ════════════════════════════════════════════════════════════
// DELETE — Delete/Cancel a pending booking
// ════════════════════════════════════════════════════════════
export async function DELETE(req: Request) {
  try {
    const session = await getIronSession<SessionData>(
      await cookies(),
      sessionOptions
    );

    if (!session.isLoggedIn) {
      return NextResponse.json(
        { message: "You must be logged in to delete a booking." },
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

    // Security check: Only the booking creator or an admin can delete it
    if (
      booking.userId.toString() !== session.userId &&
      session.role !== "admin"
    ) {
      return NextResponse.json(
        { message: "You don't have permission to delete this booking." },
        { status: 403 }
      );
    }

    // Remove from database
    await Booking.findByIdAndDelete(bookingId);

    return NextResponse.json({
      success: true,
      message: "Booking deleted successfully.",
    });
  } catch (error: unknown) {
    console.error("Booking deletion error:", error);
    return NextResponse.json(
      { message: "Failed to delete booking." },
      { status: 500 }
    );
  }
}

