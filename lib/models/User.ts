import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
  name:         { type: String, required: true },
  email:        { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  phone:        { type: String },
  role:         { type: String, default: "user" }, // user, couple
  createdAt:    { type: Date, default: Date.now },
});

export const User =
  mongoose.models.User ?? mongoose.model("User", UserSchema);
