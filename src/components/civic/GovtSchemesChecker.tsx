import React, { useState, useMemo } from 'react';
import {
  Landmark,
  Search,
  Filter,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  FileCheck,
  ArrowRight,
  TrendingUp,
  User,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { GOVT_SCHEMES } from '../../data/mockData';
import { GovtScheme } from '../../types';

export const GovtSchemesChecker: React.FC = () => {
  // Quiz inputs
  const [age, setAge] = useState<number>(32);
  const [gender, setGender] = useState<'All' | 'Female' | 'Male'>('All');
  const [occupation, setOccupation] = useState<string>('All');
  const [incomeLakhs, setIncomeLakhs] = useState<number>(2.5);
  const [area, setArea] = useState<'All' | 'Rural' | 'Urban'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSchemeId, setExpandedSchemeId] = useState<string | null>('sch-1');

  const occupations = [
    'All Occupations',
    'Farmer',
    'Self Employed / Small Business',
    'Artisan / Craftsman',
    'Street Vendor / Hawker',
    'Daily Wage / Unorganized',
    'Salaried / Employee',
    'Student',
    'Homemaker',
  ];

  // Filter schemes based on eligibility quiz
  const matchingSchemes = useMemo(() => {
    return GOVT_SCHEMES.filter((sch) => {
      // Age check
      if (sch.eligibility.minAge !== undefined && age < sch.eligibility.minAge) return false;
      if (sch.eligibility.maxAge !== undefined && age > sch.eligibility.maxAge) return false;

      // Gender check
      if (gender !== 'All' && sch.eligibility.gender && sch.eligibility.gender !== 'All' && sch.eligibility.gender !== gender) {
        return false;
      }

      // Income check
      if (sch.eligibility.maxAnnualIncome !== undefined && incomeLakhs > sch.eligibility.maxAnnualIncome) {
        return false;
      }

      // Occupation check
      if (occupation !== 'All Occupations' && sch.eligibility.occupation) {
        const matchesOcc = sch.eligibility.occupation.some((occ) =>
          occupation.toLowerCase().includes(occ.toLowerCase())
        );
        if (!matchesOcc) return false;
      }

      // Area check
      if (area !== 'All' && sch.eligibility.ruralUrban && sch.eligibility.ruralUrban !== 'All' && sch.eligibility.ruralUrban !== area) {
        return false;
      }

      // Text search
      if (searchQuery.trim()) {
        const matchesSearch =
          sch.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          sch.ministry.toLowerCase().includes(searchQuery.toLowerCase()) ||
          sch.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          sch.benefits.toLowerCase().includes(searchQuery.toLowerCase());
        if (!matchesSearch) return false;
      }

      return true;
    });
  }, [age, gender, occupation, incomeLakhs, area, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-linear-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-2xl p-5 sm:p-6 text-white shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" /> Direct Benefit Transfer (DBT)
          </span>
          <span className="text-xs text-slate-300">National Welfare Schemes Portal (MyScheme)</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight mb-2">
          Government Schemes Eligibility Finder
        </h1>
        <p className="text-xs sm:text-sm text-emerald-50 leading-relaxed max-w-3xl">
          Enter your demographic and economic details to discover all central and state welfare benefits, subsidies,
          and credit guarantee schemes you are eligible to claim.
        </p>
      </div>

      {/* Interactive Eligibility Quiz Panel */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
          <Landmark className="w-5 h-5 text-emerald-600" />
          <h2 className="text-base font-bold text-slate-900">Your Eligibility Profile Quiz</h2>
          <span className="text-xs text-slate-500 ml-auto hidden sm:inline">
            Matches updated live as you change parameters
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {/* Age */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Citizen Age: {age} Years</label>
            <input
              type="range"
              min="0"
              max="85"
              value={age}
              onChange={(e) => setAge(parseInt(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
              <span>0 yr</span>
              <span>40 yr</span>
              <span>85 yr</span>
            </div>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value as any)}
              className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold focus:outline-hidden focus:border-emerald-600"
            >
              <option value="All">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          {/* Occupation */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Occupation Trade</label>
            <select
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
              className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold focus:outline-hidden focus:border-emerald-600"
            >
              {occupations.map((occ) => (
                <option key={occ} value={occ}>
                  {occ}
                </option>
              ))}
            </select>
          </div>

          {/* Annual Income */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Annual Family Income: ₹{incomeLakhs} Lakhs
            </label>
            <input
              type="range"
              min="0.5"
              max="15"
              step="0.5"
              value={incomeLakhs}
              onChange={(e) => setIncomeLakhs(parseFloat(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
              <span>₹50K</span>
              <span>₹6 Lakhs</span>
              <span>₹15L+</span>
            </div>
          </div>

          {/* Area */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Area Region</label>
            <select
              value={area}
              onChange={(e) => setArea(e.target.value as any)}
              className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold focus:outline-hidden focus:border-emerald-600"
            >
              <option value="All">All Regions</option>
              <option value="Rural">Rural (Gramin)</option>
              <option value="Urban">Urban (City/Town)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Matching Schemes Result Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-bold text-slate-900">
            Matching Schemes for Your Profile ({matchingSchemes.length})
          </h3>
          <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
            Verified Govt Benefits
          </span>
        </div>

        {/* Quick Search inside schemes */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search scheme name or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:border-emerald-600"
          />
        </div>
      </div>

      {/* Schemes Grid */}
      <div className="space-y-4">
        {matchingSchemes.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500 text-sm">
            No schemes found matching the chosen criteria. Try adjusting income or occupation filters.
          </div>
        ) : (
          matchingSchemes.map((sch) => {
            const isExpanded = expandedSchemeId === sch.id;
            return (
              <div
                key={sch.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden transition-all hover:border-emerald-300"
              >
                <div className="p-4 sm:p-5">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                          {sch.category}
                        </span>
                        <span className="text-xs font-black text-slate-900 bg-amber-100 text-amber-900 border border-amber-200 px-2.5 py-0.5 rounded-md">
                          {sch.benefitAmount}
                        </span>
                      </div>

                      <h3 className="font-bold text-slate-900 text-base sm:text-lg">{sch.title}</h3>
                      <p className="text-xs text-slate-500 font-medium">{sch.ministry}</p>
                      <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">{sch.shortDesc}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={sch.officialPortalUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
                      >
                        <span>Apply on Portal</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <button
                        onClick={() => setExpandedSchemeId(isExpanded ? null : sch.id)}
                        className="p-2 text-slate-400 hover:text-slate-700 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer transition-colors"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-slate-100 bg-slate-50/60 p-4 sm:p-6 space-y-4">
                    {/* Benefits Detail */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200">
                      <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block mb-1">
                        Comprehensive Direct Benefits
                      </span>
                      <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                        {sch.benefits}
                      </p>
                    </div>

                    {/* Required Documents Checklist */}
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                        Required Citizen Documents
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {sch.requiredDocs.map((doc, idx) => (
                          <div
                            key={idx}
                            className="bg-white p-2.5 rounded-lg border border-slate-200 text-xs text-slate-700 flex items-center gap-2"
                          >
                            <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span className="font-medium">{doc}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
