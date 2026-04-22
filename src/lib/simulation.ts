import { CITY_COORDS, getCityCoords } from './geo';
import { computeUrgencyScore } from './scoring';
import { supabase } from './supabase';
import type { Task } from '../types';

const CITIES = Object.keys(CITY_COORDS);
const NGOS   = ['Health First','Relief Force','Care India','Helping Hands','Teach Mission'];
const SKILLS = ['Medical','Logistics','Teaching','First Aid','Counseling','Data Entry','Cooking','Driving'];
const ORGS   = ['Healthcare NGO','Education NGO','Disaster Relief NGO','Food NGO','Women Welfare NGO'];
const PRIOS  = ['Low','Medium','High','Critical'] as const;

export async function pushSimulatedTask(): Promise<void> {
  const city     = CITIES[Math.floor(Math.random() * CITIES.length)];
  const priority = PRIOS[Math.floor(Math.random() * PRIOS.length)];
  const skills   = [SKILLS[Math.floor(Math.random() * SKILLS.length)]];
  const now      = new Date().toISOString();
  const coords   = getCityCoords(city, false);
  const task: Omit<Task,'assigned_volunteer_id'> & { assigned_volunteer_id: null } = {
    task_id: `SIM-${Date.now()}`,
    ngo_name: NGOS[Math.floor(Math.random() * NGOS.length)],
    required_skills: skills, required_days: ['Mon','Tue','Wed'],
    location: city, organization_type: ORGS[Math.floor(Math.random() * ORGS.length)],
    priority, status: 'open', severity_score: 0, assigned_volunteer_id: null,
    latitude: coords.latitude, longitude: coords.longitude,
    created_at: now, last_updated: now,
  };
  task.severity_score = computeUrgencyScore(task);
  await supabase.from('tasks').insert(task);
}

import { rankVolunteers } from './matching';

export async function simulateTick(): Promise<void> {
  // 1. Move en_route volunteers towards their assigned task
  const { data: vols } = await supabase.from('volunteers').select('*').eq('status', 'en_route');
  if (vols && vols.length > 0) {
    const { data: tasks } = await supabase.from('tasks').select('*').in('task_id', vols.map(v => v.assigned_task_id).filter(Boolean));
    if (tasks) {
      for (const vol of vols) {
        const target = tasks.find(t => t.task_id === vol.assigned_task_id);
        if (!target) continue;
        
        const dx = target.latitude - vol.latitude;
        const dy = target.longitude - vol.longitude;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 0.05) {
          // Arrived
          await supabase.from('volunteers').update({ status: 'assigned' }).eq('volunteer_id', vol.volunteer_id);
          await supabase.from('tasks').update({ status: 'in_progress' }).eq('task_id', target.task_id);
        } else {
          // Move 0.05 degrees per tick
          const moveRatio = 0.05 / dist;
          await supabase.from('volunteers').update({
            latitude: vol.latitude + dx * moveRatio,
            longitude: vol.longitude + dy * moveRatio,
            last_updated: new Date().toISOString()
          }).eq('volunteer_id', vol.volunteer_id);
        }
      }
    }
  }

  // 2. Assign available volunteers to open tasks
  const { data: openTasks } = await supabase.from('tasks').select('*').eq('status', 'open').order('severity_score', { ascending: false }).limit(3);
  if (openTasks && openTasks.length > 0) {
    const { data: availableVols } = await supabase.from('volunteers').select('*').eq('status', 'available');
    if (availableVols && availableVols.length > 0) {
      let currentVols = [...availableVols];
      for (const task of openTasks) {
        if (currentVols.length === 0) break;
        const matches = rankVolunteers(task, currentVols as any);
        if (matches.length > 0) {
          const best = matches[0].volunteer;
          currentVols = currentVols.filter(v => v.volunteer_id !== best.volunteer_id);
          
          await supabase.from('volunteers').update({
            status: 'en_route',
            assigned_task_id: task.task_id
          }).eq('volunteer_id', best.volunteer_id);
          
          await supabase.from('tasks').update({
            status: 'assigned',
            assigned_volunteer_id: best.volunteer_id
          }).eq('task_id', task.task_id);
        }
      }
    }
  }
}

export async function pushCrisisTasks(
  type: 'flood' | 'outbreak' | 'famine', location: string
): Promise<void> {
  const cfg = {
    flood:    { skill: 'First Aid', count: 8, priority: 'Critical' as const },
    outbreak: { skill: 'Medical',   count: 6, priority: 'Critical' as const },
    famine:   { skill: 'Cooking',   count: 5, priority: 'High'     as const },
  }[type];
  const now = new Date().toISOString();
  const coords = getCityCoords(location, false);
  const tasks = Array.from({ length: cfg.count }, (_, i) => {
    const t = {
      task_id: `CRISIS-${Date.now()}-${i}`,
      ngo_name: 'Emergency Response Unit', required_skills: [cfg.skill],
      required_days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
      location, organization_type: 'Disaster Relief NGO',
      priority: cfg.priority, status: 'open' as const, severity_score: 0,
      assigned_volunteer_id: null,
      latitude:  coords.latitude  + (Math.random() - 0.5) * 0.18,
      longitude: coords.longitude + (Math.random() - 0.5) * 0.18,
      created_at: now, last_updated: now,
    };
    t.severity_score = computeUrgencyScore(t);
    return t;
  });
  await supabase.from('tasks').insert(tasks);
  await supabase.from('events').insert({
    event_type: 'crisis_triggered', payload: { type, location, count: cfg.count },
  });
}
