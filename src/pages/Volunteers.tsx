import { PageWrapper } from '../components/layout/PageWrapper';
import { useRealtimeVolunteers } from '../hooks/useRealtimeVolunteers';
import { VolunteerCard } from '../components/dashboard/VolunteerCard';

export function Volunteers() {
  const { volunteers, loading } = useRealtimeVolunteers();

  return (
    <PageWrapper>
      <div style={{ padding: '40px 24px', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        <h1 style={{ fontFamily: 'Syne', fontSize: '2rem', marginBottom: 8 }}>Volunteers Directory</h1>
        <p style={{ fontFamily: 'Inter', color: 'var(--text-secondary)', marginBottom: 32 }}>Manage and view all registered volunteers.</p>
        
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 20 }}>
            {volunteers.map(vol => (
              <VolunteerCard key={vol.volunteer_id} volunteer={vol} />
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
