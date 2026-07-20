import { NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { SessionData, sessionOptions } from "@/lib/session";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"]);
const ALLOWED_VIDEO_TYPES = new Set(["video/mp4", "video/webm", "video/quicktime", "video/x-m4v"]);
const MAX_IMAGE_SIZE_BYTES = 15 * 1024 * 1024; // 15 MB
const MAX_VIDEO_SIZE_BYTES = 200 * 1024 * 1024; // 200 MB

export async function POST(req: Request) {
  try {
    // Check vendor or admin authentication
    const session = await getIronSession<SessionData>(
      await cookies(),
      sessionOptions
    );

    if (!session.isLoggedIn) {
      return NextResponse.json({ message: "Login required." }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ message: "No file uploaded." }, { status: 400 });
    }

    // Validate MIME type — images by default, videos when kind=video
    const kind = formData.get("kind") === "video" ? "video" : "image";
    const allowedTypes = kind === "video" ? ALLOWED_VIDEO_TYPES : ALLOWED_IMAGE_TYPES;
    if (!allowedTypes.has(file.type)) {
      return NextResponse.json(
        {
          message:
            kind === "video"
              ? "Invalid file type. Only MP4, WebM, and MOV videos are allowed."
              : "Invalid file type. Only JPEG, PNG, WebP, AVIF, and GIF images are allowed.",
        },
        { status: 400 }
      );
    }

    // Validate file size
    const maxBytes = kind === "video" ? MAX_VIDEO_SIZE_BYTES : MAX_IMAGE_SIZE_BYTES;
    if (file.size > maxBytes) {
      return NextResponse.json(
        { message: `File too large. Maximum allowed size is ${kind === "video" ? "200" : "15"} MB.` },
        { status: 400 }
      );
    }

    // Read file bytes
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure target uploads folder exists in public directory
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    // Generate unique name — keep only the extension from the original file
    const ext = file.name.split(".").pop()?.replace(/[^a-zA-Z0-9]/g, "") ?? "jpg";
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename = `${uniqueSuffix}.${ext}`;
    const filePath = path.join(uploadDir, filename);

    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/${filename}`;
    return NextResponse.json({ success: true, url: publicUrl, kind });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Upload failed.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
