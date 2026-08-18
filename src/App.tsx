import React, { useState } from 'react';
import {
  Menu,
  HeartPulse,
  Landmark,
  PhoneCall,
  Pill,
  CreditCard,
  CalendarCheck,
  AlertCircle,
  FileText,
  ShieldCheck,
  Droplet,
  FolderLock,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { SuiteType, HealthcareTab, CivicTab } from './types';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';

// Healthcare suite views
import { HealthcareOverview } from './components/healthcare/HealthcareOverview';
import { DigitalHealthLocker } from './components/healthcare/DigitalHealthLocker';
import { AiHealthTriage } from './components/healthcare/AiHealthTriage';
import { JanAushadhiFinder } from './components/healthcare/JanAushadhiFinder';
import { AbhaHealthCard } from './components/healthcare/AbhaHealthCard';
import { ESanjeevaniOpd } from './components/healthcare/ESanjeevaniOpd';
import { BloodBankNetwork } from './components/healthcare/BloodBankNetwork';
import { ImmunizationTracker } from './components/healthcare/ImmunizationTracker';

// Civic suite views
import { CivicOverview } from './components/civic/CivicOverview';
import { GrievanceRedressal } from './components/civic/GrievanceRedressal';
import { GovtSchemesChecker } from './components/civic/GovtSchemesChecker';
import { RtiAssistant } from './components/civic/RtiAssistant';
import { CitizenDocumentsHub } from './components/civic/CitizenDocumentsHub';
import { CyberConsumerSafety } from './components/civic/CyberConsumerSafety';

export default function App() {
  const [currentSuite, setCurrentSuite] = useState<SuiteType>('healthcare');
  const [healthcareTab, setHealthcareTab] = useState<HealthcareTab>('health-locker');
  const [civicTab, setCivicTab] = useState<CivicTab>('overview');
  const [selectedCity, setSelectedCity] = useState<string>('All India (National)');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Global search navigation handler
  const handleGlobalSearchSelect = (suite: SuiteType, tab: string) => {
    setCurrentSuite(suite);
    if (suite === 'healthcare') {
      setHealthcareTab(tab as HealthcareTab);
    } else {
      setCivicTab(tab as CivicTab);
    }
  };

  const handleOpenAbha = () => {
    setCurrentSuite('healthcare');
    setHealthcareTab('abha');
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-900 font-sans overflow-hidden flex-col selection:bg-indigo-600 selection:text-white">
      {/* Top Main Navigation Header */}
      <Header
        currentSuite={currentSuite}
        selectedCity={selectedCity}
        onCityChange={setSelectedCity}
        onGlobalSearchSelect={handleGlobalSearchSelect}
        onOpenAbhaModal={handleOpenAbha}
        onSelectSuite={setCurrentSuite}
      />

      {/* Main Body with Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          currentSuite={currentSuite}
          onSelectSuite={(suite) => {
            setCurrentSuite(suite);
          }}
          healthcareTab={healthcareTab}
          onSelectHealthcareTab={setHealthcareTab}
          civicTab={civicTab}
          onSelectCivicTab={setCivicTab}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto pb-24 lg:pb-8">
          {/* Mobile Top Suite Switcher & Hamburger Bar */}
          <div className="lg:hidden flex items-center justify-between mb-4 bg-white p-2 rounded-lg border border-slate-200 shadow-xs">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-1.5 text-slate-700 hover:bg-slate-50 rounded-md flex items-center gap-1.5 text-xs font-semibold"
            >
              <Menu className="w-4 h-4 text-slate-900" />
              <span>Menu</span>
            </button>

            {/* Switch between the 2 main tabs on mobile */}
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-md">
              <button
                onClick={() => setCurrentSuite('healthcare')}
                className={`px-2.5 py-1 text-xs font-semibold rounded transition-all cursor-pointer ${
                  currentSuite === 'healthcare'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Healthcare
              </button>
              <button
                onClick={() => setCurrentSuite('civic')}
                className={`px-2.5 py-1 text-xs font-semibold rounded transition-all cursor-pointer ${
                  currentSuite === 'civic'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Civic & Econ
              </button>
            </div>
          </div>

          {/* Render Active Suite Content */}
          {currentSuite === 'healthcare' && (
            <div>
              {healthcareTab === 'overview' && (
                <HealthcareOverview
                  selectedCity={selectedCity}
                  onNavigateTab={setHealthcareTab}
                  onOpenAbha={handleOpenAbha}
                />
              )}
              {healthcareTab === 'health-locker' && <DigitalHealthLocker />}
              {healthcareTab === 'ai-triage' && <AiHealthTriage />}
              {healthcareTab === 'jan-aushadhi' && <JanAushadhiFinder />}
              {healthcareTab === 'abha' && <AbhaHealthCard />}
              {healthcareTab === 'opd-token' && <ESanjeevaniOpd />}
              {healthcareTab === 'blood-bank' && <BloodBankNetwork />}
              {healthcareTab === 'immunization' && <ImmunizationTracker />}
            </div>
          )}

          {currentSuite === 'civic' && (
            <div>
              {civicTab === 'overview' && (
                <CivicOverview
                  selectedCity={selectedCity}
                  onNavigateTab={setCivicTab}
                />
              )}
              {civicTab === 'grievance' && <GrievanceRedressal />}
              {civicTab === 'schemes' && <GovtSchemesChecker />}
              {civicTab === 'rti' && <RtiAssistant />}
              {civicTab === 'documents' && <CitizenDocumentsHub />}
              {civicTab === 'cyber-consumer' && <CyberConsumerSafety />}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (Minimal Clean) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-200 px-3 py-1.5 flex items-center justify-around text-slate-500 shadow-xs">
        <button
          onClick={() => {
            setCurrentSuite('healthcare');
            setHealthcareTab('overview');
          }}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-medium transition-colors ${
            currentSuite === 'healthcare' && healthcareTab === 'overview'
              ? 'text-indigo-600 font-semibold'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <HeartPulse className="w-4 h-4" />
          <span>Health</span>
        </button>

        <button
          onClick={() => {
            setCurrentSuite('healthcare');
            setHealthcareTab('jan-aushadhi');
          }}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-medium transition-colors ${
            currentSuite === 'healthcare' && healthcareTab === 'jan-aushadhi'
              ? 'text-indigo-600 font-semibold'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Pill className="w-4 h-4" />
          <span>Generics</span>
        </button>

        <button
          onClick={() => {
            setCurrentSuite('civic');
            setCivicTab('grievance');
          }}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-medium transition-colors ${
            currentSuite === 'civic' && civicTab === 'grievance'
              ? 'text-indigo-600 font-semibold'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <AlertCircle className="w-4 h-4" />
          <span>Grievance</span>
        </button>

        <button
          onClick={() => {
            setCurrentSuite('civic');
            setCivicTab('schemes');
          }}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-medium transition-colors ${
            currentSuite === 'civic' && civicTab === 'schemes'
              ? 'text-indigo-600 font-semibold'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Landmark className="w-4 h-4" />
          <span>Schemes</span>
        </button>

        <button
          onClick={() => setIsMobileSidebarOpen(true)}
          className="flex flex-col items-center gap-0.5 text-[10px] font-medium text-slate-500 hover:text-slate-900"
        >
          <Menu className="w-4 h-4" />
          <span>Menu</span>
        </button>
      </div>
    </div>
  );
}
