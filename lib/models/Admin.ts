import mongoose, { Schema } from "mongoose";

const AdminSchema = new Schema({
  name:         { type: String, required: true },
  email:        { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  profileImage: { type: String, default: "" },
  role:         { type: String, default: "admin" }, // admin, superadmin, moderator
  isEmailVerified: { type: Boolean, default: false },
  createdAt:    { type: Date, default: Date.now },
});

export const Admin =
  mongoose.models.Admin ?? mongoose.model("Admin", AdminSchema);
