import mongoose, { Schema, Document } from "mongoose";

export interface IInvoiceItem {
  description: string;
  units: number;
  unitCost: number;
}

export interface IInvoice extends Document {
  reference: string;
  issuedDate: Date;
  dueDate: Date;
  client: {
    name: string;
    email: string;
    initials: string;
    address: string;
  };
  business: {
    address: string;
    paymentInfo: string;
  };
  items: IInvoiceItem[];
  taxRate: number;
  discount: number;
  status: "Draft" | "Sent" | "Paid" | "Overdue";
  createdAt: Date;
  updatedAt: Date;
}

const invoiceItemSchema = new Schema<IInvoiceItem>({
  description: { type: String, required: true },
  units: { type: Number, required: true },
  unitCost: { type: Number, required: true },
});

const invoiceSchema = new Schema<IInvoice>(
  {
    reference: { type: String, required: true, unique: true },
    issuedDate: { type: Date, required: true },
    dueDate: { type: Date, required: true },
    client: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      initials: { type: String },
      address: { type: String },
    },
    business: {
      address: { type: String },
      paymentInfo: { type: String },
    },
    items: [invoiceItemSchema],
    taxRate: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["Draft", "Sent", "Paid", "Overdue"],
      default: "Draft",
    },
  },
  { timestamps: true }
);

export const Invoice = mongoose.models.Invoice || mongoose.model<IInvoice>("Invoice", invoiceSchema);
