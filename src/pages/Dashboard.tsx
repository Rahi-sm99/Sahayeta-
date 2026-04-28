import { PageWrapper } from '../components/layout/PageWrapper';
import { MetricsBar } from '../components/dashboard/MetricsBar';
import { UrgencyQueue } from '../components/dashboard/UrgencyQueue';
import { VolunteerStrip } from '../components/dashboard/VolunteerStrip';
import { MatchModal } from '../components/dashboard/MatchModal';
import { CrisisPanel } from '../components/crisis/CrisisPanel';
import { CrisisTimeline } from '../components/crisis/CrisisTimeline';
import SahayetaMap from '../components/map/SahayetaMap';
import { useApp } from '../context/AppContext';


import { useRealtimeTasks } from '../hooks/useRealtimeTasks';
import { useRealtimeVolunteers } from '../hooks/useRealtimeVolunteers';

export function Dashboard() {
  const { state } = useApp();
  const { tasks } = useRealtimeTasks();
  const { volunteers } = useRealtimeVolunteers();

  return (
    <PageWrapper style={{ height: '100vh', overflow: 'hidden' }}>
      {state.crisisMode && (
        <div className="crisis-banner" style={{ padding: '8px 24px', display: 'flex', justifyContent: 'center' }}>
          <span style={{ fontFamily: 'Syne', fontWeight: 800, color: 'var(--critical)', letterSpacing: '0.1em' }}>🚨 CRISIS ACTIVE — EMERGENCY PROTOCOLS ENGAGED</span>
        </div>
      )}
      
      <MetricsBar />
      
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <div style={{ display: 'flex', flexDirection: 'column', width: 440 }}>
          <div style={{ padding: '16px', borderBottom: '1px solid var(--border-default)', background: 'var(--bg-base)' }}>
            <CrisisPanel />
            <CrisisTimeline />

          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <UrgencyQueue />
          </div>
        </div>
        
        <div style={{ flex: 1, padding: 24, display: 'flex', flexDirection: 'column' }}>
          <SahayetaMap tasks={tasks} volunteers={volunteers} />
        </div>
      </div>
      
      <VolunteerStrip />
      
      {state.selectedTaskId && <MatchModal />}
    </PageWrapper>
  );
}
