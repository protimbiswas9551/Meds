import React, { useState, useMemo } from 'react';
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
  ExternalLink,
  ShieldCheck,
  Navigation,
  ArrowUpDown,
} from 'lucide-react';
import { BLOOD_STOCKS } from '../../data/mockData';
import { BloodStockRecord } from '../../types';
import { calculateDistanceKm, formatDistance, getCoordinatesForCity, getProximityTag } from '../../utils/geoUtils';

interface BloodBankNetworkProps {
  selectedCity?: string;
}

export const BloodBankNetwork: React.FC<BloodBankNetworkProps> = ({ selectedCity = 'New Delhi' }) => {
  const [selectedGroup, setSelectedGroup] = useState<string>('All');
  const [searchCity, setSearchCity] = useState('');
  const [sortBy, setSortBy] = useState<'proximity' | 'stock_selected' | 'stock_total' | 'name'>('proximity');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showDonorModal, setShowDonorModal] = useState(false);
  const [donorRegistered, setDonorRegistered] = useState(false);
  const [requestBroadcasted, setRequestBroadcasted] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states
  const [patientName, setPatientName] = useState('');
  const [neededGroup, setNeededGroup] = useState('O+');
  const [neededHospital, setNeededHospital] = useState('');
  const [unitsNeeded, setUnitsNeeded] = useState('2');

  const bloodGroups = ['All', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

  const userCoords = useMemo(() => {
    return getCoordinatesForCity(selectedCity || 'New Delhi');
  }, [selectedCity]);

  // Compute distances & sort
  const processedBanks = useMemo(() => {
    const list = BLOOD_STOCKS.map((bank) => {
      let distanceKm = 0;
      if (bank.lat && bank.lng) {
        distanceKm = calculateDistanceKm(userCoords.lat, userCoords.lng, bank.lat, bank.lng);
      } else {
        const bankCoords = getCoordinatesForCity(bank.city);
        distanceKm = calculateDistanceKm(userCoords.lat, userCoords.lng, bankCoords.lat, bankCoords.lng);
      }

      const totalUnits = Object.values(bank.stocks).reduce((sum, count) => sum + count, 0);
      const selectedGroupUnits =
        selectedGroup !== 'All' ? bank.stocks[selectedGroup as keyof typeof bank.stocks] || 0 : totalUnits;

      return {
        ...bank,
        calculatedDistanceKm: distanceKm,
        totalUnits,
        selectedGroupUnits,
      };
    });

    // Filtering
    const filtered = list.filter((bank) => {
      if (!searchCity) return true;
      const q = searchCity.toLowerCase();
      return (
        bank.city.toLowerCase().includes(q) ||
        bank.hospitalName.toLowerCase().includes(q) ||
        bank.state.toLowerCase().includes(q) ||
        (bank.address && bank.address.toLowerCase().includes(q))
      );
    });

    // Sorting
    filtered.sort((a, b) => {
      if (sortBy === 'proximity') {
        return a.calculatedDistanceKm - b.calculatedDistanceKm;
      }
      if (sortBy === 'stock_selected') {
        return b.selectedGroupUnits - a.selectedGroupUnits;
      }
      if (sortBy === 'stock_total') {
        return b.totalUnits - a.totalUnits;
      }
      if (sortBy === 'name') {
        return a.hospitalName.localeCompare(b.hospitalName);
      }
      return 0;
    });

    return filtered;
  }, [userCoords, searchCity, selectedGroup, sortBy]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleBroadcastRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setRequestBroadcasted(true);
    setTimeout(() => {
      setRequestBroadcasted(false);
      setShowRequestModal(false);
      showToast(`Urgent SOS request for ${unitsNeeded} units of ${neededGroup} blood broadcasted to local network.`);
      setPatientName('');
      setNeededHospital('');
    }, 1000);
  };

  const handleRegisterDonor = (e: React.FormEvent) => {
    e.preventDefault();
    setDonorRegistered(true);
    setTimeout(() => {
      setDonorRegistered(false);
      setShowDonorModal(false);
      showToast('Registration submitted for National Voluntary Blood Donor Registry (e-RaktKosh).');
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-lg shadow-lg border border-slate-700 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Banner */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <Droplet className="w-5 h-5 text-rose-600" />
            <h1 className="text-xl font-bold text-slate-900">
              e-RaktKosh Blood Availability & Donor Network
            </h1>
            <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-medium border border-indigo-100 flex items-center gap-1">
              <Navigation className="w-3 h-3 text-indigo-600" />
              <span>Reference: {selectedCity}</span>
            </span>
          </div>
          <p className="text-xs text-slate-600">
            Real-time blood stock across government blood transfusion centres and voluntary donor coordination.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <a
            href="https://www.eraktkosh.in"
            target="_blank"
            rel="noreferrer"
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200"
          >
            <span>Official e-RaktKosh</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-600" />
          </a>
          <button
            onClick={() => setShowRequestModal(true)}
            className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Emergency Request</span>
          </button>
          <button
            onClick={() => setShowDonorModal(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Register Donor</span>
          </button>
        </div>
      </div>

      {/* Filter & Sorting Controls */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 sm:p-5 space-y-3.5">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-slate-900 block">Blood Inventory & Proximity Search</span>
            <span className="text-[11px] text-slate-500">
              Filter by group, location, and sort nearest transfusion centres to {selectedCity}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Sorting Dropdown */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2 py-1.5 rounded-lg">
              <ArrowUpDown className="w-3.5 h-3.5 text-rose-600 shrink-0" />
              <span className="text-[11px] text-slate-500 font-medium">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-xs bg-transparent text-slate-800 font-medium focus:outline-hidden cursor-pointer"
              >
                <option value="proximity">Proximity (Nearest First)</option>
                <option value="stock_selected">
                  {selectedGroup === 'All' ? 'Highest Stock' : `Highest ${selectedGroup} Stock`}
                </option>
                <option value="stock_total">Highest Total Inventory</option>
                <option value="name">Center Name (A-Z)</option>
              </select>
            </div>

            {/* City / Hospital Search */}
            <div className="relative w-full sm:w-60">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search hospital or area..."
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:bg-white focus:border-indigo-600"
              />
            </div>
          </div>
        </div>

        {/* Blood Group Filter Chips */}
        <div className="pt-2 border-t border-slate-100 flex items-center gap-2 flex-wrap">
          <span className="text-[11px] text-slate-500 font-medium mr-1">Group:</span>
          {bloodGroups.map((grp) => (
            <button
              key={grp}
              onClick={() => setSelectedGroup(grp)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer border ${
                selectedGroup === grp
                  ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              {grp === 'All' ? 'All Groups' : grp}
            </button>
          ))}
        </div>
      </div>

      {/* Blood Bank Live Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {processedBanks.length === 0 ? (
          <div className="col-span-2 p-12 text-center bg-white rounded-xl border border-slate-200">
            <Droplet className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <h3 className="text-xs font-semibold text-slate-700">No Blood Banks Found</h3>
            <p className="text-xs text-slate-500">Try changing your search keywords or blood group filter.</p>
          </div>
        ) : (
          processedBanks.map((bank) => {
            const proxTag = getProximityTag(bank.calculatedDistanceKm);

            return (
              <div
                key={bank.id}
                className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 sm:p-5 flex flex-col justify-between hover:border-slate-300 transition-colors space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded border border-slate-200">
                          {bank.type}
                        </span>
                        
                        {/* Proximity Distance Badge */}
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border flex items-center gap-1 ${proxTag.styleClass}`}>
                          <Navigation className="w-2.5 h-2.5" />
                          <span>{formatDistance(bank.calculatedDistanceKm)}</span>
                        </span>
                      </div>

                      <h2 className="font-bold text-slate-900 text-sm mt-1">{bank.hospitalName}</h2>
                      
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>
                          {bank.address ? `${bank.address}, ` : ''}{bank.city}, {bank.state}
                          {bank.pincode ? ` - ${bank.pincode}` : ''}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-slate-400 block">{bank.lastUpdated}</span>
                      <span className="text-[11px] font-bold text-slate-700 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded mt-1 inline-block">
                        Total: {bank.totalUnits} Units
                      </span>
                    </div>
                  </div>

                  {/* Group Units Badges Grid */}
                  <div className="grid grid-cols-4 gap-2 pt-3">
                    {(Object.entries(bank.stocks) as [string, number][]).map(([group, count]) => {
                      const isHighlighted = selectedGroup === 'All' || selectedGroup === group;
                      return (
                        <div
                          key={group}
                          className={`p-2 rounded-lg text-center border transition-all ${
                            isHighlighted
                              ? count > 5
                                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900 font-semibold'
                                : 'bg-rose-50/70 border-rose-200 text-rose-900 font-semibold'
                              : 'bg-slate-50 border-slate-100 text-slate-400 opacity-60'
                          }`}
                        >
                          <span className="text-[10px] font-bold block">{group}</span>
                          <span className="text-sm font-bold">{count}</span>
                          <span className="text-[9px] block opacity-75">units</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                  <a
                    href={`tel:${bank.contact}`}
                    className="text-slate-800 font-medium flex items-center gap-1.5 hover:text-rose-600"
                  >
                    <Phone className="w-3.5 h-3.5 text-rose-600" />
                    <span>{bank.contact}</span>
                  </a>

                  <a
                    href={`tel:${bank.contact}`}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-medium px-3 py-1.5 rounded-lg shadow-xs transition-colors cursor-pointer"
                  >
                    Call Blood Bank
                  </a>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Emergency Request Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-5 sm:p-6 shadow-xl border border-slate-200">
            <h2 className="text-base font-bold text-slate-900 mb-1">Broadcast Urgent Blood Need</h2>
            <p className="text-xs text-slate-500 mb-4">
              Sends urgent notifications to registered blood donors in your area
            </p>

            <form onSubmit={handleBroadcastRequest} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Patient Name</label>
                <input
                  type="text"
                  required
                  placeholder="Enter patient full name"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:bg-white focus:border-rose-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Required Blood Group</label>
                  <select
                    value={neededGroup}
                    onChange={(e) => setNeededGroup(e.target.value)}
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:bg-white focus:border-rose-600"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Units Required</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={unitsNeeded}
                    onChange={(e) => setUnitsNeeded(e.target.value)}
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:bg-white focus:border-rose-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Hospital & Location</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AIIMS Trauma Center, ICU"
                  value={neededHospital}
                  onChange={(e) => setNeededHospital(e.target.value)}
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:bg-white focus:border-rose-600"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  className="flex-1 py-2 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors shadow-xs cursor-pointer"
                >
                  {requestBroadcasted ? 'Broadcasting...' : 'Broadcast SOS'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Donor Registration Modal */}
      {showDonorModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-5 sm:p-6 shadow-xl border border-slate-200">
            <h2 className="text-base font-bold text-slate-900 mb-1">Register as Voluntary Blood Donor</h2>
            <p className="text-xs text-slate-500 mb-4">
              Join the voluntary lifesaver network to support emergency needs
            </p>

            <form onSubmit={handleRegisterDonor} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Enter your full name"
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:bg-white focus:border-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Blood Group</label>
                  <select className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:bg-white focus:border-indigo-600">
                    {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Mobile Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:bg-white focus:border-indigo-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">City / District</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. New Delhi"
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:bg-white focus:border-indigo-600"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDonorModal(false)}
                  className="flex-1 py-2 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs cursor-pointer"
                >
                  {donorRegistered ? 'Submitting...' : 'Register'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
