import { useState } from 'react';
import { Button } from '../ui/Button';
import { localStore } from '../../lib/store';
import { useApp } from '../../context/AppContext';

export function CrisisPanel() {
  const { state, dispatch } = useApp();
  const [loading, setLoading] = useState<string | null>(null);

  const handleTrigger = async (type: 'flood' | 'outbreak' | 'famine', location: string) => {
    setLoading(type);
    localStore.pushCrisisTasks(type, location);
    dispatch({ type: 'SET_CRISIS_MODE', payload: true });
    setLoading(null);
  };

  return (
    <div style={{
      background: 'var(--bg-surface)', border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-lg)', padding: 20,
      boxShadow: state.crisisMode ? 'var(--shadow-critical)' : 'none',
      transition: 'box-shadow 0.3s ease',
    }}>
      <h3 style={{ fontFamily: 'Syne', fontSize: '1rem', marginBottom: 16, color: state.crisisMode ? 'var(--critical)' : 'var(--text-primary)' }}>
        Crisis Simulation
      </h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Button 
          variant={state.crisisMode ? 'danger' : 'ghost'} 
          onClick={() => handleTrigger('flood', 'Kolkata')}
          disabled={loading !== null || state.crisisMode}
          style={!state.crisisMode ? { borderColor: 'rgba(244,63,94,0.3)', color: 'rgba(244,63,94,0.8)' } : {}}
        >
          {loading === 'flood' ? 'Triggering...' : '🌊 Flood — Kolkata'}
        </Button>
        <Button 
          variant={state.crisisMode ? 'danger' : 'ghost'} 
          onClick={() => handleTrigger('outbreak', 'Siliguri')}
          disabled={loading !== null || state.crisisMode}
          style={!state.crisisMode ? { borderColor: 'rgba(244,63,94,0.3)', color: 'rgba(244,63,94,0.8)' } : {}}
        >
          {loading === 'outbreak' ? 'Triggering...' : '🦠 Outbreak — Siliguri'}
        </Button>
        <Button 
          variant={state.crisisMode ? 'danger' : 'ghost'} 
          onClick={() => handleTrigger('famine', 'Asansol')}
          disabled={loading !== null || state.crisisMode}
          style={!state.crisisMode ? { borderColor: 'rgba(249,115,22,0.3)', color: 'rgba(249,115,22,0.8)' } : {}}
        >
          {loading === 'famine' ? 'Triggering...' : '🌾 Famine — Chennai'}
        </Button>
      </div>

      {state.crisisMode && (
        <Button variant="ghost" onClick={() => dispatch({ type: 'SET_CRISIS_MODE', payload: false })} style={{ width: '100%', marginTop: 16 }}>
          End Crisis Mode
        </Button>
      )}
    </div>
  );
}
