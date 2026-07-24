import { connectDB } from "@/lib/mongodb";
import { PageView } from "@/lib/models/PageView";
import { NextResponse } from "next/server";

// POST — record one page view (public, fire-and-forget from detail pages)
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const providerId = String(body.providerId || "");
    const providerType = body.providerType === "vendor" ? "vendor" : "venue";

    if (!providerId) {
      return NextResponse.json({ message: "providerId is required." }, { status: 400 });
    }

    await new PageView({ providerId, providerType }).save();
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to record view.";
    return NextResponse.json({ message }, { status: 500 });
  }
}

// GET — raw view timestamps for a provider, for charting real monthly trends
export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const providerId = searchParams.get("providerId");
    if (!providerId) {
      return NextResponse.json({ message: "providerId is required." }, { status: 400 });
    }

    const views = await PageView.find({ providerId }).select("viewedAt -_id").limit(5000).lean();
    return NextResponse.json({ success: true, views });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch views.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
