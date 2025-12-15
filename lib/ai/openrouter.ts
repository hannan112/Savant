// OpenRouter AI implementation
// Supports OpenAI-compatible API format

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

export interface OpenRouterOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

// Popular models on OpenRouter
export const POPULAR_MODELS = {
  // OpenAI Models
  "gpt-4o": "openai/gpt-4o",
  "gpt-4-turbo": "openai/gpt-4-turbo",
  "gpt-3.5-turbo": "openai/gpt-3.5-turbo",

  // Anthropic Models
  "claude-3.5-sonnet": "anthropic/claude-3.5-sonnet",
  "claude-3-opus": "anthropic/claude-3-opus",
  "claude-3-haiku": "anthropic/claude-3-haiku",

  // Google Models
  "gemini-pro": "google/gemini-pro",
  "gemini-flash": "google/gemini-flash-1.5",

  // Meta Models
  "llama-3.1": "meta-llama/llama-3.1-70b-instruct",
  "llama-3.3-70b-free": "meta-llama/llama-3.3-70b-instruct:free", // User requested model

  // Free/Cheap Models
  "mistral-small": "mistralai/mistral-small",
  "phi-3": "microsoft/phi-3-mini-128k-instruct",
};

const DEFAULT_MODEL = "meta-llama/llama-3.3-70b-instruct:free"; // Set as Default

export async function generateText(
  prompt: string,
  options: OpenRouterOptions = {}
): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY || process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY or GOOGLE_API_KEY is not set. Please check your .env.local file.");
  }

  const model = options.model || DEFAULT_MODEL;

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL || "http://localhost:3000",
        "X-Title": process.env.SITE_NAME || "NextFile Converter",
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: options.temperature ?? 0.7,
        max_tokens: options.maxTokens ?? 2048,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: { message: response.statusText } }));
      throw new Error(errorData.error?.message || `API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.choices || !data.choices[0] || !data.choices[0].message?.content) {
      throw new Error("Invalid response format from OpenRouter API");
    }

    return data.choices[0].message.content.trim();
  } catch (error: any) {
    console.error("OpenRouter API error:", error);

    // Provide more specific error messages
    if (error.message?.includes("401") || error.message?.includes("Unauthorized")) {
      throw new Error("Invalid API key. Please check your OPENROUTER_API_KEY in .env.local file.");
    }

    if (error.message?.includes("quota") || error.message?.includes("limit") || error.message?.includes("insufficient")) {
      throw new Error("API quota exceeded. Please check your OpenRouter account balance or limits.");
    }

    if (error.message?.includes("403") || error.message?.includes("Forbidden")) {
      throw new Error("API access denied. Please check your API key permissions.");
    }

    if (error.message?.includes("model") || error.message?.includes("not found")) {
      throw new Error(`Model "${model}" is not available. Please try a different model.`);
    }

    throw new Error(error.message || "Failed to generate text. Please try again.");
  }
}

export async function listAvailableModels(): Promise<any[]> {
  const apiKey = process.env.OPENROUTER_API_KEY || process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is not set");
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/models", {
      headers: {
        "Authorization": `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch models: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data || [];
  } catch (error: any) {
    console.error("Error fetching models:", error);
    throw error;
  }
}

