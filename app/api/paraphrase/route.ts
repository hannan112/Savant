import { NextRequest, NextResponse } from "next/server";
import { paraphraseText } from "@/lib/paraphraser/gemini";
import { paraphraseSchema } from "@/lib/validations";
import { MAX_PARAPHRASE_WORDS } from "@/lib/constants";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = paraphraseSchema.parse(body);

    // Check word count
    const wordCount = validated.text.split(/\s+/).filter(Boolean).length;

    // Check user plan for limits
    // Default limit is 250 for free users, MAX for premium
    let limit = 250;

    // We can't easily check session here without making it async and importing auth
    // But for better security we should. 
    // For now, let's implement the limits based on the request content or assume checking is done in middleware or here

    // To do this properly, we should look up the user session
    const { auth } = require("@/lib/auth");
    const session = await auth();

    if (session?.user?.plan === "premium" || session?.user?.role === "admin") {
      limit = MAX_PARAPHRASE_WORDS; // e.g. 5000 or whatever constant is
    }

    if (wordCount > limit) {
      return NextResponse.json(
        {
          error: `Text exceeds ${limit} word limit for your plan. Upgrade to Premium for unlimited access.`,
        },
        { status: 400 }
      );
    }

    const paraphrased = await paraphraseText(validated.text, validated.mode);

    return NextResponse.json({
      original: validated.text,
      paraphrased,
      wordCount,
      mode: validated.mode,
      model: "openrouter",
    });
  } catch (error: any) {
    console.error("Paraphrase error:", error);

    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    // Return more detailed error message
    const errorMessage = error.message || "Failed to paraphrase text. Please try again.";

    // Check for API key related errors
    if (errorMessage.includes("GOOGLE_API_KEY") || errorMessage.includes("API key")) {
      return NextResponse.json(
        {
          error: errorMessage,
          hint: "Please ensure GOOGLE_API_KEY is set in your .env.local file and restart your server."
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details: process.env.NODE_ENV === "development" ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

