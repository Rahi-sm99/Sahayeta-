import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import type { Task } from '../../types';

const COLOR: Record<string, string> = {
  Critical: '#ff9933', High: '#ffcc33', Medium: '#ffffff', Low: '#138808',
};

function makeTaskIcon(task: Task) {
  const priorityClass = task.priority.toLowerCase();
  return L.divIcon({
    className: `issue-marker ${priorityClass}`,
    html: `
      <div class="pin"></div>
      <div class="issue-label">${task.ngo_name} · ${task.location}</div>
    `,
    iconSize: [150, 40], iconAnchor: [75, 10],
  });
}

export default function TaskMarkerLayer({ tasks }: { tasks: Task[] }) {
  return <>
    {tasks.filter(t => t.latitude != null && t.longitude != null).map(task => (
      <Marker
        key={task.task_id}
        position={[task.latitude, task.longitude]}
        icon={makeTaskIcon(task)}
      >
        <Popup className="premium-popup">
          <div style={{
            fontFamily: 'var(--font-main)', minWidth: 200,
            background: '#0a0a0a', color: '#fff', padding: '15px', borderRadius: '12px',
            border: '1px solid #222'
          }}>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '5px' }}>{task.ngo_name}</div>
            <div style={{ color: COLOR[task.priority], fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase' }}>{task.priority}</div>
          </div>
        </Popup>
      </Marker>
    ))}
  </>;
}
