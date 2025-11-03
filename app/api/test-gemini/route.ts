import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = "nodejs";

export async function GET() {
  try {
    const apiKey = process.env.GOOGLE_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        {
          status: "error",
          message: "GOOGLE_API_KEY is not set in environment variables",
          hint: "Please check your .env.local file and restart your server",
        },
        { status: 500 }
      );
    }

    // Test the API key with a simple request
    const genAI = new GoogleGenerativeAI(apiKey);
    // Try multiple model names to find the correct one
    const modelNames = ["gemini-pro", "gemini-1.5-pro", "gemini-1.5-flash", "gemini-1.5-flash-latest"];
    
    let lastError: Error | null = null;
    for (const modelName of modelNames) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Say hello");
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({
          status: "success",
          message: "API key is valid and working!",
          apiKey: apiKey.substring(0, 10) + "..." + apiKey.substring(apiKey.length - 4),
          modelName,
          testResponse: text,
        });
      } catch (error: any) {
        lastError = error;
        continue;
      }
    }

    // If all models failed, throw the last error
    throw lastError || new Error("All model names failed");
  } catch (error: any) {
    console.error("Gemini API test error:", error);

    let errorMessage = "Failed to test API key";
    let details = error.message;

    if (error.message?.includes("API_KEY")) {
      errorMessage = "Invalid API key";
      details = "The API key may be incorrect or expired";
    } else if (error.message?.includes("quota") || error.message?.includes("limit")) {
      errorMessage = "API quota exceeded";
      details = "Please check your API usage limits";
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

