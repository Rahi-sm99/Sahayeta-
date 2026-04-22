import { haversineKm } from './geo';
import type { Volunteer, Task, MatchResult } from '../types';

export function rankVolunteers(task: Task, volunteers: Volunteer[]): MatchResult[] {
  return volunteers
    .filter(v => v.status === 'available')
    .map(vol => {
      const tSkills = task.required_skills || [];
      const vSkills = vol.skills || [];
      const tDays = task.required_days || [];
      const vDays = vol.availability_days || [];

      const matchedSkills     = tSkills.filter(s => vSkills.includes(s));
      const skillScore        = tSkills.length > 0
        ? (matchedSkills.length / tSkills.length) * 100 : 50;
      const distanceKm        = haversineKm(vol.latitude, vol.longitude, task.latitude, task.longitude);
      const distanceScore     = Math.max(0, 100 - (distanceKm / 200) * 100);
      const matchedDays       = tDays.filter(d => vDays.includes(d));
      const availabilityScore = tDays.length > 0
        ? (matchedDays.length / tDays.length) * 100 : 50;
      const score = skillScore * 0.5 + distanceScore * 0.3 + availabilityScore * 0.2;
      return {
        volunteer: vol, score: Math.round(score),
        skillScore: Math.round(skillScore), distanceScore: Math.round(distanceScore),
        availabilityScore: Math.round(availabilityScore),
        distanceKm: Math.round(distanceKm * 10) / 10, matchedSkills,
      };
    })
    .sort((a, b) => b.score - a.score);
}
