import React, { useState, useMemo } from 'react';
import {
  Pill,
  Search,
  CheckCircle2,
  TrendingDown,
  Calculator,
  MapPin,
  Phone,
  Clock,
  Sparkles,
  Filter,
  Plus,
  Trash2,
  Share2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { MEDICINE_DATABASE, JAN_AUSHADHI_STORES } from '../../data/mockData';
import { MedicineComparison } from '../../types';

export const JanAushadhiFinder: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [storeCityFilter, setStoreCityFilter] = useState<string>('All');
  const [prescriptionBasket, setPrescriptionBasket] = useState<MedicineComparison[]>([]);
  const [copiedStore, setCopiedStore] = useState<string | null>(null);

  const categories = [
    'All',
    'Fever & Pain Relief',
    'Diabetes Care',
    'Cardiovascular & Cholesterol',
    'Hypertension & Blood Pressure',
    'Acidity & Gastro',
    'Antibiotics',
    'Allergy & Asthma',
    'Vitamins & Bone Health',
  ];

  // Filter medicines
  const filteredMedicines = useMemo(() => {
    return MEDICINE_DATABASE.filter((med) => {
      const matchesSearch =
        med.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        med.brandedExample.toLowerCase().includes(searchQuery.toLowerCase()) ||
        med.composition.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === 'All' || med.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  // Filter stores
  const filteredStores = useMemo(() => {
    if (storeCityFilter === 'All') return JAN_AUSHADHI_STORES;
    return JAN_AUSHADHI_STORES.filter((s) => s.city.toLowerCase() === storeCityFilter.toLowerCase());
  }, [storeCityFilter]);

  // Calculator sums
  const totalBranded = prescriptionBasket.reduce((sum, item) => sum + item.brandedPrice, 0);
  const totalJanAushadhi = prescriptionBasket.reduce((sum, item) => sum + item.janAushadhiPrice, 0);
  const totalMonthlySavings = totalBranded - totalJanAushadhi;
  const totalYearlySavings = totalMonthlySavings * 12;
  const overallSavingsPercent = totalBranded > 0 ? Math.round((totalMonthlySavings / totalBranded) * 100) : 0;

  const handleAddToBasket = (med: MedicineComparison) => {
    if (!prescriptionBasket.some((item) => item.id === med.id)) {
      setPrescriptionBasket([...prescriptionBasket, med]);
    }
  };

  const handleRemoveFromBasket = (id: string) => {
    setPrescriptionBasket(prescriptionBasket.filter((item) => item.id !== id));
  };

  const handleCopyStore = (name: string, address: string) => {
    navigator.clipboard.writeText(`${name} - ${address}`);
    setCopiedStore(name);
    setTimeout(() => setCopiedStore(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-linear-to-r from-amber-600 via-orange-600 to-amber-700 rounded-2xl p-5 sm:p-6 text-white shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-white/20 text-white border border-white/30 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-200" /> PMBJP Initiative
          </span>
          <span className="text-xs text-amber-100">Pradhan Mantri Bhartiya Janaushadhi Pariyojana</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight mb-2">
          Jan Aushadhi Generic Medicine Price Comparator
        </h1>
        <p className="text-xs sm:text-sm text-amber-50 leading-relaxed max-w-3xl">
          Search branded medicines to discover identical generic alternatives made under strict WHO-GMP
          standards. Direct price control ensures up to 50% to 90% savings for Indian families.
        </p>
      </div>

      {/* Interactive Monthly Prescription Savings Calculator */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/70">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-amber-600" />
              <h2 className="text-base font-bold text-slate-900">Your Monthly Family Medicine Savings Calculator</h2>
            </div>
            <span className="text-xs font-semibold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200">
              {prescriptionBasket.length} Medicines in Monthly Plan
            </span>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Basket items list */}
            <div className="lg:col-span-2 space-y-3">
              <div className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                Monthly Prescription Items
              </div>
              {prescriptionBasket.length === 0 ? (
                <div className="p-6 text-center border-2 border-dashed border-slate-200 rounded-xl text-slate-500 text-xs">
                  No medicines added to calculator. Click &apos;+ Add to Savings Calc&apos; from the table below.
                </div>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {prescriptionBasket.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                    >
                      <div className="space-y-0.5 max-w-xs sm:max-w-md">
                        <div className="font-bold text-slate-900">{item.genericName}</div>
                        <div className="text-slate-500 text-[11px] truncate">
                          Replaces: <span className="font-medium text-slate-700">{item.brandedExample}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 shrink-0">
                        <div className="text-right">
                          <span className="text-slate-400 line-through mr-2">₹{item.brandedPrice.toFixed(1)}</span>
                          <span className="font-bold text-emerald-700 text-sm">₹{item.janAushadhiPrice.toFixed(1)}</span>
                        </div>
                        <button
                          onClick={() => handleRemoveFromBasket(item.id)}
                          className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                          title="Remove from calculator"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Savings Total Box */}
            <div className="bg-linear-to-br from-emerald-50 to-teal-50 rounded-xl p-4 sm:p-5 border border-emerald-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-emerald-900 mb-3">
                  <span>ESTIMATED CITIZEN SAVINGS</span>
                  <span className="bg-emerald-600 text-white text-[10px] px-2 py-0.5 rounded-full">
                    {overallSavingsPercent}% Lower
                  </span>
                </div>

                <div className="space-y-2 mb-4 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Branded Pharmacy Cost:</span>
                    <span className="font-semibold line-through text-slate-500">₹{totalBranded.toFixed(2)}/mo</span>
                  </div>
                  <div className="flex justify-between text-slate-900 font-bold">
                    <span>Jan Aushadhi Generic Cost:</span>
                    <span className="text-emerald-700 font-bold text-sm">₹{totalJanAushadhi.toFixed(2)}/mo</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-emerald-200">
                  <div className="text-[11px] text-emerald-800 font-semibold uppercase">You Save Each Month</div>
                  <div className="text-2xl font-black text-emerald-800 tracking-tight">
                    ₹{totalMonthlySavings.toFixed(2)}
                  </div>
                  <div className="text-xs text-emerald-700 mt-1 font-medium">
                    = ₹{totalYearlySavings.toFixed(0)} Saved per Year
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-emerald-900/80 mt-4 leading-tight">
                *Prices regulated under NPPA & Department of Pharmaceuticals, Govt of India.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Medicine Search & Filter Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-5">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mb-4">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search generic salt (e.g., Paracetamol, Metformin) or Brand (e.g., Dolo, Lipitor, Augmentin)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:border-amber-600 focus:bg-white transition-all"
            />
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 rounded-xl px-3 py-2 focus:outline-hidden focus:border-amber-600 cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Medicine Comparison Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredMedicines.length === 0 ? (
            <div className="col-span-2 p-8 text-center text-slate-500 text-sm">
              No matching generic medicines found for &quot;{searchQuery}&quot;. Try searching by active chemical ingredient or common brand name.
            </div>
          ) : (
            filteredMedicines.map((med) => {
              const inBasket = prescriptionBasket.some((item) => item.id === med.id);
              return (
                <div
                  key={med.id}
                  className="p-4 rounded-xl border border-slate-200 hover:border-amber-300 bg-slate-50/50 hover:bg-white transition-all space-y-3 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                          {med.category}
                        </span>
                        <h3 className="font-bold text-slate-900 text-sm sm:text-base mt-1.5">{med.genericName}</h3>
                        <p className="text-[11px] text-slate-500 font-mono">{med.composition}</p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="inline-flex items-center text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
                          {med.savingsPercentage}% OFF
                        </span>
                      </div>
                    </div>

                    <div className="mt-2 text-xs text-slate-600 space-y-1">
                      <div className="flex items-center justify-between text-[11px] bg-white p-2 rounded-lg border border-slate-100">
                        <span className="text-slate-500">Replaces Branded:</span>
                        <strong className="text-slate-800">{med.brandedExample}</strong>
                      </div>
                      <p className="text-[11px] text-slate-500 italic pt-1">{med.usage}</p>
                    </div>
                  </div>

                  {/* Price Bar & Add Action */}
                  <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between gap-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-slate-400 line-through text-xs">₹{med.brandedPrice.toFixed(1)}</span>
                      <span className="text-base font-black text-emerald-700">₹{med.janAushadhiPrice.toFixed(1)}</span>
                      <span className="text-[10px] text-slate-400">Govt MRP</span>
                    </div>

                    <button
                      onClick={() => handleAddToBasket(med)}
                      disabled={inBasket}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors cursor-pointer ${
                        inBasket
                          ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                          : 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-xs'
                      }`}
                    >
                      {inBasket ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>In Plan</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add to Calc</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Jan Aushadhi Kendra (Store Locator) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-amber-600" />
              <h2 className="text-base font-bold text-slate-900">Locate Nearest Jan Aushadhi Kendra Store</h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              10,000+ PMBJP Kendras operating nationwide with certified pharmacists
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500">Filter City:</span>
            <select
              value={storeCityFilter}
              onChange={(e) => setStoreCityFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 font-semibold text-slate-800 rounded-lg px-2.5 py-1 focus:outline-hidden"
            >
              <option value="All">All Cities</option>
              <option value="New Delhi">New Delhi</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Bengaluru">Bengaluru</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Kolkata">Kolkata</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 p-4 sm:p-5">
          {filteredStores.map((store) => (
            <div
              key={store.id}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-amber-300 transition-all space-y-2 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-1">
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{store.name}</h4>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded-md shrink-0">
                    {store.distance}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1">{store.address}</p>
                <p className="text-xs text-slate-500">
                  {store.city}, {store.state} - {store.pincode}
                </p>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-200/60 text-[11px] text-slate-600">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{store.timing}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <a href={`tel:${store.contact}`} className="text-blue-600 font-semibold hover:underline">
                    {store.contact}
                  </a>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-emerald-700 font-medium">{store.inStockCount}+ Medicines in Stock</span>
                  <button
                    onClick={() => handleCopyStore(store.name, store.address)}
                    className="text-amber-700 font-semibold hover:underline"
                  >
                    {copiedStore === store.name ? 'Copied!' : 'Copy Address'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
