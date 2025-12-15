import { NextRequest, NextResponse } from "next/server";
import { generateText, listAvailableModels, POPULAR_MODELS } from "@/lib/ai/openrouter";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY || process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          status: "error",
          message: "OPENROUTER_API_KEY or GOOGLE_API_KEY is not set in environment variables",
          hint: "Please check your .env.local file and restart your server",
        },
        { status: 500 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const testModel = searchParams.get("model");

    // Try to generate text with a simple request
    const model = testModel || process.env.OPENROUTER_MODEL || POPULAR_MODELS["llama-3.3-70b-free"] || POPULAR_MODELS["gemini-flash"] || POPULAR_MODELS["gpt-3.5-turbo"];

    try {
      const result = await generateText("Say hello in one word", {
        model,
        temperature: 0.7,
      });

      return NextResponse.json({
        status: "success",
        message: "OpenRouter API key is valid and working!",
        apiKey: apiKey.substring(0, 10) + "..." + apiKey.substring(apiKey.length - 4),
        model,
        testResponse: result,
        note: "You can use OPENROUTER_MODEL in .env.local to set a default model",
      });
    } catch (error: any) {
      return NextResponse.json(
        {
          status: "error",
          message: "Failed to generate text with the selected model",
          model,
          error: error.message,
          hint: "Try setting OPENROUTER_MODEL in .env.local to a different model",
          availableModels: Object.keys(POPULAR_MODELS),
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("OpenRouter API test error:", error);

    let errorMessage = "Failed to test API key";
    let details = error.message;

    if (error.message?.includes("401") || error.message?.includes("Unauthorized")) {
      errorMessage = "Invalid API key";
      details = "The API key may be incorrect or expired";
    } else if (error.message?.includes("quota") || error.message?.includes("limit") || error.message?.includes("insufficient")) {
      errorMessage = "API quota exceeded";
      details = "Please check your OpenRouter account balance or limits";
    } else if (error.message?.includes("PERMISSION_DENIED") || error.message?.includes("403")) {
      errorMessage = "API access denied";
      details = "The API key may not have the required permissions";
    }

    return NextResponse.json(
      {
        status: "error",
        message: errorMessage,
        details,
        fullError: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  // List available models
  try {
    const models = await listAvailableModels();

    return NextResponse.json({
      status: "success",
      models: models.map((m: any) => ({
        id: m.id,
        name: m.name,
        description: m.description,
        pricing: m.pricing,
      })),
      popularModels: POPULAR_MODELS,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to list models",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

