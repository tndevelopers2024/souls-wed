import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Invoice } from "@/lib/models/Invoice";
import { sendInvoiceEmail } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    const { invoiceId } = await req.json();
    
    if (!invoiceId) {
      return NextResponse.json({ success: false, message: "Missing invoice ID" }, { status: 400 });
    }

    await connectDB();
    const invoice = await Invoice.findById(invoiceId);

    if (!invoice) {
      return NextResponse.json({ success: false, message: "Invoice not found" }, { status: 404 });
    }

    if (!invoice.client || !invoice.client.email) {
      return NextResponse.json({ success: false, message: "Client email is required to send invoice" }, { status: 400 });
    }

    // Send the email
    await sendInvoiceEmail(invoice.client.email, invoice);

    // Update status to Sent if it's currently Draft
    if (invoice.status === "Draft") {
      invoice.status = "Sent";
      await invoice.save();
    }

    return NextResponse.json({ success: true, message: "Invoice sent successfully", invoice });
  } catch (error: any) {
    console.error("Error sending invoice:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
