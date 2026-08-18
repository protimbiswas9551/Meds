import React, { useState } from 'react';
import {
  Droplet,
  Search,
  MapPin,
  Phone,
  Clock,
  Heart,
  Share2,
  Plus,
  CheckCircle2,
  AlertTriangle,
  UserPlus,
  Sparkles,
} from 'lucide-react';
import { BLOOD_STOCKS } from '../../data/mockData';
import { BloodStockRecord } from '../../types';

export const BloodBankNetwork: React.FC = () => {
  const [selectedGroup, setSelectedGroup] = useState<string>('All');
  const [searchCity, setSearchCity] = useState('');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showDonorModal, setShowDonorModal] = useState(false);
  const [donorRegistered, setDonorRegistered] = useState(false);
  const [requestBroadcasted, setRequestBroadcasted] = useState(false);

  // Form states
  const [patientName, setPatientName] = useState('');
  const [neededGroup, setNeededGroup] = useState('O+');
  const [neededHospital, setNeededHospital] = useState('');
  const [unitsNeeded, setUnitsNeeded] = useState('2');

  const bloodGroups = ['All', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

  const filteredBanks = BLOOD_STOCKS.filter((bank) => {
    const matchesCity =
      !searchCity ||
      bank.city.toLowerCase().includes(searchCity.toLowerCase()) ||
      bank.hospitalName.toLowerCase().includes(searchCity.toLowerCase());
    return matchesCity;
  });

  const handleBroadcastRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setRequestBroadcasted(true);
    setTimeout(() => {
      setRequestBroadcasted(false);
      setShowRequestModal(false);
      alert(`Urgent Blood Request broadcasted to 140+ registered voluntary donors in your district.`);
    }, 1500);
  };

  const handleRegisterDonor = (e: React.FormEvent) => {
    e.preventDefault();
    setDonorRegistered(true);
    setTimeout(() => {
      setDonorRegistered(false);
      setShowDonorModal(false);
      alert('Congratulations! You are now registered in the National Voluntary Blood Donor Registry (e-Raktkosh).');
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-linear-to-r from-rose-900 via-red-900 to-slate-900 rounded-2xl p-5 sm:p-6 text-white shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-rose-500/20 text-rose-300 border border-rose-400/30 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-rose-300" /> e-Raktkosh Digital Network
          </span>
          <span className="text-xs text-slate-300">Centralized Blood Bank Management System</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight mb-2">
          Live Blood Stock Availability & Donor Network
        </h1>
        <p className="text-xs sm:text-sm text-rose-100 leading-relaxed max-w-3xl">
          Check live units of whole blood and packed red blood cells across government blood banks. Request emergency
          units or register as a voluntary lifesaver donor.
        </p>

        <div className="flex flex-wrap gap-2.5 mt-4">
          <button
            onClick={() => setShowRequestModal(true)}
            className="bg-rose-500 hover:bg-rose-600 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs sm:text-sm transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            <AlertTriangle className="w-4 h-4 text-slate-950" />
            <span>Broadcast Urgent Blood Need</span>
          </button>
          <button
            onClick={() => setShowDonorModal(true)}
            className="bg-white/10 hover:bg-white/20 text-white font-semibold border border-white/20 px-4 py-2 rounded-xl text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer"
          >
            <UserPlus className="w-4 h-4 text-rose-300" />
            <span>Register as Voluntary Donor</span>
          </button>
        </div>
      </div>

      {/* Blood Group Filter Chips */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div>
            <span className="text-xs font-bold text-slate-900 block">Filter by Required Blood Group</span>
            <span className="text-[11px] text-slate-500">Select specific blood type to view live units</span>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search blood bank or city..."
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:border-rose-600"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {bloodGroups.map((grp) => (
            <button
              key={grp}
              onClick={() => setSelectedGroup(grp)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedGroup === grp
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              {grp === 'All' ? 'All Blood Groups' : grp}
            </button>
          ))}
        </div>
      </div>

      {/* Blood Bank Live Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredBanks.map((bank) => (
          <div
            key={bank.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-5 flex flex-col justify-between hover:border-rose-300 transition-all space-y-4"
          >
            <div>
              <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="space-y-0.5">
                  <span className="text-[10px] bg-rose-50 text-rose-700 font-bold px-2 py-0.5 rounded-md border border-rose-200">
                    {bank.type}
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base mt-1">{bank.hospitalName}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{bank.city}, {bank.state}</span>
                  </div>
                </div>

                <div className="text-right shrink-0 text-[10px] text-slate-400">
                  Updated {bank.lastUpdated}
                </div>
              </div>

              {/* Group Units Badges Grid */}
              <div className="grid grid-cols-4 gap-2 pt-3">
                {Object.entries(bank.stocks).map(([group, count]) => {
                  const isHighlighted = selectedGroup === 'All' || selectedGroup === group;
                  return (
                    <div
                      key={group}
                      className={`p-2 rounded-xl text-center border transition-all ${
                        isHighlighted
                          ? count > 5
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                            : 'bg-rose-50 border-rose-200 text-rose-900'
                          : 'bg-slate-50 border-slate-100 text-slate-400 opacity-60'
                      }`}
                    >
                      <span className="text-[10px] font-bold block">{group}</span>
                      <span className="text-sm font-black">{count}</span>
                      <span className="text-[9px] block opacity-75">units</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
              <a
                href={`tel:${bank.contact}`}
                className="text-slate-800 font-semibold flex items-center gap-1.5 hover:text-rose-600"
              >
                <Phone className="w-3.5 h-3.5 text-rose-600" />
                <span>{bank.contact}</span>
              </a>

              <button
                onClick={() => alert(`Calling ${bank.hospitalName} Blood Bank for reservation...`)}
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-3 py-1.5 rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                Reserve Unit
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Emergency Request Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">Broadcast Urgent Blood Requirement</h3>
            <p className="text-xs text-slate-500 mb-4">
              Sends urgent notifications to nearby voluntary registered blood donors
            </p>

            <form onSubmit={handleBroadcastRequest} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Patient Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Meera Devi"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-rose-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Required Blood Group</label>
                  <select
                    value={neededGroup}
                    onChange={(e) => setNeededGroup(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-rose-600"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Units Required</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={unitsNeeded}
                    onChange={(e) => setUnitsNeeded(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-rose-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Hospital & City</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AIIMS Trauma Center, ICU Bed 14"
                  value={neededHospital}
                  onChange={(e) => setNeededHospital(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-rose-600"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  className="flex-1 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors shadow-xs"
                >
                  {requestBroadcasted ? 'Broadcasting...' : 'Broadcast SOS Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Donor Registration Modal */}
      {showDonorModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">Register as Voluntary Blood Donor</h3>
            <p className="text-xs text-slate-500 mb-4">
              Help save lives during emergencies in your city
            </p>

            <form onSubmit={handleRegisterDonor} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikramaditya Singh"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-rose-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Blood Group</label>
                  <select className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-rose-600">
                    {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Mobile</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-rose-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">City / Pincode</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. New Delhi - 110001"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-rose-600"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDonorModal(false)}
                  className="flex-1 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors shadow-xs"
                >
                  {donorRegistered ? 'Registering...' : 'Complete Registration'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
