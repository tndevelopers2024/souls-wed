import { NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { SessionData, sessionOptions } from "@/lib/session";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  try {
    // Check vendor authentication
    const session = await getIronSession<SessionData>(
      await cookies(),
      sessionOptions
    );

    if (!session.isLoggedIn || session.role !== "vendor") {
      return NextResponse.json({ message: "Vendor login required." }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ message: "No file uploaded." }, { status: 400 });
    }

    // Read file bytes
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure target uploads folder exists in public directory
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    // Generate unique name to avoid duplicates
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const cleanFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filename = `${uniqueSuffix}-${cleanFilename}`;
    const filePath = path.join(uploadDir, filename);

    // Save image file
    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/${filename}`;
    return NextResponse.json({ success: true, url: publicUrl });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Upload failed.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
