import { motion } from 'framer-motion';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { ScoreBar } from '../ui/ScoreBar';
import { useApp } from '../../context/AppContext';
import type { Task } from '../../types';

export function UrgencyRow({ task }: { task: Task }) {
  const { dispatch } = useApp();
  
  const scoreColor = task.severity_score >= 80 ? 'var(--critical)' : 
                     task.severity_score >= 60 ? 'var(--high)' : 
                     task.severity_score >= 40 ? 'var(--medium)' : 'var(--low)';

  return (
    <motion.div
      layout="position"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
      transition={{ duration: 0.35 }}
      style={{
        padding: '12px 16px', borderBottom: '1px solid var(--border-default)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'var(--bg-surface)', cursor: 'default',
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-subtle)'}
      onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-surface)'}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: scoreColor }} />
        <div>
          <div style={{ fontFamily: 'Syne', fontWeight: 600, fontSize: '0.9rem' }}>
            {task.ngo_name} - {task.location}
          </div>
          <div style={{ fontFamily: 'Inter', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>
            {task.required_skills.join(', ')}
          </div>
        </div>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Badge severity={task.priority} />
        <div style={{ width: 60 }}>
          <ScoreBar score={task.severity_score} color={scoreColor} />
        </div>
        <div style={{ fontFamily: 'JetBrains Mono', color: scoreColor, width: 36, textAlign: 'right', fontSize: '0.8rem' }}>
          {task.severity_score.toFixed(1)}
        </div>
        <Button variant="ghost" onClick={() => dispatch({ type: 'SET_SELECTED_TASK', payload: task.task_id })}
          style={{ padding: '4px 12px', fontSize: '0.75rem' }}>
          Match →
        </Button>
      </div>
    </motion.div>
  );
}
