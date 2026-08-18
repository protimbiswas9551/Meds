import React, { useState } from 'react';
import {
  CreditCard,
  QrCode,
  ShieldCheck,
  Download,
  Share2,
  FileText,
  Plus,
  CheckCircle,
  Clock,
  User,
  Heart,
  Phone,
  Printer,
  Sparkles,
} from 'lucide-react';
import { MOCK_ABHA_PROFILE } from '../../data/mockData';
import { AbhaProfile } from '../../types';

export const AbhaHealthCard: React.FC = () => {
  const [profile, setProfile] = useState<AbhaProfile>(MOCK_ABHA_PROFILE);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddRecordModal, setShowAddRecordModal] = useState(false);
  const [newRecordTitle, setNewRecordTitle] = useState('');
  const [newRecordHospital, setNewRecordHospital] = useState('');
  const [newRecordType, setNewRecordType] = useState<'Prescription' | 'Lab Report' | 'Vaccine' | 'Discharge Summary'>('Prescription');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownloadCard = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const handlePrintCard = () => {
    window.print();
  };

  const handleAddRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecordTitle.trim()) return;

    const newRec = {
      id: `rec-${Date.now()}`,
      title: newRecordTitle,
      hospital: newRecordHospital || 'District Civil Hospital',
      date: 'Today',
      type: newRecordType,
    };

    setProfile({
      ...profile,
      linkedRecords: [newRec, ...profile.linkedRecords],
    });

    setNewRecordTitle('');
    setNewRecordHospital('');
    setShowAddRecordModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-linear-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-5 sm:p-6 text-white shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-blue-300" /> Ayushman Bharat Digital Mission (ABDM)
          </span>
          <span className="text-xs text-slate-300">National Health Authority (NHA)</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight mb-2">
          Ayushman Bharat Health Account (ABHA)
        </h1>
        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-3xl">
          Your 14-digit ABHA number uniquely identifies you across India’s digital healthcare ecosystem, linking
          digital prescriptions, diagnostic reports, and medical history with 100% citizen consent.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ABHA Digital Card Preview (Official Card Style) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Digital Health Identity Card
          </div>

          <div
            id="abha-card-print"
            className="bg-linear-to-br from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-xl border border-blue-800/60 relative overflow-hidden"
          >
            {/* Background Decorative Rings */}
            <div className="absolute -right-8 -top-8 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -left-8 -bottom-8 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

            {/* National Emblem & Card Header */}
            <div className="flex items-center justify-between pb-3 border-b border-blue-800/80 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-amber-400 font-bold border border-white/20">
                  AB
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-wider text-slate-300">
                    National Health Authority
                  </div>
                  <div className="text-xs font-bold text-white">Ayushman Bharat Health Account</div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 px-2 py-0.5 rounded-full font-bold uppercase">
                  Verified ID
                </span>
              </div>
            </div>

            {/* Middle Profile & QR Code */}
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="space-y-1">
                <div className="text-[11px] text-slate-400">Cardholder Name</div>
                <div className="text-base font-bold text-white tracking-wide">{profile.fullName}</div>
                <div className="text-xs text-slate-300">
                  {profile.gender} • DOB: {profile.dob}
                </div>
                <div className="text-xs font-semibold text-rose-300 flex items-center gap-1 mt-1">
                  <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" /> Blood Group: {profile.bloodGroup}
                </div>
              </div>

              {/* QR Code */}
              <div className="bg-white p-2 rounded-xl text-slate-950 shrink-0 shadow-md text-center">
                <QrCode className="w-16 h-16" />
                <span className="text-[8px] font-mono font-bold block mt-0.5 text-slate-700">SCAN AT OPD</span>
              </div>
            </div>

            {/* 14-Digit ABHA Number Display */}
            <div className="bg-white/10 rounded-xl p-3 border border-white/10 mb-4 backdrop-blur-xs">
              <div className="text-[10px] text-slate-300 font-medium uppercase tracking-wider">
                14-Digit ABHA Number
              </div>
              <div className="font-mono text-base sm:text-lg font-bold text-amber-300 tracking-wider">
                {profile.abhaNumber}
              </div>
              <div className="text-[11px] text-slate-300 font-mono mt-0.5">
                ABHA Address: <span className="text-white font-medium">{profile.abhaAddress}</span>
              </div>
            </div>

            {/* Emergency & State info */}
            <div className="flex items-center justify-between text-[11px] text-slate-300 pt-2 border-t border-blue-900">
              <div>
                <span className="text-slate-400 block text-[9px] uppercase">Emergency ICE</span>
                <span className="font-medium text-slate-200">{profile.emergencyContactPhone}</span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block text-[9px] uppercase">State / PIN</span>
                <span className="font-medium text-slate-200">
                  {profile.state} - {profile.pinCode}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleDownloadCard}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{downloadSuccess ? 'Card Downloaded!' : 'Download Card (PDF)'}</span>
            </button>
            <button
              onClick={handlePrintCard}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
          </div>
        </div>

        {/* Linked Health Records Locker */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Digitally Linked Medical Records</h3>
              <p className="text-xs text-slate-500">Secured via National Health Data Privacy framework</p>
            </div>

            <button
              onClick={() => setShowAddRecordModal(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Link Record</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
            {profile.linkedRecords.map((rec) => (
              <div key={rec.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2.5 rounded-xl shrink-0 ${
                      rec.type === 'Prescription'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : rec.type === 'Lab Report'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{rec.title}</h4>
                    <p className="text-xs text-slate-500">
                      {rec.hospital} • {rec.date}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-semibold border border-slate-200">
                    {rec.type}
                  </span>
                  <button
                    onClick={() => alert(`Viewing certified record: ${rec.title} issued by ${rec.hospital}`)}
                    className="text-xs text-blue-600 hover:text-blue-800 font-semibold px-2 py-1 hover:bg-blue-50 rounded-md transition-colors"
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ABDM Consent Info Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-600 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Full Citizen Privacy & Data Sovereignty</span>
            </div>
            <p className="leading-relaxed">
              No hospital, clinic, or doctor can access your previous records without OTP consent sent to your
              Aadhaar-linked mobile phone. You can revoke access at any time through the ABHA portal.
            </p>
          </div>
        </div>
      </div>

      {/* Add Record Modal */}
      {showAddRecordModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">Link New Healthcare Record to ABHA</h3>
            <p className="text-xs text-slate-500 mb-4">
              Add verified prescription, pathology blood test, or vaccine certificate
            </p>

            <form onSubmit={handleAddRecord} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Record Title / Diagnosis
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Ultrasound Abdomen / Cardiology ECG Report"
                  value={newRecordTitle}
                  onChange={(e) => setNewRecordTitle(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Issuing Hospital / Diagnostic Lab
                </label>
                <input
                  type="text"
                  placeholder="e.g., AIIMS New Delhi / Max Healthcare"
                  value={newRecordHospital}
                  onChange={(e) => setNewRecordHospital(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Record Type</label>
                <select
                  value={newRecordType}
                  onChange={(e) => setNewRecordType(e.target.value as any)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-blue-600"
                >
                  <option value="Prescription">Prescription</option>
                  <option value="Lab Report">Lab Report</option>
                  <option value="Vaccine">Vaccine Certificate</option>
                  <option value="Discharge Summary">Discharge Summary</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddRecordModal(false)}
                  className="flex-1 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs"
                >
                  Save to ABHA Locker
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
