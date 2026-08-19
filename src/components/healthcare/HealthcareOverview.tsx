import React, { useState, useEffect } from 'react';
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
  RefreshCw,
  ExternalLink,
  Info,
  Building,
  Wind,
  HeartPulse,
} from 'lucide-react';
import { HospitalRecord, HealthcareTab } from '../../types';
import { fetchLiveHospitalData } from '../../services/hospitalBedApi';

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
  const [hospitals, setHospitals] = useState<HospitalRecord[]>([]);
  const [hospitalSearch, setHospitalSearch] = useState('');
  const [bedTypeFilter, setBedTypeFilter] = useState<'all' | 'icu' | 'oxygen' | 'ventilator' | 'general'>('all');
  const [pmjayOnly, setPmjayOnly] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('');
  const [selectedHospitalForModal, setSelectedHospitalForModal] = useState<HospitalRecord | null>(null);

  const loadHospitals = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetchLiveHospitalData({
        city: selectedCity,
        searchQuery: hospitalSearch,
        bedTypeFilter: bedTypeFilter,
        pmjayOnly: pmjayOnly,
      });
      setHospitals(res.hospitals);
      setLastSyncTime(res.timestamp);
    } catch (err) {
      console.error('Failed to sync hospital data', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadHospitals();
  }, [selectedCity, hospitalSearch, bedTypeFilter, pmjayOnly]);

  const totalGeneralBeds = hospitals.reduce((acc, curr) => acc + curr.generalBeds.available, 0);
  const totalIcuBeds = hospitals.reduce((acc, curr) => acc + curr.icuBeds.available, 0);
  const totalOxygenBeds = hospitals.reduce((acc, curr) => acc + curr.oxygenBeds.available, 0);
  const totalVentilatorBeds = hospitals.reduce((acc, curr) => acc + curr.ventilatorBeds.available, 0);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" /> National Health Authority (NHA)
            </span>
            <span className="text-xs text-slate-500">ABDM Health Facility Registry (HFR)</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">National Healthcare & Live Bed Registry</h1>
          <p className="text-xs text-slate-600 mt-1">
            Real-time bed availability verified through official government hospital portals, NIC e-Hospital, and PM-JAY empanelment database.
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
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Available ICU / CCU</span>
            <HeartPulse className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-bold text-slate-900">{totalIcuBeds} Beds</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-0.5">Critical Care Units</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Ventilator Supported</span>
            <Wind className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xl font-bold text-slate-900">{totalVentilatorBeds} Beds</div>
          <div className="text-[11px] text-blue-600 font-medium mt-0.5">Advanced Life Support</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Oxygen / HDU</span>
            <Activity className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-xl font-bold text-slate-900">{totalOxygenBeds} Beds</div>
          <div className="text-[11px] text-indigo-600 font-medium mt-0.5">High Flow Units</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>General Ward</span>
            <Bed className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-xl font-bold text-slate-900">{totalGeneralBeds} Beds</div>
          <div className="text-[11px] text-slate-500 font-medium mt-0.5">Inpatient Admission</div>
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
        <div className="p-4 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-600" />
              <h2 className="text-sm font-bold text-slate-900">Verified Hospital Bed Availability & Registry</h2>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-medium border border-emerald-100">
                Official Government Facilities
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Direct telemetry & bed status synchronised with ABDM / NIC e-Hospital (Last sync: {lastSyncTime || 'Active'})
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={loadHospitals}
              disabled={isRefreshing}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-indigo-600' : ''}`} />
              <span>{isRefreshing ? 'Syncing...' : 'Sync Live Data'}</span>
            </button>
            <a
              href="https://hospitals.pmjay.gov.in"
              target="_blank"
              rel="noreferrer"
              className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors border border-indigo-200"
            >
              <span>PM-JAY Portal</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="p-3.5 bg-slate-50/70 border-b border-slate-200 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by hospital name, HFR ID, city, or address..."
              value={hospitalSearch}
              onChange={(e) => setHospitalSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:border-indigo-600"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
            <select
              value={bedTypeFilter}
              onChange={(e) => setBedTypeFilter(e.target.value as any)}
              className="text-xs p-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-hidden focus:border-indigo-600"
            >
              <option value="all">All Bed Categories</option>
              <option value="icu">ICU / Critical Care Available</option>
              <option value="ventilator">Ventilator Supported Available</option>
              <option value="oxygen">Oxygen Supported Available</option>
              <option value="general">General Ward Available</option>
            </select>

            <label className="flex items-center gap-1.5 text-xs text-slate-700 bg-white border border-slate-200 px-2.5 py-1.5 rounded-lg cursor-pointer hover:border-slate-300 select-none">
              <input
                type="checkbox"
                checked={pmjayOnly}
                onChange={(e) => setPmjayOnly(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span>Ayushman PM-JAY Only</span>
            </label>
          </div>
        </div>

        {/* Hospital List */}
        <div className="divide-y divide-slate-100">
          {hospitals.length === 0 ? (
            <div className="p-12 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <Building className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-semibold text-slate-700">No Hospitals Found Matching Criteria</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try selecting &quot;All India&quot; in the header city dropdown or clearing your search filters.
              </p>
            </div>
          ) : (
            hospitals.map((hosp) => (
              <div key={hosp.id} className="p-4 hover:bg-slate-50/60 transition-colors">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-1.5 max-w-xl">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-slate-900 text-xs">{hosp.name}</h3>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                        HFR: {hosp.hfrId}
                      </span>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                        {hosp.type}
                      </span>
                      {hosp.ayushmanEmpanelled && (
                        <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded flex items-center gap-1 border border-emerald-100 font-medium">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> PM-JAY Empanelled
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        {hosp.address}, {hosp.city}, {hosp.state} - {hosp.pincode}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-600 pt-0.5">
                      <a
                        href={`tel:${hosp.emergencyContact}`}
                        className="text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1"
                      >
                        <PhoneCall className="w-3 h-3" />
                        <span>Emergency: {hosp.emergencyContact}</span>
                      </a>
                      {hosp.helplinePhone && (
                        <span className="text-slate-400">• Desk: {hosp.helplinePhone}</span>
                      )}
                      <button
                        onClick={() => setSelectedHospitalForModal(hosp)}
                        className="text-indigo-600 hover:text-indigo-800 font-medium underline text-[11px] cursor-pointer ml-auto sm:ml-0"
                      >
                        View Full Bed Breakdown
                      </button>
                    </div>
                  </div>

                  {/* Beds summary */}
                  <div className="grid grid-cols-4 gap-2 shrink-0">
                    <div className="bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg text-center min-w-[70px]">
                      <span className="text-[10px] text-slate-500 block font-medium">General</span>
                      <span className="text-xs font-bold text-slate-900">
                        {hosp.generalBeds.available} / {hosp.generalBeds.total}
                      </span>
                    </div>
                    <div className="bg-emerald-50 border border-emerald-100 px-2.5 py-1.5 rounded-lg text-center min-w-[70px]">
                      <span className="text-[10px] text-emerald-700 block font-medium">ICU</span>
                      <span className="text-xs font-bold text-emerald-800">
                        {hosp.icuBeds.available} / {hosp.icuBeds.total}
                      </span>
                    </div>
                    <div className="bg-blue-50 border border-blue-100 px-2.5 py-1.5 rounded-lg text-center min-w-[70px]">
                      <span className="text-[10px] text-blue-700 block font-medium">Ventilator</span>
                      <span className="text-xs font-bold text-blue-800">
                        {hosp.ventilatorBeds.available} / {hosp.ventilatorBeds.total}
                      </span>
                    </div>
                    <div className="bg-indigo-50 border border-indigo-100 px-2.5 py-1.5 rounded-lg text-center min-w-[70px]">
                      <span className="text-[10px] text-indigo-700 block font-medium">Oxygen</span>
                      <span className="text-xs font-bold text-indigo-800">
                        {hosp.oxygenBeds.available} / {hosp.oxygenBeds.total}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Hospital Detail Modal */}
      {selectedHospitalForModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-5 sm:p-6 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                  ABDM HFR Code: {selectedHospitalForModal.hfrId}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  {selectedHospitalForModal.name}
                </h3>
                <p className="text-xs text-slate-500">{selectedHospitalForModal.type}</p>
              </div>
              <button
                onClick={() => setSelectedHospitalForModal(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-xs space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span className="text-slate-700">
                  {selectedHospitalForModal.address}, {selectedHospitalForModal.city},{' '}
                  {selectedHospitalForModal.state} - {selectedHospitalForModal.pincode}
                </span>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-200">
                <span className="text-slate-500">PM-JAY Empanelment ID:</span>
                <span className="font-mono font-semibold text-slate-900">
                  {selectedHospitalForModal.pmjayId}
                </span>
              </div>
            </div>

            {/* Bed Breakdown Metrics */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Current Bed Status Breakdown
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 rounded-lg border border-slate-200 bg-white">
                  <div className="text-[11px] text-slate-500">General Inpatient Ward</div>
                  <div className="text-base font-bold text-slate-900">
                    {selectedHospitalForModal.generalBeds.available} Available
                  </div>
                  <div className="text-[10px] text-slate-400">Total Capacity: {selectedHospitalForModal.generalBeds.total}</div>
                </div>

                <div className="p-3 rounded-lg border border-emerald-200 bg-emerald-50/50">
                  <div className="text-[11px] text-emerald-800">ICU / CCU (Critical Care)</div>
                  <div className="text-base font-bold text-emerald-900">
                    {selectedHospitalForModal.icuBeds.available} Available
                  </div>
                  <div className="text-[10px] text-emerald-600">Total Capacity: {selectedHospitalForModal.icuBeds.total}</div>
                </div>

                <div className="p-3 rounded-lg border border-blue-200 bg-blue-50/50">
                  <div className="text-[11px] text-blue-800">Ventilator Supported Beds</div>
                  <div className="text-base font-bold text-blue-900">
                    {selectedHospitalForModal.ventilatorBeds.available} Available
                  </div>
                  <div className="text-[10px] text-blue-600">Total Capacity: {selectedHospitalForModal.ventilatorBeds.total}</div>
                </div>

                <div className="p-3 rounded-lg border border-indigo-200 bg-indigo-50/50">
                  <div className="text-[11px] text-indigo-800">Oxygen Supported / HDU</div>
                  <div className="text-base font-bold text-indigo-900">
                    {selectedHospitalForModal.oxygenBeds.available} Available
                  </div>
                  <div className="text-[10px] text-indigo-600">Total Capacity: {selectedHospitalForModal.oxygenBeds.total}</div>
                </div>
              </div>
            </div>

            {/* Official Admission Guidelines */}
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-950 space-y-1">
              <div className="font-bold flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-amber-700" />
                <span>Emergency Admission Guidelines</span>
              </div>
              <p className="text-[11px] text-amber-900/80 leading-relaxed">
                Emergency trauma cases are admitted directly through 24x7 Casualty without appointment. Ayushman Bharat
                beneficiaries can present their ABHA Card / PM-JAY Golden Card at the Ayushman Mitra desk in the emergency lobby for cashless hospitalization.
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <a
                href={`tel:${selectedHospitalForModal.emergencyContact}`}
                className="flex-1 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors shadow-xs flex items-center justify-center gap-1.5"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call Emergency Desk</span>
              </a>
              <a
                href="https://hospitals.pmjay.gov.in"
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-center gap-1.5 border border-slate-200"
              >
                <span>Verify on PM-JAY</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

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
