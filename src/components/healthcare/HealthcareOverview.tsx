import React, { useState } from 'react';
import {
  Activity,
  Bed,
  Heart,
  PhoneCall,
  Pill,
  ShieldCheck,
  Calendar,
  Search,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Clock,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { HOSPITALS_DATA, MEDICINE_DATABASE, EMERGENCY_CONTACTS } from '../../data/mockData';
import { HealthcareTab } from '../../types';

interface HealthcareOverviewProps {
  selectedCity: string;
  onNavigateTab: (tab: HealthcareTab) => void;
  onOpenAbha: () => void;
}

export const HealthcareOverview: React.FC<HealthcareOverviewProps> = ({
  selectedCity,
  onNavigateTab,
  onOpenAbha,
}) => {
  const [hospitalSearch, setHospitalSearch] = useState('');
  const [bedTypeFilter, setBedTypeFilter] = useState<'all' | 'general' | 'icu' | 'oxygen'>('all');
  const [ambulanceDispatched, setAmbulanceDispatched] = useState(false);

  // Filter hospitals based on city & search
  const filteredHospitals = HOSPITALS_DATA.filter((h) => {
    const matchesCity =
      selectedCity.includes('All India') ||
      h.city.toLowerCase().includes(selectedCity.toLowerCase()) ||
      h.state.toLowerCase().includes(selectedCity.toLowerCase());
    const matchesSearch =
      h.name.toLowerCase().includes(hospitalSearch.toLowerCase()) ||
      h.type.toLowerCase().includes(hospitalSearch.toLowerCase()) ||
      h.city.toLowerCase().includes(hospitalSearch.toLowerCase());
    return matchesCity && matchesSearch;
  });

  const totalGeneralBeds = HOSPITALS_DATA.reduce((acc, curr) => acc + curr.generalBeds.available, 0);
  const totalIcuBeds = HOSPITALS_DATA.reduce((acc, curr) => acc + curr.icuBeds.available, 0);
  const totalOxygenBeds = HOSPITALS_DATA.reduce((acc, curr) => acc + curr.oxygenBeds.available, 0);

  const handleSimulateAmbulance = () => {
    setAmbulanceDispatched(true);
    setTimeout(() => {
      setAmbulanceDispatched(false);
    }, 6000);
  };

  return (
    <div className="space-y-6">
      {/* Top Clean Minimalism Hero Card */}
      <div className="bg-white rounded-xl p-6 sm:p-7 border border-slate-200 shadow-xs relative overflow-hidden">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-indigo-100 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> National Health Mission (NHM)
            </span>
            <span className="text-xs text-slate-500">Universal Citizen Healthcare</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mb-2">
            Healthcare Suite: Affordable, Accessible, Universal
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5">
            Compare brand vs. Jan Aushadhi generic medicines to save up to 85%, track live government hospital
            beds & ICU availability, access your Ayushman ABHA digital card, and book free OPD consultations.
          </p>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => onNavigateTab('jan-aushadhi')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-lg text-xs sm:text-sm transition-colors shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <Pill className="w-4 h-4" />
              <span>Generic Medicine Price Finder</span>
            </button>
            <button
              onClick={onOpenAbha}
              className="bg-white hover:bg-slate-50 text-slate-700 font-medium border border-slate-200 px-4 py-2 rounded-lg text-xs sm:text-sm transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>View ABHA Health Card</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Quick Stat Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Available ICU Beds</span>
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{totalIcuBeds}</div>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">Across partner Govt & Civil Hospitals</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>General Ward Beds</span>
            <Bed className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{totalGeneralBeds}</div>
          <p className="text-[11px] text-slate-500 font-medium mt-1">Real-time bed tracker</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Jan Aushadhi Generics</span>
            <Pill className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">Up to 89%</div>
          <p className="text-[11px] text-amber-700 font-medium mt-1">Direct savings on essential salts</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Ayushman PM-JAY</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">₹5 Lakh/Yr</div>
          <p className="text-[11px] text-emerald-700 font-medium mt-1">Cashless family coverage</p>
        </div>
      </div>

      {/* Emergency Quick Action Dispatcher & 108 Simulator */}
      <div className="bg-white border border-rose-200 rounded-xl p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">Emergency Ambulance 108 & Trauma Rescue</h3>
                <span className="text-[10px] bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded font-semibold uppercase">
                  Priority 1
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Free government emergency medical transport with ALS & GPS tracking.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto">
            <a
              href="tel:108"
              className="flex-1 md:flex-none text-center bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white px-4 py-2 rounded-lg font-medium text-xs sm:text-sm shadow-xs transition-colors"
            >
              Call 108 Now
            </a>
            <button
              onClick={handleSimulateAmbulance}
              className="flex-1 md:flex-none bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-medium px-4 py-2 rounded-lg text-xs sm:text-sm transition-colors cursor-pointer"
            >
              {ambulanceDispatched ? 'Ambulance Unit En Route...' : 'Simulate GPS Dispatch'}
            </button>
          </div>
        </div>

        {ambulanceDispatched && (
          <div className="mt-3.5 p-3 bg-rose-50/50 rounded-lg border border-rose-200 shadow-xs flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-600" />
            <div className="text-xs text-slate-800">
              <span className="font-semibold text-rose-700">Dispatched: </span>
              Ambulance DL-108-8422 assigned from nearest trauma hub. Driver Contact:{' '}
              <span className="font-medium">+91 98765 00108</span>. Estimated Arrival:{' '}
              <span className="font-bold text-emerald-700">7 mins</span>.
            </div>
          </div>
        )}
      </div>

      {/* Live Hospital Bed Tracker */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-indigo-600" />
                <h2 className="text-sm font-bold text-slate-900">Live Hospital Beds & ICU Occupancy</h2>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 font-medium px-2 py-0.5 rounded border border-emerald-100">
                  Updated Live
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time government medical college & civil hospital bed census
              </p>
            </div>

            {/* Hospital Search */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search hospital or area..."
                value={hospitalSearch}
                onChange={(e) => setHospitalSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:bg-white focus:border-indigo-600"
              />
            </div>
          </div>
        </div>

        {/* Hospital List Cards */}
        <div className="divide-y divide-slate-100">
          {filteredHospitals.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm">
              No hospitals found matching your criteria. Try changing city or search term.
            </div>
          ) : (
            filteredHospitals.map((hosp) => (
              <div key={hosp.id} className="p-4 sm:p-5 hover:bg-slate-50/70 transition-colors">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-1 max-w-xl">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-semibold text-slate-900 text-sm">{hosp.name}</h4>
                      <span className="text-[10px] bg-indigo-50 text-indigo-700 font-medium px-2 py-0.5 rounded border border-indigo-100">
                        {hosp.type}
                      </span>
                      {hosp.ayushmanEm突panelled && (
                        <span className="text-[10px] bg-emerald-50 text-emerald-700 font-medium px-2 py-0.5 rounded border border-emerald-100 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Ayushman PM-JAY
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2.5 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {hosp.city}, {hosp.state} ({hosp.distance})
                      </span>
                      <span>•</span>
                      <span>Emergency: <strong className="text-slate-700 font-medium">{hosp.emergencyContact}</strong></span>
                    </div>
                  </div>

                  {/* Bed Counts Display */}
                  <div className="grid grid-cols-3 gap-2 sm:gap-3 shrink-0">
                    <div className="bg-slate-50 border border-slate-200/80 p-2 rounded-lg text-center min-w-[85px]">
                      <span className="text-[10px] text-slate-500 block font-medium">General</span>
                      <span className="text-sm font-bold text-slate-900">
                        {hosp.generalBeds.available}
                      </span>
                      <span className="text-[10px] text-slate-400 block">/ {hosp.generalBeds.total}</span>
                    </div>

                    <div className="bg-emerald-50/60 border border-emerald-100 p-2 rounded-lg text-center min-w-[85px]">
                      <span className="text-[10px] text-emerald-700 block font-medium">ICU Beds</span>
                      <span className="text-sm font-bold text-emerald-800">
                        {hosp.icuBeds.available}
                      </span>
                      <span className="text-[10px] text-emerald-600 block">/ {hosp.icuBeds.total}</span>
                    </div>

                    <div className="bg-indigo-50/60 border border-indigo-100 p-2 rounded-lg text-center min-w-[85px]">
                      <span className="text-[10px] text-indigo-700 block font-medium">Oxygen</span>
                      <span className="text-sm font-bold text-indigo-800">
                        {hosp.oxygenBeds.available}
                      </span>
                      <span className="text-[10px] text-indigo-600 block">/ {hosp.oxygenBeds.total}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 2-Column Health Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Jan Aushadhi Savings Promo */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-amber-50 rounded-lg text-amber-700 border border-amber-100">
                <Pill className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-600">
                Pradhan Mantri Jan Aushadhi Yojana
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Save up to 85% on Prescription Medications
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              All Jan Aushadhi generic medicines are WHO-GMP certified, identical in chemical composition, safety,
              and efficacy to expensive branded pharmaceuticals.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('jan-aushadhi')}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-2 px-3 rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            <span>Open Medicine Comparator</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Free e-Sanjeevani OPD */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-700 border border-indigo-100">
                <Calendar className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-600">
                e-Sanjeevani National Teleconsultation
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Free Doctor OPD Token & Video Consultation
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Consult certified MBBS and MD government doctors across General Medicine, Pediatrics, Cardiology,
              Gynecology and AYUSH directly from home.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('opd-token')}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-3 rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            <span>Generate Free OPD Queue Token</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
