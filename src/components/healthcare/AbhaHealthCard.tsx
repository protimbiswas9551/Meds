import React, { useState } from 'react';
import {
  CreditCard,
  QrCode,
  ShieldCheck,
  Download,
  Plus,
  Heart,
  Printer,
  Sparkles,
  User,
  Phone,
  Calendar,
  MapPin,
  RefreshCw,
  FileText,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import { AbhaProfile } from '../../types';

export const AbhaHealthCard: React.FC = () => {
  // Starts with null (unlinked default state) — no hardcoded dummy person
  const [profile, setProfile] = useState<AbhaProfile | null>(null);

  // Form states for creating / linking ABHA
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [gender, setGender] = useState('Male');
  const [dob, setDob] = useState('1995-01-01');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [stateName, setStateName] = useState('Delhi');
  const [pinCode, setPinCode] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // Link record modal
  const [showAddRecordModal, setShowAddRecordModal] = useState(false);
  const [newRecordTitle, setNewRecordTitle] = useState('');
  const [newRecordHospital, setNewRecordHospital] = useState('');
  const [newRecordType, setNewRecordType] = useState<'Prescription' | 'Lab Report' | 'Vaccine' | 'Discharge Summary'>('Prescription');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleCreateAbha = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !mobile.trim()) return;

    setIsCreating(true);

    setTimeout(() => {
      // Generate clean 14-digit ABHA number based on randomized valid format
      const rand4 = () => Math.floor(1000 + Math.random() * 9000);
      const abhaNum = `91-${rand4()}-${rand4()}-${rand4()}`;
      const username = fullName.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 12);
      const abhaAddr = `${username}${Math.floor(10 + Math.random() * 90)}@abdm`;

      const newProfile: AbhaProfile = {
        abhaNumber: abhaNum,
        abhaAddress: abhaAddr,
        fullName: fullName.trim(),
        gender,
        dob,
        bloodGroup,
        mobile: mobile.trim(),
        emergencyContactName: 'Family Contact',
        emergencyContactPhone: mobile.trim(),
        pinCode: pinCode.trim() || '110001',
        state: stateName,
        isVerified: true,
        createdDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        linkedRecords: [],
      };

      setProfile(newProfile);
      setIsCreating(false);
    }, 500);
  };

  const handleDownloadCard = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const handlePrintCard = () => {
    window.print();
  };

  const handleAddRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecordTitle.trim() || !profile) return;

    const newRec = {
      id: `rec-${Date.now()}`,
      title: newRecordTitle.trim(),
      hospital: newRecordHospital.trim() || 'Civil Hospital / Lab',
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
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

  const handleDeleteLinkedRecord = (recordId: string) => {
    if (!profile) return;
    setProfile({
      ...profile,
      linkedRecords: profile.linkedRecords.filter((r) => r.id !== recordId),
    });
  };

  const handleResetProfile = () => {
    setProfile(null);
    setFullName('');
    setMobile('');
    setPinCode('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <CreditCard className="w-5 h-5 text-indigo-600" />
            <h1 className="text-xl font-bold text-slate-900">
              Ayushman Bharat Health Account (ABHA)
            </h1>
          </div>
          <p className="text-xs text-slate-600">
            Create or manage your 14-digit digital health identity card under the Ayushman Bharat Digital Mission (ABDM).
          </p>
        </div>

        {profile && (
          <button
            onClick={handleResetProfile}
            className="px-3 py-1.5 text-xs text-slate-500 hover:text-rose-600 border border-slate-200 hover:border-rose-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer self-start md:self-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Unlink / Reset Account</span>
          </button>
        )}
      </div>

      {/* When Profile is NOT yet created / linked */}
      {!profile && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 max-w-2xl mx-auto space-y-5">
          <div className="text-center space-y-1.5 pb-4 border-b border-slate-100">
            <div className="w-12 h-12 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-2">
              <Sparkles className="w-6 h-6" />
            </div>
            <h2 className="text-base font-bold text-slate-900">Generate Your ABHA Digital Health Card</h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              Enter your details below to create your official 14-digit ABHA ID. Your account will start fresh with zero linked records.
            </p>
          </div>

          <form onSubmit={handleCreateAbha} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name (as per Aadhaar / Govt ID) *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Ananya Sharma"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:bg-white focus:border-indigo-600 font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  required
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:bg-white focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Gender
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:bg-white focus:border-indigo-600"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:bg-white focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Blood Group
                </label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:bg-white focus:border-indigo-600"
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  PIN Code (Optional)
                </label>
                <input
                  type="text"
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                  placeholder="e.g. 110001"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:bg-white focus:border-indigo-600"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isCreating || !fullName.trim() || !mobile.trim()}
                className={`w-full py-2.5 px-4 rounded-lg font-medium text-xs text-white transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer ${
                  isCreating || !fullName.trim() || !mobile.trim()
                    ? 'bg-indigo-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {isCreating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Generating ABHA Card...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Generate & View ABHA Card</span>
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="flex items-start gap-2 text-[11px] text-slate-500 pt-2 border-t border-slate-100">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              ABHA complies with the National Health Authority privacy framework. No health records are shared without citizen OTP authorization.
            </span>
          </div>
        </div>
      )}

      {/* When Profile IS generated / active */}
      {profile && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Card Preview */}
          <div className="lg:col-span-5 space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Your Digital Health Identity Card
            </div>

            <div
              id="abha-card-print"
              className="bg-linear-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-xl border border-indigo-800/60 relative overflow-hidden"
            >
              <div className="flex items-center justify-between pb-3 border-b border-indigo-800/80 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-amber-400 font-bold border border-white/20 text-xs">
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
                    Active ID
                  </span>
                </div>
              </div>

              {/* Profile Details */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="space-y-1">
                  <div className="text-[10px] text-slate-400">Cardholder Name</div>
                  <div className="text-base font-bold text-white tracking-wide">{profile.fullName}</div>
                  <div className="text-xs text-slate-300">
                    {profile.gender} • DOB: {profile.dob}
                  </div>
                  <div className="text-xs font-semibold text-rose-300 flex items-center gap-1 mt-1">
                    <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" /> Blood Group: {profile.bloodGroup}
                  </div>
                </div>

                <div className="bg-white p-1.5 rounded-lg text-slate-950 shrink-0 text-center">
                  <QrCode className="w-14 h-14" />
                  <span className="text-[8px] font-mono font-bold block mt-0.5 text-slate-700">ABHA QR</span>
                </div>
              </div>

              {/* 14-Digit Number */}
              <div className="bg-white/10 rounded-xl p-3 border border-white/10 mb-4">
                <div className="text-[10px] text-slate-300 font-medium uppercase tracking-wider">
                  14-Digit ABHA Number
                </div>
                <div className="font-mono text-base font-bold text-amber-300 tracking-wider">
                  {profile.abhaNumber}
                </div>
                <div className="text-[11px] text-slate-300 font-mono mt-0.5">
                  ABHA Address: <span className="text-white font-medium">{profile.abhaAddress}</span>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between text-[11px] text-slate-300 pt-2 border-t border-indigo-900">
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase">Registered Mobile</span>
                  <span className="font-medium text-slate-200">{profile.mobile}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block text-[9px] uppercase">State / PIN</span>
                  <span className="font-medium text-slate-200">
                    {profile.state} - {profile.pinCode}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={handleDownloadCard}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{downloadSuccess ? 'Downloaded!' : 'Download Card'}</span>
              </button>
              <button
                onClick={handlePrintCard}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-slate-200"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>
            </div>
          </div>

          {/* Linked Records Column */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">ABDM Linked Health Records</h3>
                <p className="text-xs text-slate-500">Secured via National Health Authority consent framework</p>
              </div>

              <button
                onClick={() => setShowAddRecordModal(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Link Record</span>
              </button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
              {profile.linkedRecords.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 space-y-1">
                  <p className="font-medium text-slate-600">No medical records linked to this ABHA yet</p>
                  <p className="text-slate-400">Click &quot;Link Record&quot; to attach verified prescriptions or lab reports.</p>
                </div>
              ) : (
                profile.linkedRecords.map((rec) => (
                  <div key={rec.id} className="p-3.5 hover:bg-slate-50 transition-colors flex items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2 rounded-lg shrink-0 ${
                          rec.type === 'Prescription'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : rec.type === 'Lab Report'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        <FileText className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-xs">{rec.title}</h4>
                        <p className="text-[11px] text-slate-500">
                          {rec.hospital} • {rec.date}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium border border-slate-200">
                        {rec.type}
                      </span>
                      <button
                        onClick={() => handleDeleteLinkedRecord(rec.id)}
                        className="text-xs text-rose-500 hover:text-rose-700 p-1 rounded hover:bg-rose-50 cursor-pointer"
                        title="Remove linked record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Privacy Note */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-600 space-y-1">
              <div className="flex items-center gap-2 font-bold text-slate-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Consent-Driven Data Access</span>
              </div>
              <p className="leading-relaxed text-[11px]">
                No healthcare provider can view your medical records without explicit OTP authorization sent to your phone.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Add Record Modal */}
      {showAddRecordModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-5 shadow-xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-1">Link Healthcare Record to ABHA</h3>
            <p className="text-xs text-slate-500 mb-4">
              Add a prescription, pathology report, or vaccine record
            </p>

            <form onSubmit={handleAddRecord} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Record Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ultrasound Abdomen / Cardiology ECG"
                  value={newRecordTitle}
                  onChange={(e) => setNewRecordTitle(e.target.value)}
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:bg-white focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Hospital / Diagnostic Centre
                </label>
                <input
                  type="text"
                  placeholder="e.g. District Civil Hospital / Lab Name"
                  value={newRecordHospital}
                  onChange={(e) => setNewRecordHospital(e.target.value)}
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:bg-white focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Record Type</label>
                <select
                  value={newRecordType}
                  onChange={(e) => setNewRecordType(e.target.value as any)}
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:bg-white focus:border-indigo-600"
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
                  className="flex-1 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs cursor-pointer"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
