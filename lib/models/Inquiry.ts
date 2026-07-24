import mongoose, { Schema } from "mongoose";

const InquirySchema = new Schema({
  firstName: { type: String, required: true },
  lastName:  { type: String, required: true },
  email:     { type: String, required: true },
  message:   { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Inquiry =
  mongoose.models.Inquiry ?? mongoose.model("Inquiry", InquirySchema);
