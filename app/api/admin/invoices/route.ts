import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Invoice } from "@/lib/models/Invoice";

// Ensure admin is authenticated (you can add this logic later)

export async function GET() {
  try {
    await connectDB();
    const invoices = await Invoice.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, invoices });
  } catch (error: any) {
    console.error("Error fetching invoices:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    await connectDB();

    // Basic validation
    if (!data.reference || !data.issuedDate || !data.dueDate || !data.client?.email) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    // Ensure reference is unique
    const existing = await Invoice.findOne({ reference: data.reference });
    if (existing) {
      return NextResponse.json({ success: false, message: "Invoice reference already exists" }, { status: 400 });
    }

    const newInvoice = new Invoice(data);
    await newInvoice.save();

    return NextResponse.json({ success: true, invoice: newInvoice }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating invoice:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const data = await req.json();
    await connectDB();

    if (!data._id) {
      return NextResponse.json({ success: false, message: "Missing invoice ID" }, { status: 400 });
    }

    const updatedInvoice = await Invoice.findByIdAndUpdate(data._id, data, { new: true });
    
    if (!updatedInvoice) {
      return NextResponse.json({ success: false, message: "Invoice not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, invoice: updatedInvoice });
  } catch (error: any) {
    console.error("Error updating invoice:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
