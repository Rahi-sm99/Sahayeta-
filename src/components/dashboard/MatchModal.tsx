import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { rankVolunteers } from '../../lib/matching';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { SkillTag } from '../ui/SkillTag';
import { ScoreBar } from '../ui/ScoreBar';
import { useApp } from '../../context/AppContext';
import { useRealtimeTasks } from '../../hooks/useRealtimeTasks';
import { useRealtimeVolunteers } from '../../hooks/useRealtimeVolunteers';
import type { MatchResult } from '../../types';

export function MatchModal() {
  const { state, dispatch } = useApp();
  const { tasks } = useRealtimeTasks();
  const { volunteers } = useRealtimeVolunteers();
  
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [toast, setToast] = useState(false);

  const task = tasks.find(t => t.task_id === state.selectedTaskId);

  useEffect(() => {
    if (task) {
      setMatches(rankVolunteers(task, volunteers).slice(0, 5));
    }
  }, [task, volunteers]);

  if (!task) return null;

  const handleAssign = async (volId: string) => {
    await supabase.from('tasks').update({ status: 'assigned', assigned_volunteer_id: volId }).eq('task_id', task.task_id);
    await supabase.from('volunteers').update({ status: 'assigned', assigned_task_id: task.task_id }).eq('volunteer_id', volId);
    
    setToast(true);
    setTimeout(() => {
      setToast(false);
      dispatch({ type: 'SET_SELECTED_TASK', payload: null });
    }, 2000);
  };

  return (
    <>
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', zIndex: 3000,
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }} onClick={() => dispatch({ type: 'SET_SELECTED_TASK', payload: null })}>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.22 }}
          onClick={e => e.stopPropagation()}
          style={{
            background: 'var(--bg-elevated)', border: '1px solid var(--border-strong)',
            borderRadius: 'var(--radius-xl)', width: 520, maxHeight: '80vh', overflowY: 'auto',
            boxShadow: 'var(--shadow-elevated)', display: 'flex', flexDirection: 'column'
          }}
        >
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-default)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h2 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.1rem', margin: '0 0 8px 0' }}>{task.ngo_name} Need</h2>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <Badge severity={task.priority} />
                <span style={{ fontFamily: 'Inter', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{task.location}</span>
              </div>
            </div>
            <button onClick={() => dispatch({ type: 'SET_SELECTED_TASK', payload: null })} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
          </div>

          <div style={{ padding: '20px 24px', flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h3 style={{ fontFamily: 'Inter', fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>Top Matches</h3>
            {matches.length === 0 && <div style={{ color: 'var(--text-secondary)' }}>No available volunteers found.</div>}
            
            {matches.map((match, i) => (
              <motion.div
                key={match.volunteer.volunteer_id}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 * i }}
                style={{
                  background: 'var(--bg-surface)', border: '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-md)', padding: 16, display: 'flex', flexDirection: 'column', gap: 12
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Syne', fontWeight: 600, color: 'var(--accent)' }}>
                      {match.volunteer.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: '0.9rem' }}>{match.volunteer.name}</div>
                      <div style={{ fontFamily: 'Inter', fontSize: '0.7rem', color: 'var(--text-muted)' }}>{match.distanceKm} km away</div>
                    </div>
                  </div>
                  <div style={{ fontFamily: 'JetBrains Mono', fontSize: '1.2rem', color: 'var(--low)', fontWeight: 500 }}>
                    {match.score}%
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {match.volunteer.skills.map(skill => <SkillTag key={skill} skill={skill} />)}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginTop: 4 }}>
                  <div><div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: 4 }}>Skill Match</div><ScoreBar score={match.skillScore} color="var(--accent)" /></div>
                  <div><div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: 4 }}>Distance</div><ScoreBar score={match.distanceScore} color="var(--low)" /></div>
                  <div><div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: 4 }}>Availability</div><ScoreBar score={match.availabilityScore} color="var(--medium)" /></div>
                </div>

                <Button variant="ghost" onClick={() => handleAssign(match.volunteer.volunteer_id)} style={{ marginTop: 8 }}>
                  Assign Volunteer
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }}
            style={{
              position: 'fixed', top: 80, right: 24, zIndex: 4000,
              background: 'var(--low-subtle)', border: '1px solid var(--low)', color: 'var(--text-primary)',
              padding: '12px 20px', borderRadius: 'var(--radius-md)', display: 'flex', gap: 12, alignItems: 'center'
            }}
          >
            <div style={{ color: 'var(--low)' }}>✓</div>
            <span style={{ fontFamily: 'Inter', fontSize: '0.85rem' }}>Volunteer assigned successfully</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
