import { HealthVitalRecord, HealthLockerRecord } from '../types';
import { VACCINE_SCHEDULE } from '../data/mockData';

const VITALS_STORAGE_KEY = 'jansetu_health_vitals';
const LOCKER_STORAGE_KEY = 'jansetu_health_locker_docs';
const IMMUNIZATION_STORAGE_KEY = 'jansetu_immunization_checked';

export const DEFAULT_VITALS_HISTORY: HealthVitalRecord[] = [
  {
    id: 'vital-1',
    date: '15 Aug',
    time: '08:30 AM',
    systolicBp: 122,
    diastolicBp: 78,
    bloodGlucose: 94,
    glucoseType: 'Fasting',
    heartRate: 72,
    spO2: 99,
    weightKg: 68.5,
    notes: 'Routine morning checkup',
  },
  {
    id: 'vital-2',
    date: '17 Aug',
    time: '09:00 AM',
    systolicBp: 118,
    diastolicBp: 76,
    bloodGlucose: 128,
    glucoseType: 'Post-Meal',
    heartRate: 74,
    spO2: 98,
    weightKg: 68.4,
  },
  {
    id: 'vital-3',
    date: '18 Aug',
    time: '08:15 AM',
    systolicBp: 120,
    diastolicBp: 80,
    bloodGlucose: 96,
    glucoseType: 'Fasting',
    heartRate: 70,
    spO2: 99,
    weightKg: 68.2,
  },
  {
    id: 'vital-4',
    date: '19 Aug',
    time: '07:45 PM',
    systolicBp: 124,
    diastolicBp: 82,
    bloodGlucose: 132,
    glucoseType: 'Post-Meal',
    heartRate: 76,
    spO2: 98,
    weightKg: 68.3,
  },
  {
    id: 'vital-5',
    date: '20 Aug',
    time: '08:00 AM',
    systolicBp: 119,
    diastolicBp: 77,
    bloodGlucose: 92,
    glucoseType: 'Fasting',
    heartRate: 68,
    spO2: 99,
    weightKg: 68.0,
    notes: 'Optimal resting state',
  },
  {
    id: 'vital-6',
    date: 'Today',
    time: '08:30 AM',
    systolicBp: 118,
    diastolicBp: 75,
    bloodGlucose: 91,
    glucoseType: 'Fasting',
    heartRate: 69,
    spO2: 99,
    weightKg: 67.9,
    notes: 'ABDM Health Locker verified log',
  },
];

export function getStoredHealthVitals(): HealthVitalRecord[] {
  try {
    const data = localStorage.getItem(VITALS_STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading health vitals from localStorage', e);
  }
  return DEFAULT_VITALS_HISTORY;
}

export function saveHealthVital(vital: Omit<HealthVitalRecord, 'id'>): HealthVitalRecord[] {
  const current = getStoredHealthVitals();
  const newRecord: HealthVitalRecord = {
    ...vital,
    id: `vital-${Date.now()}`,
  };
  const updated = [...current, newRecord];
  try {
    localStorage.setItem(VITALS_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error writing vital to localStorage', e);
  }
  return updated;
}

export function getStoredLockerRecords(): HealthLockerRecord[] {
  try {
    const data = localStorage.getItem(LOCKER_STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error('Error reading locker records from localStorage', e);
  }
  return [];
}

export function getStoredImmunizationStatus(): {
  completedCount: number;
  totalCount: number;
  checkedMap: Record<string, boolean>;
  progressPercent: number;
  upcomingVaccine: { targetAge: string; vaccineName: string; preventsAgainst: string } | null;
} {
  let checkedMap: Record<string, boolean> = {};
  try {
    const data = localStorage.getItem(IMMUNIZATION_STORAGE_KEY);
    if (data) {
      checkedMap = JSON.parse(data);
    }
  } catch (e) {
    console.error('Error reading immunization status', e);
  }

  const totalCount = VACCINE_SCHEDULE.length;
  // If user hasn't checked any, default initial sample checked state to show baseline UIP progress
  const completedCount = Object.keys(checkedMap).length > 0 
    ? Object.values(checkedMap).filter(Boolean).length 
    : 4; // Default 4 doses completed (Birth & 6 weeks vaccines)
  
  const progressPercent = Math.min(100, Math.round((completedCount / totalCount) * 100));

  // Find next upcoming
  const upcomingIdx = completedCount < totalCount ? completedCount : totalCount - 1;
  const upcomingItem = VACCINE_SCHEDULE[upcomingIdx] || null;

  return {
    completedCount,
    totalCount,
    checkedMap,
    progressPercent,
    upcomingVaccine: upcomingItem
      ? {
          targetAge: upcomingItem.targetAge,
          vaccineName: upcomingItem.vaccineName,
          preventsAgainst: upcomingItem.preventsAgainst,
        }
      : null,
  };
}

export interface HealthActivityEvent {
  id: string;
  type: 'vital' | 'locker' | 'immunization' | 'abdm';
  title: string;
  subtitle: string;
  timeAgo: string;
  badge: string;
  badgeClass: string;
}

export function getRecentHealthActivities(): HealthActivityEvent[] {
  const lockerRecords = getStoredLockerRecords();
  const vitals = getStoredHealthVitals();
  const activities: HealthActivityEvent[] = [];

  // Recent vital
  if (vitals.length > 0) {
    const latestVital = vitals[vitals.length - 1];
    activities.push({
      id: 'act-vital',
      type: 'vital',
      title: `Blood Pressure & Vitals: ${latestVital.systolicBp}/${latestVital.diastolicBp} mmHg`,
      subtitle: `Pulse: ${latestVital.heartRate} bpm • Fasting Glucose: ${latestVital.bloodGlucose} mg/dL`,
      timeAgo: `${latestVital.date} at ${latestVital.time}`,
      badge: 'Vitals Recorded',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    });
  }

  // Recent locker doc if any
  if (lockerRecords.length > 0) {
    const latestDoc = lockerRecords[0];
    activities.push({
      id: 'act-doc',
      type: 'locker',
      title: `${latestDoc.name} (${latestDoc.category})`,
      subtitle: `${latestDoc.hospitalOrLab} • ${latestDoc.fileSize}`,
      timeAgo: `${latestDoc.date}`,
      badge: 'Health Locker Doc',
      badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    });
  } else {
    activities.push({
      id: 'act-doc-default',
      type: 'abdm',
      title: 'ABDM Health Records Vault Active',
      subtitle: 'Encrypted storage linked with ABHA Health ID',
      timeAgo: 'Sync Status: Real-time Active',
      badge: 'ABHA Link Active',
      badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
    });
  }

  // Immunization Milestone
  const imm = getStoredImmunizationStatus();
  activities.push({
    id: 'act-imm',
    type: 'immunization',
    title: `UIP Immunization Progress: ${imm.completedCount}/${imm.totalCount} Doses`,
    subtitle: imm.upcomingVaccine 
      ? `Next due: ${imm.upcomingVaccine.vaccineName} (${imm.upcomingVaccine.targetAge})`
      : 'All mandatory childhood doses completed',
    timeAgo: 'Universal Indradhanush Registry',
    badge: `${imm.progressPercent}% Protected`,
    badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
  });

  return activities;
}
