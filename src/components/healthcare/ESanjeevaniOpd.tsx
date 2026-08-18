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
} from 'lucide-react';
import { MOCK_OPD_TOKENS } from '../../data/mockData';
import { OpdToken } from '../../types';

export const ESanjeevaniOpd: React.FC = () => {
  const [tokens, setTokens] = useState<OpdToken[]>(MOCK_OPD_TOKENS);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('32');
  const [patientGender, setPatientGender] = useState('Male');
  const [department, setDepartment] = useState('General Medicine');
  const [isTeleConsult, setIsTeleConsult] = useState(true);
  const [activeCallSimulated, setActiveCallSimulated] = useState(false);

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
      doctorName: isTeleConsult ? 'Dr. Sunita Deshmukh, MD (Tele-OPD)' : 'Dr. R. K. Singhal, MD',
      hospitalName: isTeleConsult ? 'e-Sanjeevani National Tele-Portal' : 'District Govt Civil Hospital',
      slotTime: 'Today, 11:45 AM - 12:00 PM',
      date: 'Today',
      status: 'In Queue',
      estimatedWaitMinutes: Math.floor(10 + Math.random() * 15),
      isTeleConsult: isTeleConsult,
    };

    setTokens([newToken, ...tokens]);
    setPatientName('');
    setShowBookingModal(false);
  };

  const handleStartCall = () => {
    setActiveCallSimulated(true);
    setTimeout(() => {
      setActiveCallSimulated(false);
      alert('Teleconsultation completed. Digital e-Prescription saved to your ABHA profile.');
    }, 5000);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-linear-to-r from-teal-800 via-emerald-800 to-slate-900 rounded-2xl p-5 sm:p-6 text-white shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-teal-500/20 text-teal-300 border border-teal-400/30 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-teal-300" /> e-Sanjeevani 2.0 National OPD
          </span>
          <span className="text-xs text-slate-300">Ministry of Health & Family Welfare</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight mb-2">
          Free OPD Teleconsultation & Queue Token System
        </h1>
        <p className="text-xs sm:text-sm text-teal-50 leading-relaxed max-w-3xl">
          Zero cost digital doctor consultations from home or instant skip-the-line OPD registration for government
          civil hospitals and AIIMS clinics across India.
        </p>
      </div>

      {/* Active Tokens & Queue Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900">Your Active OPD & Tele-Consultation Passes</h2>
          <p className="text-xs text-slate-500">Live queue position & digital consultation room</p>
        </div>

        <button
          onClick={() => setShowBookingModal(true)}
          className="bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold px-4 py-2 rounded-xl text-xs sm:text-sm shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Book Free OPD / Tele-Consult</span>
        </button>
      </div>

      {/* Token Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tokens.map((tok) => (
          <div
            key={tok.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between hover:border-emerald-300 transition-all space-y-4"
          >
            <div>
              <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200">
                    <Ticket className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Token Number</span>
                    <div className="text-lg font-black text-slate-900 font-mono tracking-tight">
                      {tok.tokenNumber}
                    </div>
                  </div>
                </div>

                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                    tok.status === 'In Queue'
                      ? 'bg-amber-50 text-amber-800 border-amber-200 animate-pulse'
                      : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  }`}
                >
                  {tok.status}
                </span>
              </div>

              <div className="mt-3 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span className="text-slate-400">Patient:</span>
                  <span className="font-semibold text-slate-900">
                    {tok.patientName} ({tok.age}y, {tok.gender})
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span className="text-slate-400">Department:</span>
                  <span className="font-semibold text-slate-900">{tok.department}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span className="text-slate-400">Doctor / Hospital:</span>
                  <span className="font-medium text-slate-800 text-right">
                    {tok.doctorName} <br />
                    <span className="text-[11px] text-slate-500">{tok.hospitalName}</span>
                  </span>
                </div>
                <div className="flex justify-between text-slate-600 bg-slate-50 p-2 rounded-lg">
                  <span className="text-slate-500 font-medium">Slot Time:</span>
                  <span className="font-bold text-emerald-800">{tok.slotTime}</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <div className="text-xs text-slate-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>Est. Wait: <strong className="text-slate-800">{tok.estimatedWaitMinutes} mins</strong></span>
              </div>

              {tok.isTeleConsult ? (
                <button
                  onClick={handleStartCall}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Join Video OPD</span>
                </button>
              ) : (
                <button
                  onClick={() => alert(`Showing QR Code gate pass for ${tok.tokenNumber}`)}
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>OPD Pass</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Simulated Call Banner */}
      {activeCallSimulated && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 text-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-700 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-600/30 border border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto animate-pulse">
              <Video className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">e-Sanjeevani Video OPD Connected</h3>
            <p className="text-xs text-slate-300">
              Connecting with Dr. Sunita Deshmukh, MD (Tele-OPD Specialist, Ministry of Health)...
            </p>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 w-3/4 animate-pulse" />
            </div>
            <p className="text-[11px] text-slate-400">Encrypted peer-to-peer government consultation channel</p>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">Book Free Consultation / OPD Token</h3>
            <p className="text-xs text-slate-500 mb-4">
              Instant queue ticket with zero registration charge
            </p>

            <form onSubmit={handleBookToken} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Patient Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Age</label>
                  <input
                    type="number"
                    value={patientAge}
                    onChange={(e) => setPatientAge(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Gender</label>
                  <select
                    value={patientGender}
                    onChange={(e) => setPatientGender(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-emerald-600"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Clinical Department</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-emerald-600"
                >
                  {departments.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Consultation Mode</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setIsTeleConsult(true)}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      isTeleConsult
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    Video / Online OPD
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsTeleConsult(false)}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      !isTeleConsult
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    Hospital Physical OPD
                  </button>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs"
                >
                  Confirm Free Token
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
