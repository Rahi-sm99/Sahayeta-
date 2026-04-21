import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
  { name: 'Critical', value: 45, color: '#f43f5e' },
  { name: 'High', value: 120, color: '#f97316' },
  { name: 'Medium', value: 340, color: '#eab308' },
  { name: 'Low', value: 210, color: '#22c55e' },
];

export function SeverityDonut() {
  const total = data.reduce((acc, item) => acc + item.value, 0);

  return (
    <div style={{ height: 300, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ height: 240, width: '100%', position: 'relative' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data} cx="50%" cy="50%" innerRadius={70} outerRadius={100}
              paddingAngle={5} dataKey="value" stroke="none"
              isAnimationActive animationDuration={800}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-sm)' }}
              itemStyle={{ fontFamily: 'Inter', fontSize: '0.85rem' }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          textAlign: 'center', pointerEvents: 'none'
        }}>
          <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.8rem', color: 'var(--text-primary)' }}>{total}</div>
          <div style={{ fontFamily: 'Inter', fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Tasks</div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 16, marginTop: 10 }}>
        {data.map(item => (
          <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: item.color }} />
            <span style={{ fontFamily: 'Inter', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
