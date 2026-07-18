import { connectDB } from "@/lib/mongodb";
import { Vendor } from "@/lib/models/Vendor";
import { Admin } from "@/lib/models/Admin";
import { User } from "@/lib/models/User";
import { Otp } from "@/lib/models/Otp";
import { NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { SessionData, sessionOptions } from "@/lib/session";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email, role, otp } = await req.json();

    if (!email || !role || !otp) {
      return NextResponse.json(
        { message: "Email, role, and OTP are required." },
        { status: 400 }
      );
    }

    // Check OTP
    const otpRecord = await Otp.findOne({ email: email.toLowerCase().trim(), role, otp });
    
    if (!otpRecord) {
      return NextResponse.json(
        { message: "Invalid or expired OTP." },
        { status: 400 }
      );
    }

    // Mark user as verified
    let user = null;
    if (role === "admin") {
      user = await Admin.findOneAndUpdate({ email: email.toLowerCase().trim() }, { isEmailVerified: true }, { new: true });
    } else if (role === "vendor") {
      user = await Vendor.findOneAndUpdate({ email: email.toLowerCase().trim() }, { isEmailVerified: true }, { new: true });
    } else if (role === "user") {
      user = await User.findOneAndUpdate({ email: email.toLowerCase().trim() }, { isEmailVerified: true }, { new: true });
    } else {
      return NextResponse.json(
        { message: "Invalid user role specified." },
        { status: 400 }
      );
    }

    if (!user) {
      return NextResponse.json(
        { message: "User not found." },
        { status: 404 }
      );
    }

    // Delete the used OTP
    await Otp.deleteOne({ _id: otpRecord._id });

    // Auto-login: Create encrypted session cookie
    const session = await getIronSession<SessionData>(
      await cookies(),
      sessionOptions
    );

    session.userId = user._id.toString();
    session.name = user.name;
    session.email = user.email;
    session.role = role;
    session.isLoggedIn = true;

    await session.save();

    return NextResponse.json({
      success: true,
      message: "Email verified successfully.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: role,
      },
    });
  } catch (error: unknown) {
    console.error("Verify OTP error:", error);
    return NextResponse.json(
      { message: "Internal server error occurred." },
      { status: 500 }
    );
  }
}
