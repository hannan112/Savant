import { generateText, POPULAR_MODELS } from "@/lib/ai/openrouter";
import { PARAPHRASE_MODES } from "@/lib/constants";

export type ParaphraseMode =
  | "standard"
  | "formal"
  | "casual"
  | "academic"
  | "creative"
  | "simplify";

const MODE_PROMPTS: Record<ParaphraseMode, string> = {
  standard:
    "Paraphrase the following text while maintaining the original meaning and tone. Keep it balanced and natural.",
  formal:
    "Paraphrase the following text in a formal and professional tone, suitable for business or academic contexts.",
  casual:
    "Paraphrase the following text in a casual and conversational tone, making it friendly and approachable.",
  academic:
    "Paraphrase the following text in an academic and scholarly tone, suitable for research papers and academic writing.",
  creative:
    "Paraphrase the following text with creative and varied phrasing, using different word choices while keeping the meaning.",
  simplify:
    "Paraphrase the following text to make it simpler and easier to understand, using simpler words and shorter sentences.",
};

export async function paraphraseText(
  text: string,
  mode: ParaphraseMode = "standard"
): Promise<string> {
  const prompt = `${MODE_PROMPTS[mode]}\n\nText to paraphrase:\n${text}\n\nParaphrased version:`;

  try {
    // Use OpenRouter with a fast, free model (default to free Llama 3.3)
    // Use OpenRouter with the requested free model
    const model = process.env.OPENROUTER_MODEL || POPULAR_MODELS["llama-3.3-70b-free"] || "meta-llama/llama-3.3-70b-instruct:free";

    const result = await generateText(prompt, {
      model,
      temperature: 0.7,
    });

    if (!result || result.trim().length === 0) {
      throw new Error("Empty response from API. Please try again.");
    }

    return result;
  } catch (error: any) {
    console.error("Paraphrase error:", error);
    throw error;
  }
}

