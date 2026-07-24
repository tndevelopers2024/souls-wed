import { connectDB } from "@/lib/mongodb";
import { Subscriber } from "@/lib/models/Subscriber";
import { sendSubscriberNotificationEmail } from "@/lib/mail";
import { NextResponse } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const email = String(body.email || "").trim().toLowerCase();

    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ message: "Please enter a valid email address." }, { status: 400 });
    }

    const existing = await Subscriber.findOne({ email });
    if (existing) {
      return NextResponse.json({ message: "You're already subscribed!" }, { status: 200 });
    }

    await new Subscriber({ email }).save();
    await sendSubscriberNotificationEmail(email);

    return NextResponse.json({ message: "Subscribed! Watch your inbox for inspiration." }, { status: 201 });
  } catch (error: unknown) {
    console.error("Error creating subscriber:", error);
    return NextResponse.json({ message: "Internal server error occurred." }, { status: 500 });
  }
}
