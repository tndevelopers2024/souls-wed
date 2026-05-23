import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models/User";
import { Vendor } from "@/lib/models/Vendor";
import { Admin } from "@/lib/models/Admin";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("soulswed-session");

    if (!sessionCookie || !sessionCookie.value) {
      return NextResponse.json(
        { authenticated: false, message: "No active session found." },
        { status: 200 } // Return 200 with authenticated: false for easier front-end handling
      );
    }

    let parsedSession;
    try {
      parsedSession = JSON.parse(sessionCookie.value);
    } catch {
      return NextResponse.json(
        { authenticated: false, message: "Invalid session cookie format." },
        { status: 200 }
      );
    }

    const { id, role } = parsedSession;
    if (!id || !role) {
      return NextResponse.json(
        { authenticated: false, message: "Malformed session data." },
        { status: 200 }
      );
    }

    await connectDB();
    let dbUser = null;

    if (role === "admin") {
      dbUser = await Admin.findById(id).select("-passwordHash");
    } else if (role === "vendor") {
      dbUser = await Vendor.findById(id).select("-passwordHash");
    } else if (role === "user") {
      dbUser = await User.findById(id).select("-passwordHash");
    } else {
      return NextResponse.json(
        { authenticated: false, message: "Unknown role in session." },
        { status: 200 }
      );
    }

    if (!dbUser) {
      return NextResponse.json(
        { authenticated: false, message: "User not found in database." },
        { status: 200 }
      );
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: dbUser._id,
        name: dbUser.name,
        email: dbUser.email,
        role: role,
        phone: (dbUser as any).phone || "",
        businessName: (dbUser as any).businessName || "",
        category: (dbUser as any).category || "",
        city: (dbUser as any).city || "",
      },
    });
  } catch (error: unknown) {
    console.error("Error in /api/auth/me:", error);
    const errMsg = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { 
        message: "Internal server error occurred.",
        details: errMsg,
        hint: errMsg.includes("ENOTFOUND") || errMsg.includes("placeholder")
          ? "Please ensure you have replaced the 'cluster0.xxxxxxx.mongodb.net' host placeholder in your .env.local with your actual MongoDB Atlas cluster address."
          : undefined
      },
      { status: 500 }
    );
  }
}
