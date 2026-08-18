import React, { useState } from 'react';
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
} from 'lucide-react';
import { MOCK_GRIEVANCES, GOVT_SCHEMES } from '../../data/mockData';
import { CivicTab } from '../../types';

interface CivicOverviewProps {
  selectedCity: string;
  onNavigateTab: (tab: CivicTab) => void;
}

export const CivicOverview: React.FC<CivicOverviewProps> = ({ selectedCity, onNavigateTab }) => {
  const [activeTabFilter, setActiveTabFilter] = useState<'all' | 'in-progress' | 'resolved'>('all');

  const totalGrievances = MOCK_GRIEVANCES.length;
  const resolvedGrievances = MOCK_GRIEVANCES.filter((g) => g.status === 'Resolved').length;
  const inProgressGrievances = MOCK_GRIEVANCES.filter((g) => g.status === 'In Progress').length;
  const resolutionRate = Math.round((resolvedGrievances / totalGrievances) * 100);

  const civicAlerts = [
    {
      id: 'a1',
      tag: 'Sanitation Drive',
      title: 'Special Mega Ward Cleanliness & Desilting Campaign',
      desc: 'Municipal corporation starting monsoon drain desilting across all zonal wards this Saturday.',
      time: '2h ago',
    },
    {
      id: 'a2',
      tag: 'Public Notice',
      title: 'Water Supply Maintenance Shutdown Notice',
      desc: '3-hour scheduled pipeline pressure enhancement in North & Central zones on Thursday 2 PM.',
      time: '5h ago',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Clean Minimalism Hero Card */}
      <div className="bg-white rounded-xl p-6 sm:p-7 border border-slate-200 shadow-xs relative overflow-hidden">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-indigo-100 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Digital India & CPGRAMS
            </span>
            <span className="text-xs text-slate-500">Centralized Citizen Redressal</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mb-2">
            Civic & Economic Suite: Transparent & Citizen-First
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5">
            File municipal grievances for potholes, water supply, or sanitation with instant tracking IDs, check
            eligibility for government welfare schemes (PM-JAY, PM Kisan, PMAY), and draft legal RTI applications.
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
              <span>Check Govt Schemes Eligibility</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Metric Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Ward Resolution Rate</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{resolutionRate}%</div>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">Average SLA: 48 hours</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Active Grievances</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{inProgressGrievances} Active</div>
          <p className="text-[11px] text-amber-700 font-medium mt-1">In inspection & repair stage</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Central Schemes</span>
            <Landmark className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">8+ Major DBT</div>
          <p className="text-[11px] text-slate-500 font-medium mt-1">Direct Benefit Transfers</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Cyber Cell Response</span>
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">Helpline 1930</div>
          <p className="text-[11px] text-indigo-600 font-medium mt-1">Financial fraud freeze in golden hr</p>
        </div>
      </div>

      {/* Municipal Ward Notices */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {civicAlerts.map((alert) => (
          <div key={alert.id} className="p-4 sm:p-5 rounded-xl border border-slate-200 bg-white space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                {alert.tag}
              </span>
              <span className="text-[10px] text-slate-400">{alert.time}</span>
            </div>
            <h4 className="font-semibold text-sm text-slate-900">{alert.title}</h4>
            <p className="text-xs text-slate-500 leading-relaxed">{alert.desc}</p>
          </div>
        ))}
      </div>

      {/* Recent Ward Grievance Timeline Summary */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-indigo-600" />
              <h2 className="text-sm font-bold text-slate-900">Recent Ward Grievances & Redressal Status</h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Live updates from Municipal Corporation & Public Works Department
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('grievance')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
          >
            <span>View All Grievances</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {MOCK_GRIEVANCES.slice(0, 3).map((grv) => (
            <div key={grv.id} className="p-4 sm:p-5 hover:bg-slate-50/70 transition-colors">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                <div className="space-y-1 max-w-2xl">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-medium text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {grv.id}
                    </span>
                    <span className="text-[10px] bg-indigo-50 text-indigo-700 font-medium px-2 py-0.5 rounded border border-indigo-100">
                      {grv.category}
                    </span>
                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded border ${
                        grv.status === 'Resolved'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                          : 'bg-amber-50 text-amber-800 border-amber-100'
                      }`}
                    >
                      {grv.status}
                    </span>
                  </div>
                  <h4 className="font-semibold text-slate-900 text-sm">{grv.title}</h4>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{grv.address}, {grv.wardNumber}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right text-xs">
                    <span className="text-slate-400 block text-[10px]">Department</span>
                    <span className="font-medium text-slate-700">{grv.department}</span>
                  </div>
                  <button
                    onClick={() => onNavigateTab('grievance')}
                    className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    Track Stepper
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2-Column Civic Services CTA Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* RTI Assistant Promo */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-700 border border-indigo-100">
                <FileText className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-600">
                Right to Information (RTI) Act 2005
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Draft Certified Legal RTI Applications
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Enquire into road construction contracts, ration shop allocations, government job exam answer
              keys, and municipal ward fund expenditures.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('rti')}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-2 px-3 rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            <span>Open RTI Form Drafter</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 1930 Cyber Fraud Promo */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-rose-50 rounded-lg text-rose-700 border border-rose-100">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-600">
                National Cyber Crime Portal & Helpline 1930
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Freeze Financial Cyber Fraud in Golden Hour
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Immediate action checklist to reverse unauthorized UPI/Netbanking deductions, report fake customer
              care numbers, and lodge consumer disputes.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('cyber-consumer')}
            className="w-full bg-rose-600 hover:bg-rose-700 text-white font-medium py-2 px-3 rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            <span>Cyber Fraud & Consumer Guide</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
