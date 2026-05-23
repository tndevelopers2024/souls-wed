import { connectDB } from "@/lib/mongodb";
import { Vendor } from "@/lib/models/Vendor";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const city = searchParams.get("city");
  const featured = searchParams.get("featured");

  const query: Record<string, unknown> = {};
  if (category) query.category = category;
  if (city) query.city = city;
  if (featured) query.featured = true;

  const vendors = await Vendor.find(query).limit(20);
  return NextResponse.json(vendors);
}
