import { LiveDot } from '../ui/LiveDot';
import type { Task, Volunteer } from '../../types';

export default function MapHUD({ tasks, volunteers }: { tasks: Task[]; volunteers: Volunteer[] }) {
  const critical = tasks.filter(t => t.priority === 'Critical' && t.status === 'open').length;
  const available = volunteers.filter(v => v.status === 'available').length;

  return (
    <div style={{
      position: 'absolute', top: 12, left: 12, zIndex: 1000,
      display: 'flex', flexDirection: 'column', gap: 6,
    }}>
      {[
        { label: 'Active needs', value: tasks.filter(t => t.status === 'open').length },
        { label: 'Critical', value: critical },
        { label: 'Available volunteers', value: available },
      ].map(item => (
        <div key={item.label} style={{
          background: 'rgba(9,9,11,0.88)',
          border: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(12px)',
          borderRadius: 'var(--radius-md)',
          padding: '6px 12px',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          {item.label === 'Critical' && <LiveDot color="var(--critical)" />}
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)' }}>
            {item.label}:
          </span>
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.78rem', fontWeight: 500,
            color: item.label === 'Critical' ? 'var(--critical)' : 'white' }}>
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
}
