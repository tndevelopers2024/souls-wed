import mongoose, { Schema } from "mongoose";

const VenueReviewSchema = new Schema({
  id:     { type: Number },
  author: { type: String },
  avatar: { type: String },
  date:   { type: String },
  rating: { type: Number },
  text:   { type: String },
});

const VenueFaqSchema = new Schema({
  question: { type: String },
  answer:   { type: String },
});

const VenueSchema = new Schema({
  // Stable slug-style ID used throughout the app (e.g. "venue-paris-1")
  venueId:   { type: String, required: true, unique: true, index: true },

  name:      { type: String, required: true },
  location:  { type: String, required: true },
  city:      { type: String, required: true },
  country:   { type: String, default: "Global" },
  type:      { type: String },

  // Pricing
  price:              { type: String },
  priceUnit:          { type: String },
  pricePerPlateVeg:   { type: String },
  pricePerPlateNonVeg:{ type: String },
  rentalCost:         { type: String },

  // Ratings
  rating:      { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },

  // Flags
  verified: { type: Boolean, default: false },
  featured: { type: Boolean, default: false },

  // Media
  image:   { type: String },
  gallery: [{ type: String }],

  // Capacity & amenities
  minGuests: { type: Number },
  maxGuests: { type: Number },
  rooms:     { type: Number, default: 0 },
  outdoor:   { type: Boolean, default: false },
  indoor:    { type: Boolean, default: true },
  parking:   { type: Boolean, default: false },
  catering:  { type: Boolean, default: false },

  description: { type: String },
  features:    [{ type: String }],
  faqs:        [VenueFaqSchema],
  reviews:     [VenueReviewSchema],

  // Admin control
  active: { type: Boolean, default: true },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

VenueSchema.pre("save", function () {
  this.updatedAt = new Date();
});

export const Venue =
  mongoose.models.Venue ?? mongoose.model("Venue", VenueSchema);
