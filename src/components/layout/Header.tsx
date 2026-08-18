import React, { useState } from 'react';
import {
  PhoneCall,
  Search,
  MapPin,
  Bell,
  Heart,
  X,
  CheckCircle,
  Sparkles,
  HeartPulse,
  Landmark,
} from 'lucide-react';
import { EMERGENCY_CONTACTS } from '../../data/mockData';
import { SuiteType } from '../../types';

interface HeaderProps {
  currentSuite: SuiteType;
  selectedCity: string;
  onCityChange: (city: string) => void;
  onGlobalSearchSelect: (suite: SuiteType, tab: string) => void;
  onOpenAbhaModal: () => void;
  onSelectSuite?: (suite: SuiteType) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentSuite,
  selectedCity,
  onCityChange,
  onGlobalSearchSelect,
  onOpenAbhaModal,
  onSelectSuite,
}) => {
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);

  const cities = [
    'All India (National)',
    'New Delhi',
    'Mumbai',
    'Bengaluru',
    'Hyderabad',
    'Kolkata',
    'Chennai',
    'Pune',
    'Lucknow',
    'Patna',
    'Jaipur',
  ];

  const notifications = [
    {
      id: 'n1',
      title: 'Grievance Updated: GRV-2025-0842',
      time: '15m ago',
      desc: 'Repair vehicle dispatched with cold emulsion patch materials for Ring Road Pothole.',
      type: 'civic',
    },
    {
      id: 'n2',
      title: 'OPD Queue Alert: Token #142',
      time: '1h ago',
      desc: 'Your estimated consultation slot starts in 18 minutes at AIIMS Cardiology.',
      type: 'health',
    },
    {
      id: 'n3',
      title: 'New Generic Medicine Batch Added',
      time: 'Yesterday',
      desc: 'Jan Aushadhi Kendra received 400+ units of Metformin and Atorvastatin.',
      type: 'health',
    },
  ];

  const quickSearchItems = [
    { name: 'AI Health Triage & Symptom Checker (Hindi / English)', suite: 'healthcare' as SuiteType, tab: 'ai-triage', category: 'Health' },
    { name: 'Jan Aushadhi Generic Medicine Comparison', suite: 'healthcare' as SuiteType, tab: 'jan-aushadhi', category: 'Health' },
    { name: 'Ayushman Bharat Health Account (ABHA) Card', suite: 'healthcare' as SuiteType, tab: 'abha', category: 'Health' },
    { name: 'Free OPD Appointment & e-Sanjeevani Token', suite: 'healthcare' as SuiteType, tab: 'opd-token', category: 'Health' },
    { name: 'Live Blood Bank Stock Finder (A+, B+, O+, AB-)', suite: 'healthcare' as SuiteType, tab: 'blood-bank', category: 'Health' },
    { name: 'File Municipal Grievance (Potholes, Water, Sanitation)', suite: 'civic' as SuiteType, tab: 'grievance', category: 'Civic' },
    { name: 'Govt Schemes Eligibility Calculator (PM-JAY, Kisan, Awas)', suite: 'civic' as SuiteType, tab: 'schemes', category: 'Civic' },
    { name: 'Draft Legal RTI (Right to Information) Application', suite: 'civic' as SuiteType, tab: 'rti', category: 'Civic' },
    { name: 'Report Cyber Bank Fraud Helpline 1930', suite: 'civic' as SuiteType, tab: 'cyber-consumer', category: 'Civic' },
  ];

  const filteredSearch = searchQuery.trim()
    ? quickSearchItems.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleCopy = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedNumber(num);
    setTimeout(() => setCopiedNumber(null), 2000);
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-3">
            {/* Left Brand / Mobile Title */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-xs shrink-0 lg:hidden">
                  <span>जन</span>
                </div>
                <div className="lg:hidden">
                  <span className="font-bold text-base text-slate-900 tracking-tight">JanSetu</span>
                </div>
              </div>

              {/* Suite Switcher Tabs in Desktop Header */}
              {onSelectSuite && (
                <div className="hidden md:flex items-center space-x-1 h-16">
                  <button
                    onClick={() => onSelectSuite('healthcare')}
                    className={`h-16 px-4 flex items-center gap-2 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
                      currentSuite === 'healthcare'
                        ? 'border-indigo-600 text-indigo-600'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <HeartPulse className="w-4 h-4" />
                    <span>Healthcare Suite</span>
                  </button>
                  <button
                    onClick={() => onSelectSuite('civic')}
                    className={`h-16 px-4 flex items-center gap-2 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
                      currentSuite === 'civic'
                        ? 'border-indigo-600 text-indigo-600'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Landmark className="w-4 h-4" />
                    <span>Civic & Economic</span>
                  </button>
                </div>
              )}
            </div>

            {/* Global Search Bar */}
            <div className="relative flex-1 max-w-md hidden sm:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search medicines, schemes, hospital beds, grievance..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setTimeout(() => setSearchFocused(false), 250)}
                  className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:bg-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all"
                />
              </div>

              {/* Search Dropdown */}
              {searchFocused && filteredSearch.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 max-h-80 overflow-y-auto">
                  <div className="px-3 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Quick Navigation
                  </div>
                  {filteredSearch.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        onGlobalSearchSelect(item.suite, item.tab);
                        setSearchQuery('');
                        setSearchFocused(false);
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center justify-between text-xs group transition-colors"
                    >
                      <span className="text-slate-800 group-hover:text-indigo-600 font-medium">
                        {item.name}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                          item.category === 'Health'
                            ? 'bg-indigo-50 text-indigo-700'
                            : 'bg-amber-50 text-amber-800'
                        }`}
                      >
                        {item.category}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Action Controls */}
            <div className="flex items-center gap-2">
              {/* City / State Selector */}
              <div className="flex items-center gap-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 transition-colors">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <select
                  value={selectedCity}
                  onChange={(e) => onCityChange(e.target.value)}
                  className="bg-transparent text-xs font-medium text-slate-700 focus:outline-hidden cursor-pointer pr-1"
                >
                  {cities.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* SOS Helpline Quick Pill */}
              <button
                onClick={() => setShowEmergencyModal(true)}
                className="flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                title="Emergency Helplines (112, 108, 1930)"
              >
                <PhoneCall className="w-3.5 h-3.5 text-rose-600" />
                <span className="hidden sm:inline">SOS 112</span>
                <span className="sm:hidden">112</span>
              </button>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-lg relative transition-colors cursor-pointer"
                  title="Citizen Alerts"
                >
                  <Bell className="w-4 h-4" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full" />
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-88 bg-white rounded-xl shadow-xl border border-slate-200 py-3 z-50">
                    <div className="flex items-center justify-between px-4 pb-2 border-b border-slate-100">
                      <div className="font-semibold text-xs text-slate-900">Notifications & Alerts</div>
                      <span className="text-[10px] text-indigo-600 font-medium">3 unread</span>
                    </div>
                    <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                      {notifications.map((n) => (
                        <div key={n.id} className="p-3 hover:bg-slate-50 transition-colors">
                          <div className="flex items-center justify-between text-xs mb-0.5">
                            <span className="font-semibold text-slate-900">{n.title}</span>
                            <span className="text-slate-400 text-[10px]">{n.time}</span>
                          </div>
                          <p className="text-[11px] text-slate-600 leading-relaxed">{n.desc}</p>
                        </div>
                      ))}
                    </div>
                    <div className="px-4 pt-2 border-t border-slate-100 text-center">
                      <button
                        onClick={() => setShowNotifications(false)}
                        className="text-xs text-slate-500 hover:text-slate-800 font-medium"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* ABHA Profile Pill */}
              <button
                onClick={onOpenAbhaModal}
                className="flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 text-indigo-700 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                title="View ABHA Health Account"
              >
                <div className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[9px] font-bold">
                  ✓
                </div>
                <span className="hidden md:inline">ABHA Active</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Emergency SOS Modal */}
      {showEmergencyModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-5 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">National Emergency Helplines</h3>
                  <p className="text-xs text-slate-500">Toll-free 24x7 Government emergency network</p>
                </div>
              </div>
              <button
                onClick={() => setShowEmergencyModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-3 space-y-2 max-h-96 overflow-y-auto pr-1">
              {EMERGENCY_CONTACTS.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200/70 hover:border-slate-300 transition-all"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900 text-xs">{item.name}</span>
                      <span className="text-[10px] bg-slate-200/80 text-slate-700 px-1.5 py-0.2 rounded font-medium">
                        {item.available}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">{item.description}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    <a
                      href={`tel:${item.number}`}
                      className="flex items-center gap-1 bg-rose-600 hover:bg-rose-700 text-white px-2.5 py-1 rounded-md text-xs font-semibold transition-colors"
                    >
                      <PhoneCall className="w-3 h-3" />
                      {item.number}
                    </a>
                    <button
                      onClick={() => handleCopy(item.number)}
                      className="text-xs text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-2 py-1 rounded-md transition-colors"
                    >
                      {copiedNumber === item.number ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>National Disaster Management System</span>
              <button
                onClick={() => setShowEmergencyModal(false)}
                className="px-3.5 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-medium hover:bg-slate-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
