import React, { useState } from 'react';
import {
  FolderLock,
  Search,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  FileText,
  CreditCard,
  Building,
  Sparkles,
  QrCode,
} from 'lucide-react';

export const CitizenDocumentsHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'digilocker' | 'ration' | 'voter' | 'aadhaar'>('digilocker');
  const [rationNumber, setRationNumber] = useState('071004928192');
  const [rationSearched, setRationSearched] = useState(false);
  const [epicNumber, setEpicNumber] = useState('ABC1294821');
  const [epicSearched, setEpicSearched] = useState(false);

  const digiLockerDocs = [
    { title: 'Aadhaar Card (UIDAI Verified)', id: 'XXXX-XXXX-5521', date: 'Issued', status: 'Active' },
    { title: 'Driving Licence (MoRTH)', id: 'DL-04201900842', date: 'Valid till 2038', status: 'Active' },
    { title: 'Vehicle Registration Certificate (RC)', id: 'DL-01-AB-4829', date: 'Valid', status: 'Active' },
    { title: 'COVID-19 Vaccination Certificate', id: 'Beneficiary #918281', date: 'Final Dose', status: 'Verified' },
    { title: 'PAN Verification Record (Income Tax)', id: 'ABCPS1294E', date: 'Linked', status: 'Active' },
  ];

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-linear-to-r from-purple-900 via-indigo-950 to-slate-900 rounded-2xl p-5 sm:p-6 text-white shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-purple-500/20 text-purple-300 border border-purple-400/30 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-purple-300" /> Digital Public Infrastructure (DPI)
          </span>
          <span className="text-xs text-slate-300">National Citizen Identity & Document Locker</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight mb-2">
          Citizen Documents & Public Verification Hub
        </h1>
        <p className="text-xs sm:text-sm text-purple-100 leading-relaxed max-w-3xl">
          Direct access to legally valid digital documents under Rule 9A of IT Rules 2016, Ration Card allocation
          checks, and Voter ID status verification.
        </p>
      </div>

      {/* 4-Tab Navigation */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <button
          onClick={() => setActiveTab('digilocker')}
          className={`py-3 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer border ${
            activeTab === 'digilocker'
              ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <FolderLock className="w-4 h-4" />
          <span>DigiLocker Hub</span>
        </button>

        <button
          onClick={() => setActiveTab('ration')}
          className={`py-3 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer border ${
            activeTab === 'ration'
              ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Ration Card Check</span>
        </button>

        <button
          onClick={() => setActiveTab('voter')}
          className={`py-3 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer border ${
            activeTab === 'voter'
              ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Voter ID (EPIC)</span>
        </button>

        <button
          onClick={() => setActiveTab('aadhaar')}
          className={`py-3 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer border ${
            activeTab === 'aadhaar'
              ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Aadhaar Seva Kendra</span>
        </button>
      </div>

      {/* Tab 1: DigiLocker */}
      {activeTab === 'digilocker' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-base text-slate-900">Your Issued Legal Digital Certificates</h3>
                <p className="text-xs text-slate-500">
                  Equivalent to original physical documents under Rule 9A of Information Technology Rules
                </p>
              </div>

              <a
                href="https://www.digilocker.gov.in"
                target="_blank"
                rel="noreferrer"
                className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <span>Open DigiLocker App</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="divide-y divide-slate-100">
              {digiLockerDocs.map((doc, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-50 text-purple-700 rounded-lg">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{doc.title}</div>
                      <div className="text-slate-500 font-mono text-[11px]">{doc.id}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-md border border-emerald-200">
                      {doc.status}
                    </span>
                    <button
                      onClick={() => alert(`Opening certified digital copy of ${doc.title}`)}
                      className="text-blue-600 hover:text-blue-800 font-semibold px-2 py-1 hover:bg-blue-50 rounded-md transition-colors"
                    >
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Ration Card Lookup */}
      {activeTab === 'ration' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="max-w-md space-y-3">
            <h3 className="font-bold text-base text-slate-900">National Food Security Act (NFSA) Card Check</h3>
            <p className="text-xs text-slate-500">
              Verify monthly subsidized/free grain quota allocation (PMGKAY)
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                value={rationNumber}
                onChange={(e) => setRationNumber(e.target.value)}
                placeholder="Enter 12-digit Ration Card Number"
                className="flex-1 text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono font-bold focus:outline-hidden"
              />
              <button
                onClick={() => setRationSearched(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Check Quota
              </button>
            </div>
          </div>

          {rationSearched && (
            <div className="mt-4 p-4 rounded-xl bg-purple-50 border border-purple-200 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-purple-950">
                <span>Ration Card Holder: Rajesh Kumar Sharma</span>
                <span className="bg-emerald-600 text-white text-[10px] px-2 py-0.5 rounded-full">
                  NFSA Priority Household (PHH)
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="bg-white p-3 rounded-lg border border-purple-100 text-center">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Wheat</span>
                  <span className="text-base font-black text-slate-900">15 Kg</span>
                  <span className="text-[10px] text-emerald-700 block font-bold">₹0 (Free PMGKAY)</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-purple-100 text-center">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Rice</span>
                  <span className="text-base font-black text-slate-900">10 Kg</span>
                  <span className="text-[10px] text-emerald-700 block font-bold">₹0 (Free PMGKAY)</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-purple-100 text-center">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Sugar</span>
                  <span className="text-base font-black text-slate-900">1 Kg</span>
                  <span className="text-[10px] text-purple-700 block font-bold">₹13.50/Kg</span>
                </div>
              </div>
              <p className="text-[11px] text-purple-900/80">
                Assigned FPS Shop: Fair Price Shop #4812, Near Shivaji Market, Lajpat Nagar Ward.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Voter ID */}
      {activeTab === 'voter' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="max-w-md space-y-3">
            <h3 className="font-bold text-base text-slate-900">Election Commission of India (ECI) Voter Search</h3>
            <p className="text-xs text-slate-500">
              Verify your polling booth, assembly constituency, and electoral roll entry
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                value={epicNumber}
                onChange={(e) => setEpicNumber(e.target.value)}
                placeholder="Enter 10-character EPIC Number (e.g. ABC1234567)"
                className="flex-1 text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono font-bold focus:outline-hidden"
              />
              <button
                onClick={() => setEpicSearched(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Search Roll
              </button>
            </div>
          </div>

          {epicSearched && (
            <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-700">
              <div className="font-bold text-slate-900 text-sm">Voter Name: Rajesh Kumar Sharma</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                <div>Assembly Constituency: <strong>42 - Kasturba Nagar</strong></div>
                <div>Parliamentary Constituency: <strong>New Delhi (04)</strong></div>
                <div>Polling Station: <strong>Govt Boys Senior Secondary School, Room 4</strong></div>
                <div>Part Number & Serial: <strong>Part 84, Sl No. 412</strong></div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Aadhaar Seva Kendra */}
      {activeTab === 'aadhaar' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
          <h3 className="font-bold text-base text-slate-900">Aadhaar Update & Seva Kendra Locator</h3>
          <p className="text-xs text-slate-500">
            Book appointment for biometric update (fingerprint/iris/photo), address change, or mobile link
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900 text-xs">UIDAI ASK Centre - CP Metro</h4>
              <p className="text-xs text-slate-500">Shop 14, Metro Concourse, Connaught Place</p>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md">
                Walk-ins & Online Booking Open
              </span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900 text-xs">Head Post Office Aadhaar Center</h4>
              <p className="text-xs text-slate-500">Main Post Office Building, Gole Dak Khana</p>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md">
                9:30 AM - 5:30 PM (Mon-Sat)
              </span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900 text-xs">Bank of Baroda Aadhaar Wing</h4>
              <p className="text-xs text-slate-500">Lajpat Nagar 2 Branch</p>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md">
                Free Mandatory Child Updates
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
