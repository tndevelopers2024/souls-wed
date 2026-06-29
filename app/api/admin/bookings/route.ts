import { connectDB } from "@/lib/mongodb";
import { Booking } from "@/lib/models/Booking";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "@/lib/session";

async function checkAdminSession() {
  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions
  );
  if (!session.isLoggedIn || session.role !== "admin") {
    return false;
  }
  return true;
}

export async function GET() {
  try {
    if (!(await checkAdminSession())) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    await connectDB();
    const bookings = await Booking.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, bookings });
  } catch (error: unknown) {
    console.error("Error in GET /api/admin/bookings:", error);
    return NextResponse.json({ message: "Failed to fetch bookings." }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    if (!(await checkAdminSession())) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();
    const { bookingId, status } = body;

    if (!bookingId || !status) {
      return NextResponse.json({ message: "Booking ID and status are required." }, { status: 400 });
    }

    const validStatuses = ["pending", "confirmed", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ message: "Invalid status." }, { status: 400 });
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      { $set: { status } },
      { new: true }
    );

    if (!updatedBooking) {
      return NextResponse.json({ message: "Booking not found." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Booking status updated to ${status} successfully.`,
      booking: updatedBooking,
    });
  } catch (error: unknown) {
    console.error("Error in PATCH /api/admin/bookings:", error);
    return NextResponse.json({ message: "Failed to update booking status." }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    if (!(await checkAdminSession())) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    await connectDB();
    const { searchParams } = new URL(req.url);
    const bookingId = searchParams.get("bookingId");

    if (!bookingId) {
      return NextResponse.json({ message: "Booking ID is required." }, { status: 400 });
    }

    const deletedBooking = await Booking.findByIdAndDelete(bookingId);

    if (!deletedBooking) {
      return NextResponse.json({ message: "Booking not found." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Booking deleted successfully.",
    });
  } catch (error: unknown) {
    console.error("Error in DELETE /api/admin/bookings:", error);
    return NextResponse.json({ message: "Failed to delete booking." }, { status: 500 });
  }
}
