
import { GoogleGenAI, Type } from "@google/genai";

// Use process.env.API_KEY directly as per SDK guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeRootCause = async (problemDescription: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Perform a 5-Why root cause analysis for the following quality issue: ${problemDescription}. Provide a suggested root cause and a preventive action plan.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            whys: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'The 5-Why progression.'
            },
            suggestedRootCause: { type: Type.STRING },
            suggestedActionPlan: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'List of actions.'
            }
          },
          required: ["whys", "suggestedRootCause", "suggestedActionPlan"]
        }
      }
    });

    // Access .text property directly and trim as per guidelines
    const text = response.text?.trim();
    return text ? JSON.parse(text) : null;
  } catch (error) {
    console.error("Gemini Error:", error);
    return null;
  }
};
