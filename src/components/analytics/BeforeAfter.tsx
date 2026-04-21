import { motion } from 'framer-motion';

const beforeData = [
  "Paper surveys lost or delayed for weeks",
  "Manual sorting of thousands of requests",
  "Volunteers wait hours for assignments",
  "No visibility into critical hotspots",
  "Duplicate efforts by different NGOs",
  "Slow response to sudden crises"
];

const afterData = [
  "Instant digital data aggregation from field",
  "AI urgency scoring prioritizes automatically",
  "Smart matching connects volunteers in seconds",
  "Live interactive map shows real-time needs",
  "Centralized dashboard prevents duplication",
  "One-click crisis mode auto-dispatches help"
];

export function BeforeAfter() {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 40,
      background: 'var(--bg-surface)', padding: 40, borderRadius: 'var(--radius-xl)',
      border: '1px solid var(--border-default)'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <h3 style={{ fontFamily: 'Syne', fontSize: '1.2rem', color: 'var(--text-muted)', textAlign: 'center' }}>Without Sahayeta</h3>
        {beforeData.map((text, i) => (
          <div key={i} style={{
            background: 'rgba(244,63,94,0.04)', borderLeft: '3px solid rgba(244,63,94,0.3)',
            padding: '12px 16px', borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
            display: 'flex', gap: 12, alignItems: 'center'
          }}>
            <span style={{ color: 'rgba(244,63,94,0.5)', fontSize: '1.2rem' }}>✗</span>
            <span style={{ fontFamily: 'Inter', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{text}</span>
          </div>
        ))}
      </div>

      <div style={{ width: 1, background: 'var(--border-strong)', position: 'relative' }}>
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          background: 'var(--bg-elevated)', padding: '4px 12px', borderRadius: 100,
          border: '1px solid var(--border-strong)', fontFamily: 'Syne', fontWeight: 700,
          color: 'var(--text-muted)'
        }}>vs</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <h3 style={{ fontFamily: 'Syne', fontSize: '1.2rem', color: 'var(--accent)', textAlign: 'center' }}>With Sahayeta</h3>
        {afterData.map((text, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            style={{
              background: 'rgba(99,102,241,0.04)', borderLeft: '3px solid var(--accent)',
              padding: '12px 16px', borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
              display: 'flex', gap: 12, alignItems: 'center'
            }}
          >
            <span style={{ color: 'var(--low)', fontSize: '1.2rem' }}>✓</span>
            <span style={{ fontFamily: 'Inter', fontSize: '0.9rem', color: 'var(--text-primary)' }}>{text}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
