import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Task } from '../types';

// Normalize raw Supabase row to the Task interface the UI expects
function normalizeTask(row: any): Task {
  return {
    ...row,
    task_id: row.task_id ?? row.id ?? '',
    requirements: row.requirements ?? '',
    payment: row.payment ?? '',
    priority: row.priority ?? 'Medium',
    status: row.status ?? 'open',
    severity_score: row.severity_score ?? (row.priority === 'Critical' ? 95 : row.priority === 'High' ? 75 : 50),
    assigned_volunteer_id: row.assigned_volunteer_id ?? null,
    required_skills: Array.isArray(row.required_skills) 
      ? row.required_skills 
      : typeof row.required_skills === 'string' 
      ? row.required_skills.split('|').map((s: string) => s.trim()).filter(Boolean)
      : [],
    required_days: Array.isArray(row.required_days)
      ? row.required_days
      : typeof row.required_days === 'string'
      ? row.required_days.split('|').map((s: string) => s.trim()).filter(Boolean)
      : [],
  } as Task;
}

export function useRealtimeTasks(_userId?: string) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      console.log('Fetching tasks from Supabase...');
      const { data, error } = await supabase
        .from('tasks')
        .select('*');
      
      if (error) {
        console.error('Task fetch error:', error);
      } else if (data) {
        const normalized = data.map(normalizeTask);
        console.log('Tasks fetched successfully:', normalized);
        setTasks(normalized);
      }
      setLoading(false);
    };

    fetchTasks();

    const channel = supabase
      .channel('tasks_changes')
      .on('postgres_changes', { event: '*', table: 'tasks', schema: 'public' }, () => {
        fetchTasks();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    tasks, 
    loading,
    criticalCount: tasks.filter(t => t.priority === 'Critical' && t.status === 'open').length,
    openCount:     tasks.filter(t => t.status === 'open').length,
    resolvedCount: tasks.filter(t => t.status === 'resolved').length,
  };
}
