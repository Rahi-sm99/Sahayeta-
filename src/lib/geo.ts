export const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
  Kolkata:    { lat: 22.5726, lng: 88.3639 },
  Howrah:     { lat: 22.5958, lng: 88.2636 },
  Durgapur:   { lat: 23.5204, lng: 87.3119 },
  Asansol:    { lat: 23.6739, lng: 86.9524 },
  Siliguri:   { lat: 26.7271, lng: 88.3953 },
  Bardhaman:  { lat: 23.2324, lng: 87.8615 },
  Malda:      { lat: 25.0108, lng: 88.1411 },
  Kharagpur:  { lat: 22.3460, lng: 87.2320 },
  Haldia:     { lat: 22.0251, lng: 88.0583 },
  Darjeeling: { lat: 27.0410, lng: 88.2627 },
};

export function jitter(val: number, isVolunteer: boolean, amount = 0.25): number {
  const offset = isVolunteer ? 0.1 : -0.1;
  return val + offset + (Math.random() - 0.5) * amount;
}

export function getCityCoords(city: string, isVolunteer: boolean) {
  const base = CITY_COORDS[city] ?? { lat: 22.9868, lng: 87.8550 };
  return { 
    latitude: jitter(base.lat, isVolunteer), 
    longitude: jitter(base.lng, isVolunteer) 
  };
}

export function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
