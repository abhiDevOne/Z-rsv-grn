import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

// Ensure API key exists
if (!process.env.GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY is missing in .env file");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const analyzeGrievance = async (title, description) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    const prompt = `
      Analyze the following grievance for a college system.
      Title: "${title}"
      Description: "${description}"
      
      Tasks:
      1. Determine priority (Low, Medium, High). Issues involving safety, harassment, or major infrastructure failure are High.
      2. Generate a very short 1-sentence summary (max 15 words).
      
      Output strictly in this JSON format:
      {
        "priority": "High/Medium/Low",
        "summary": "The summary text here"
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Log the raw response for debugging
    console.log("🤖 AI Raw Response:", text);

    // Clean up markdown code blocks if the AI adds them
    const cleanText = text.replace(/```json|```/g, "").trim();

    return JSON.parse(cleanText);
  } catch (error) {
    console.error("❌ AI Service Error:", error);
    // Fallback if AI fails
    return { priority: "Medium", summary: "Auto-summary unavailable" };
  }
};
