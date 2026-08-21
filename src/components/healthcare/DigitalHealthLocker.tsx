import React, { useState, useEffect, useRef } from 'react';
import {
  FolderLock,
  Upload,
  QrCode,
  FileText,
  Clock,
  ShieldCheck,
  Plus,
  Trash2,
  Download,
  Eye,
  Check,
  Copy,
  X,
  Share2,
  Calendar,
  Building2,
  CheckCircle2,
  RefreshCw,
  Search,
} from 'lucide-react';
import { HealthLockerRecord } from '../../types';

export const DigitalHealthLocker: React.FC = () => {
  // Starts loaded from storage or clean
  const [records, setRecords] = useState<HealthLockerRecord[]>(() => {
    try {
      const saved = localStorage.getItem('jansetu_health_locker_docs');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  // Save to storage whenever records change
  useEffect(() => {
    try {
      localStorage.setItem('jansetu_health_locker_docs', JSON.stringify(records));
    } catch (e) {
      console.error(e);
    }
  }, [records]);

  // Form states — default empty
  const [docName, setDocName] = useState('');
  const [category, setCategory] = useState<HealthLockerRecord['category']>('Lab Report');
  const [hospitalOrLab, setHospitalOrLab] = useState('');
  const [docDate, setDocDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [doctorNotes, setDoctorNotes] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');

  // QR Modal
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrExpirySeconds, setQrExpirySeconds] = useState(900);
  const [accessPin, setAccessPin] = useState('4829');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedPin, setCopiedPin] = useState(false);

  // Preview Modal
  const [previewRecord, setPreviewRecord] = useState<HealthLockerRecord | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showQrModal && qrExpirySeconds > 0) {
      timer = setInterval(() => {
        setQrExpirySeconds((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [showQrModal, qrExpirySeconds]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      if (!docName) {
        setDocName(file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' '));
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (!docName) {
        setDocName(file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' '));
      }
    }
  };

  const handleAddRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim()) return;

    setIsUploading(true);

    setTimeout(() => {
      const finalFileName = selectedFile
        ? selectedFile.name
        : `${docName.trim().replace(/\s+/g, '_')}_document.pdf`;

      const finalFileSize = selectedFile
        ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`
        : '1.2 MB';

      const newRecord: HealthLockerRecord = {
        id: `hl-${Date.now().toString().slice(-4)}`,
        name: docName.trim(),
        category,
        date: docDate || new Date().toISOString().split('T')[0],
        hospitalOrLab: hospitalOrLab.trim() || 'General Hospital / Lab',
        fileName: finalFileName,
        fileSize: finalFileSize,
        fileType: 'pdf',
        doctorNotes: doctorNotes.trim() || undefined,
        isAbdmLinked: true,
      };

      setRecords((prev) => [newRecord, ...prev]);
      setIsUploading(false);
      setToastMessage(`"${newRecord.name}" added to locker.`);

      // Reset Form
      setDocName('');
      setSelectedFile(null);
      setHospitalOrLab('');
      setDoctorNotes('');

      setTimeout(() => setToastMessage(null), 3000);
    }, 400);
  };

  const handleDelete = (id: string, name?: string) => {
    setRecords((prev) => prev.filter((r) => r.id !== id));
    if (previewRecord?.id === id) {
      setPreviewRecord(null);
    }
    setToastMessage(name ? `"${name}" removed from locker.` : 'Document removed from locker.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://jansetu.abdm.gov.in/share/doc-token?pin=${accessPin}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyPin = () => {
    navigator.clipboard.writeText(accessPin);
    setCopiedPin(true);
    setTimeout(() => setCopiedPin(false), 2000);
  };

  const filteredRecords = records.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.hospitalOrLab.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategoryFilter === 'All' || r.category === selectedCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories: Array<HealthLockerRecord['category']> = [
    'Lab Report',
    'Prescription',
    'Discharge Summary',
    'Vaccine Certificate',
    'Scan & X-Ray',
    'Other',
  ];

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-lg shadow-lg border border-slate-700 flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FolderLock className="w-5 h-5 text-indigo-600" />
            <h1 className="text-xl font-bold text-slate-900">Digital Health Locker</h1>
          </div>
          <p className="text-xs text-slate-600">
            Upload, manage, and securely share your medical reports, prescriptions, and scans via temporary QR codes.
          </p>
        </div>

        {/* Generate QR Share Button */}
        <button
          onClick={() => {
            setQrExpirySeconds(900);
            setAccessPin(Math.floor(1000 + Math.random() * 9000).toString());
            setShowQrModal(true);
          }}
          disabled={records.length === 0}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer ${
            records.length === 0
              ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
          title={records.length === 0 ? 'Upload a document first to generate sharing QR' : 'Generate temporary QR for doctors'}
        >
          <QrCode className="w-4 h-4" />
          <span>Share via QR Code</span>
        </button>
      </div>

      {/* Main Content: Upload Form + Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Upload Form */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900">Upload Document</h2>
            <button
              type="button"
              onClick={() => {
                setDocName('');
                setSelectedFile(null);
                setHospitalOrLab('');
                setDoctorNotes('');
              }}
              className="text-xs text-slate-500 hover:text-slate-700 flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          <form onSubmit={handleAddRecord} className="space-y-3.5">
            {/* Document Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Document Name *
              </label>
              <input
                type="text"
                value={docName}
                onChange={(e) => setDocName(e.target.value)}
                placeholder="e.g. Blood Test Report, Chest X-Ray..."
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:bg-white focus:border-indigo-600"
                required
              />
            </div>

            {/* Category & Date */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:bg-white focus:border-indigo-600"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={docDate}
                  onChange={(e) => setDocDate(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:bg-white focus:border-indigo-600"
                />
              </div>
            </div>

            {/* Provider */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Hospital / Lab / Doctor (Optional)
              </label>
              <input
                type="text"
                value={hospitalOrLab}
                onChange={(e) => setHospitalOrLab(e.target.value)}
                placeholder="e.g. City Hospital, Lab Name..."
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:bg-white focus:border-indigo-600"
              />
            </div>

            {/* File Drop Area */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Attach File
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
              />
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleFileDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border border-dashed rounded-lg p-3.5 text-center cursor-pointer transition-colors ${
                  isDragging
                    ? 'border-indigo-600 bg-indigo-50/50'
                    : 'border-slate-300 hover:border-slate-400 bg-slate-50/50'
                }`}
              >
                <Upload className="w-4 h-4 text-slate-400 mx-auto mb-1" />
                <p className="text-xs font-medium text-slate-700">
                  {selectedFile ? selectedFile.name : 'Click to browse or drag file here'}
                </p>
                <span className="text-[10px] text-slate-400">Supports PDF, JPG, PNG up to 10MB</span>
              </div>
            </div>

            {/* Doctor Remark */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Notes / Remarks (Optional)
              </label>
              <textarea
                rows={2}
                value={doctorNotes}
                onChange={(e) => setDoctorNotes(e.target.value)}
                placeholder="Any doctor instructions or report summary..."
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:bg-white focus:border-indigo-600 resize-none"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isUploading || !docName.trim()}
              className={`w-full py-2 px-4 text-xs font-semibold text-white rounded-lg transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer ${
                isUploading || !docName.trim()
                  ? 'bg-indigo-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {isUploading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Uploading to Locker...</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add to Health Locker</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right: Document Timeline & Search */}
        <div className="lg:col-span-7 space-y-4">
          {/* Search & Category Filter Bar */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-3 space-y-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search documents by title or hospital..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:bg-white focus:border-indigo-600"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {['All', ...categories].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategoryFilter(cat)}
                  className={`text-xs px-2.5 py-1 rounded whitespace-nowrap transition-colors cursor-pointer ${
                    selectedCategoryFilter === cat
                      ? 'bg-indigo-50 text-indigo-700 font-medium'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Timeline List */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-600" />
                <h2 className="text-sm font-bold text-slate-900">Medical Timeline</h2>
              </div>
              <span className="text-xs text-slate-500">{filteredRecords.length} Documents</span>
            </div>

            {filteredRecords.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs space-y-1">
                <p className="font-medium text-slate-600">No medical documents in your locker</p>
                <p className="text-slate-400">
                  {records.length === 0
                    ? 'Upload your medical reports, prescriptions, or vaccination certificates using the form on the left.'
                    : 'No documents match the current filter or search criteria.'}
                </p>
              </div>
            ) : (
              <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-slate-200">
                {filteredRecords.map((record) => (
                  <div key={record.id} className="relative">
                    {/* Dot */}
                    <div className="absolute -left-6 top-2 w-4 h-4 rounded-full bg-white border border-indigo-600 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                    </div>

                    {/* Card */}
                    <div className="bg-slate-50/70 hover:bg-slate-50 border border-slate-200 rounded-lg p-3.5 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                        <div className="space-y-1 flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-medium uppercase tracking-wider bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded">
                              {record.category}
                            </span>
                            <span className="text-[11px] text-slate-400 flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-slate-400" />
                              {record.date}
                            </span>
                          </div>

                          <h3 className="text-xs font-bold text-slate-900">{record.name}</h3>

                          {record.hospitalOrLab && (
                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                              <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="truncate">{record.hospitalOrLab}</span>
                            </div>
                          )}

                          {record.doctorNotes && (
                            <p className="text-xs text-slate-600 bg-white p-2 rounded border border-slate-200 mt-1.5">
                              {record.doctorNotes}
                            </p>
                          )}

                          <div className="pt-1 flex items-center gap-1.5 text-[11px] text-slate-500">
                            <FileText className="w-3.5 h-3.5 text-slate-400" />
                            <span className="font-mono">{record.fileName}</span>
                            <span>({record.fileSize})</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1.5 shrink-0 pt-2 sm:pt-0">
                          <button
                            onClick={() => setPreviewRecord(record)}
                            className="px-2.5 py-1 text-slate-700 hover:text-indigo-600 bg-white hover:bg-slate-50 border border-slate-200 rounded-md text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View</span>
                          </button>
                          <button
                            onClick={() => handleDelete(record.id, record.name)}
                            className="px-2.5 py-1 text-rose-600 hover:text-rose-700 bg-white hover:bg-rose-50 border border-rose-200 hover:border-rose-300 rounded-md text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
                            title={`Remove "${record.name}" from timeline`}
                          >
                            <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* QR Code Sharing Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-sm w-full p-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <QrCode className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">Scan to View Documents</h3>
              </div>
              <button
                onClick={() => setShowQrModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-center">
              {/* QR Container */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 inline-block mx-auto">
                <svg
                  className="w-44 h-44 mx-auto text-slate-900"
                  viewBox="0 0 100 100"
                  fill="currentColor"
                >
                  <rect x="5" y="5" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="4" />
                  <rect x="11" y="11" width="13" height="13" />
                  <rect x="70" y="5" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="4" />
                  <rect x="76" y="11" width="13" height="13" />
                  <rect x="5" y="70" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="4" />
                  <rect x="11" y="76" width="13" height="13" />
                  <rect x="40" y="10" width="6" height="6" />
                  <rect x="50" y="15" width="6" height="6" />
                  <rect x="40" y="25" width="6" height="6" />
                  <rect x="45" y="45" width="10" height="10" />
                  <rect x="15" y="45" width="8" height="8" />
                  <rect x="75" y="45" width="8" height="8" />
                  <rect x="40" y="70" width="6" height="6" />
                  <rect x="55" y="75" width="6" height="6" />
                  <rect x="70" y="70" width="8" height="8" />
                  <rect x="85" y="80" width="6" height="6" />
                </svg>
              </div>

              {/* Pin & Expiry */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Access PIN:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold tracking-widest text-slate-900 text-sm">{accessPin}</span>
                    <button
                      onClick={handleCopyPin}
                      className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                      title="Copy PIN"
                    >
                      {copiedPin ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs border-t border-slate-200/60 pt-2">
                  <span className="text-slate-500">Expires in:</span>
                  <span className="font-mono font-semibold text-rose-600">{formatTimer(qrExpirySeconds)}</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed">
                Doctor scans this code to view {records.length} authorized documents on the ABDM network.
              </p>

              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => setShowQrModal(false)}
                  className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                >
                  Done
                </button>
                <button
                  onClick={handleCopyLink}
                  className="flex-1 py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Copied' : 'Share Link'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-md w-full p-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2 min-w-0">
                <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                <h3 className="text-sm font-bold text-slate-900 truncate">{previewRecord.name}</h3>
              </div>
              <button
                onClick={() => setPreviewRecord(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Category:</span>
                  <span className="font-semibold text-slate-800">{previewRecord.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Date:</span>
                  <span className="font-semibold text-slate-800">{previewRecord.date}</span>
                </div>
                {previewRecord.hospitalOrLab && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Hospital / Lab:</span>
                    <span className="font-semibold text-slate-800">{previewRecord.hospitalOrLab}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-500">File:</span>
                  <span className="font-mono text-slate-800">{previewRecord.fileName} ({previewRecord.fileSize})</span>
                </div>
              </div>

              {previewRecord.doctorNotes && (
                <div className="p-3 bg-white border border-slate-200 rounded-lg">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Remarks</span>
                  <p className="text-slate-700 leading-relaxed">{previewRecord.doctorNotes}</p>
                </div>
              )}

              <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100">
                <button
                  onClick={() => handleDelete(previewRecord.id, previewRecord.name)}
                  className="px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                  <span>Delete Document</span>
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPreviewRecord(null)}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => setPreviewRecord(null)}
                    className="px-4 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
