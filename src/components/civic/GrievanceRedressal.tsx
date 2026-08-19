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
  ExternalLink,
  Trash2,
} from 'lucide-react';
import { GrievanceTicket } from '../../types';

export const GrievanceRedressal: React.FC = () => {
  const [grievances, setGrievances] = useState<GrievanceTicket[]>([]);
  const [showFileModal, setShowFileModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [expandedTicketId, setExpandedTicketId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Grievance form fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<GrievanceTicket['category']>('Pothole & Roads');
  const [wardNumber, setWardNumber] = useState('');
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

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

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
        wardNumber: wardNumber.trim() || 'Zonal Ward',
        address: address.trim() || 'Civic Ward Location',
        description: description.trim(),
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
      showToast(`Grievance #${newTicket.id} registered successfully.`);

      // Reset form
      setTitle('');
      setWardNumber('');
      setAddress('');
      setDescription('');
      setPhotoSelected(false);
    }, 600);
  };

  const handleDeleteGrievance = (id: string) => {
    setGrievances(grievances.filter((g) => g.id !== id));
    showToast('Grievance record removed.');
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
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle className="w-5 h-5 text-indigo-600" />
            <h1 className="text-xl font-bold text-slate-900">
              CPGRAMS Municipal Grievance Redressal
            </h1>
          </div>
          <p className="text-xs text-slate-600">
            Lodge municipal and civic complaints with SLA tracking and direct escalation to zonal officers.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <a
            href="https://pgportal.gov.in"
            target="_blank"
            rel="noreferrer"
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200"
          >
            <span>Official CPGRAMS</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-600" />
          </a>
          <button
            onClick={() => setShowFileModal(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>File New Grievance</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by ticket ID, keyword, address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:bg-white focus:border-indigo-600"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-hidden focus:bg-white focus:border-indigo-600"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  Category: {c}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-hidden focus:bg-white focus:border-indigo-600"
            >
              <option value="All">All Statuses</option>
              <option value="Submitted">Submitted</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tickets List */}
      <div className="space-y-3">
        {filteredGrievances.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h2 className="text-sm font-semibold text-slate-800">No Grievance Tickets Found</h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              You have not filed any grievances yet. Click &quot;File New Grievance&quot; to register an issue with the
              municipal corporation or Public Works Department.
            </p>
            <button
              onClick={() => setShowFileModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>File Your First Grievance</span>
            </button>
          </div>
        ) : (
          filteredGrievances.map((ticket) => (
            <div
              key={ticket.id}
              className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 transition-all hover:border-slate-300 space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                    {ticket.id}
                  </span>
                  <span className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                    {ticket.category}
                  </span>
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${
                      ticket.status === 'Resolved'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : ticket.status === 'In Progress'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-blue-50 text-blue-700 border-blue-200'
                    }`}
                  >
                    {ticket.status}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span>Filed: {ticket.filedDate}</span>
                  <button
                    onClick={() => handleDeleteGrievance(ticket.id)}
                    className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                    title="Delete record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div>
                <h2 className="font-bold text-slate-900 text-sm mb-1">{ticket.title}</h2>
                <p className="text-xs text-slate-600 leading-relaxed mb-2">{ticket.description}</p>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    {ticket.address} ({ticket.wardNumber})
                  </span>
                </div>
              </div>

              {/* Expandable updates timeline */}
              {expandedTicketId === ticket.id && ticket.updates && (
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    Official Action Log
                  </div>
                  {ticket.updates.map((upd, idx) => (
                    <div key={idx} className="text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-200 space-y-0.5">
                      <div className="flex items-center justify-between text-slate-500 text-[10px]">
                        <span className="font-medium text-slate-700">{upd.actor}</span>
                        <span>{upd.timestamp}</span>
                      </div>
                      <p className="text-slate-800">{upd.message}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => handleUpvote(ticket.id)}
                  className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-indigo-600 font-medium cursor-pointer"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>Support / Upvote ({ticket.upvotes})</span>
                </button>

                <button
                  onClick={() =>
                    setExpandedTicketId(expandedTicketId === ticket.id ? null : ticket.id)
                  }
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                >
                  <span>{expandedTicketId === ticket.id ? 'Hide Timeline' : 'View Updates'}</span>
                  {expandedTicketId === ticket.id ? (
                    <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* File Grievance Modal */}
      {showFileModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-5 sm:p-6 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <h2 className="text-base font-bold text-slate-900 mb-1">File Official Municipal Grievance</h2>
            <p className="text-xs text-slate-500 mb-4">
              Directly routed to the municipal ward officer under Public Services Guarantee Act
            </p>

            <form onSubmit={handleFileGrievance} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Issue Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hazardous pothole cluster near main market"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:bg-white focus:border-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as GrievanceTicket['category'])}
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:bg-white focus:border-indigo-600"
                  >
                    {categories
                      .filter((c) => c !== 'All')
                      .map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as GrievanceTicket['priority'])}
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:bg-white focus:border-indigo-600"
                  >
                    <option value="High">High (48h SLA)</option>
                    <option value="Medium">Medium (72h SLA)</option>
                    <option value="Low">Low (7 Days SLA)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Ward / Zone</label>
                <input
                  type="text"
                  placeholder="e.g. Ward 24, South Zone"
                  value={wardNumber}
                  onChange={(e) => setWardNumber(e.target.value)}
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:bg-white focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Specific Location Address</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Near Metro Pillar 142, Outer Ring Road"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:bg-white focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Detailed Description</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe the issue, safety hazard, or duration of the problem..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:bg-white focus:border-indigo-600"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowFileModal(false)}
                  className="flex-1 py-2 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {isSubmitting ? 'Registering...' : 'Submit Grievance'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
