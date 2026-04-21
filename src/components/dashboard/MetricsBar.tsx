import { AlertCircle, Users, Clock, MapPin } from 'lucide-react';
import { StatCard } from '../ui/StatCard';
import { useRealtimeTasks } from '../../hooks/useRealtimeTasks';
import { useRealtimeVolunteers } from '../../hooks/useRealtimeVolunteers';

export function MetricsBar() {
  const { openCount } = useRealtimeTasks();
  const { availableCount } = useRealtimeVolunteers();

  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24,
      padding: '24px', height: 130
    }}>
      <StatCard label="Active Needs" value={openCount} color="var(--critical)" icon={AlertCircle} delta="↑ 12% this hour" />
      <StatCard label="Available Volunteers" value={availableCount} color="var(--accent)" icon={Users} />
      <StatCard label="Avg Response Time" value={11} color="var(--medium)" icon={Clock} delta="↓ 2m improvement" />
      <StatCard label="Current Coverage" value={91} color="var(--low)" icon={MapPin} delta="↑ 3% this week" />
    </div>
  );
}
