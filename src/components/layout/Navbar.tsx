import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { LiveDot } from '../ui/LiveDot';
import { Button } from '../ui/Button';
import { seedDatabase } from '../../data/seed';

export function Navbar() {
  const { pathname } = useLocation();
  const { state, dispatch } = useApp();

  const links = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/volunteers', label: 'Volunteers' },
    { path: '/tasks', label: 'Tasks' },
    { path: '/analytics', label: 'Analytics' },
  ];

  return (
    <nav style={{
      height: 60, position: 'fixed', top: 0, left: 0, right: 0, zIndex: 2000,
      background: 'rgba(9,9,11,0.85)', backdropFilter: 'blur(16px) saturate(180%)',
      borderBottom: '1px solid var(--border-default)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 24px',
    }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
        <div style={{
          background: 'var(--accent)', color: 'white',
          width: 32, height: 32, borderRadius: 8,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Syne', fontWeight: 800, fontSize: '1.2rem',
        }}>स</div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1.15rem', color: 'var(--text-primary)', lineHeight: 1.2 }}>Sahayeta</span>
          <span style={{ fontFamily: 'Inter', fontWeight: 300, fontSize: '0.72rem', color: 'var(--text-muted)' }}>सहायता</span>
        </div>
      </Link>

      <div style={{ display: 'flex', gap: 24, height: '100%' }}>
        {links.map(l => {
          const active = pathname.startsWith(l.path);
          return (
            <Link key={l.path} to={l.path} style={{
              display: 'flex', alignItems: 'center', height: '100%',
              textDecoration: 'none', fontFamily: 'Inter', fontSize: '0.9rem',
              color: active ? 'var(--text-primary)' : 'var(--text-muted)',
              borderBottom: active ? '2px solid var(--accent)' : '2px solid transparent',
              transition: 'color 0.18s ease',
            }}>
              {l.label}
            </Link>
          );
        })}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--critical-subtle)', padding: '4px 10px', borderRadius: 100 }}>
          <LiveDot color="var(--critical)" />
          <span style={{ fontFamily: 'JetBrains Mono', color: 'var(--critical)', fontSize: '0.75rem', fontWeight: 500, textTransform: 'uppercase' }}>Live</span>
        </div>
        
        <Button 
          variant={state.simulationRunning ? 'primary' : 'ghost'} 
          onClick={() => dispatch({ type: 'TOGGLE_SIMULATION' })}
          className={state.simulationRunning ? 'sim-active' : ''}
          style={{ padding: '6px 12px', fontSize: '0.8rem' }}
        >
          {state.simulationRunning ? 'Stop ⏹' : 'Start Simulation ▶'}
        </Button>

        <Button variant="ghost" onClick={() => seedDatabase().then(() => alert('Database Seeded!'))}
          style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
          Seed DB
        </Button>
      </div>
    </nav>
  );
}
