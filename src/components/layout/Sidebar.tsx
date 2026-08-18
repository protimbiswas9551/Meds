import React from 'react';
import {
  HeartPulse,
  Pill,
  CreditCard,
  CalendarCheck,
  Droplet,
  ShieldCheck,
  Building2,
  AlertCircle,
  Landmark,
  FileText,
  FolderLock,
  ShieldAlert,
  Sparkles,
  ChevronRight,
  UserCheck,
  Layers,
} from 'lucide-react';
import { SuiteType, HealthcareTab, CivicTab } from '../../types';

interface SidebarProps {
  currentSuite: SuiteType;
  onSelectSuite: (suite: SuiteType) => void;
  healthcareTab: HealthcareTab;
  onSelectHealthcareTab: (tab: HealthcareTab) => void;
  civicTab: CivicTab;
  onSelectCivicTab: (tab: CivicTab) => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentSuite,
  onSelectSuite,
  healthcareTab,
  onSelectHealthcareTab,
  civicTab,
  onSelectCivicTab,
  isMobileOpen,
  onCloseMobile,
}) => {
  const healthcareNavItems = [
    { id: 'health-locker' as HealthcareTab, label: 'Digital Health Locker', icon: FolderLock },
    { id: 'overview' as HealthcareTab, label: 'Healthcare Overview', icon: HeartPulse },
    { id: 'ai-triage' as HealthcareTab, label: 'AI Health Triage', icon: Sparkles },
    { id: 'jan-aushadhi' as HealthcareTab, label: 'Jan Aushadhi Generics', icon: Pill },
    { id: 'abha' as HealthcareTab, label: 'Ayushman ABHA Card', icon: CreditCard },
    { id: 'opd-token' as HealthcareTab, label: 'e-Sanjeevani OPD', icon: CalendarCheck },
    { id: 'blood-bank' as HealthcareTab, label: 'Blood Bank Network', icon: Droplet },
    { id: 'immunization' as HealthcareTab, label: 'Immunization Schedule', icon: ShieldCheck },
  ];

  const civicNavItems = [
    { id: 'overview' as CivicTab, label: 'Civic Overview', icon: Building2 },
    { id: 'grievance' as CivicTab, label: 'Grievance Redressal', icon: AlertCircle },
    { id: 'schemes' as CivicTab, label: 'Govt Schemes Checker', icon: Landmark },
    { id: 'rti' as CivicTab, label: 'RTI Legal Drafter', icon: FileText },
    { id: 'documents' as CivicTab, label: 'DigiLocker Hub', icon: FolderLock },
    { id: 'cyber-consumer' as CivicTab, label: 'Cyber & Consumer Safety', icon: ShieldAlert },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white text-slate-800 border-r border-slate-200">
      {/* Brand Header */}
      <div className="h-16 px-6 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-xs">
            <span>जन</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base text-slate-900 tracking-tight">JanSetu</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded border border-indigo-100">
                v2.4
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-none">Indian Civic & Health Suite</p>
          </div>
        </div>
      </div>

      {/* Primary Suite Tabs Switcher */}
      <div className="p-4 border-b border-slate-100">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2 px-1">
          Select Suite
        </div>
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-lg">
          <button
            onClick={() => onSelectSuite('healthcare')}
            className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              currentSuite === 'healthcare'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <HeartPulse className="w-3.5 h-3.5 text-indigo-600" />
            <span>Healthcare</span>
          </button>

          <button
            onClick={() => onSelectSuite('civic')}
            className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              currentSuite === 'civic'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Landmark className="w-3.5 h-3.5 text-indigo-600" />
            <span>Civic & Econ</span>
          </button>
        </div>
      </div>

      {/* Navigation Section Title */}
      <div className="px-5 pt-4 pb-2 flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          {currentSuite === 'healthcare' ? 'Health Modules' : 'Civic Modules'}
        </span>
        <span className="text-[10px] bg-slate-100 text-slate-600 font-medium px-2 py-0.5 rounded-full">
          {currentSuite === 'healthcare' ? '8 Modules' : '6 Modules'}
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-1.5 space-y-1">
        {currentSuite === 'healthcare'
          ? healthcareNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = healthcareTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectHealthcareTab(item.id);
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors cursor-pointer group ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 font-semibold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'
                      }`}
                    />
                    <span className="text-xs truncate">{item.label}</span>
                  </div>
                </button>
              );
            })
          : civicNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = civicTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectCivicTab(item.id);
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors cursor-pointer group ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 font-semibold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'
                      }`}
                    />
                    <span className="text-xs truncate">{item.label}</span>
                  </div>
                </button>
              );
            })}
      </nav>

      {/* Citizen Profile Footer */}
      <div className="p-3.5 border-t border-slate-200 bg-slate-50/50">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0 border border-indigo-200">
            RK
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <span className="text-xs font-semibold text-slate-900 truncate">Rajesh Kumar</span>
              <UserCheck className="w-3 h-3 text-emerald-600 shrink-0" />
            </div>
            <div className="text-[10px] text-slate-500 truncate">ABHA: 91-4820-1948-2830</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col shrink-0 bg-white">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop & Menu */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-2xl z-50">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
