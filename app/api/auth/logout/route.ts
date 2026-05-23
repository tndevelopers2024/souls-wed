import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("soulswed-session");

    return NextResponse.json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (error: unknown) {
    console.error("Error in /api/auth/logout:", error);
    return NextResponse.json(
      { message: "Internal server error occurred." },
      { status: 500 }
    );
  }
}

// Support GET requests as fallback for quick redirection or browser-driven logouts if needed
export async function GET() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("soulswed-session");

    // Redirect to home page on GET logout
    return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"));
  } catch (error: unknown) {
    console.error("Error in GET /api/auth/logout:", error);
    return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"));
  }
}
