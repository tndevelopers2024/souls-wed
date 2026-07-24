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
  country:   { type: String, default: "India" },
  location:  { type: String },

  // Contact & Location Details
  contactPhone: { type: String },
  mapLink:      { type: String },
  // Capacity & Amenities
  minGuests: { type: Number },
  maxGuests: { type: Number },
  rooms:     { type: Number, default: 0 },
  outdoor:   { type: Boolean, default: false },
  indoor:    { type: Boolean, default: true },
  parking:   { type: Boolean, default: false },
  catering:  { type: Boolean, default: false },
  
  // Pricing
  priceFrom:          { type: Number, required: true },
  priceUnit:          { type: String },
  pricePerPlateVeg:   { type: String },
  pricePerPlateNonVeg:{ type: String },
  rentalCost:         { type: String },
  
  // Description and Features
  description: { type: String, default: "" },
  features:    [{ type: String }],
  
  // Media
  image:     { type: String },
  heroImage: { type: String },
  gallery:   [{ type: String }],
  videos:    [{ type: String }],
  
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
