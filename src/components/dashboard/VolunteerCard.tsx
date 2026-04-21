import type { Volunteer } from '../../types';

export function VolunteerCard({ volunteer }: { volunteer: Volunteer }) {
  const initials = volunteer.name.split(' ').map(n => n[0]).join('').substring(0, 2);
  const color = volunteer.status === 'assigned' ? 'var(--accent)' : 'var(--low)';
  
  return (
    <div style={{
      width: 160, minWidth: 160, height: 120,
      background: 'var(--bg-surface)', border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-md)', padding: 16,
      display: 'flex', flexDirection: 'column', gap: 8,
      cursor: 'pointer', transition: 'all 0.2s ease',
      position: 'relative'
    }}
    onMouseEnter={e => {
      e.currentTarget.style.transform = 'translateY(-3px)';
      e.currentTarget.style.borderColor = 'var(--border-strong)';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.transform = 'none';
      e.currentTarget.style.borderColor = 'var(--border-default)';
    }}>
      <div style={{ position: 'absolute', top: 12, right: 12, width: 8, height: 8, borderRadius: '50%', background: color }} />
      
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%', background: 'var(--bg-subtle)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Syne', fontWeight: 600, fontSize: '0.8rem', color: 'var(--text-primary)'
        }}>
          {initials}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <span style={{ fontFamily: 'Syne', fontWeight: 600, fontSize: '0.85rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
            {volunteer.name}
          </span>
          <span style={{ fontFamily: 'Inter', fontSize: '0.65rem', color: 'var(--text-muted)' }}>
            {volunteer.location}
          </span>
        </div>
      </div>
      
      <div style={{ marginTop: 'auto', display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        {volunteer.skills.slice(0, 2).map(skill => (
          <span key={skill} style={{
            background: 'var(--bg-elevated)', padding: '2px 6px', borderRadius: 4,
            fontSize: '0.6rem', color: 'var(--text-secondary)'
          }}>{skill}</span>
        ))}
        {volunteer.skills.length > 2 && (
          <span style={{
            background: 'var(--bg-elevated)', padding: '2px 6px', borderRadius: 4,
            fontSize: '0.6rem', color: 'var(--text-secondary)'
          }}>+{volunteer.skills.length - 2}</span>
        )}
      </div>
    </div>
  );
}
