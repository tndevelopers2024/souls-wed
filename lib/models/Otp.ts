import mongoose, { Schema } from "mongoose";

const OtpSchema = new Schema({
  email: { type: String, required: true, lowercase: true, trim: true },
  role: { type: String, required: true },
  otp: { type: String, required: true },
  registrationData: { type: Schema.Types.Mixed }, // Store pending registration fields here
  sendCount: { type: Number, default: 1 },
  lastSentAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now, expires: 900 }, // Expires after 15 minutes (900 seconds)
});

// Ensure a single user can only have one active OTP record (optional, but good for cleanup)
// Using an index on email so we can overwrite/delete older ones easily.
OtpSchema.index({ email: 1 });

export const Otp = mongoose.models.Otp ?? mongoose.model("Otp", OtpSchema);
