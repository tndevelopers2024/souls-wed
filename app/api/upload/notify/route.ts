import { NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { SessionData, sessionOptions } from "@/lib/session";
import { sendUploadNotificationEmail } from "@/lib/mail";

/**
 * Called once by the gallery editor after a batch of uploads settles, so the
 * moderation inbox gets a single email per burst instead of one per file.
 */

// Vendor id → timestamp of the last notification we sent. Keeps a vendor
// hammering the endpoint from flooding the inbox.
const lastNotifiedAt = new Map<string, number>();
const NOTIFY_COOLDOWN_MS = 60_000;

export async function POST(req: Request) {
  try {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);

    if (!session.isLoggedIn) {
      return NextResponse.json({ message: "Login required." }, { status: 401 });
    }

    // Admin uploads are made by the SoulsWed team itself — nothing to review.
    if (session.role === "admin") {
      return NextResponse.json({ success: true, notified: false });
    }

    const body = await req.json().catch(() => ({}));
    const imageCount = Math.max(0, Math.min(Number(body.images) || 0, 100));
    const videoCount = Math.max(0, Math.min(Number(body.videos) || 0, 100));

    if (imageCount + videoCount === 0) {
      return NextResponse.json({ success: true, notified: false });
    }

    const now = Date.now();
    const last = lastNotifiedAt.get(session.userId) ?? 0;
    if (now - last < NOTIFY_COOLDOWN_MS) {
      return NextResponse.json({ success: true, notified: false });
    }
    lastNotifiedAt.set(session.userId, now);

    await sendUploadNotificationEmail({
      vendorName: session.name,
      vendorEmail: session.email,
      vendorId: session.userId,
      imageCount,
      videoCount,
    });

    return NextResponse.json({ success: true, notified: true });
  } catch (error: unknown) {
    // A failed notification must never surface as a failed upload.
    console.error("Upload notification failed:", error);
    return NextResponse.json({ success: true, notified: false });
  }
}
