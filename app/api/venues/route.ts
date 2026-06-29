/**
 * GET  /api/venues          — list all active venues (with optional filters)
 * PATCH /api/venues         — admin: update a venue (verify, feature, toggle active)
 * DELETE /api/venues?id=... — admin: delete a venue
 */

import { connectDB } from "@/lib/mongodb";
import { Venue } from "@/lib/models/Venue";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "@/lib/session";

// ─────────────────────────────────────────────────────────────────────────────
// GET — public, fetch venues with optional filters
// ─────────────────────────────────────────────────────────────────────────────
export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);

    const query: Record<string, unknown> = { active: true };

    const city     = searchParams.get("city");
    const featured = searchParams.get("featured");
    const search   = searchParams.get("search");
    const id       = searchParams.get("id");      // fetch by venueId

    if (id)       query.venueId = id;
    if (city)     query.city    = { $regex: city, $options: "i" };
    if (featured) query.featured = true;
    if (search) {
      query.$or = [
        { name:     { $regex: search, $options: "i" } },
        { city:     { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { type:     { $regex: search, $options: "i" } },
      ];
    }

    const limit  = parseInt(searchParams.get("limit")  ?? "100");
    const skip   = parseInt(searchParams.get("skip")   ?? "0");

    const venues = await Venue.find(query).limit(limit).skip(skip).lean();

    return NextResponse.json({ success: true, venues, total: venues.length });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ message: "Failed to fetch venues.", error: msg }, { status: 500 });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PATCH — admin: update venue fields
// ─────────────────────────────────────────────────────────────────────────────
export async function PATCH(req: Request) {
  try {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
    if (!session.isLoggedIn || session.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();
    const { venueId, ...updates } = body;

    if (!venueId) {
      return NextResponse.json({ message: "venueId is required." }, { status: 400 });
    }

    // Only allow safe fields to be updated by admin
    const allowed: Record<string, unknown> = {};
    const safeFields = ["verified", "featured", "active", "name", "city", "location", "type", "description", "pricePerPlateVeg", "pricePerPlateNonVeg", "rentalCost", "price", "minGuests", "maxGuests", "outdoor", "indoor", "parking", "catering"];
    for (const field of safeFields) {
      if (updates[field] !== undefined) allowed[field] = updates[field];
    }
    allowed.updatedAt = new Date();

    const venue = await Venue.findOneAndUpdate(
      { venueId },
      { $set: allowed },
      { new: true }
    );

    if (!venue) {
      return NextResponse.json({ message: "Venue not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, venue });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ message: "Failed to update venue.", error: msg }, { status: 500 });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// DELETE — admin: permanently delete a venue
// ─────────────────────────────────────────────────────────────────────────────
export async function DELETE(req: Request) {
  try {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
    if (!session.isLoggedIn || session.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    await connectDB();
    const { searchParams } = new URL(req.url);
    const venueId = searchParams.get("venueId");

    if (!venueId) {
      return NextResponse.json({ message: "venueId query param is required." }, { status: 400 });
    }

    await Venue.deleteOne({ venueId });
    return NextResponse.json({ success: true, message: "Venue deleted." });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ message: "Failed to delete venue.", error: msg }, { status: 500 });
  }
}
