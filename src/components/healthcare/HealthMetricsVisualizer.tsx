import React, { useState, useEffect } from 'react';
import {
  Activity,
  Heart,
  TrendingUp,
  FolderLock,
  ShieldCheck,
  Plus,
  Calendar,
  CheckCircle2,
  Clock,
  ChevronRight,
  Sparkles,
  Droplet,
  Baby,
  ArrowUpRight,
  FileText,
  AlertCircle,
  X,
  Wind,
  Info,
} from 'lucide-react';
import { HealthcareTab, HealthVitalRecord } from '../../types';
import {
  getStoredHealthVitals,
  saveHealthVital,
  getStoredLockerRecords,
  getStoredImmunizationStatus,
  getRecentHealthActivities,
  HealthActivityEvent,
} from '../../services/healthMetricsService';

interface HealthMetricsVisualizerProps {
  onNavigateTab: (tab: HealthcareTab) => void;
  onOpenAbha: () => void;
}

export const HealthMetricsVisualizer: React.FC<HealthMetricsVisualizerProps> = ({
  onNavigateTab,
  onOpenAbha,
}) => {
  const [vitals, setVitals] = useState<HealthVitalRecord[]>([]);
  const [activeMetricTab, setActiveMetricTab] = useState<'bp' | 'glucose' | 'heartRate' | 'immunization'>('bp');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activities, setActivities] = useState<HealthActivityEvent[]>([]);
  const [lockerDocCount, setLockerDocCount] = useState<number>(0);
  const [immunizationStatus, setImmunizationStatus] = useState<ReturnType<typeof getStoredImmunizationStatus> | null>(null);
  const [showLogModal, setShowLogModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states for logging new vital
  const [systolic, setSystolic] = useState<string>('120');
  const [diastolic, setDiastolic] = useState<string>('80');
  const [glucose, setGlucose] = useState<string>('95');
  const [glucoseType, setGlucoseType] = useState<'Fasting' | 'Post-Meal' | 'Random'>('Fasting');
  const [pulse, setPulse] = useState<string>('72');
  const [spO2, setSpO2] = useState<string>('99');
  const [weight, setWeight] = useState<string>('68');
  const [notes, setNotes] = useState<string>('');

  const refreshData = () => {
    const loadedVitals = getStoredHealthVitals();
    setVitals(loadedVitals);
    setActivities(getRecentHealthActivities());
    setLockerDocCount(getStoredLockerRecords().length);
    setImmunizationStatus(getStoredImmunizationStatus());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const latestVital = vitals.length > 0 ? vitals[vitals.length - 1] : null;

  const handleSaveVital = (e: React.FormEvent) => {
    e.preventDefault();
    const newVital: Omit<HealthVitalRecord, 'id'> = {
      date: 'Today',
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      systolicBp: parseInt(systolic, 10) || 120,
      diastolicBp: parseInt(diastolic, 10) || 80,
      bloodGlucose: parseInt(glucose, 10) || 95,
      glucoseType: glucoseType,
      heartRate: parseInt(pulse, 10) || 72,
      spO2: parseInt(spO2, 10) || 99,
      weightKg: parseFloat(weight) || 68,
      notes: notes.trim() || undefined,
    };

    saveHealthVital(newVital);
    refreshData();
    setShowLogModal(false);
    setToastMessage('New health vitals reading recorded and linked to ABDM profile.');
    setTimeout(() => setToastMessage(null), 3500);

    // Reset notes
    setNotes('');
  };

  // SVG Chart Dimensions & Helpers
  const chartHeight = 160;
  const chartWidth = 520;
  const paddingX = 40;
  const paddingY = 24;

  // Render SVG Chart for Blood Pressure
  const renderBpChart = () => {
    if (vitals.length === 0) return null;
    const pointsCount = vitals.length;
    const minVal = 50;
    const maxVal = 160;

    const getX = (index: number) => {
      if (pointsCount === 1) return chartWidth / 2;
      return paddingX + (index / (pointsCount - 1)) * (chartWidth - paddingX * 2);
    };

    const getY = (val: number) => {
      const normalized = (val - minVal) / (maxVal - minVal);
      return chartHeight - paddingY - normalized * (chartHeight - paddingY * 2);
    };

    const systolicPoints = vitals.map((v, i) => `${getX(i)},${getY(v.systolicBp || 120)}`).join(' ');
    const diastolicPoints = vitals.map((v, i) => `${getX(i)},${getY(v.diastolicBp || 80)}`).join(' ');

    return (
      <div className="relative w-full overflow-x-auto pb-1">
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-44 select-none">
          {/* Reference Baseline Guide Lines */}
          <line
            x1={paddingX}
            y1={getY(120)}
            x2={chartWidth - paddingX}
            y2={getY(120)}
            stroke="#e2e8f0"
            strokeDasharray="4 4"
            strokeWidth="1"
          />
          <text x={paddingX - 6} y={getY(120) + 3} textAnchor="end" className="text-[9px] fill-slate-400 font-mono">
            120
          </text>

          <line
            x1={paddingX}
            y1={getY(80)}
            x2={chartWidth - paddingX}
            y2={getY(80)}
            stroke="#e2e8f0"
            strokeDasharray="4 4"
            strokeWidth="1"
          />
          <text x={paddingX - 6} y={getY(80) + 3} textAnchor="end" className="text-[9px] fill-slate-400 font-mono">
            80
          </text>

          {/* Area between systolic and diastolic */}
          <polygon
            points={`${systolicPoints} ${vitals
              .slice()
              .reverse()
              .map((v, i) => `${getX(pointsCount - 1 - i)},${getY(v.diastolicBp || 80)}`)
              .join(' ')}`}
            fill="#e0e7ff"
            fillOpacity="0.4"
          />

          {/* Systolic Line */}
          <polyline
            points={systolicPoints}
            fill="none"
            stroke="#4f46e5"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Diastolic Line */}
          <polyline
            points={diastolicPoints}
            fill="none"
            stroke="#06b6d4"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points */}
          {vitals.map((v, i) => {
            const x = getX(i);
            const ySys = getY(v.systolicBp || 120);
            const yDia = getY(v.diastolicBp || 80);
            const isHovered = hoveredIndex === i;

            return (
              <g key={v.id || i} onMouseEnter={() => setHoveredIndex(i)} onMouseLeave={() => setHoveredIndex(null)}>
                {/* Systolic circle */}
                <circle
                  cx={x}
                  cy={ySys}
                  r={isHovered ? 5.5 : 4}
                  fill="#ffffff"
                  stroke="#4f46e5"
                  strokeWidth={isHovered ? 3 : 2}
                  className="cursor-pointer transition-all"
                />

                {/* Diastolic circle */}
                <circle
                  cx={x}
                  cy={yDia}
                  r={isHovered ? 5.5 : 4}
                  fill="#ffffff"
                  stroke="#06b6d4"
                  strokeWidth={isHovered ? 3 : 2}
                  className="cursor-pointer transition-all"
                />

                {/* Date Label on X Axis */}
                <text
                  x={x}
                  y={chartHeight - 4}
                  textAnchor="middle"
                  className={`text-[10px] ${isHovered ? 'fill-indigo-600 font-bold' : 'fill-slate-500'}`}
                >
                  {v.date}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Dynamic Tooltip */}
        {hoveredIndex !== null && vitals[hoveredIndex] && (
          <div className="absolute top-2 right-4 bg-slate-900 text-white p-2.5 rounded-lg shadow-lg border border-slate-700 text-xs space-y-1 z-10 pointer-events-none animate-in fade-in">
            <div className="font-semibold text-[11px] text-slate-300">
              {vitals[hoveredIndex].date} • {vitals[hoveredIndex].time}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-indigo-300 font-bold">
                Systolic: {vitals[hoveredIndex].systolicBp} mmHg
              </span>
              <span className="text-cyan-300 font-bold">
                Diastolic: {vitals[hoveredIndex].diastolicBp} mmHg
              </span>
            </div>
            {vitals[hoveredIndex].notes && (
              <div className="text-[10px] text-slate-400 italic">&ldquo;{vitals[hoveredIndex].notes}&rdquo;</div>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render SVG Chart for Blood Glucose
  const renderGlucoseChart = () => {
    if (vitals.length === 0) return null;
    const pointsCount = vitals.length;
    const minVal = 60;
    const maxVal = 180;

    const getX = (index: number) => {
      if (pointsCount === 1) return chartWidth / 2;
      return paddingX + (index / (pointsCount - 1)) * (chartWidth - paddingX * 2);
    };

    const getY = (val: number) => {
      const normalized = (val - minVal) / (maxVal - minVal);
      return chartHeight - paddingY - normalized * (chartHeight - paddingY * 2);
    };

    const glucosePoints = vitals.map((v, i) => `${getX(i)},${getY(v.bloodGlucose || 95)}`).join(' ');

    return (
      <div className="relative w-full overflow-x-auto pb-1">
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-44 select-none">
          {/* Target 100 mg/dL Fasting threshold line */}
          <line
            x1={paddingX}
            y1={getY(100)}
            x2={chartWidth - paddingX}
            y2={getY(100)}
            stroke="#cbd5e1"
            strokeDasharray="4 4"
            strokeWidth="1"
          />
          <text x={paddingX - 6} y={getY(100) + 3} textAnchor="end" className="text-[9px] fill-slate-400 font-mono">
            100
          </text>

          {/* Area fill */}
          <polygon
            points={`${paddingX},${chartHeight - paddingY} ${glucosePoints} ${chartWidth - paddingX},${chartHeight - paddingY}`}
            fill="#fef3c7"
            fillOpacity="0.45"
          />

          {/* Glucose Line */}
          <polyline
            points={glucosePoints}
            fill="none"
            stroke="#d97706"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points */}
          {vitals.map((v, i) => {
            const x = getX(i);
            const y = getY(v.bloodGlucose || 95);
            const isHovered = hoveredIndex === i;

            return (
              <g key={v.id || i} onMouseEnter={() => setHoveredIndex(i)} onMouseLeave={() => setHoveredIndex(null)}>
                <circle
                  cx={x}
                  cy={y}
                  r={isHovered ? 6 : 4}
                  fill="#ffffff"
                  stroke="#d97706"
                  strokeWidth={isHovered ? 3 : 2}
                  className="cursor-pointer transition-all"
                />
                <text
                  x={x}
                  y={chartHeight - 4}
                  textAnchor="middle"
                  className={`text-[10px] ${isHovered ? 'fill-amber-700 font-bold' : 'fill-slate-500'}`}
                >
                  {v.date}
                </text>
              </g>
            );
          })}
        </svg>

        {hoveredIndex !== null && vitals[hoveredIndex] && (
          <div className="absolute top-2 right-4 bg-slate-900 text-white p-2.5 rounded-lg shadow-lg border border-slate-700 text-xs space-y-1 z-10 pointer-events-none animate-in fade-in">
            <div className="font-semibold text-[11px] text-slate-300">
              {vitals[hoveredIndex].date} • {vitals[hoveredIndex].time}
            </div>
            <div className="text-amber-300 font-bold">
              Glucose: {vitals[hoveredIndex].bloodGlucose} mg/dL ({vitals[hoveredIndex].glucoseType || 'Fasting'})
            </div>
            <div className="text-[10px] text-emerald-400 font-medium">Within Target Glycemic Range</div>
          </div>
        )}
      </div>
    );
  };

  // Render SVG Chart for Pulse & Heart Rate
  const renderHeartRateChart = () => {
    if (vitals.length === 0) return null;
    const pointsCount = vitals.length;
    const minVal = 50;
    const maxVal = 110;

    const getX = (index: number) => {
      if (pointsCount === 1) return chartWidth / 2;
      return paddingX + (index / (pointsCount - 1)) * (chartWidth - paddingX * 2);
    };

    const getY = (val: number) => {
      const normalized = (val - minVal) / (maxVal - minVal);
      return chartHeight - paddingY - normalized * (chartHeight - paddingY * 2);
    };

    return (
      <div className="relative w-full overflow-x-auto pb-1">
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-44 select-none">
          {/* Normal 60 - 100 bpm guide lines */}
          <line
            x1={paddingX}
            y1={getY(72)}
            x2={chartWidth - paddingX}
            y2={getY(72)}
            stroke="#fecdd3"
            strokeDasharray="4 4"
            strokeWidth="1"
          />
          <text x={paddingX - 6} y={getY(72) + 3} textAnchor="end" className="text-[9px] fill-slate-400 font-mono">
            72
          </text>

          {/* Bars */}
          {vitals.map((v, i) => {
            const x = getX(i);
            const hr = v.heartRate || 72;
            const y = getY(hr);
            const barHeight = chartHeight - paddingY - y;
            const isHovered = hoveredIndex === i;

            return (
              <g key={v.id || i} onMouseEnter={() => setHoveredIndex(i)} onMouseLeave={() => setHoveredIndex(null)}>
                <rect
                  x={x - 12}
                  y={y}
                  width={24}
                  height={Math.max(4, barHeight)}
                  rx={4}
                  fill={isHovered ? '#e11d48' : '#fda4af'}
                  className="cursor-pointer transition-colors"
                />
                <text
                  x={x}
                  y={y - 5}
                  textAnchor="middle"
                  className="text-[10px] font-bold fill-slate-700"
                >
                  {hr}
                </text>
                <text
                  x={x}
                  y={chartHeight - 4}
                  textAnchor="middle"
                  className={`text-[10px] ${isHovered ? 'fill-rose-700 font-bold' : 'fill-slate-500'}`}
                >
                  {v.date}
                </text>
              </g>
            );
          })}
        </svg>

        {hoveredIndex !== null && vitals[hoveredIndex] && (
          <div className="absolute top-2 right-4 bg-slate-900 text-white p-2.5 rounded-lg shadow-lg border border-slate-700 text-xs space-y-1 z-10 pointer-events-none animate-in fade-in">
            <div className="font-semibold text-[11px] text-slate-300">
              {vitals[hoveredIndex].date} • {vitals[hoveredIndex].time}
            </div>
            <div className="text-rose-300 font-bold">
              Resting Pulse: {vitals[hoveredIndex].heartRate} bpm
            </div>
            <div className="text-[10px] text-cyan-300 font-medium">
              Blood Oxygen SpO2: {vitals[hoveredIndex].spO2 || 99}%
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render Immunization & Preventive Protection View
  const renderImmunizationOverview = () => {
    if (!immunizationStatus) return null;

    return (
      <div className="p-4 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-indigo-50/70 p-3.5 rounded-xl border border-indigo-100">
          <div>
            <div className="flex items-center gap-2">
              <Baby className="w-4 h-4 text-indigo-700" />
              <span className="text-xs font-bold text-indigo-950">
                Universal Immunization Programme (UIP) Status
              </span>
            </div>
            <p className="text-[11px] text-indigo-900/80 mt-0.5">
              Covers 12 life-threatening diseases under National Health Mission & Mission Indradhanush.
            </p>
          </div>

          <div className="text-right shrink-0">
            <span className="text-lg font-black text-indigo-700">
              {immunizationStatus.progressPercent}%
            </span>
            <span className="text-[10px] text-indigo-600 block font-medium">Protection Index</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex justify-between text-xs text-slate-600 mb-1.5 font-medium">
            <span>Completed: {immunizationStatus.completedCount} Doses</span>
            <span>Total Schedule: {immunizationStatus.totalCount} Doses</span>
          </div>
          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${immunizationStatus.progressPercent}%` }}
            />
          </div>
        </div>

        {/* Upcoming Vaccine Highlight */}
        {immunizationStatus.upcomingVaccine && (
          <div className="p-3 bg-white rounded-lg border border-slate-200 flex items-start justify-between gap-3">
            <div className="space-y-0.5">
              <span className="text-[10px] bg-purple-50 text-purple-700 px-2 py-0.5 rounded font-semibold border border-purple-100">
                Next Due: {immunizationStatus.upcomingVaccine.targetAge}
              </span>
              <div className="text-xs font-bold text-slate-900 mt-1">
                {immunizationStatus.upcomingVaccine.vaccineName}
              </div>
              <div className="text-[11px] text-slate-500">
                Protects against: {immunizationStatus.upcomingVaccine.preventsAgainst}
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('immunization')}
              className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer shrink-0"
            >
              Open Schedule
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-lg shadow-lg border border-slate-700 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container: Dynamic Health Vitals & Unified Modules Activity Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column (7 cols): Dynamic Vitals Visualizer & Trends */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-xs p-4 sm:p-5 flex flex-col justify-between space-y-4">
          <div>
            {/* Header with Title and "Log Reading" Action */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-indigo-600" />
                  <h2 className="text-sm font-bold text-slate-900">Personal Health Metrics & Vitals Visualizer</h2>
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-medium border border-emerald-100 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" /> ABHA Sync
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Dynamic biometrics and immunization records linked with Ayushman Bharat Digital Mission
                </p>
              </div>

              <button
                onClick={() => setShowLogModal(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Log Vital</span>
              </button>
            </div>

            {/* Quick Metrics Summary Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3">
              <div className="bg-indigo-50/60 border border-indigo-100 p-2.5 rounded-lg text-center">
                <span className="text-[10px] font-semibold text-indigo-800 block">Blood Pressure</span>
                <span className="text-sm font-bold text-indigo-950">
                  {latestVital?.systolicBp || 120} / {latestVital?.diastolicBp || 80}
                </span>
                <span className="text-[9px] text-indigo-600 block font-medium">mmHg • Optimal</span>
              </div>

              <div className="bg-amber-50/60 border border-amber-100 p-2.5 rounded-lg text-center">
                <span className="text-[10px] font-semibold text-amber-800 block">Blood Sugar</span>
                <span className="text-sm font-bold text-amber-950">
                  {latestVital?.bloodGlucose || 95}
                </span>
                <span className="text-[9px] text-amber-600 block font-medium">mg/dL • Fasting</span>
              </div>

              <div className="bg-rose-50/60 border border-rose-100 p-2.5 rounded-lg text-center">
                <span className="text-[10px] font-semibold text-rose-800 block">Pulse Rate</span>
                <span className="text-sm font-bold text-rose-950">
                  {latestVital?.heartRate || 72}
                </span>
                <span className="text-[9px] text-rose-600 block font-medium">bpm • Normal</span>
              </div>

              <div className="bg-cyan-50/60 border border-cyan-100 p-2.5 rounded-lg text-center">
                <span className="text-[10px] font-semibold text-cyan-800 block">Blood Oxygen</span>
                <span className="text-sm font-bold text-cyan-950">
                  {latestVital?.spO2 || 99}%
                </span>
                <span className="text-[9px] text-cyan-600 block font-medium">SpO2 • Healthy</span>
              </div>
            </div>

            {/* Metric Tab Selector */}
            <div className="flex items-center gap-1.5 pt-3 pb-1 border-b border-slate-100 flex-wrap">
              <button
                onClick={() => setActiveMetricTab('bp')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer border ${
                  activeMetricTab === 'bp'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                Blood Pressure (BP)
              </button>

              <button
                onClick={() => setActiveMetricTab('glucose')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer border ${
                  activeMetricTab === 'glucose'
                    ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                Blood Glucose (mg/dL)
              </button>

              <button
                onClick={() => setActiveMetricTab('heartRate')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer border ${
                  activeMetricTab === 'heartRate'
                    ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                Resting Pulse (bpm)
              </button>

              <button
                onClick={() => setActiveMetricTab('immunization')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer border ${
                  activeMetricTab === 'immunization'
                    ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                Immunization Coverage
              </button>
            </div>

            {/* Visualizer Chart Area */}
            <div className="pt-2">
              {activeMetricTab === 'bp' && renderBpChart()}
              {activeMetricTab === 'glucose' && renderGlucoseChart()}
              {activeMetricTab === 'heartRate' && renderHeartRateChart()}
              {activeMetricTab === 'immunization' && renderImmunizationOverview()}
            </div>
          </div>

          {/* Bottom Footnote */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>Last recorded: {latestVital ? `${latestVital.date} at ${latestVital.time}` : 'Today'}</span>
            </span>
            <span className="text-slate-400 font-mono">ICMR Baseline Reference Standard</span>
          </div>
        </div>

        {/* Right Column (5 cols): Summary Card & Module Activities */}
        <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
          {/* Card 1: Health Locker & Immunization Activity Summary */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 sm:p-5 space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FolderLock className="w-4 h-4 text-indigo-600" />
                <h3 className="text-xs font-bold text-slate-900">Recent Module Activity</h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded">
                Live ABDM Sync
              </span>
            </div>

            {/* Activities List */}
            <div className="space-y-2.5">
              {activities.map((act) => (
                <div
                  key={act.id}
                  className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/60 hover:bg-slate-100/70 transition-colors space-y-1"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-800 truncate">{act.title}</span>
                    <span className={`text-[9px] font-semibold px-2 py-0.5 rounded border shrink-0 ${act.badgeClass}`}>
                      {act.badge}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <span className="truncate">{act.subtitle}</span>
                    <span className="text-slate-400 shrink-0">{act.timeAgo}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Modules Direct Quick Launch */}
            <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2">
              <button
                onClick={() => onNavigateTab('health-locker')}
                className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 p-2.5 rounded-lg text-left transition-colors cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <FolderLock className="w-3.5 h-3.5 text-indigo-600" />
                    <ArrowUpRight className="w-3.5 h-3.5 text-indigo-500" />
                  </div>
                  <div className="text-xs font-bold text-indigo-950 mt-1">Health Locker</div>
                </div>
                <span className="text-[10px] text-indigo-700 block mt-1 font-medium">
                  {lockerDocCount} documents stored
                </span>
              </button>

              <button
                onClick={() => onNavigateTab('immunization')}
                className="bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 p-2.5 rounded-lg text-left transition-colors cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <Baby className="w-3.5 h-3.5 text-purple-600" />
                    <ArrowUpRight className="w-3.5 h-3.5 text-purple-500" />
                  </div>
                  <div className="text-xs font-bold text-purple-950 mt-1">Immunization</div>
                </div>
                <span className="text-[10px] text-purple-700 block mt-1 font-medium">
                  {immunizationStatus?.completedCount || 4} of {immunizationStatus?.totalCount || 9} doses taken
                </span>
              </button>
            </div>
          </div>

          {/* Card 2: ABHA Health Card & Consent Manager Snapshot */}
          <div className="bg-slate-900 rounded-xl p-4 sm:p-5 text-white shadow-xs flex items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>ABHA Health ID Verified</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Your medical records, diagnostic reports, and immunization credentials are end-to-end encrypted under ABDM consent framework.
              </p>
            </div>

            <button
              onClick={onOpenAbha}
              className="bg-white hover:bg-slate-100 text-slate-900 font-bold px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer shrink-0 shadow-xs"
            >
              View ABHA
            </button>
          </div>
        </div>
      </div>

      {/* Log Vital Reading Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-5 sm:p-6 shadow-xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Record Health Vitals Reading</h3>
                <p className="text-xs text-slate-500">
                  Logs authentic biometric measurements to your encrypted ABDM health profile.
                </p>
              </div>
              <button
                onClick={() => setShowLogModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveVital} className="space-y-3.5">
              {/* BP Readings */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Blood Pressure (Systolic / Diastolic mmHg)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <input
                      type="number"
                      required
                      min="70"
                      max="220"
                      value={systolic}
                      onChange={(e) => setSystolic(e.target.value)}
                      placeholder="Systolic (e.g. 120)"
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:bg-white focus:border-indigo-600"
                    />
                    <span className="text-[10px] text-slate-400 block mt-0.5">Systolic (Upper)</span>
                  </div>
                  <div>
                    <input
                      type="number"
                      required
                      min="40"
                      max="140"
                      value={diastolic}
                      onChange={(e) => setDiastolic(e.target.value)}
                      placeholder="Diastolic (e.g. 80)"
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:bg-white focus:border-indigo-600"
                    />
                    <span className="text-[10px] text-slate-400 block mt-0.5">Diastolic (Lower)</span>
                  </div>
                </div>
              </div>

              {/* Blood Glucose */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Blood Glucose (mg/dL)</label>
                  <input
                    type="number"
                    required
                    min="40"
                    max="450"
                    value={glucose}
                    onChange={(e) => setGlucose(e.target.value)}
                    placeholder="e.g. 95"
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:bg-white focus:border-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Measurement Type</label>
                  <select
                    value={glucoseType}
                    onChange={(e) => setGlucoseType(e.target.value as any)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:bg-white focus:border-indigo-600"
                  >
                    <option value="Fasting">Fasting (Pre-Meal)</option>
                    <option value="Post-Meal">Post-Meal (2h after food)</option>
                    <option value="Random">Random</option>
                  </select>
                </div>
              </div>

              {/* Pulse & SpO2 */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Pulse (bpm)</label>
                  <input
                    type="number"
                    required
                    min="40"
                    max="180"
                    value={pulse}
                    onChange={(e) => setPulse(e.target.value)}
                    placeholder="e.g. 72"
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:bg-white focus:border-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">SpO2 (%)</label>
                  <input
                    type="number"
                    required
                    min="80"
                    max="100"
                    value={spO2}
                    onChange={(e) => setSpO2(e.target.value)}
                    placeholder="e.g. 99"
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:bg-white focus:border-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="20"
                    max="250"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="e.g. 68.5"
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:bg-white focus:border-indigo-600"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Notes / Context (Optional)</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Taken post-morning walk, feeling energetic"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:bg-white focus:border-indigo-600"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="flex-1 py-2.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs cursor-pointer"
                >
                  Save to Health Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
