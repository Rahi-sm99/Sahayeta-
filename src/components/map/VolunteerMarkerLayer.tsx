import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import type { Volunteer } from '../../types';

function makeIcon(status: string, index: number) {
  const statusClass = status === 'available' ? 'available' : '';
  return L.divIcon({
    className: `volunteer-marker ${statusClass}`,
    html: `V${index + 1}`,
    iconSize: [24, 24], iconAnchor: [12, 12],
  });
}

export default function VolunteerMarkerLayer({ volunteers }: { volunteers: Volunteer[] }) {
  const map     = useMap();
  const markers = useRef<Map<string, L.Marker>>(new Map());

  useEffect(() => {
    volunteers.filter(v => v.latitude != null && v.longitude != null).forEach((vol, idx) => {
      const pos: L.LatLngExpression = [vol.latitude, vol.longitude];
      const existing = markers.current.get(vol.volunteer_id);
      if (existing) {
        existing.setLatLng(pos);
        existing.setIcon(makeIcon(vol.status, idx));
      } else {
        const m = L.marker(pos, { icon: makeIcon(vol.status, idx) })
          .addTo(map)
          .bindPopup(`
            <div style="font-family:var(--font-main);padding:10px;background:#0a0a0a;color:#fff;border-radius:12px">
              <strong style="display:block;margin-bottom:5px">${vol.name}</strong>
              <small style="color:#666">${vol.status.toUpperCase()}</small>
            </div>
          `);
        markers.current.set(vol.volunteer_id, m);
      }
    });
    markers.current.forEach((m, id) => {
      if (!volunteers.find(v => v.volunteer_id === id)) { m.remove(); markers.current.delete(id); }
    });
  }, [volunteers, map]);

  useEffect(() => {
    return () => {
      markers.current.forEach(m => m.remove());
      markers.current.clear();
    };
  }, []);

  return null;
}
