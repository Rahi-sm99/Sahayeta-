import { VolunteerCard } from './VolunteerCard';
import { useRealtimeVolunteers } from '../../hooks/useRealtimeVolunteers';

export function VolunteerStrip() {
  const { volunteers } = useRealtimeVolunteers();

  return (
    <div style={{
      height: 160, borderTop: '1px solid var(--border-default)', background: 'var(--bg-base)',
      padding: '20px 24px', display: 'flex', gap: 16, overflowX: 'auto', alignItems: 'center'
    }}>
      {volunteers.map(vol => (
        <VolunteerCard key={vol.volunteer_id} volunteer={vol} />
      ))}
    </div>
  );
}
