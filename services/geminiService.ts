import { GoogleGenAI } from "@google/genai";

// Initialize safely - if key is missing, it will default to empty string
// The app won't crash on load, but requests will fail if key is invalid
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const refineJobDescription = async (text: string): Promise<string> => {
  if (!text || text.trim().length === 0) return "";
  
  // Basic validation before making request
  if (!apiKey) {
    console.error("Gemini API Key is missing");
    alert("API Key is missing. Please configure it in your deployment settings.");
    return text;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are an expert HR consultant. Rewrite the following raw job functions into a professional, bulleted list suitable for a formal job description. 
      
      Rules:
      1. Use professional action verbs.
      2. Keep it concise but descriptive.
      3. Format as a clean bulleted list (using • or -).
      4. Correct grammar and spelling.
      5. Do not add any introductory or concluding text, just the list.

      Raw Input:
      ${text}`,
      config: {
        temperature: 0.3, // Lower temperature for more deterministic/professional output
      }
    });

    return response.text || text;
  } catch (error) {
    console.error("Gemini Polish Error:", error);
    // Fallback to original text if AI fails
    return text;
  }
};