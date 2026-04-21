import { useCountUp } from '../../hooks/useCountUp';

export function StatCard({ label, value, delta, icon: Icon, color }: {
  label: string; value: number; delta?: string; icon: any; color: string;
}) {
  const animatedValue = useCountUp(value);
  const isPositive = delta?.startsWith('↑');

  return (
    <div style={{
      background: 'var(--bg-surface)', border: '1px solid var(--border-default)',
      borderLeft: `3px solid ${color}`, borderRadius: 'var(--radius-lg)',
      padding: '16px 20px', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: 16, right: 16, opacity: 0.3, color,
      }}>
        <Icon size={24} />
      </div>
      <div style={{ fontFamily: 'Syne', fontSize: '2rem', fontWeight: 800 }}>
        {animatedValue}
      </div>
      <div style={{ fontFamily: 'Inter', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
        {label}
      </div>
      {delta && (
        <div style={{
          fontFamily: 'Inter', fontSize: '0.72rem', fontWeight: 500, marginTop: 4,
          color: isPositive ? 'var(--low)' : 'var(--critical)',
        }}>
          {delta}
        </div>
      )}
    </div>
  );
}
