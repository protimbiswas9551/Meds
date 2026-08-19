import React, { useState } from 'react';
import {
  ShieldCheck,
  Calendar,
  Baby,
  Heart,
  CheckCircle2,
  Clock,
  Sparkles,
  AlertCircle,
  Download,
  Printer,
  ChevronRight,
} from 'lucide-react';
import { VACCINE_SCHEDULE } from '../../data/mockData';

export const ImmunizationTracker: React.FC = () => {
  const [childDob, setChildDob] = useState('');
  const [checkedVaccines, setCheckedVaccines] = useState<Record<string, boolean>>({});

  const toggleVaccine = (id: string) => {
    setCheckedVaccines({
      ...checkedVaccines,
      [id]: !checkedVaccines[id],
    });
  };

  const totalMandatory = VACCINE_SCHEDULE.length;
  const completedCount = Object.values(checkedVaccines).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / totalMandatory) * 100);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-linear-to-r from-indigo-900 via-purple-900 to-slate-900 rounded-2xl p-5 sm:p-6 text-white shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" /> Mission Indradhanush (UIP)
          </span>
          <span className="text-xs text-slate-300">Universal Immunization Programme</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight mb-2">
          National Immunization Schedule & Child Health Tracker
        </h1>
        <p className="text-xs sm:text-sm text-indigo-100 leading-relaxed max-w-3xl">
          Track 100% free life-saving vaccines provided at government health centers, Anganwadi centers, and
          district hospitals for newborns, infants, children, and expectant mothers.
        </p>
      </div>

      {/* Interactive Progress & DOB Calculator */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
            <Calendar className="w-4 h-4 text-indigo-600" />
            <span>Child Date of Birth</span>
          </div>
          <input
            type="date"
            value={childDob}
            onChange={(e) => setChildDob(e.target.value)}
            className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold focus:outline-hidden focus:border-indigo-600"
          />
          <p className="text-[11px] text-slate-500">
            Auto-calculates due dates for upcoming polio, pentavalent, measles-rubella & booster doses.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-bold text-slate-900">
            <span>Immunization Protection Level</span>
            <span className="text-indigo-600 font-black">{progressPercent}%</span>
          </div>
          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden my-2">
            <div
              className="bg-linear-to-r from-indigo-600 to-purple-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-500">
            <span>{completedCount} Doses Completed</span>
            <span>{totalMandatory - completedCount} Doses Remaining</span>
          </div>
        </div>

        <div className="bg-indigo-50 border border-indigo-200 p-5 rounded-2xl flex flex-col justify-between">
          <div className="space-y-1">
            <div className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
              <Baby className="w-4 h-4 text-indigo-700" />
              <span>100% Free at All Govt PHCs</span>
            </div>
            <p className="text-xs text-indigo-900/80 leading-relaxed">
              Every Wednesday is Village Health & Nutrition Day (VHND) across all Anganwadi centers in India.
            </p>
          </div>
          <button
            onClick={() => window.print()}
            className="mt-3 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Vaccine Chart</span>
          </button>
        </div>
      </div>

      {/* Vaccine Timeline Table / List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Universal Immunization Timeline</h2>
            <p className="text-xs text-slate-500 mt-0.5">Click checkbox when your child receives each dose</p>
          </div>
          <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
            WHO & MoHFW Approved
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {VACCINE_SCHEDULE.map((item) => {
            const isDone = !!checkedVaccines[item.id];
            return (
              <div
                key={item.id}
                className={`p-4 sm:p-5 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isDone ? 'bg-emerald-50/30 hover:bg-emerald-50/50' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <button
                    onClick={() => toggleVaccine(item.id)}
                    className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-all cursor-pointer ${
                      isDone
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'border-2 border-slate-300 hover:border-slate-500 bg-white'
                    }`}
                  >
                    {isDone && <CheckCircle2 className="w-4 h-4" />}
                  </button>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md">
                        {item.targetAge}
                      </span>
                      <h4 className={`font-bold text-sm sm:text-base ${isDone ? 'text-slate-700 line-through' : 'text-slate-900'}`}>
                        {item.vaccineName}
                      </h4>
                    </div>

                    <p className="text-xs text-slate-600 font-medium">
                      Prevents: <span className="text-slate-800">{item.preventsAgainst}</span>
                    </p>
                    <p className="text-xs text-slate-500 italic">{item.notes}</p>
                  </div>
                </div>

                <div className="text-right shrink-0 sm:self-center pl-9 sm:pl-0">
                  <span className="text-[11px] font-mono font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-md border border-slate-200 block sm:inline-block">
                    {item.doses}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
