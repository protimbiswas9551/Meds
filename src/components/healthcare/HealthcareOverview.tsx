import React, { useState } from 'react';
import {
  Activity,
  Bed,
  PhoneCall,
  Pill,
  ShieldCheck,
  Calendar,
  Search,
  CheckCircle2,
  MapPin,
  FolderLock,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { HOSPITALS_DATA } from '../../data/mockData';
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

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Healthcare Portal</h1>
          <p className="text-xs text-slate-600 mt-1">
            Access hospital beds, digital health locker, generic medicine savings, and OPD consultations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigateTab('health-locker')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-3.5 py-2 rounded-lg text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <FolderLock className="w-3.5 h-3.5" />
            <span>Health Locker</span>
          </button>
          <button
            onClick={() => onNavigateTab('ai-triage')}
            className="bg-white hover:bg-slate-50 text-slate-700 font-medium border border-slate-200 px-3.5 py-2 rounded-lg text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>AI Triage</span>
          </button>
          <button
            onClick={() => onNavigateTab('jan-aushadhi')}
            className="bg-white hover:bg-slate-50 text-slate-700 font-medium border border-slate-200 px-3.5 py-2 rounded-lg text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Pill className="w-3.5 h-3.5 text-amber-600" />
            <span>Generics</span>
          </button>
          <button
            onClick={onOpenAbha}
            className="bg-white hover:bg-slate-50 text-slate-700 font-medium border border-slate-200 px-3.5 py-2 rounded-lg text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>ABHA Card</span>
          </button>
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 mb-1">Available ICU Beds</div>
          <div className="text-xl font-bold text-slate-900">{totalIcuBeds}</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-0.5">Live Occupancy</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 mb-1">General Beds</div>
          <div className="text-xl font-bold text-slate-900">{totalGeneralBeds}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Partner Hospitals</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 mb-1">Oxygen Supported</div>
          <div className="text-xl font-bold text-slate-900">{totalOxygenBeds}</div>
          <div className="text-[11px] text-indigo-600 font-medium mt-0.5">High Flow Units</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 mb-1">Generic Savings</div>
          <div className="text-xl font-bold text-slate-900">Up to 85%</div>
          <div className="text-[11px] text-amber-700 font-medium mt-0.5">Jan Aushadhi Scheme</div>
        </div>
      </div>

      {/* Emergency Helplines Strip */}
      <div className="bg-white border border-rose-200 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100">
            <PhoneCall className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-slate-900">National Emergency Medical Helplines</h2>
            <p className="text-[11px] text-slate-500">24x7 toll-free ambulance and medical emergency transport</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="tel:108"
            className="bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-lg font-medium text-xs shadow-xs transition-colors"
          >
            Ambulance: 108
          </a>
          <a
            href="tel:112"
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1.5 rounded-lg font-medium text-xs transition-colors"
          >
            Emergency: 112
          </a>
          <a
            href="tel:104"
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1.5 rounded-lg font-medium text-xs transition-colors"
          >
            Health Helpline: 104
          </a>
        </div>
      </div>

      {/* Live Hospital Bed Tracker */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900">Live Hospital Beds & ICU Occupancy</h2>
          </div>

          <div className="relative w-full sm:w-60">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Filter by hospital or city..."
              value={hospitalSearch}
              onChange={(e) => setHospitalSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:bg-white focus:border-indigo-600"
            />
          </div>
        </div>

        {/* Hospital List */}
        <div className="divide-y divide-slate-100">
          {filteredHospitals.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No hospitals found matching your filter criteria.
            </div>
          ) : (
            filteredHospitals.map((hosp) => (
              <div key={hosp.id} className="p-4 hover:bg-slate-50/60 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-slate-900 text-xs">{hosp.name}</h3>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                        {hosp.type}
                      </span>
                      {hosp.ayushmanEmpanelled && (
                        <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded flex items-center gap-1 border border-emerald-100">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> PM-JAY
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {hosp.city}, {hosp.state}
                      </span>
                      <span>•</span>
                      <span>Tel: {hosp.emergencyContact}</span>
                    </div>
                  </div>

                  {/* Beds summary */}
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-center min-w-[75px]">
                      <span className="text-[10px] text-slate-500 block">General</span>
                      <span className="text-xs font-bold text-slate-900">{hosp.generalBeds.available} / {hosp.generalBeds.total}</span>
                    </div>
                    <div className="bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-lg text-center min-w-[75px]">
                      <span className="text-[10px] text-emerald-700 block">ICU</span>
                      <span className="text-xs font-bold text-emerald-800">{hosp.icuBeds.available} / {hosp.icuBeds.total}</span>
                    </div>
                    <div className="bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-lg text-center min-w-[75px]">
                      <span className="text-[10px] text-indigo-700 block">Oxygen</span>
                      <span className="text-xs font-bold text-indigo-800">{hosp.oxygenBeds.available} / {hosp.oxygenBeds.total}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 2 Focused Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Pill className="w-4 h-4 text-amber-600" />
              <h2 className="text-xs font-bold text-slate-900">Jan Aushadhi Generic Medicines</h2>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Compare branded medicines against equivalent WHO-GMP certified Jan Aushadhi generic alternatives and check pricing.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('jan-aushadhi')}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-2 px-3 rounded-lg text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>Search Medicine Substitutes</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-indigo-600" />
              <h2 className="text-xs font-bold text-slate-900">e-Sanjeevani OPD Teleconsultation</h2>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Book a consultation token with government medical college physicians across general medicine, pediatrics, and cardiology.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('opd-token')}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-3 rounded-lg text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-xs"
          >
            <span>Get OPD Token</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
