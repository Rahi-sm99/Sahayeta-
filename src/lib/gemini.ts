import { GoogleGenerativeAI } from '@google/generative-ai';
import { haversineKm } from './geo';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// Define our specialist models
const tacticalModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const strategicModel = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

/**
 * TACTICAL AGENT (Gemini 1.5 Flash)
 * Fast, real-time briefings for individual missions.
 */
export async function getTacticalBriefing(task: any) {
  const prompt = `
    As a Sahayeta Tactical Agent, provide a 2-sentence mission briefing for this request:
    NGO: ${task.ngo_name}
    Location: ${task.location}
    Requirements: ${task.requirements}
    Priority: ${task.priority}
    
    Focus on immediate action items for a field volunteer. Keep it professional and urgent.
  `;

  try {
    const result = await tacticalModel.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Tactical Agent Error:', error);
    return "Tactical briefing unavailable. Proceed with standard emergency protocols.";
  }
}

/**
 * STRATEGIC ANALYST (Gemini 1.5 Pro)
 * Deep reasoning across all active missions to find patterns and resource gaps.
 */
export async function getRegionalStrategy(tasks: any[]) {
  if (tasks.length === 0) return "No active missions to analyze.";

  const missionSummary = tasks.map(t => `- ${t.ngo_name} in ${t.location}: ${t.requirements} (${t.priority})`).join('\n');
  
  const prompt = `
    As the Sahayeta Strategic Analyst, analyze these ${tasks.length} active missions:
    
    ${missionSummary}
    
    Provide a high-level humanitarian strategy including:
    1. CLUSTER ANALYSIS: Where is the highest concentration of need?
    2. RESOURCE GAPS: What skills are missing across these missions?
    3. CROSS-NGO COLLABORATION: Which NGOs should work together based on proximity?
    
    Format with bold headers and bullet points. Be insightful and professional.
  `;

  try {
    const result = await strategicModel.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Strategic Analyst Error:', error);
    return "Strategic analysis offline. Focus on localized response.";
  }
}

/**
 * VISUAL SENTINEL (Gemini 1.5 Flash Vision)
 * Analyzes images from the field to assess damage.
 */
export async function analyzeFieldPhoto(base64Image: string) {
  const prompt = "Analyze this disaster field photo. Identify the type of crisis, estimated damage level (1-10), and key hazards for responders.";

  try {
    const result = await tacticalModel.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Image.split(',')[1],
          mimeType: "image/jpeg"
        }
      }
    ]);
    return result.response.text();
  } catch (error) {
    console.error('Visual Sentinel Error:', error);
    return "Visual analysis failed. Manual verification required.";
  }
}
