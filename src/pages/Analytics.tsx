import { PageWrapper } from '../components/layout/PageWrapper';
import { ImpactBarChart } from '../components/analytics/ImpactBarChart';
import { SeverityDonut } from '../components/analytics/SeverityDonut';
import { BeforeAfter } from '../components/analytics/BeforeAfter';
import { StatCard } from '../components/ui/StatCard';
import { Database, Activity, Clock, Users } from 'lucide-react';

export function Analytics() {
  return (
    <PageWrapper>
      <div style={{ padding: '40px 24px', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        <h1 style={{ fontFamily: 'Syne', fontSize: '2rem', marginBottom: 32 }}>Impact Analytics</h1>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, marginBottom: 40 }}>
          <StatCard label="Total Matches" value={842} color="var(--accent)" icon={Database} delta="↑ 24% this month" />
          <StatCard label="Avg Urgency Resolved" value={78} color="var(--critical)" icon={Activity} />
          <StatCard label="Hours Saved" value={1250} color="var(--medium)" icon={Clock} />
          <StatCard label="Active NGOs" value={14} color="var(--low)" icon={Users} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, marginBottom: 40 }}>
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', padding: 24 }}>
            <h3 style={{ fontFamily: 'Syne', fontSize: '1.1rem', marginBottom: 20 }}>Response Capacity</h3>
            <ImpactBarChart />
          </div>
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', padding: 24 }}>
            <h3 style={{ fontFamily: 'Syne', fontSize: '1.1rem', marginBottom: 20 }}>Task Severity Distribution</h3>
            <SeverityDonut />
          </div>
        </div>

        <BeforeAfter />
      </div>
    </PageWrapper>
  );
}
