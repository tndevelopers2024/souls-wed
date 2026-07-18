import { NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { SessionData, sessionOptions } from "@/lib/session";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

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

    // Validate MIME type
    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        { message: "Invalid file type. Only JPEG, PNG, WebP, and GIF images are allowed." },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { message: "File too large. Maximum allowed size is 5 MB." },
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
    return NextResponse.json({ success: true, url: publicUrl });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Upload failed.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
