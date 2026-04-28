import { GoogleGenerativeAI } from "@google/generative-ai";
import { haversineKm } from './geo';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

/**
 * Generates strategic crisis insights using Gemini 2.0 Flash.
 * This function works ALONGSIDE the algorithmic matching engine (rankVolunteers)
 * which scores volunteers using:
 *   - 50% Skill Match (intersection of required_skills & volunteer skills)
 *   - 30% Proximity (Haversine distance, penalized beyond 200km)
 *   - 20% Availability (day overlap between task and volunteer)
 * 
 * Gemini adds a qualitative strategic layer on top of the quantitative algorithm.
 */
export async function generateCrisisInsights(tasks: any[], volunteers?: any[]) {
  if (!tasks || tasks.length === 0) return "No active tasks to analyze.";

  // Pre-compute proximity clusters using our Haversine algorithm
  const taskSummaries = tasks.slice(0, 10).map(t => ({
    name: t.ngo_name,
    location: t.location,
    requirements: t.requirements || t.description,
    priority: t.priority,
    severity: t.severity_score,
    skills_needed: t.required_skills,
    coords: { lat: t.latitude, lng: t.longitude }
  }));

  // Calculate inter-task distances to find geographic clusters
  const clusterData: string[] = [];
  for (let i = 0; i < taskSummaries.length; i++) {
    for (let j = i + 1; j < taskSummaries.length; j++) {
      const dist = haversineKm(
        taskSummaries[i].coords.lat, taskSummaries[i].coords.lng,
        taskSummaries[j].coords.lat, taskSummaries[j].coords.lng
      );
      if (dist < 200) {
        clusterData.push(`${taskSummaries[i].name} and ${taskSummaries[j].name} are ${Math.round(dist)}km apart — can share volunteers.`);
      }
    }
  }

  // Aggregate all required skills to detect shortages
  const allSkills = taskSummaries.flatMap(t => t.skills_needed || []);
  const skillCounts: Record<string, number> = {};
  allSkills.forEach(s => { skillCounts[s] = (skillCounts[s] || 0) + 1; });
  const criticalSkills = Object.entries(skillCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([skill, count]) => `${skill} (needed by ${count} missions)`);

  const prompt = `
You are an AI Disaster Response Strategist for "Sahayeta", an Indian humanitarian coordination platform.

CONTEXT: Our platform uses a weighted matching algorithm to assign field agents to NGO missions:
  - 50% weight: Skill Match (intersection of required vs available skills)
  - 30% weight: Proximity Score (Haversine distance, penalized beyond 200km radius)
  - 20% weight: Availability (day overlap between mission schedule and agent availability)

ACTIVE MISSIONS (${taskSummaries.length}):
${JSON.stringify(taskSummaries.map(t => ({ name: t.name, location: t.location, priority: t.priority, severity: t.severity, skills: t.skills_needed })), null, 1)}

GEOGRAPHIC CLUSTERS (pre-computed via Haversine):
${clusterData.length > 0 ? clusterData.join('\n') : 'No nearby missions detected within 200km radius.'}

CRITICAL SKILL DEMAND:
${criticalSkills.join(', ')}

TASK: Provide exactly 4 strategic bullet points:
1. Which missions should be prioritized based on severity and skill scarcity
2. How to exploit geographic clusters for shared volunteer deployment
3. Which skill gaps are most critical and need urgent recruitment
4. An overall risk assessment (1-10) for the current crisis landscape

Keep each bullet to 1-2 sentences. Use **bold** for key terms.
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    if (!text) throw new Error("Empty response from Gemini");
    return text;
  } catch (error: any) {
    console.error("GEMINI_SERVICE_ERROR:", error);
    if (error.message?.includes('API_KEY_INVALID')) return "AI Error: Invalid API Key. Please check your .env settings.";
    if (error.message?.includes('quota')) return "AI Error: Quota exceeded. Please try again in a minute.";
    return "AI Engine is warming up. Please refresh in a moment.";
  }
}
