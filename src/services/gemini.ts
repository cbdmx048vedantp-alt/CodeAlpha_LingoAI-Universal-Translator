import { GoogleGenAI } from "@google/genai";

// Initialize the API only when we need it, but define the client
let ai: GoogleGenAI | null = null;

function getClient() {
  if (!ai) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is required. Please add it to your secrets.");
    }
    ai = new GoogleGenAI({ apiKey: key });
  }
  return ai;
}

export async function translateText(text: string, sourceLang: string, targetLang: string): Promise<string> {
  if (!text.trim()) return "";
  
  const aiClient = getClient();
  const source = sourceLang === 'auto' ? 'the source language (auto-detect)' : sourceLang;
  
  const prompt = `You are an expert, fluent language translator.
Translate the following text from ${source} to ${targetLang}.

IMPORTANT RULES:
- Respond ONLY with the direct translation.
- Do NOT wrap the translation in quotes.
- Do NOT include any explanations, conversational text, or notes.
- If the source is already in the target language, return it exactly as is.
- Preserve all original formatting, line breaks, punctuation, and capitalization as much as appropriate for the target language.

Text to translate:
${text}`;

  try {
    const response = await aiClient.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return (response.text || "").trim();
  } catch (error) {
    console.error("Translation API Error:", error);
    throw new Error("Translation failed. Please check network connection or API limits.");
  }
}
