import { NextRequest, NextResponse } from "next/server";
import { contactFormSchema } from "@/lib/validations";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = contactFormSchema.parse(body);

    // In production, you would:
    // 1. Send email via Resend/SendGrid
    // 2. Store in database
    // 3. Add spam protection (honeypot/reCAPTCHA)

    console.log("Contact form submission:", validated);

    return NextResponse.json({
      success: true,
      message: "Thank you for your message! We'll get back to you soon.",
    });
  } catch (error: any) {
    console.error("Contact form error:", error);

    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to send message. Please try again." },
      { status: 500 }
    );
  }
}

