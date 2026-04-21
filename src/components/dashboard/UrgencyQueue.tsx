import { AnimatePresence } from 'framer-motion';
import { UrgencyRow } from './UrgencyRow';
import { useRealtimeTasks } from '../../hooks/useRealtimeTasks';
import { LiveDot } from '../ui/LiveDot';

export function UrgencyQueue() {
  const { tasks } = useRealtimeTasks();
  const openTasks = tasks.filter(t => t.status === 'open');

  return (
    <div style={{
      width: 440, background: 'var(--bg-surface)', borderRight: '1px solid var(--border-default)',
      display: 'flex', flexDirection: 'column', height: '100%',
    }}>
      <div style={{
        padding: '16px 20px', borderBottom: '1px solid var(--border-default)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <h2 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1.05rem', margin: 0 }}>Community Needs</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--critical-subtle)', padding: '2px 8px', borderRadius: 100 }}>
            <LiveDot color="var(--critical)" />
            <span style={{ fontFamily: 'JetBrains Mono', color: 'var(--critical)', fontSize: '0.65rem' }}>LIVE</span>
          </div>
        </div>
        <span style={{ background: 'var(--bg-subtle)', padding: '2px 8px', borderRadius: 100, fontSize: '0.75rem', fontFamily: 'JetBrains Mono' }}>
          {openTasks.length}
        </span>
      </div>
      
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <AnimatePresence initial={false}>
          {openTasks.map(task => (
            <UrgencyRow key={task.task_id} task={task} />
          ))}
        </AnimatePresence>
        {openTasks.length === 0 && (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'Inter' }}>
            No active needs currently.
          </div>
        )}
      </div>
    </div>
  );
}
