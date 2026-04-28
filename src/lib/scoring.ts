const PRIORITY_BASE: Record<string, number> = {
  Critical: 100, High: 75, Medium: 50, Low: 25,
};

export function computeUrgencyScore(task: {
  priority: string;
  created_at: string;
  required_skills: string[];
}): number {
  const severity  = PRIORITY_BASE[task.priority] ?? 50;
  const frequency = Math.min(100, (task.required_skills?.length || 0) * 20);
  const ageHours  = (Date.now() - new Date(task.created_at).getTime()) / 3_600_000;
  const recency   = Math.max(0, 100 - ageHours * 2);
  return Math.round((severity * 0.5 + frequency * 0.3 + recency * 0.2) * 10) / 10;
}
