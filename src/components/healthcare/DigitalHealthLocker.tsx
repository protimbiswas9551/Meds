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
  Lock,
  Calendar,
  Building,
  Sparkles,
  FileSpreadsheet,
  FileCode,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  RefreshCw,
  Search,
  Filter,
} from 'lucide-react';
import { HealthLockerRecord } from '../../types';

export const DigitalHealthLocker: React.FC = () => {
  const [records, setRecords] = useState<HealthLockerRecord[]>([
    {
      id: 'hl-001',
      name: 'Comprehensive Metabolic & Lipid Blood Test',
      category: 'Lab Report',
      date: '2025-05-14',
      hospitalOrLab: 'Dr. Lal PathLabs & Civil Hospital Delhi',
      fileName: 'Lipid_Profile_BloodReport_May2025.pdf',
      fileSize: '1.8 MB',
      fileType: 'pdf',
      doctorNotes: 'Fasting glucose: 94 mg/dL, Total cholesterol: 182 mg/dL. Normal limits.',
      isAbdmLinked: true,
    },
    {
      id: 'hl-002',
      name: 'Cardiology ECG & Holter Monitor Summary',
      category: 'Scan & X-Ray',
      date: '2025-04-20',
      hospitalOrLab: 'AIIMS New Delhi - Cardiology Dept',
      fileName: 'AIIMS_Cardio_ECG_Lead12.pdf',
      fileSize: '3.4 MB',
      fileType: 'pdf',
      doctorNotes: 'Normal sinus rhythm, HR 72 bpm. No ST-T segment deviation.',
      isAbdmLinked: true,
    },
    {
      id: 'hl-003',
      name: 'General Medicine OPD Prescription',
      category: 'Prescription',
      date: '2025-03-10',
      hospitalOrLab: 'e-Sanjeevani National Telemedicine',
      fileName: 'eSanjeevani_Rx_DrSharma.pdf',
      fileSize: '840 KB',
      fileType: 'pdf',
      doctorNotes: 'Tab. Paracetamol 650mg SOS, Tab. Cetirizine 10mg OD x 5 days.',
      isAbdmLinked: true,
    },
    {
      id: 'hl-004',
      name: 'Covid-19 Booster & Tetanus Certificate',
      category: 'Vaccine Certificate',
      date: '2024-11-18',
      hospitalOrLab: 'Govt Urban Primary Health Centre (UPHC)',
      fileName: 'CoWIN_Universal_Vaccination_Pass.pdf',
      fileSize: '620 KB',
      fileType: 'pdf',
      doctorNotes: 'Batch #COV-8491. Fully immunized under National UIP.',
      isAbdmLinked: true,
    },
  ]);

  // Form states
  const [docName, setDocName] = useState('');
  const [category, setCategory] = useState<HealthLockerRecord['category']>('Lab Report');
  const [hospitalOrLab, setHospitalOrLab] = useState('');
  const [docDate, setDocDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [mockFileName, setMockFileName] = useState('');
  const [doctorNotes, setDoctorNotes] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');

  // QR Code Sharing Modal States
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrExpirySeconds, setQrExpirySeconds] = useState(900); // 15 minutes default
  const [selectedRecordsForShare, setSelectedRecordsForShare] = useState<string[]>([]);
  const [accessPin, setAccessPin] = useState('5839');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedPin, setCopiedPin] = useState(false);

  // Preview Modal
  const [previewRecord, setPreviewRecord] = useState<HealthLockerRecord | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Countdown timer for QR code
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showQrModal && qrExpirySeconds > 0) {
      timer = setInterval(() => {
        setQrExpirySeconds((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [showQrModal, qrExpirySeconds]);

  // Format seconds to mm:ss
  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOpenQrModal = () => {
    setSelectedRecordsForShare(records.map((r) => r.id));
    setQrExpirySeconds(900);
    setAccessPin(Math.floor(1000 + Math.random() * 9000).toString());
    setShowQrModal(true);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      setMockFileName(file.name);
      if (!docName) {
        setDocName(file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' '));
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setMockFileName(file.name);
      if (!docName) {
        setDocName(file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' '));
      }
    }
  };

  const handleSelectPreset = (presetName: string, presetCat: HealthLockerRecord['category'], presetLab: string) => {
    setDocName(presetName);
    setCategory(presetCat);
    setHospitalOrLab(presetLab);
    setMockFileName(`${presetName.replace(/\s+/g, '_')}.pdf`);
  };

  const handleAddRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim()) return;

    setIsUploading(true);

    setTimeout(() => {
      const finalFileName =
        selectedFile?.name ||
        mockFileName.trim() ||
        `${docName.replace(/\s+/g, '_')}_${new Date().getFullYear()}.pdf`;

      const finalFileSize = selectedFile
        ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`
        : '1.4 MB';

      const newRecord: HealthLockerRecord = {
        id: `hl-${Date.now().toString().slice(-4)}`,
        name: docName.trim(),
        category,
        date: docDate || new Date().toISOString().split('T')[0],
        hospitalOrLab: hospitalOrLab.trim() || 'AIIMS / Govt Healthcare Network',
        fileName: finalFileName,
        fileSize: finalFileSize,
        fileType: finalFileName.endsWith('.jpg') || finalFileName.endsWith('.png') ? 'image' : 'pdf',
        doctorNotes: doctorNotes.trim() || undefined,
        isAbdmLinked: true,
      };

      setRecords([newRecord, ...records]);
      setIsUploading(false);
      setShowUploadModal(false);

      // Reset form
      setDocName('');
      setHospitalOrLab('');
      setSelectedFile(null);
      setMockFileName('');
      setDoctorNotes('');
    }, 600);
  };

  const handleDelete = (id: string) => {
    setRecords(records.filter((r) => r.id !== id));
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

  // Filtered records
  const filteredRecords = records.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.hospitalOrLab.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategoryFilter === 'All' || r.category === selectedCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categoriesList: Array<HealthLockerRecord['category']> = [
    'Lab Report',
    'Prescription',
    'Discharge Summary',
    'Vaccine Certificate',
    'Scan & X-Ray',
    'Other',
  ];

  return (
    <div className="space-y-6">
      {/* Top Clean Minimalism Hero Card */}
      <div className="bg-white rounded-xl p-6 sm:p-7 border border-slate-200 shadow-xs relative overflow-hidden">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-indigo-100 flex items-center gap-1">
              <FolderLock className="w-3.5 h-3.5 text-indigo-600" />
              Ayushman Digital Health Locker (ABDM)
            </span>
            <span className="text-xs text-slate-500">256-Bit Encrypted Citizen Records</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mb-2">
            Digital Health Locker & Temporary Doctor QR Sharing
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5">
            Store and organize all your medical test reports, doctor prescriptions, and hospital discharge
            summaries in one secure, ABDM-linked timeline. Generate time-limited QR codes to share records with
            consulting doctors without paper files.
          </p>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => setShowUploadModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-lg text-xs sm:text-sm transition-colors shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Upload Health Document</span>
            </button>
            <button
              onClick={handleOpenQrModal}
              className="bg-white hover:bg-slate-50 text-slate-700 font-medium border border-slate-200 px-4 py-2 rounded-lg text-xs sm:text-sm transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <QrCode className="w-4 h-4 text-indigo-600" />
              <span>Generate Doctor Share QR Code</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Stat Overview Badges */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Stored Documents</span>
            <FolderLock className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{records.length} Files</div>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">100% ABDM Linked & Verified</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Lab Test Reports</span>
            <FileSpreadsheet className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {records.filter((r) => r.category === 'Lab Report').length}
          </div>
          <p className="text-[11px] text-slate-500 font-medium mt-1">Blood, Urine, Pathology</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Prescriptions & Scans</span>
            <FileText className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {records.filter((r) => r.category === 'Prescription' || r.category === 'Scan & X-Ray').length}
          </div>
          <p className="text-[11px] text-amber-700 font-medium mt-1">Digital OPD Rx & Imaging</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Doctor QR Consent</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">Time-Limited</div>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">PIN Protected 15-min token</p>
        </div>
      </div>

      {/* Search and Category Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search documents by name, hospital, or report type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:bg-white focus:border-indigo-600"
          />
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 shrink-0">
          {['All', 'Lab Report', 'Prescription', 'Scan & X-Ray', 'Vaccine Certificate'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategoryFilter(cat)}
              className={`text-xs px-2.5 py-1 rounded-md border transition-colors cursor-pointer whitespace-nowrap ${
                selectedCategoryFilter === cat
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-semibold'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 sm:p-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900">Medical History & Documents Timeline</h2>
            <span className="text-[10px] bg-slate-100 text-slate-600 font-medium px-2 py-0.5 rounded-full">
              {filteredRecords.length} Documents
            </span>
          </div>

          <button
            onClick={() => setShowUploadModal(true)}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Document</span>
          </button>
        </div>

        {filteredRecords.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            No medical documents match your search. Click &ldquo;Add Document&rdquo; above to upload your first health record.
          </div>
        ) : (
          <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-2 sm:before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
            {filteredRecords.map((record) => (
              <div key={record.id} className="relative group">
                {/* Timeline Dot */}
                <div className="absolute -left-6 sm:-left-8 top-1.5 w-4 h-4 rounded-full bg-white border-2 border-indigo-600 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                </div>

                {/* Timeline Card */}
                <div className="bg-slate-50/70 hover:bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 transition-colors">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-3">
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-semibold uppercase tracking-wider bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-100">
                          {record.category}
                        </span>
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {record.date}
                        </span>
                        {record.isAbdmLinked && (
                          <span className="text-[10px] bg-emerald-50 text-emerald-700 font-medium px-2 py-0.5 rounded border border-emerald-100 flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" /> ABDM Linked
                          </span>
                        )}
                      </div>

                      <h3 className="text-sm font-bold text-slate-900">{record.name}</h3>

                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{record.hospitalOrLab}</span>
                      </div>

                      {record.doctorNotes && (
                        <p className="text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200/80 leading-relaxed mt-2">
                          <strong className="text-slate-700 font-medium">Doctor Notes: </strong>
                          {record.doctorNotes}
                        </p>
                      )}

                      {/* File attachment row */}
                      <div className="flex items-center gap-2 pt-1">
                        <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-2.5 py-1 rounded text-xs text-slate-700">
                          <FileText className="w-3.5 h-3.5 text-indigo-600" />
                          <span className="font-mono text-[11px] font-medium">{record.fileName}</span>
                          <span className="text-[10px] text-slate-400">({record.fileSize})</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 shrink-0 pt-2 lg:pt-0">
                      <button
                        onClick={() => setPreviewRecord(record)}
                        className="p-1.5 text-slate-600 hover:text-indigo-600 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
                        title="Preview Document"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Preview</span>
                      </button>

                      <button
                        onClick={() => {
                          alert(`Downloading verified copy of "${record.fileName}" from ABDM Health Repository.`);
                        }}
                        className="p-1.5 text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
                        title="Download Document"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Download</span>
                      </button>

                      <button
                        onClick={() => handleDelete(record.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 bg-white hover:bg-rose-50 border border-slate-200 rounded-lg text-xs transition-colors cursor-pointer shadow-xs"
                        title="Delete Document"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Health Document Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-lg w-full p-5 sm:p-6 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <FolderLock className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">Upload Health Document to Locker</h3>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-md cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddRecord} className="space-y-4">
              {/* Document Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Document Title / Report Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Blood Test Report (CBC & Lipid), Discharge Summary"
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:bg-white focus:border-indigo-600"
                />
              </div>

              {/* Preset suggestion chips */}
              <div>
                <span className="block text-[10px] text-slate-400 mb-1">Quick Presets:</span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      handleSelectPreset(
                        'Thyroid Profile (T3, T4, TSH)',
                        'Lab Report',
                        'Govt Civil Hospital Pathology Lab'
                      )
                    }
                    className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded cursor-pointer transition-colors"
                  >
                    Thyroid Profile
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleSelectPreset(
                        'General Physician Consultation Rx',
                        'Prescription',
                        'Primary Health Centre (PHC)'
                      )
                    }
                    className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded cursor-pointer transition-colors"
                  >
                    OPD Prescription
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleSelectPreset(
                        'Chest X-Ray PA View Digital Report',
                        'Scan & X-Ray',
                        'AIIMS Radiology Dept'
                      )
                    }
                    className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded cursor-pointer transition-colors"
                  >
                    Chest X-Ray
                  </button>
                </div>
              </div>

              {/* Category & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Record Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:bg-white focus:border-indigo-600"
                  >
                    {categoriesList.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Date of Record
                  </label>
                  <input
                    type="date"
                    value={docDate}
                    onChange={(e) => setDocDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:bg-white focus:border-indigo-600"
                  />
                </div>
              </div>

              {/* Hospital or Lab */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Hospital / Diagnostic Centre / Doctor
                </label>
                <input
                  type="text"
                  placeholder="e.g. AIIMS New Delhi, Civil Hospital, SRL Diagnostics"
                  value={hospitalOrLab}
                  onChange={(e) => setHospitalOrLab(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:bg-white focus:border-indigo-600"
                />
              </div>

              {/* File Dropzone & Manual Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Upload File / PDF / Image (Drag & Drop or Browse)
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
                  className={`border-2 border-dashed rounded-xl p-4 sm:p-5 text-center cursor-pointer transition-colors ${
                    isDragging
                      ? 'border-indigo-600 bg-indigo-50/50'
                      : 'border-slate-300 hover:border-indigo-400 bg-slate-50/50'
                  }`}
                >
                  <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
                  <p className="text-xs font-semibold text-slate-700">
                    {selectedFile
                      ? `Selected: ${selectedFile.name} (${(selectedFile.size / 1024).toFixed(0)} KB)`
                      : mockFileName
                      ? `Selected Preset: ${mockFileName}`
                      : 'Click to select or drag and drop PDF/JPG'}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Supports PDF, PNG, JPG, DICOM scans up to 25 MB
                  </p>
                </div>
              </div>

              {/* Doctor notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Doctor Notes / Key Findings (Optional)
                </label>
                <textarea
                  rows={2}
                  value={doctorNotes}
                  onChange={(e) => setDoctorNotes(e.target.value)}
                  placeholder="e.g. Hemoglobin 14.2 g/dL, Prescribed 5 days course..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:bg-white focus:border-indigo-600 resize-none"
                />
              </div>

              {/* ABDM Security Note */}
              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100 text-[11px] text-emerald-800 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  This file will be automatically linked with your Ayushman ABHA ID: <strong>91-4820-1948-2830</strong>.
                </span>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading || !docName.trim()}
                  className={`px-4 py-2 text-xs font-medium text-white rounded-lg transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer ${
                    isUploading || !docName.trim()
                      ? 'bg-indigo-400 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
                >
                  {isUploading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Encrypting & Saving...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5" />
                      <span>Save to Locker</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Temporary Doctor QR Code Sharing Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-md w-full p-5 sm:p-6 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <QrCode className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">Doctor Quick-Scan QR Share</h3>
              </div>
              <button
                onClick={() => setShowQrModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-md cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-center space-y-4">
              {/* Expiry Timer Pill */}
              <div className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full text-xs text-amber-800 font-semibold">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>
                  {qrExpirySeconds > 0 ? (
                    `Passcode expires in: ${formatTimer(qrExpirySeconds)}`
                  ) : (
                    <span className="text-rose-600">Expired — Regenerate QR</span>
                  )}
                </span>
              </div>

              {/* Mock Clean SVG QR Code */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl inline-block shadow-xs">
                <svg
                  className="w-44 h-44 mx-auto text-slate-900"
                  viewBox="0 0 100 100"
                  fill="currentColor"
                >
                  {/* Outer corner 1 */}
                  <rect x="5" y="5" width="28" height="28" rx="4" fill="none" stroke="currentColor" strokeWidth="6" />
                  <rect x="13" y="13" width="12" height="12" rx="2" fill="currentColor" />
                  {/* Outer corner 2 */}
                  <rect x="67" y="5" width="28" height="28" rx="4" fill="none" stroke="currentColor" strokeWidth="6" />
                  <rect x="75" y="13" width="12" height="12" rx="2" fill="currentColor" />
                  {/* Outer corner 3 */}
                  <rect x="5" y="67" width="28" height="28" rx="4" fill="none" stroke="currentColor" strokeWidth="6" />
                  <rect x="13" y="75" width="12" height="12" rx="2" fill="currentColor" />
                  {/* Central Pattern Data Blocks */}
                  <rect x="38" y="10" width="8" height="8" rx="1" />
                  <rect x="50" y="10" width="8" height="8" rx="1" />
                  <rect x="38" y="24" width="8" height="8" rx="1" />
                  <rect x="50" y="24" width="8" height="8" rx="1" />
                  <rect x="10" y="38" width="8" height="8" rx="1" />
                  <rect x="24" y="38" width="8" height="8" rx="1" />
                  <rect x="38" y="38" width="10" height="10" rx="2" fill="#4f46e5" />
                  <rect x="52" y="38" width="8" height="8" rx="1" />
                  <rect x="66" y="38" width="8" height="8" rx="1" />
                  <rect x="80" y="38" width="8" height="8" rx="1" />
                  <rect x="10" y="52" width="8" height="8" rx="1" />
                  <rect x="24" y="52" width="8" height="8" rx="1" />
                  <rect x="38" y="52" width="8" height="8" rx="1" />
                  <rect x="52" y="52" width="8" height="8" rx="1" />
                  <rect x="66" y="52" width="8" height="8" rx="1" />
                  <rect x="80" y="52" width="8" height="8" rx="1" />
                  <rect x="38" y="66" width="8" height="8" rx="1" />
                  <rect x="50" y="66" width="8" height="8" rx="1" />
                  <rect x="66" y="66" width="8" height="8" rx="1" />
                  <rect x="80" y="66" width="8" height="8" rx="1" />
                  <rect x="38" y="80" width="8" height="8" rx="1" />
                  <rect x="50" y="80" width="8" height="8" rx="1" />
                  <rect x="66" y="80" width="8" height="8" rx="1" />
                  <rect x="80" y="80" width="8" height="8" rx="1" />
                </svg>
                <div className="mt-2 text-[10px] text-slate-500 font-mono">
                  ABDM Consent Artifact #CA-2025-{records.length}94
                </div>
              </div>

              {/* 4-digit Security PIN Display */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-center justify-between">
                <div className="text-left">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                    Doctor Verbal Security PIN
                  </span>
                  <span className="font-mono text-base font-bold text-slate-900 tracking-widest">
                    {accessPin}
                  </span>
                </div>
                <button
                  onClick={handleCopyPin}
                  className="px-2.5 py-1 text-xs font-medium text-indigo-700 bg-white border border-indigo-200 rounded hover:bg-indigo-50 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  {copiedPin ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedPin ? 'Copied' : 'Copy PIN'}</span>
                </button>
              </div>

              {/* Information text */}
              <p className="text-xs text-slate-500 leading-relaxed text-left">
                Show this QR code to your consulting doctor or hospital registration counter. The doctor
                scans it with the National Hospital Management Information System (e-Hospital) to view selected
                documents for this session only.
              </p>

              {/* Shared items summary */}
              <div className="text-left bg-slate-50/70 p-3 rounded-lg border border-slate-200/80 text-xs text-slate-600 space-y-1">
                <span className="font-semibold text-slate-800 block text-[11px]">
                  Included Documents ({records.length}):
                </span>
                {records.slice(0, 3).map((r) => (
                  <div key={r.id} className="truncate text-[11px] text-slate-500">
                    • {r.name} ({r.category})
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => {
                    setQrExpirySeconds(900);
                    setAccessPin(Math.floor(1000 + Math.random() * 9000).toString());
                  }}
                  className="flex-1 py-2 px-3 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Regenerate PIN</span>
                </button>
                <button
                  onClick={handleCopyLink}
                  className="flex-1 py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Link Copied' : 'Copy Share Link'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Document Preview Modal */}
      {previewRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-xl w-full p-5 sm:p-6 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2 min-w-0">
                <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                <h3 className="text-sm font-bold text-slate-900 truncate">
                  {previewRecord.name}
                </h3>
              </div>
              <button
                onClick={() => setPreviewRecord(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-md cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Document Metadata Header */}
              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[10px]">Category</span>
                  <span className="font-semibold text-slate-800">{previewRecord.category}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Date Issued</span>
                  <span className="font-semibold text-slate-800">{previewRecord.date}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Issuer / Lab</span>
                  <span className="font-semibold text-slate-800 truncate block">
                    {previewRecord.hospitalOrLab}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">File Spec</span>
                  <span className="font-mono text-slate-800">
                    {previewRecord.fileName} ({previewRecord.fileSize})
                  </span>
                </div>
              </div>

              {/* Simulated Paper Report Layout */}
              <div className="p-5 bg-white border border-slate-200 rounded-lg shadow-inner text-xs space-y-3 font-sans">
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <div>
                    <span className="font-bold text-slate-900 block">{previewRecord.hospitalOrLab}</span>
                    <span className="text-[10px] text-slate-500">
                      National Accreditation Board for Testing and Calibration Laboratories (NABL)
                    </span>
                  </div>
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-mono border border-emerald-100">
                    ABHA Verified
                  </span>
                </div>

                <div className="py-2 space-y-1.5">
                  <div className="font-semibold text-slate-800">{previewRecord.name}</div>
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    {previewRecord.doctorNotes ||
                      'Test results verified by clinical pathologist. Routine parameters within standard reference intervals.'}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Digitally Signed by Medical Officer</span>
                  <span>SHA-256 Checksum: Verified</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setPreviewRecord(null)}
                  className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  Close Preview
                </button>
                <button
                  onClick={() => {
                    alert(`Downloading verified copy of "${previewRecord.fileName}".`);
                  }}
                  className="px-4 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download File</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
