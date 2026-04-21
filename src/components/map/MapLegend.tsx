const ITEMS = [
  { color: '#ef4444', label: 'Critical' },
  { color: '#f59e0b', label: 'High' },
  { color: '#3b82f6', label: 'Medium' },
  { color: '#10b981', label: 'Low' },
  { color: '#10b981', label: 'Assigned', isVolunteer: true },
  { color: '#3b82f6', label: 'Available', isVolunteer: true },
];

export default function MapLegend() {
  return (
    <div style={{
      position: 'absolute', bottom: 12, left: 12, zIndex: 1000,
      background: 'rgba(9,9,11,0.88)', backdropFilter: 'blur(12px)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 'var(--radius-md)', padding: '10px 14px',
      display: 'flex', gap: 14, flexWrap: 'wrap',
    }}>
      {ITEMS.map(item => (
        <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 10, height: 10, 
            borderRadius: item.isVolunteer ? '50%' : '2px',
            background: item.color,
            flexShrink: 0,
          }} />
          <span style={{ fontFamily: 'Inter', fontSize: '0.75rem', fontWeight: 600, color: 'white' }}>
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
