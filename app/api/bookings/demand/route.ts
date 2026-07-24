import { connectDB } from "@/lib/mongodb";
import { Booking } from "@/lib/models/Booking";
import { NextResponse } from "next/server";

// GET — real count of bookings created in the last 7 days for a provider,
// replacing the random "N enquiries last week" badge on venue/vendor pages.
export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const providerId = searchParams.get("providerId");
    if (!providerId) {
      return NextResponse.json({ message: "providerId is required." }, { status: 400 });
    }

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const count = await Booking.countDocuments({
      providerId,
      createdAt: { $gte: sevenDaysAgo },
    });

    return NextResponse.json({ success: true, count });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch demand.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
