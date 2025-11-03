import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generateBlogContent, BlogGenerationOptions } from "@/lib/blog/generator";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      topic,
      targetWords = 1000,
      style = "professional",
      includeHeadings = true,
      focusKeyword,
      tone = "informative",
      targetAudience = "general audience",
    } = body;

    if (!topic || topic.trim().length < 3) {
      return NextResponse.json(
        { error: "Topic is required and must be at least 3 characters" },
        { status: 400 }
      );
    }

    if (targetWords < 500) {
      return NextResponse.json(
        { error: "Target words must be at least 500" },
        { status: 400 }
      );
    }

    const options: BlogGenerationOptions = {
      topic: topic.trim(),
      targetWords: Math.max(targetWords, 1000), // Ensure at least 1000 words
      style: style as any,
      includeHeadings,
      focusKeyword: focusKeyword?.trim(),
      tone: tone as any,
      targetAudience: targetAudience?.trim() || "general audience",
    };

    const result = await generateBlogContent(options);

    return NextResponse.json({
      ...result,
      model: "gemini-1.5-flash",
      generatedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Blog generation error:", error);
    
    if (error.message?.includes("GOOGLE_API_KEY")) {
      return NextResponse.json(
        { error: "AI service is not configured. Please check GOOGLE_API_KEY." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Failed to generate blog content" },
      { status: 500 }
    );
  }
}

