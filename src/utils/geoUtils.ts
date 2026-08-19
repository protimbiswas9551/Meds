export interface GeoCoordinate {
  lat: number;
  lng: number;
  displayName: string;
}

export const CITY_COORDINATES: Record<string, GeoCoordinate> = {
  'all india (national)': { lat: 28.6139, lng: 77.2090, displayName: 'New Delhi (National Hub)' },
  'all india': { lat: 28.6139, lng: 77.2090, displayName: 'New Delhi (National Hub)' },
  'new delhi': { lat: 28.6139, lng: 77.2090, displayName: 'New Delhi' },
  'delhi': { lat: 28.6139, lng: 77.2090, displayName: 'New Delhi' },
  'mumbai': { lat: 19.0760, lng: 72.8777, displayName: 'Mumbai' },
  'bengaluru': { lat: 12.9716, lng: 77.5946, displayName: 'Bengaluru' },
  'bangalore': { lat: 12.9716, lng: 77.5946, displayName: 'Bengaluru' },
  'hyderabad': { lat: 17.3850, lng: 78.4867, displayName: 'Hyderabad' },
  'kolkata': { lat: 22.5726, lng: 88.3639, displayName: 'Kolkata' },
  'chennai': { lat: 13.0827, lng: 80.2707, displayName: 'Chennai' },
  'pune': { lat: 18.5204, lng: 73.8567, displayName: 'Pune' },
  'lucknow': { lat: 26.8467, lng: 80.9462, displayName: 'Lucknow' },
  'patna': { lat: 25.5941, lng: 85.1376, displayName: 'Patna' },
  'jaipur': { lat: 26.9124, lng: 75.7873, displayName: 'Jaipur' },
  'chandigarh': { lat: 30.7333, lng: 76.7794, displayName: 'Chandigarh' },
  'ahmedabad': { lat: 23.0225, lng: 72.5714, displayName: 'Ahmedabad' },
  'bhopal': { lat: 23.2599, lng: 77.4126, displayName: 'Bhopal' },
  'bhubaneswar': { lat: 20.2961, lng: 85.8245, displayName: 'Bhubaneswar' },
  'guwahati': { lat: 26.1445, lng: 91.7362, displayName: 'Guwahati' },
};

/**
 * Retrieves the coordinates for any selected city string
 */
export function getCoordinatesForCity(cityStr: string): GeoCoordinate {
  const normalized = cityStr.toLowerCase().trim();
  
  for (const [key, coord] of Object.entries(CITY_COORDINATES)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return coord;
    }
  }
  
  // Default to New Delhi (National center)
  return CITY_COORDINATES['new delhi'];
}

/**
 * Calculates accurate Haversine distance in kilometers between two geo coordinates
 */
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's mean radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10;
}

/**
 * Formats distance with unit (e.g. "3.2 km" or "14 km")
 */
export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m away`;
  }
  if (distanceKm < 10) {
    return `${distanceKm.toFixed(1)} km away`;
  }
  return `${Math.round(distanceKm)} km away`;
}

/**
 * Returns a human-readable proximity badge text and color theme
 */
export function getProximityTag(distanceKm: number): {
  label: string;
  styleClass: string;
} {
  if (distanceKm <= 15) {
    return {
      label: 'Immediate Vicinity (< 15 km)',
      styleClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    };
  }
  if (distanceKm <= 50) {
    return {
      label: 'Metro Area (< 50 km)',
      styleClass: 'bg-blue-50 text-blue-700 border-blue-200',
    };
  }
  if (distanceKm <= 200) {
    return {
      label: 'Neighbouring Region',
      styleClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    };
  }
  return {
    label: 'State / Inter-City',
    styleClass: 'bg-slate-100 text-slate-700 border-slate-200',
  };
}
