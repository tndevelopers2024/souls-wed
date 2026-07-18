import mongoose, { Schema } from "mongoose";

const VendorSchema = new Schema({
  name:         { type: String, required: true },
  businessName: { type: String },  // Brand/business name — was missing before, signup data was silently dropped
  email:        { type: String, unique: true, sparse: true, lowercase: true, trim: true },
  passwordHash: { type: String },
  phone:        { type: String },
  category:     { type: String }, // Legacy, kept for backwards compatibility during migration
  categories:   [{ type: String }], // E.g. ["venues", "rooms", "planners", "caterers", "decorators"]
  city:         { type: String, required: true },
  description:  { type: String, default: "" },
  website:      { type: String, default: "" },
  instagram:    { type: String, default: "" },
  rating:       { type: Number, default: 0 },
  reviewCount:  { type: Number, default: 0 },
  priceFrom:    { type: Number }, // Base starting price for generic showcase
  advancePercentage: { type: Number, default: 30 }, // Default 30% advance
  unavailableDates: [{ type: Date }],
  profileImage: { type: String, default: "" },
  images:       [{ type: String }],
  featured:     { type: Boolean, default: false },
  verified:     { type: Boolean, default: false },
  available:    { type: Boolean, default: true },
  createdAt:    { type: Date, default: Date.now },
});

export const Vendor =
  mongoose.models.Vendor ?? mongoose.model("Vendor", VendorSchema);
