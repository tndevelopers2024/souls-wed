import { connectDB } from "@/lib/mongodb";
import { Otp } from "@/lib/models/Otp";
import { sendVerificationOtpEmail } from "@/lib/mail";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required." },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    // Find the pending OTP record
    const otpRecord = await Otp.findOne({ email: cleanEmail });

    if (!otpRecord) {
      return NextResponse.json(
        { message: "No pending registration found for this email. Please sign up again." },
        { status: 404 }
      );
    }

    // Protection 1: Max attempts
    if (otpRecord.sendCount >= 3) {
      return NextResponse.json(
        { message: "Maximum OTP attempts reached. Please try again after 15 minutes." },
        { status: 429 }
      );
    }

    // Protection 2: Cooldown period (60 seconds)
    const timeSinceLastSent = Date.now() - new Date(otpRecord.lastSentAt).getTime();
    if (timeSinceLastSent < 60000) {
      return NextResponse.json(
        { message: "Please wait 60 seconds before requesting another OTP." },
        { status: 429 }
      );
    }

    // Generate new OTP
    const newOtpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Update the record
    otpRecord.otp = newOtpCode;
    otpRecord.sendCount += 1;
    otpRecord.lastSentAt = new Date();
    await otpRecord.save();

    // Send the email
    const name = otpRecord.registrationData?.name || "User";
    await sendVerificationOtpEmail(cleanEmail, name, newOtpCode);

    return NextResponse.json(
      { message: "A new OTP has been sent to your email." },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Resend OTP error:", error);
    return NextResponse.json(
      { message: "Internal server error occurred." },
      { status: 500 }
    );
  }
}
