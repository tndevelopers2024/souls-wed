import mongoose, { Schema } from "mongoose";

const ServiceFaqSchema = new Schema({
  question: { type: String },
  answer:   { type: String },
});

const ServiceListingSchema = new Schema({
  // Strictly ties this service to a specific vendor account
  vendorId:  { type: String, required: true, index: true },
  
  // Stable slug-style ID (e.g. "planner-elite-1")
  serviceId: { type: String, required: true, unique: true, index: true },

  // The category: "planners", "caterers", "decorators", etc.
  category:  { type: String, required: true, index: true },

  name:      { type: String, required: true },
  city:      { type: String, required: true },
  location:  { type: String },
  
  // Pricing
  priceFrom: { type: Number, required: true },
  priceUnit: { type: String },
  
  // Description and Features
  description: { type: String, default: "" },
  features:    [{ type: String }],
  
  // Media
  image:   { type: String },
  gallery: [{ type: String }],
  
  // Ratings
  rating:      { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  
  // Flags
  verified: { type: Boolean, default: false },
  featured: { type: Boolean, default: false },
  
  faqs: [ServiceFaqSchema],
  
  // Admin control
  active: { type: Boolean, default: true },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

ServiceListingSchema.pre("save", function () {
  this.updatedAt = new Date();
});

export const ServiceListing =
  mongoose.models.ServiceListing ?? mongoose.model("ServiceListing", ServiceListingSchema);
