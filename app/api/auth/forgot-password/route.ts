import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models/User";
import { Vendor } from "@/lib/models/Vendor";
import { Admin } from "@/lib/models/Admin";
import { sendPasswordResetEmail } from "@/lib/mail";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    await connectDB();

    // Search for user across all collections
    let account = await User.findOne({ email });

    if (!account) {
      account = await Vendor.findOne({ email });
    }

    if (!account) {
      account = await Admin.findOne({ email });
    }

    // Always return success to prevent email enumeration attacks
    if (!account) {
      return NextResponse.json({ message: "If that email is registered, we have sent a reset link." }, { status: 200 });
    }

    // Generate secure token
    const resetToken = crypto.randomBytes(32).toString("hex");
    
    // Hash token for database storage
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    
    // Set expiration to 1 hour from now
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000);

    // Save token to account
    account.resetPasswordToken = hashedToken;
    account.resetPasswordExpires = resetExpires;
    await account.save();

    // Construct reset URL using request origin or environment variables
    const getBaseUrl = () => {
      if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
      if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
      return req.headers.get("origin") || "http://localhost:3000";
    };
    
    const origin = getBaseUrl();
    const resetUrl = `${origin}/reset-password?token=${resetToken}`;

    // Send email
    await sendPasswordResetEmail(account.email, account.name || "User", resetUrl);

    return NextResponse.json({ message: "If that email is registered, we have sent a reset link." }, { status: 200 });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
