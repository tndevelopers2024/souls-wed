import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models/User";
import { Vendor } from "@/lib/models/Vendor";
import { Booking } from "@/lib/models/Booking";
import { Admin } from "@/lib/models/Admin";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "@/lib/session";

export async function GET() {
  try {
    // 1. Verify admin session
    const session = await getIronSession<SessionData>(
      await cookies(),
      sessionOptions
    );

    if (!session.isLoggedIn || session.role !== "admin") {
      return NextResponse.json(
        { message: "Unauthorized. Admin privileges required." },
        { status: 401 }
      );
    }

    // 2. Connect to Database
    await connectDB();

    // 3. Fetch statistics in parallel
    const [totalUsers, totalVendors, totalBookings, totalAdmins] = await Promise.all([
      User.countDocuments({ role: { $ne: "admin" } }),
      Vendor.countDocuments(),
      Booking.countDocuments(),
      Admin.countDocuments(),
    ]);

    // 4. Calculate total revenue (sum of advanceAmount for confirmed/completed bookings)
    const revenueResult = await Booking.aggregate([
      {
        $match: {
          status: { $in: ["confirmed", "completed"] },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$advanceAmount" },
        },
      },
    ]);

    const totalRevenue = revenueResult[0]?.total || 0;

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        totalVendors,
        totalBookings,
        totalAdmins,
        totalRevenue,
      },
    });
  } catch (error: unknown) {
    console.error("Error in GET /api/admin/stats:", error);
    const errMsg = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { message: "Failed to fetch stats.", error: errMsg },
      { status: 500 }
    );
  }
}
