import { connectDB } from "@/lib/mongodb";
import { Vendor } from "@/lib/models/Vendor";
import { Admin } from "@/lib/models/Admin";
import { User } from "@/lib/models/User";
import { hashPassword } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { role, name, email, password } = body;

    if (!role || !name || !email || !password) {
      return NextResponse.json(
        { message: "Required fields (role, name, email, password) are missing." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters long." },
        { status: 400 }
      );
    }

    const passwordHash = hashPassword(password);

    if (role === "admin") {
      const { accessCode } = body;
      const systemAccessCode = process.env.ADMIN_ACCESS_CODE || "SOULSWED_SECRET_2026";

      if (!accessCode || accessCode !== systemAccessCode) {
        return NextResponse.json(
          { message: "Invalid or missing Admin Access Code." },
          { status: 403 }
        );
      }

      // Check if Admin exists
      const existingAdmin = await Admin.findOne({ email });
      if (existingAdmin) {
        return NextResponse.json(
          { message: "An administrator with this email already exists." },
          { status: 409 }
        );
      }

      // Create admin
      const newAdmin = new Admin({
        name,
        email,
        passwordHash,
        role: "admin",
      });
      await newAdmin.save();

      return NextResponse.json(
        { message: "Admin account registered successfully." },
        { status: 201 }
      );
    } else if (role === "user") {
      const { phone } = body;

      // Check if User exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return NextResponse.json(
          { message: "A user with this email already exists." },
          { status: 409 }
        );
      }

      // Create user
      const newUser = new User({
        name,
        email,
        passwordHash,
        phone,
        role: "user",
      });
      await newUser.save();

      return NextResponse.json(
        { message: "User account registered successfully." },
        { status: 201 }
      );
    } else if (role === "vendor") {
      const { businessName, phone, category, city } = body;

      if (!businessName || !phone || !category || !city) {
        return NextResponse.json(
          { message: "Vendor specific fields (businessName, phone, category, city) are missing." },
          { status: 400 }
        );
      }

      // Check if Vendor exists
      const existingVendor = await Vendor.findOne({ email });
      if (existingVendor) {
        return NextResponse.json(
          { message: "A vendor with this email already exists." },
          { status: 409 }
        );
      }

      // Create vendor
      const newVendor = new Vendor({
        name, // contact person
        businessName,
        email,
        passwordHash,
        phone,
        category,
        city,
        verified: false, // public signups start unverified
        available: true,
      });
      await newVendor.save();

      return NextResponse.json(
        { message: "Vendor account registered successfully." },
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        { message: "Invalid user role specified." },
        { status: 400 }
      );
    }
  } catch (error: unknown) {
    console.error("Signup error:", error);
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
