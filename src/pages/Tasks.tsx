import { PageWrapper } from '../components/layout/PageWrapper';
import { useRealtimeTasks } from '../hooks/useRealtimeTasks';
import { Badge } from '../components/ui/Badge';
import { ScoreBar } from '../components/ui/ScoreBar';

export function Tasks() {
  const { tasks, loading } = useRealtimeTasks();

  return (
    <PageWrapper>
      <div style={{ padding: '40px 24px', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        <h1 style={{ fontFamily: 'Syne', fontSize: '2rem', marginBottom: 8 }}>Task Queue</h1>
        <p style={{ fontFamily: 'Inter', color: 'var(--text-secondary)', marginBottom: 32 }}>All ongoing and completed needs.</p>
        
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {tasks.map(task => (
              <div key={task.task_id} style={{
                background: 'var(--bg-surface)', border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-md)', padding: 20, display: 'flex', gap: 24, alignItems: 'center'
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1.1rem' }}>{task.ngo_name}</div>
                  <div style={{ fontFamily: 'Inter', fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                    {task.location} • {task.organization_type}
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                    {task.required_skills.map(s => <span key={s} style={{ background: 'var(--bg-subtle)', padding: '2px 8px', borderRadius: 4, fontSize: '0.7rem' }}>{s}</span>)}
                  </div>
                </div>
                
                <div style={{ width: 120, textAlign: 'center' }}>
                  <div style={{ fontFamily: 'JetBrains Mono', fontSize: '1.4rem', fontWeight: 600, color: 'var(--text-primary)' }}>{task.severity_score.toFixed(1)}</div>
                  <ScoreBar score={task.severity_score} />
                </div>
                
                <div style={{ width: 100, textAlign: 'right' }}>
                  <Badge severity={task.priority} />
                  <div style={{ marginTop: 8, fontSize: '0.8rem', color: task.status === 'open' ? 'var(--critical)' : 'var(--low)' }}>
                    {task.status.toUpperCase()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
