import { supabase } from '../lib/supabase';
import { getCityCoords } from '../lib/geo';
import { computeUrgencyScore } from '../lib/scoring';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

import tasksCsvUrl from '../assets/tasks.csv?url';
import volsXlsxUrl from '../assets/volunteers.xlsx?url';

export async function seedDatabase(): Promise<{ volunteers: number; tasks: number }> {
  const createdAt = new Date(Date.now() - 2 * 3600 * 1000).toISOString();

  // Parse tasks.csv
  const tasksRes = await fetch(tasksCsvUrl);
  const tasksText = await tasksRes.text();
  const tasksParsed = Papa.parse(tasksText, { header: true, skipEmptyLines: true }).data as any[];

  const taskRows = tasksParsed.map(t => {
    const c = getCityCoords(t.location, false);
    const row = {
      task_id: t.task_id,
      ngo_name: t.ngo_name,
      required_skills: t.required_skills ? t.required_skills.split('|') : [],
      required_days: t.required_days ? t.required_days.split('|') : [],
      location: t.location,
      organization_type: t.organization_type,
      priority: t.priority,
      status: 'open',
      severity_score: 0,
      latitude: c.latitude,
      longitude: c.longitude,
      created_at: createdAt,
      last_updated: createdAt
    };
    row.severity_score = computeUrgencyScore({
      priority: row.priority,
      created_at: row.created_at,
      required_skills: row.required_skills
    });
    return row;
  });

  // Parse volunteers.xlsx
  const volsRes = await fetch(volsXlsxUrl);
  const volsBuffer = await volsRes.arrayBuffer();
  const workbook = XLSX.read(volsBuffer, { type: 'array' });
  const sheetName = workbook.SheetNames[0];
  const volsParsed = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]) as any[];

  const volRows = volsParsed.map(v => {
    const c = getCityCoords(v.location || v.city, true);
    return {
      volunteer_id: v.volunteer_id || v.id,
      name: v.name,
      age: v.age ? parseInt(v.age) : null,
      gender: v.gender,
      skills: v.skills ? (typeof v.skills === 'string' ? v.skills.split('|') : v.skills) : [],
      availability_days: v.availability_days ? (typeof v.availability_days === 'string' ? v.availability_days.split('|') : v.availability_days) : (v.days ? (typeof v.days === 'string' ? v.days.split('|') : v.days) : []),
      location: v.location || v.city,
      organization_type: v.organization_type || v.org,
      latitude: c.latitude,
      longitude: c.longitude,
      status: 'available'
    };
  });

  // Upsert to Supabase
  const { error: ve } = await supabase.from('volunteers').upsert(volRows);
  const { error: te } = await supabase.from('tasks').upsert(taskRows);
  if (ve) throw ve;
  if (te) throw te;
  return { volunteers: volRows.length, tasks: taskRows.length };
}
