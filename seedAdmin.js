import { connectDB } from "./lib/mongodb.js";
import { Admin } from "./lib/models/Admin.js";
import { hashPassword } from "./lib/auth.js";
import mongoose from "mongoose";

async function seed() {
  try {
    await connectDB();
    const email = "admin@soulswed.com";
    const existing = await Admin.findOne({ email });
    if (existing) {
      console.log("Admin already exists!");
    } else {
      const admin = new Admin({
        name: "Admin",
        email: email,
        passwordHash: hashPassword("admin123"),
        role: "admin",
      });
      await admin.save();
      console.log("Admin created successfully!");
    }
  } catch (err) {
    console.error("Error seeding admin:", err);
  } finally {
    mongoose.connection.close();
  }
}
seed();
