import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { day: 'Mon', without: 42, with: 98 },
  { day: 'Tue', without: 38, with: 105 },
  { day: 'Wed', without: 55, with: 130 },
  { day: 'Thu', without: 48, with: 115 },
  { day: 'Fri', without: 60, with: 150 },
  { day: 'Sat', without: 75, with: 180 },
  { day: 'Sun', without: 65, with: 160 },
];

export function ImpactBarChart() {
  return (
    <div style={{ height: 300, width: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: -20, bottom: 5 }}>
          <XAxis dataKey="day" stroke="var(--text-muted)" tick={{ fontFamily: 'JetBrains Mono', fontSize: 12 }} />
          <YAxis stroke="var(--text-muted)" tick={{ fontFamily: 'JetBrains Mono', fontSize: 12 }} />
          <Tooltip 
            contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-sm)' }}
            itemStyle={{ fontFamily: 'Inter', fontSize: '0.85rem' }}
            labelStyle={{ fontFamily: 'Syne', fontWeight: 700, marginBottom: 8, color: 'var(--text-primary)' }}
          />
          <Bar dataKey="without" fill="rgba(255,255,255,0.1)" name="Without Sahayeta" radius={[4, 4, 0, 0]} isAnimationActive animationDuration={800} />
          <Bar dataKey="with" fill="var(--accent)" name="With Sahayeta" radius={[4, 4, 0, 0]} isAnimationActive animationDuration={800} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
