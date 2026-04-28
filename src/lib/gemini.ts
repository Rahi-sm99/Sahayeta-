import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function generateCrisisInsights(tasks: any[]) {
  if (!tasks || tasks.length === 0) return "No active tasks to analyze.";

  const prompt = `
    You are an AI Disaster Response Specialist for 'Sahayeta'.
    Analyze the following list of active NGO missions/tasks and provide a concise (3-4 bullet points) strategic briefing.
    Focus on:
    - Overlapping requirements
    - Critical skill shortages
    - Priority geographic clusters
    
    Tasks Data:
    ${JSON.stringify(tasks.slice(0, 10).map(t => ({ name: t.ngo_name, req: t.requirements || t.description, priority: t.priority })))}
    
    Keep it professional, high-impact, and brief. Use bold text for key terms.
    Response must be in plain text with markdown bullet points.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    if (!text) throw new Error("Empty response from Gemini");
    return text;
  } catch (error: any) {
    console.error("GEMINI_SERVICE_ERROR:", error);
    // Return a more helpful message if it's a common issue
    if (error.message?.includes('API_KEY_INVALID')) return "AI Error: Invalid API Key. Please check your .env settings.";
    if (error.message?.includes('quota')) return "AI Error: Quota exceeded. Please try again in a minute.";
    return "AI Engine is warming up. Please refresh in a moment.";
  }
}
