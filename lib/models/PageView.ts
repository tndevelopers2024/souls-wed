import mongoose, { Schema } from "mongoose";

// One document per page load — lets us chart real monthly view trends
// instead of a fabricated number, at the cost of a small write per view.
const PageViewSchema = new Schema({
  providerId:   { type: String, required: true, index: true },
  providerType: { type: String, enum: ["venue", "vendor"], required: true },
  viewedAt:     { type: Date, default: Date.now },
});

export const PageView =
  mongoose.models.PageView ?? mongoose.model("PageView", PageViewSchema);
