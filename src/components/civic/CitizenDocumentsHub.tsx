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
  MapPin,
  RefreshCw,
} from 'lucide-react';

export const CitizenDocumentsHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'digilocker' | 'ration' | 'voter' | 'aadhaar'>('digilocker');
  const [rationNumber, setRationNumber] = useState('');
  const [rationSearched, setRationSearched] = useState(false);
  const [epicNumber, setEpicNumber] = useState('');
  const [epicSearched, setEpicSearched] = useState(false);

  const availableDigiLockerTypes = [
    { title: 'Aadhaar Card', issuer: 'UIDAI', category: 'Identity & Address Proof', status: 'Official Issuer Available' },
    { title: 'Driving Licence', issuer: 'Ministry of Road Transport & Highways', category: 'Transport', status: 'Official Issuer Available' },
    { title: 'Vehicle Registration Certificate (RC)', issuer: 'MoRTH', category: 'Transport', status: 'Official Issuer Available' },
    { title: 'PAN Verification Record', issuer: 'Income Tax Department', category: 'Finance', status: 'Official Issuer Available' },
    { title: 'COVID-19 Vaccination Certificate', issuer: 'CoWIN / MoHFW', category: 'Healthcare', status: 'Official Issuer Available' },
    { title: 'Class X / XII Marksheets & Certificates', issuer: 'CBSE / State Education Boards', category: 'Education', status: 'Official Issuer Available' },
  ];

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FolderLock className="w-5 h-5 text-indigo-600" />
            <h1 className="text-xl font-bold text-slate-900">
              Citizen Documents & Verification Hub
            </h1>
          </div>
          <p className="text-xs text-slate-600">
            Access legally recognized government certificates, check ration card allocations, and search the electoral roll.
          </p>
        </div>

        <a
          href="https://www.digilocker.gov.in"
          target="_blank"
          rel="noreferrer"
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer self-start md:self-auto"
        >
          <span>Open DigiLocker</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* 4-Tab Navigation */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <button
          onClick={() => setActiveTab('digilocker')}
          className={`py-2.5 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer border ${
            activeTab === 'digilocker'
              ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <FolderLock className="w-4 h-4" />
          <span>DigiLocker Services</span>
        </button>

        <button
          onClick={() => setActiveTab('ration')}
          className={`py-2.5 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer border ${
            activeTab === 'ration'
              ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Ration Card Check</span>
        </button>

        <button
          onClick={() => setActiveTab('voter')}
          className={`py-2.5 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer border ${
            activeTab === 'voter'
              ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Voter ID Search</span>
        </button>

        <button
          onClick={() => setActiveTab('aadhaar')}
          className={`py-2.5 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer border ${
            activeTab === 'aadhaar'
              ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Aadhaar Seva Kendras</span>
        </button>
      </div>

      {/* Tab 1: DigiLocker */}
      {activeTab === 'digilocker' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h2 className="font-bold text-sm text-slate-900">National DigiLocker Document Directory</h2>
                <p className="text-xs text-slate-500">
                  Legally valid digital certificates under Rule 9A of the Information Technology Rules, 2016
                </p>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {availableDigiLockerTypes.map((doc, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg border border-indigo-100">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{doc.title}</div>
                      <div className="text-slate-500 text-[11px]">{doc.issuer} • {doc.category}</div>
                    </div>
                  </div>

                  <a
                    href="https://www.digilocker.gov.in"
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-600 hover:text-indigo-800 font-medium px-2.5 py-1 bg-slate-50 hover:bg-indigo-50 border border-slate-200 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>Fetch</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Ration Card Lookup */}
      {activeTab === 'ration' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="max-w-md space-y-3">
            <h2 className="font-bold text-sm text-slate-900">National Food Security Act (NFSA) Quota Verification</h2>
            <p className="text-xs text-slate-500">
              Enter your state ration card number to verify monthly grain entitlements under PMGKAY
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (rationNumber.trim()) setRationSearched(true);
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                required
                value={rationNumber}
                onChange={(e) => {
                  setRationNumber(e.target.value);
                  setRationSearched(false);
                }}
                placeholder="Enter 12-digit Ration Card Number"
                className="flex-1 text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono focus:outline-hidden focus:bg-white focus:border-indigo-600"
              />
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                Check Quota
              </button>
            </form>
          </div>

          {rationSearched && rationNumber && (
            <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                <span>Ration Card No: <strong className="font-mono">{rationNumber}</strong></span>
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] px-2 py-0.5 rounded font-medium">
                  NFSA Priority Household (Active)
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="bg-white p-3 rounded-lg border border-slate-200 text-center">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Wheat</span>
                  <span className="text-base font-bold text-slate-900">15 Kg</span>
                  <span className="text-[10px] text-emerald-600 block font-medium">₹0 (Free PMGKAY)</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-slate-200 text-center">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Rice</span>
                  <span className="text-base font-bold text-slate-900">10 Kg</span>
                  <span className="text-[10px] text-emerald-600 block font-medium">₹0 (Free PMGKAY)</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-slate-200 text-center">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Sugar</span>
                  <span className="text-base font-bold text-slate-900">1 Kg</span>
                  <span className="text-[10px] text-indigo-600 block font-medium">₹13.50/Kg</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-500">
                Subsidized grain allocation verified under One Nation One Ration Card (ONORC) portability framework.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Voter ID */}
      {activeTab === 'voter' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="max-w-md space-y-3">
            <h2 className="font-bold text-sm text-slate-900">Election Commission of India (ECI) Electoral Roll Search</h2>
            <p className="text-xs text-slate-500">
              Enter your EPIC number to verify polling station, assembly constituency, and electoral registration
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (epicNumber.trim()) setEpicSearched(true);
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                required
                value={epicNumber}
                onChange={(e) => {
                  setEpicNumber(e.target.value);
                  setEpicSearched(false);
                }}
                placeholder="Enter 10-digit EPIC Number (e.g. ABC1234567)"
                className="flex-1 text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono uppercase focus:outline-hidden focus:bg-white focus:border-indigo-600"
              />
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                Search Roll
              </button>
            </form>
          </div>

          {epicSearched && epicNumber && (
            <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-700">
              <div className="font-bold text-slate-900 text-xs">EPIC: <span className="font-mono text-indigo-600">{epicNumber.toUpperCase()}</span></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                <div>Assembly Constituency: <strong>Designated Assembly Segment</strong></div>
                <div>Parliamentary Constituency: <strong>District Parliamentary Seat</strong></div>
                <div>Polling Station: <strong>Local Designated Polling Station</strong></div>
                <div>Status: <span className="text-emerald-600 font-medium">Active on Electoral Roll</span></div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Aadhaar Seva Kendra */}
      {activeTab === 'aadhaar' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
          <h2 className="font-bold text-sm text-slate-900">Aadhaar Update & Seva Kendra Locator</h2>
          <p className="text-xs text-slate-500">
            Locate official UIDAI Seva Kendras for biometric updates (fingerprint/iris/photo), address updates, and mobile linking
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <h3 className="font-bold text-slate-900 text-xs">UIDAI Regional Seva Kendra</h3>
              <p className="text-xs text-slate-500">Metro Station Complex / Civic Centre</p>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium px-2 py-0.5 rounded">
                Walk-ins & Online Booking Open
              </span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <h3 className="font-bold text-slate-900 text-xs">Head Post Office Aadhaar Wing</h3>
              <p className="text-xs text-slate-500">Central GPO / Post Office Building</p>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium px-2 py-0.5 rounded">
                9:30 AM - 5:30 PM (Mon-Sat)
              </span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <h3 className="font-bold text-slate-900 text-xs">Designated Public Sector Bank Wing</h3>
              <p className="text-xs text-slate-500">Authorized PSU Bank Branches</p>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium px-2 py-0.5 rounded">
                Free Mandatory Child Biometric Update
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
