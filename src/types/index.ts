export type SuiteType = 'healthcare' | 'civic';

export type HealthcareTab =
  | 'overview'
  | 'ai-triage'
  | 'abha'
  | 'jan-aushadhi'
  | 'opd-token'
  | 'blood-bank'
  | 'immunization';

export type CivicTab =
  | 'overview'
  | 'grievance'
  | 'schemes'
  | 'rti'
  | 'documents'
  | 'cyber-consumer';

export interface EmergencyContact {
  name: string;
  number: string;
  category: 'medical' | 'police' | 'civic' | 'women_child' | 'disaster';
  description: string;
  available: string;
}

export interface MedicineComparison {
  id: string;
  genericName: string;
  composition: string;
  category: string;
  brandedExample: string;
  brandedPrice: number;
  janAushadhiPrice: number;
  savingsPercentage: number;
  dosage: string;
  usage: string;
  isCommon: boolean;
}

export interface JanAushadhiStore {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  contact: string;
  distance: string;
  timing: string;
  inStockCount: number;
}

export interface HospitalRecord {
  id: string;
  name: string;
  type: 'AIIMS' | 'Government Hospital' | 'Civil Hospital' | 'ESI Hospital' | 'Primary Health Centre';
  city: string;
  state: string;
  generalBeds: { available: number; total: number };
  icuBeds: { available: number; total: number };
  oxygenBeds: { available: number; total: number };
  emergencyContact: string;
  ayushmanEm突panelled: boolean;
  distance: string;
}

export interface BloodStockRecord {
  id: string;
  hospitalName: string;
  city: string;
  state: string;
  type: 'Govt Red Cross' | 'District Hospital' | 'Govt Medical College';
  contact: string;
  lastUpdated: string;
  stocks: {
    'A+': number;
    'A-': number;
    'B+': number;
    'B-': number;
    'O+': number;
    'O-': number;
    'AB+': number;
    'AB-': number;
  };
}

export interface AbhaProfile {
  abhaNumber: string;
  abhaAddress: string;
  fullName: string;
  gender: string;
  dob: string;
  bloodGroup: string;
  mobile: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  pinCode: string;
  state: string;
  isVerified: boolean;
  createdDate: string;
  linkedRecords: {
    id: string;
    title: string;
    hospital: string;
    date: string;
    type: 'Prescription' | 'Lab Report' | 'Vaccine' | 'Discharge Summary';
  }[];
}

export interface OpdToken {
  id: string;
  tokenNumber: string;
  patientName: string;
  age: number;
  gender: string;
  department: string;
  doctorName: string;
  hospitalName: string;
  slotTime: string;
  date: string;
  status: 'Confirmed' | 'In Queue' | 'Completed' | 'Cancelled';
  estimatedWaitMinutes: number;
  isTeleConsult: boolean;
}

export interface VaccineScheduleItem {
  id: string;
  targetAge: string;
  vaccineName: string;
  preventsAgainst: string;
  doses: string;
  mandatoryUnderUIP: boolean;
  notes: string;
}

export interface GrievanceTicket {
  id: string;
  title: string;
  category: 'Pothole & Roads' | 'Garbage & Sanitation' | 'Water Supply' | 'Electricity & Streetlights' | 'Public Transport' | 'Sewage & Drainage' | 'Other';
  department: string;
  state: string;
  city: string;
  wardNumber: string;
  address: string;
  description: string;
  filedDate: string;
  status: 'Submitted' | 'Assigned' | 'In Progress' | 'Resolved' | 'Escalated';
  priority: 'Low' | 'Medium' | 'High' | 'Emergency';
  assignedOfficer?: string;
  resolutionDate?: string;
  upvotes: number;
  photoUrl?: string;
  updates: {
    timestamp: string;
    message: string;
    actor: string;
  }[];
}

export interface GovtScheme {
  id: string;
  title: string;
  ministry: string;
  category: 'Health & Wellness' | 'Agriculture & Farmers' | 'Housing & Urban' | 'Women & Child' | 'Financial & Loans' | 'Social Security & Pension' | 'Skill & Employment';
  shortDesc: string;
  benefits: string;
  benefitAmount: string;
  targetAudience: string;
  eligibility: {
    minAge?: number;
    maxAge?: number;
    gender?: 'All' | 'Female' | 'Male';
    occupation?: string[];
    maxAnnualIncome?: number; // In INR Lakhs
    ruralUrban?: 'All' | 'Rural' | 'Urban';
  };
  requiredDocs: string[];
  officialPortalUrl: string;
  popularityScore: number;
}

export interface RtiTemplate {
  id: string;
  title: string;
  category: string;
  publicAuthority: string;
  description: string;
  questions: string[];
  applicableAct: string;
}
