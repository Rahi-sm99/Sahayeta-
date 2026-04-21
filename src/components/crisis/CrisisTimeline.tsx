import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';

const STEPS = [
  { title: "Anomaly Detected", desc: "Unusual spike in local distress signals.", color: "var(--high)" },
  { title: "Crisis Declared", desc: "Severity algorithm escalated event to CRITICAL.", color: "var(--critical)" },
  { title: "Auto-Dispatching", desc: "Matching top 10 available local responders.", color: "var(--accent)" },
  { title: "Units En Route", desc: "Volunteers notified and moving to coordinates.", color: "var(--low)" }
];

export function CrisisTimeline() {
  const { state } = useApp();
  const [activeStep, setActiveStep] = useState(-1);

  useEffect(() => {
    if (state.crisisMode) {
      setActiveStep(0);
      const timers = STEPS.map((_, i) => setTimeout(() => setActiveStep(i), i * 1800));
      return () => timers.forEach(clearTimeout);
    } else {
      setActiveStep(-1);
    }
  }, [state.crisisMode]);

  if (!state.crisisMode) return null;

  return (
    <div style={{ marginTop: 24, position: 'relative', paddingLeft: 16 }}>
      <div style={{ position: 'absolute', left: 23, top: 0, bottom: 0, width: 2, background: 'rgba(255,255,255,0.08)' }} />
      <AnimatePresence>
        {STEPS.map((step, i) => i <= activeStep && (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            style={{ display: 'flex', gap: 16, marginBottom: 20, position: 'relative' }}
          >
            <div style={{ width: 16, height: 16, borderRadius: '50%', background: step.color, zIndex: 10, marginTop: 4, flexShrink: 0, boxShadow: `0 0 10px ${step.color}` }} />
            <div>
              <div style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: '0.85rem', color: 'var(--text-primary)' }}>{step.title}</div>
              <div style={{ fontFamily: 'Inter', fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 2 }}>{step.desc}</div>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: 4 }}>{new Date().toLocaleTimeString()}</div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
