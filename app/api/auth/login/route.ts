import { connectDB } from "@/lib/mongodb";
import { Vendor } from "@/lib/models/Vendor";
import { Admin } from "@/lib/models/Admin";
import { User } from "@/lib/models/User";
import { verifyPassword } from "@/lib/auth";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email, password, role } = await req.json();

    if (!email || !password || !role) {
      return NextResponse.json(
        { message: "Email, password, and role are required." },
        { status: 400 }
      );
    }

    let user = null;

    if (role === "admin") {
      user = await Admin.findOne({ email: email.toLowerCase().trim() });
    } else if (role === "vendor") {
      user = await Vendor.findOne({ email: email.toLowerCase().trim() });
    } else if (role === "user") {
      user = await User.findOne({ email: email.toLowerCase().trim() });
    } else {
      return NextResponse.json(
        { message: "Invalid user role specified." },
        { status: 400 }
      );
    }

    if (!user || !user.passwordHash) {
      return NextResponse.json(
        { message: "Invalid email or password." },
        { status: 401 }
      );
    }

    const isValid = verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { message: "Invalid email or password." },
        { status: 401 }
      );
    }

    // Set secure HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set("soulswed-session", JSON.stringify({
      id: user._id,
      email: user.email,
      name: user.name,
      role: role,
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });

    return NextResponse.json({
      success: true,
      message: "Login successful.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: role,
      },
    });
  } catch (error: unknown) {
    console.error("Login API error:", error);
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
