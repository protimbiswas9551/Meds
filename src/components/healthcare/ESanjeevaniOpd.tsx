import React, { useState } from 'react';
import {
  CalendarCheck,
  Clock,
  User,
  Video,
  Building2,
  CheckCircle2,
  AlertCircle,
  Download,
  Plus,
  Sparkles,
  Ticket,
  Printer,
  ChevronRight,
  Trash2,
} from 'lucide-react';
import { OpdToken } from '../../types';

export const ESanjeevaniOpd: React.FC = () => {
  // Starts with clean empty tokens list — only user-booked appointments will show
  const [tokens, setTokens] = useState<OpdToken[]>([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('28');
  const [patientGender, setPatientGender] = useState('Female');
  const [department, setDepartment] = useState('General Medicine');
  const [isTeleConsult, setIsTeleConsult] = useState(true);
  const [activeCallSimulated, setActiveCallSimulated] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const departments = [
    'General Medicine',
    'Pediatrics & Child Health',
    'Cardiology & Hypertension',
    'Gynecology & Obstetrics',
    'Dermatology & Skin',
    'Orthopedics & Joint Care',
    'AYUSH - Ayurveda & Wellness',
    'ENT (Ear, Nose, Throat)',
    'Ophthalmology (Eye Clinic)',
  ];

  const handleBookToken = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim()) return;

    const randomNum = Math.floor(100 + Math.random() * 900);
    const newToken: OpdToken = {
      id: `tok-${Date.now()}`,
      tokenNumber: isTeleConsult ? `eSANJ-${randomNum}` : `AIIMS-OPD-${randomNum}`,
      patientName: patientName.trim(),
      age: parseInt(patientAge) || 30,
      gender: patientGender,
      department: department,
      doctorName: isTeleConsult ? 'Dr. Priya Nair, MD (Tele-OPD)' : 'Dr. S. K. Verma, MD',
      hospitalName: isTeleConsult ? 'e-Sanjeevani National Tele-Portal' : 'District Govt Civil Hospital',
      slotTime: 'Today, 11:45 AM - 12:00 PM',
      date: 'Today',
      status: 'In Queue',
      estimatedWaitMinutes: Math.floor(10 + Math.random() * 15),
      isTeleConsult: isTeleConsult,
    };

    setTokens((prev) => [newToken, ...prev]);
    setPatientName('');
    setShowBookingModal(false);
    setToastMessage(`Token #${newToken.tokenNumber} booked for ${newToken.patientName}`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDeleteToken = (id: string) => {
    setTokens((prev) => prev.filter((t) => t.id !== id));
  };

  const handleStartCall = () => {
    setActiveCallSimulated(true);
    setTimeout(() => {
      setActiveCallSimulated(false);
      setToastMessage('Teleconsultation session completed.');
      setTimeout(() => setToastMessage(null), 3000);
    }, 4000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-lg shadow-lg border border-slate-700 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Banner */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <CalendarCheck className="w-5 h-5 text-indigo-600" />
            <h1 className="text-xl font-bold text-slate-900">
              Free OPD & Teleconsultation Tokens
            </h1>
          </div>
          <p className="text-xs text-slate-600">
            Book free online doctor consultations via e-Sanjeevani or get OPD tokens for government civil hospitals.
          </p>
        </div>

        <button
          onClick={() => setShowBookingModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-xs transition-colors flex items-center gap-2 cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Book Free Consultation</span>
        </button>
      </div>

      {/* Active Tokens List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-sm font-bold text-slate-900">Your Active OPD Passes & Appointments</h2>
          <span className="text-xs text-slate-500">{tokens.length} Active</span>
        </div>

        {tokens.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400 space-y-2">
            <p className="font-medium text-slate-600">No OPD tokens or appointments booked</p>
            <p className="text-slate-400">
              Click &quot;Book Free Consultation&quot; above to schedule a teleconsultation or hospital OPD token.
            </p>
            <button
              onClick={() => setShowBookingModal(true)}
              className="mt-2 text-xs font-semibold text-indigo-600 hover:text-indigo-800 underline cursor-pointer"
            >
              Book your first OPD token
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tokens.map((tok) => (
              <div
                key={tok.id}
                className="bg-slate-50/70 hover:bg-slate-50 border border-slate-200 rounded-xl p-4 transition-colors space-y-3"
              >
                <div className="flex items-start justify-between gap-2 pb-2 border-b border-slate-200/60">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg border border-indigo-100">
                      <Ticket className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900 font-mono">
                        {tok.tokenNumber}
                      </div>
                      <span className="text-[10px] text-slate-500">{tok.date}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-medium border border-emerald-200">
                      {tok.status}
                    </span>
                    <button
                      onClick={() => handleDeleteToken(tok.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                      title="Cancel token"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Patient:</span>
                    <span className="font-semibold text-slate-800">{tok.patientName} ({tok.age}y, {tok.gender})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Department:</span>
                    <span className="font-medium text-slate-800">{tok.department}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Doctor / Centre:</span>
                    <span className="font-medium text-slate-800 text-right">
                      {tok.doctorName} <br />
                      <span className="text-[10px] text-slate-500">{tok.hospitalName}</span>
                    </span>
                  </div>
                  <div className="flex justify-between bg-white p-2 rounded border border-slate-200 mt-2">
                    <span className="text-slate-500 font-medium">Slot Time:</span>
                    <span className="font-semibold text-indigo-600">{tok.slotTime}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between gap-2">
                  <div className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    <span>Est. Wait: <strong>{tok.estimatedWaitMinutes} mins</strong></span>
                  </div>

                  {tok.isTeleConsult ? (
                    <button
                      onClick={handleStartCall}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1 rounded-lg flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Join Video OPD</span>
                    </button>
                  ) : (
                    <span className="text-xs text-indigo-600 font-medium">
                      Show at Hospital Gate Pass
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Simulated Call Banner */}
      {activeCallSimulated && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-200 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto animate-pulse">
              <Video className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">e-Sanjeevani Video OPD Connected</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Connecting with Dr. Priya Nair, MD (Ministry of Health Teleconsultation Network)...
            </p>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 w-3/4 animate-pulse" />
            </div>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-5 shadow-xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-1">Book Free Consultation / OPD Token</h3>
            <p className="text-xs text-slate-500 mb-4">
              Ministry of Health & Family Welfare — National Teleconsultation Portal
            </p>

            <form onSubmit={handleBookToken} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Patient Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Verma"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:bg-white focus:border-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={patientAge}
                    onChange={(e) => setPatientAge(e.target.value)}
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:bg-white focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Gender
                  </label>
                  <select
                    value={patientGender}
                    onChange={(e) => setPatientGender(e.target.value)}
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:bg-white focus:border-indigo-600"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Specialty Department
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:bg-white focus:border-indigo-600"
                >
                  {departments.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Consultation Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setIsTeleConsult(true)}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
                      isTeleConsult
                        ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Online Video Tele-OPD
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsTeleConsult(false)}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
                      !isTeleConsult
                        ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Physical Hospital Token
                  </button>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs cursor-pointer"
                >
                  Confirm Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
