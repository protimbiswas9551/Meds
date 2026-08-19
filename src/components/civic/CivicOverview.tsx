import React from 'react';
import {
  Building2,
  AlertCircle,
  Landmark,
  FileText,
  ShieldCheck,
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronRight,
  TrendingUp,
  MapPin,
  Flame,
  Users,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { GOVT_SCHEMES, EMERGENCY_CONTACTS } from '../../data/mockData';
import { CivicTab } from '../../types';

interface CivicOverviewProps {
  selectedCity: string;
  onNavigateTab: (tab: CivicTab) => void;
}

export const CivicOverview: React.FC<CivicOverviewProps> = ({ selectedCity, onNavigateTab }) => {
  const civicAlerts = [
    {
      id: 'a1',
      tag: 'Sanitation & Health',
      title: 'Swachh Bharat Municipal Cleanliness & Vector Control',
      desc: 'Municipal corporations across zones conduct daily fogging and solid waste collection.',
      time: 'Daily Service',
    },
    {
      id: 'a2',
      tag: 'Public Service',
      title: 'CPGRAMS Centralized Grievance Redressal Mechanism',
      desc: 'Lodge grievances with any Central / State Government department with statutory time-bound SLA.',
      time: '24x7 Active',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Clean Hero Card */}
      <div className="bg-white rounded-xl p-6 sm:p-7 border border-slate-200 shadow-xs relative overflow-hidden">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-indigo-100 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Digital India & CPGRAMS
            </span>
            <span className="text-xs text-slate-500">Public Services & Citizen Rights</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mb-2">
            Civic & Welfare Portal: Transparent & Citizen-First
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5">
            File municipal grievances with instant tracking IDs, check eligibility for major welfare schemes (PM-JAY,
            PM-KISAN, PMAY), draft legal RTI applications under Section 6(1), and access emergency cyber fraud helplines.
          </p>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => onNavigateTab('grievance')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-lg text-xs sm:text-sm transition-colors shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <AlertCircle className="w-4 h-4" />
              <span>File Municipal Grievance</span>
            </button>
            <button
              onClick={() => onNavigateTab('schemes')}
              className="bg-white hover:bg-slate-50 text-slate-700 font-medium border border-slate-200 px-4 py-2 rounded-lg text-xs sm:text-sm transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Landmark className="w-4 h-4 text-indigo-600" />
              <span>Check Govt Schemes</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Metric Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>CPGRAMS Portal</span>
            <Building2 className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-xl font-bold text-slate-900">pgportal.gov.in</div>
          <p className="text-[11px] text-slate-500 font-medium mt-1">National Redressal System</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Central Schemes</span>
            <Landmark className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-xl font-bold text-slate-900">{GOVT_SCHEMES.length} Verified Schemes</div>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">Direct Benefit Transfer (DBT)</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Cyber Fraud Response</span>
            <ShieldAlert className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-xl font-bold text-slate-900">Helpline 1930</div>
          <p className="text-[11px] text-rose-600 font-medium mt-1">Financial fraud recovery</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>RTI Statutory Window</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-bold text-slate-900">30 Days Max</div>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">Section 7(1) RTI Act 2005</p>
        </div>
      </div>

      {/* Municipal & Public Service Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {civicAlerts.map((alert) => (
          <div key={alert.id} className="p-4 sm:p-5 rounded-xl border border-slate-200 bg-white space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                {alert.tag}
              </span>
              <span className="text-[10px] text-slate-400">{alert.time}</span>
            </div>
            <h2 className="font-semibold text-sm text-slate-900">{alert.title}</h2>
            <p className="text-xs text-slate-500 leading-relaxed">{alert.desc}</p>
          </div>
        ))}
      </div>

      {/* Verified Govt Schemes Quick Explorer */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Landmark className="w-4 h-4 text-indigo-600" />
              <h2 className="text-sm font-bold text-slate-900">Flagship Government Welfare Schemes</h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Authentic welfare initiatives verified under Government of India guidelines
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('schemes')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
          >
            <span>Check Eligibility Calculator</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {GOVT_SCHEMES.slice(0, 4).map((scheme) => (
            <div key={scheme.id} className="p-4 sm:p-5 hover:bg-slate-50/70 transition-colors">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                <div className="space-y-1 max-w-2xl">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] bg-indigo-50 text-indigo-700 font-medium px-2 py-0.5 rounded border border-indigo-100">
                      {scheme.category}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {scheme.ministry}
                    </span>
                  </div>
                  <h3 className="font-semibold text-slate-900 text-sm">{scheme.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{scheme.benefits}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <a
                    href={scheme.officialPortalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
                  >
                    <span>Official Portal</span>
                    <ExternalLink className="w-3 h-3 text-slate-500" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
