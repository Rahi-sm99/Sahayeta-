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
    ${JSON.stringify(tasks.map(t => ({ name: t.ngo_name, req: t.requirements || t.description, priority: t.priority })))}
    
    Keep it professional, high-impact, and brief. Use bold text for key terms.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Failed to generate AI insights at this moment.";
  }
}
