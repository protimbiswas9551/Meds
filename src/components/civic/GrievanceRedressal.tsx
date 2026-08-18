import React, { useState } from 'react';
import {
  AlertCircle,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  MapPin,
  Camera,
  ThumbsUp,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Send,
} from 'lucide-react';
import { MOCK_GRIEVANCES } from '../../data/mockData';
import { GrievanceTicket } from '../../types';

export const GrievanceRedressal: React.FC = () => {
  const [grievances, setGrievances] = useState<GrievanceTicket[]>(MOCK_GRIEVANCES);
  const [showFileModal, setShowFileModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [expandedTicketId, setExpandedTicketId] = useState<string | null>('GRV-2025-0842');
  const [searchQuery, setSearchQuery] = useState('');

  // New Grievance form fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<GrievanceTicket['category']>('Pothole & Roads');
  const [wardNumber, setWardNumber] = useState('Ward 24, South Zone');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<GrievanceTicket['priority']>('High');
  const [photoSelected, setPhotoSelected] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    'All',
    'Pothole & Roads',
    'Garbage & Sanitation',
    'Water Supply',
    'Electricity & Streetlights',
    'Sewage & Drainage',
    'Public Transport',
  ];

  const handleFileGrievance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const newTicket: GrievanceTicket = {
        id: `GRV-2025-${randomNum}`,
        title: title.trim(),
        category: category,
        department:
          category === 'Pothole & Roads'
            ? 'Public Works Department (PWD)'
            : category === 'Garbage & Sanitation'
            ? 'Municipal Sanitation Wing'
            : category === 'Water Supply'
            ? 'Urban Water Utility / Jal Board'
            : 'Power Distribution & Municipal Lighting',
        state: 'Delhi',
        city: 'New Delhi',
        wardNumber: wardNumber,
        address: address || 'Main Road Junction',
        description: description,
        filedDate: 'Today',
        status: 'Submitted',
        priority: priority,
        assignedOfficer: 'Assigned to Zonal Control Room',
        upvotes: 1,
        updates: [
          {
            timestamp: 'Just Now',
            message: `Grievance registered and assigned tracking ID GRV-2025-${randomNum}. Forwarded to Zonal Executive Engineer.`,
            actor: 'CPGRAMS Auto-Router',
          },
        ],
      };

      setGrievances([newTicket, ...grievances]);
      setExpandedTicketId(newTicket.id);
      setIsSubmitting(false);
      setShowFileModal(false);

      // Reset form
      setTitle('');
      setAddress('');
      setDescription('');
      setPhotoSelected(false);
    }, 800);
  };

  const handleUpvote = (id: string) => {
    setGrievances(
      grievances.map((g) => {
        if (g.id === id) {
          return { ...g, upvotes: g.upvotes + 1 };
        }
        return g;
      })
    );
  };

  const filteredGrievances = grievances.filter((g) => {
    const matchesCat = selectedCategory === 'All' || g.category === selectedCategory;
    const matchesStatus = statusFilter === 'All' || g.status === statusFilter;
    const matchesSearch =
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-linear-to-r from-blue-900 via-slate-900 to-indigo-950 rounded-2xl p-5 sm:p-6 text-white shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-blue-300" /> CPGRAMS & Swachhata Redressal
          </span>
          <span className="text-xs text-slate-300">Centralized Public Grievance Redress and Monitoring</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight mb-2">
          Municipal Grievance Redressal & Live SLA Tracking
        </h1>
        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-3xl">
          Report civic infrastructure issues directly to your municipal ward officer. Every ticket is logged
          with an immutable tracking ID, bound to statutory citizen service SLAs.
        </p>

        <div className="mt-4">
          <button
            onClick={() => setShowFileModal(true)}
            className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>File New Citizen Grievance</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-5">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by ticket ID (e.g. GRV-2025-0842), locality, or issue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:border-blue-600 focus:bg-white"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 rounded-xl px-3 py-2 focus:outline-hidden"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 rounded-xl px-3 py-2 focus:outline-hidden"
            >
              <option value="All">All Statuses</option>
              <option value="Submitted">Submitted</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grievances List */}
      <div className="space-y-4">
        {filteredGrievances.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500 text-sm">
            No grievances found matching your search.
          </div>
        ) : (
          filteredGrievances.map((ticket) => {
            const isExpanded = expandedTicketId === ticket.id;
            return (
              <div
                key={ticket.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden transition-all hover:border-slate-300"
              >
                {/* Header Row */}
                <div className="p-4 sm:p-5">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-bold text-xs bg-slate-100 text-slate-800 px-2 py-0.5 rounded-md border border-slate-200">
                          {ticket.id}
                        </span>
                        <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
                          {ticket.category}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                            ticket.priority === 'Emergency'
                              ? 'bg-rose-100 text-rose-800 border-rose-200'
                              : ticket.priority === 'High'
                              ? 'bg-amber-100 text-amber-800 border-amber-200'
                              : 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          {ticket.priority} Priority
                        </span>
                        <span
                          className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                            ticket.status === 'Resolved'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-amber-50 text-amber-800 border-amber-200 animate-pulse'
                          }`}
                        >
                          {ticket.status}
                        </span>
                      </div>

                      <h3 className="font-bold text-slate-900 text-sm sm:text-base">{ticket.title}</h3>

                      <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {ticket.address}, {ticket.wardNumber}
                        </span>
                        <span>•</span>
                        <span>Filed on: {ticket.filedDate}</span>
                        <span>•</span>
                        <span className="font-medium text-slate-700">{ticket.department}</span>
                      </div>
                    </div>

                    {/* Right side Upvote & Expand */}
                    <div className="flex items-center gap-2.5 shrink-0">
                      <button
                        onClick={() => handleUpvote(ticket.id)}
                        className="flex items-center gap-1.5 bg-slate-50 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                        title="Upvote to raise urgency"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>{ticket.upvotes} Affected</span>
                      </button>

                      <button
                        onClick={() => setExpandedTicketId(isExpanded ? null : ticket.id)}
                        className="p-2 text-slate-400 hover:text-slate-700 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer transition-colors"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Details & Stepper */}
                {isExpanded && (
                  <div className="border-t border-slate-100 bg-slate-50/60 p-4 sm:p-6 space-y-5">
                    {/* Description */}
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        Citizen Problem Description
                      </span>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-white p-3.5 rounded-xl border border-slate-200">
                        {ticket.description}
                      </p>
                    </div>

                    {/* Resolution Progress Stepper */}
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-3">
                        Redressal Progress Stepper
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                        {['Submitted', 'Assigned', 'In Progress', 'Resolved'].map((step, idx) => {
                          const statusOrder = ['Submitted', 'Assigned', 'In Progress', 'Resolved'];
                          const currentIdx = statusOrder.indexOf(ticket.status);
                          const isComplete = currentIdx >= idx;
                          const isCurrent = ticket.status === step;

                          return (
                            <div
                              key={step}
                              className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
                                isComplete
                                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                                  : 'bg-white border-slate-200 text-slate-400'
                              }`}
                            >
                              <div
                                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                  isComplete ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                                }`}
                              >
                                {isComplete ? '✓' : idx + 1}
                              </div>
                              <span>{step}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Timeline Activity Log */}
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                        Official Action Log & Timeline
                      </span>
                      <div className="space-y-2">
                        {ticket.updates.map((up, i) => (
                          <div
                            key={i}
                            className="bg-white p-3 rounded-xl border border-slate-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-1"
                          >
                            <div>
                              <span className="font-bold text-slate-800">{up.actor}: </span>
                              <span className="text-slate-600">{up.message}</span>
                            </div>
                            <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                              {up.timestamp}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {ticket.assignedOfficer && (
                      <div className="text-xs text-slate-500 flex items-center gap-1.5 pt-1">
                        <ShieldCheck className="w-4 h-4 text-blue-600" />
                        <span>Nodal Officer in Charge: <strong className="text-slate-800">{ticket.assignedOfficer}</strong></span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* File Grievance Modal */}
      {showFileModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-slate-900 mb-1">File Official Municipal Grievance</h3>
            <p className="text-xs text-slate-500 mb-4">
              Registered under CPGRAMS public grievance redressal rules
            </p>

            <form onSubmit={handleFileGrievance} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Issue Title / Subject
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Deep pothole on Main Market Road opposite Bus Stop"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-blue-600"
                  >
                    {categories.filter((c) => c !== 'All').map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Urgency Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-blue-600"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Ward / Zone</label>
                  <input
                    type="text"
                    value={wardNumber}
                    onChange={(e) => setWardNumber(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Exact Landmark / Address</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Near Pillar 42, Lala Lajpat Rai Marg"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Detailed Description & Public Impact
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Explain the severity, risk to commuters/residents, and duration of the problem..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-blue-600"
                />
              </div>

              {/* Photo Upload simulation */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Attach Geo-tagged Site Photo
                </label>
                <button
                  type="button"
                  onClick={() => setPhotoSelected(!photoSelected)}
                  className={`w-full p-3 border-2 border-dashed rounded-xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                    photoSelected
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                      : 'border-slate-300 hover:border-slate-400 bg-slate-50 text-slate-600'
                  }`}
                >
                  <Camera className="w-4 h-4" />
                  <span>
                    {photoSelected ? '✓ Site Photo Geo-Tagged & Attached' : 'Click to Upload / Capture Photo'}
                  </span>
                </button>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowFileModal(false)}
                  className="flex-1 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs"
                >
                  {isSubmitting ? 'Submitting to Portal...' : 'Submit Grievance'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
