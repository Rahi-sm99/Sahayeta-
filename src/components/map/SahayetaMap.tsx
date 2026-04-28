import { Waves } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Task, Volunteer } from '../../types';

interface SahayetaMapProps {
  tasks: Task[];
  volunteers: Volunteer[];
}

// Coordinate projection helper (Zoomed into a specific region of West Bengal)
const getPos = (lat: number, lng: number) => {
  // Region: Expanded range for better scatter distribution
  const left = ((lng - 87.0) / 2.5) * 100;
  const top = (1 - (lat - 21.2) / 2.5) * 100;
  return { 
    left: `${Math.max(5, Math.min(95, left))}%`, 
    top: `${Math.max(5, Math.min(95, top))}%` 
  };
};

export default function SahayetaMap({ tasks, volunteers }: SahayetaMapProps) {
  return (
    <div className="map-card" style={{ height: '100%', border: 'none', background: '#0a0a0a' }}>
      <div className="section-head">
        <div>
          <h3>Live severity map</h3>
          <p>Critical markers blink, volunteers move, and tasks get reassigned live.</p>
        </div>
        <span className="badge yellow">
          <Waves size={14} /> Flood zone simulation
        </span>
      </div>
      
      <div className="map-shell" style={{ 
        background: `
          linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative Grid Lines */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.1, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, borderTop: '1px dashed #fff' }} />
          <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, borderLeft: '1px dashed #fff' }} />
        </div>

        <svg className="map-path" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <motion.path 
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            d="M10 70 C 22 62, 30 56, 40 48 S 62 32, 78 28" 
            stroke="rgba(52,211,201,.25)" 
            strokeWidth="0.2" 
            fill="none" 
            strokeDasharray="1 1"
          />
          <motion.path 
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, delay: 0.5, ease: "easeInOut" }}
            d="M24 18 C 36 30, 48 38, 59 46 S 74 59, 88 72" 
            stroke="rgba(98,177,255,.2)" 
            strokeWidth="0.2" 
            fill="none" 
            strokeDasharray="2 1"
          />
        </svg>

        {/* Task Markers */}
        {tasks.map((task) => {
          const pos = getPos(task.latitude, task.longitude);
          const priorityClass = task.priority.toLowerCase();
          
          return (
            <motion.div 
              key={task.task_id}
              layoutId={task.task_id}
              className={`issue-marker ${priorityClass}`}
              style={{ 
                position: 'absolute',
                ...pos,
                zIndex: 5
              }}
            >
              <div className="pin"></div>
              <div className="issue-label" style={{ background: 'rgba(10,10,10,0.9)', backdropFilter: 'blur(4px)' }}>
                {task.ngo_name} · {task.location}
              </div>
            </motion.div>
          );
        })}

        {/* Volunteer Markers */}
        <AnimatePresence>
          {volunteers.map((vol, index) => {
            const isEnRoute = vol.status === 'en_route' && vol.assigned_task_id;
            const targetTask = isEnRoute ? tasks.find(t => t.task_id === vol.assigned_task_id) : null;
            
            // If en-route, position should interpolate towards task, but for simulation we just show it at target or original
            // In a real simulation we'd have a frame loop, here we'll use framer-motion transition
            const pos = targetTask 
              ? getPos(targetTask.latitude, targetTask.longitude) 
              : getPos(vol.latitude, vol.longitude);
            
            return (
              <motion.div 
                key={vol.volunteer_id}
                layout
                initial={false}
                animate={{
                  ...pos,
                  scale: isEnRoute ? [1, 1.2, 1] : 1,
                }}
                transition={{
                  duration: isEnRoute ? 5 : 0.5,
                  ease: "linear"
                }}
                className="volunteer"
                style={{ 
                  position: 'absolute',
                  background: vol.status === 'assigned' || vol.status === 'en_route' ? 'var(--primary)' : '#fff',
                  color: vol.status === 'assigned' || vol.status === 'en_route' ? '#fff' : '#000',
                  zIndex: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '32px',
                  height: '32px',
                  fontSize: '0.7rem',
                  boxShadow: vol.status === 'en_route' ? '0 0 20px var(--primary)' : '0 0 10px rgba(255,255,255,0.2)'
                }}
              >
                <div style={{ fontWeight: 900 }}>V{index + 1}</div>
                
                {vol.status === 'en_route' && (
                  <motion.div 
                    animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    style={{ position: 'absolute', inset: -5, borderRadius: '50%', border: '2px solid var(--primary)' }}
                  />
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <div className="map-legend">
        <div className="legend-pill"><i style={{ background: 'var(--primary)' }}></i> Critical issue</div>
        <div className="legend-pill"><i style={{ background: 'var(--secondary)' }}></i> Moderate issue</div>
        <div className="legend-pill"><i style={{ background: '#7ed957' }}></i> Low issue</div>
        <div className="legend-pill"><i style={{ background: '#fff' }}></i> Moving volunteer</div>
      </div>
    </div>
  );
}
