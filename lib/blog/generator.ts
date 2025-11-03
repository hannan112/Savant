import { generateText, POPULAR_MODELS } from "@/lib/ai/openrouter";

export interface BlogGenerationOptions {
  topic: string;
  targetWords: number;
  style?: "professional" | "casual" | "academic" | "conversational";
  includeHeadings?: boolean;
  focusKeyword?: string;
  tone?: "informative" | "persuasive" | "educational" | "how-to";
  targetAudience?: string;
}

export async function generateBlogContent(
  options: BlogGenerationOptions
): Promise<{
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  metaDescription: string;
  keywords: string[];
  focusKeyword: string;
  wordCount: number;
}> {
  const {
    topic,
    targetWords = 1000,
    style = "professional",
    includeHeadings = true,
    focusKeyword,
    tone = "informative",
    targetAudience = "general audience",
  } = options;

  // Generate focus keyword from topic if not provided
  const primaryKeyword = focusKeyword || topic.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  // Build comprehensive prompt
  const prompt = `Generate a comprehensive, SEO-optimized blog post about "${topic}".

Requirements:
- Minimum ${targetWords} words (aim for ${Math.round(targetWords * 1.1)} words for better quality)
- ${style} writing style
- ${tone} tone
- Target audience: ${targetAudience}
- Primary keyword: "${primaryKeyword}"
${includeHeadings ? "- Use proper HTML heading structure (h2, h3 tags)" : ""}
- Well-structured with clear sections
- Include practical examples and actionable insights
- Original, engaging, and valuable content
- SEO-friendly with natural keyword placement
- Proper paragraphs and formatting

Format the response as:
1. TITLE: [Compelling, SEO-optimized title with focus keyword]
2. EXCERPT: [150-160 character engaging summary]
3. META_DESCRIPTION: [150-160 character SEO meta description with focus keyword]
4. KEYWORDS: [5-10 comma-separated relevant keywords]
5. CONTENT: [Full HTML-formatted blog content with headings if requested]

Ensure the content is:
- At least ${targetWords} words
- Well-researched and factual
- Engaging and readable
- Optimized for search engines
- Includes the focus keyword naturally throughout
- Has proper structure and flow

Generate the blog post now:`;

  try {
    // Use OpenRouter with a good model for long-form content
    // Default to free Llama, but can be overridden with better paid models
    const model = process.env.OPENROUTER_MODEL || POPULAR_MODELS["llama-3.3-8b-free"] || POPULAR_MODELS["gpt-4o"] || POPULAR_MODELS["claude-3.5-sonnet"] || POPULAR_MODELS["gemini-flash"];
    
    const text = await generateText(prompt, {
      model,
      temperature: 0.8,
      maxTokens: Math.max(4000, targetWords * 6), // Estimate tokens needed
    });

    // Parse the response
    const titleMatch = text.match(/TITLE:\s*(.+?)(?:\n|EXCERPT|CONTENT|$)/i);
    const excerptMatch = text.match(/EXCERPT:\s*(.+?)(?:\n|META_DESCRIPTION|CONTENT|$)/i);
    const metaDescriptionMatch = text.match(/META_DESCRIPTION:\s*(.+?)(?:\n|KEYWORDS|CONTENT|$)/i);
    const keywordsMatch = text.match(/KEYWORDS:\s*(.+?)(?:\n|CONTENT|$)/i);
    const contentMatch = text.match(/CONTENT:\s*([\s\S]+)$/i);

    const title = titleMatch?.[1]?.trim() || `Complete Guide to ${topic}`;
    const excerpt = excerptMatch?.[1]?.trim() || `Learn everything about ${topic} in this comprehensive guide.`;
    // Truncate metaDescription to 160 characters max (SEO best practice)
    let metaDescription = metaDescriptionMatch?.[1]?.trim() || excerpt;
    if (metaDescription.length > 160) {
      metaDescription = metaDescription.substring(0, 157) + "...";
    }
    const keywordsStr = keywordsMatch?.[1]?.trim() || primaryKeyword;
    const keywords = keywordsStr
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);
    
    // If content section is found, use it; otherwise use the full text
    let content = contentMatch?.[1]?.trim() || text;
    
    // If content doesn't include HTML headings and they were requested, add them
    if (includeHeadings && !content.includes("<h2>")) {
      // Try to add structure
      const paragraphs = content.split("\n\n").filter((p) => p.trim());
      let structuredContent = "";
      let h2Index = 0;
      
      paragraphs.forEach((para, index) => {
        if (index === 0) {
          structuredContent += `<p>${para}</p>\n`;
        } else if (index % 4 === 0 && h2Index < 5) {
          // Every 4th paragraph could be a new section
          const firstSentence = para.split(".")[0];
          structuredContent += `\n<h2>${firstSentence}</h2>\n<p>${para.replace(firstSentence, "").trim()}</p>\n`;
          h2Index++;
        } else {
          structuredContent += `<p>${para}</p>\n`;
        }
      });
      
      if (structuredContent.length > 0) {
        content = structuredContent;
      }
    }

    // Ensure content has proper HTML structure
    if (!content.includes("<p>") && !content.includes("<h")) {
      // Wrap paragraphs in <p> tags
      content = content
        .split("\n\n")
        .filter((p) => p.trim())
        .map((p) => `<p>${p.trim()}</p>`)
        .join("\n\n");
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Calculate word count
    const wordCount = content.replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length;

    return {
      title,
      content,
      excerpt,
      slug,
      metaDescription,
      keywords: keywords.length > 0 ? keywords : [primaryKeyword, topic.toLowerCase()],
      focusKeyword: primaryKeyword,
      wordCount,
    };
  } catch (error: any) {
    console.error("Blog generation error:", error);
    
    if (error.message) {
      throw error;
    }
    
    throw new Error("Failed to generate blog content. Please try again.");
  }
}

