import { connectDB } from "@/lib/mongodb";
import { Vendor } from "@/lib/models/Vendor";
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

export async function GET(req: Request) {
  try {
    if (!(await checkAdminSession())) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    await connectDB();
    const { searchParams } = new URL(req.url);
    const verified = searchParams.get("verified");

    const query: Record<string, any> = {};
    if (verified === "false") {
      query.verified = false;
    } else if (verified === "true") {
      query.verified = true;
    }

    const vendors = await Vendor.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, vendors });
  } catch (error: unknown) {
    console.error("Error in GET /api/admin/vendors:", error);
    return NextResponse.json({ message: "Failed to fetch vendors." }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    if (!(await checkAdminSession())) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();
    const { vendorId, verified, featured } = body;

    if (!vendorId) {
      return NextResponse.json({ message: "Vendor ID is required." }, { status: 400 });
    }

    const updateData: Record<string, any> = {};
    if (verified !== undefined) updateData.verified = verified;
    if (featured !== undefined) updateData.featured = featured;

    const updatedVendor = await Vendor.findByIdAndUpdate(
      vendorId,
      { $set: updateData },
      { new: true }
    );

    if (!updatedVendor) {
      return NextResponse.json({ message: "Vendor not found." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Vendor updated successfully.",
      vendor: updatedVendor,
    });
  } catch (error: unknown) {
    console.error("Error in PATCH /api/admin/vendors:", error);
    return NextResponse.json({ message: "Failed to update vendor." }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    if (!(await checkAdminSession())) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    await connectDB();
    const { searchParams } = new URL(req.url);
    const vendorId = searchParams.get("vendorId");

    if (!vendorId) {
      return NextResponse.json({ message: "Vendor ID is required." }, { status: 400 });
    }

    const deletedVendor = await Vendor.findByIdAndDelete(vendorId);

    if (!deletedVendor) {
      return NextResponse.json({ message: "Vendor not found." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Vendor deleted successfully.",
    });
  } catch (error: unknown) {
    console.error("Error in DELETE /api/admin/vendors:", error);
    return NextResponse.json({ message: "Failed to delete vendor." }, { status: 500 });
  }
}
