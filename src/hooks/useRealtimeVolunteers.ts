import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Volunteer } from '../types';

// Normalize raw Supabase row to the Volunteer interface the UI expects
function normalizeVolunteer(row: any): Volunteer {
  const skills = Array.isArray(row.skills)
    ? row.skills
    : typeof row.skills === 'string'
    ? row.skills.split('|').map((s: string) => s.trim()).filter(Boolean)
    : [];

  const rawAvailability = row.availability_days ?? row.availability;
  const availabilityDays = Array.isArray(rawAvailability)
    ? rawAvailability
    : typeof rawAvailability === 'string'
    ? rawAvailability.split('|').map((s: string) => s.trim()).filter(Boolean)
    : [];

  // Map DB status 'approved' to UI status 'available'
  const mappedStatus = row.status === 'approved' ? 'available' : (row.status || 'pending');

  return {
    ...row,
    volunteer_id: row.volunteer_id ?? row.id ?? '',
    availability: typeof rawAvailability === 'string' ? rawAvailability.replace(/\|/g, ', ') : (Array.isArray(rawAvailability) ? rawAvailability.join(', ') : 'Not set'),
    availability_days: availabilityDays,
    experience_years: row.experience_years ?? row.experience ?? 0,
    skills: skills,
    name: row.name ?? '',
    status: mappedStatus,
    email: row.email ?? '',
    phone: row.phone ?? '',
  } as Volunteer & { email: string; phone: string };
}

export function useRealtimeVolunteers(_userId?: string) {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVolunteers = async () => {
      console.log('Fetching volunteers from Supabase...');
      const { data, error } = await supabase
        .from('volunteers')
        .select('*');
      
      if (error) {
        console.error('Volunteer fetch error:', error);
      } else if (data) {
        const normalized = data.map(normalizeVolunteer);
        console.log('Volunteers fetched successfully:', normalized);
        setVolunteers(normalized);
      }
      setLoading(false);
    };

    fetchVolunteers();

    const channel = supabase
      .channel('volunteers_changes')
      .on('postgres_changes', { event: '*', table: 'volunteers', schema: 'public' }, () => {
        fetchVolunteers();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    volunteers,
    loading,
    availableCount: volunteers.filter(v => v.status === 'available').length,
    assignedCount:  volunteers.filter(v => v.status === 'assigned').length,
  };
}
