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
  Building,
  Sparkles,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Search,
  FileUp,
  FileCheck2,
  FileBox,
  Key,
} from 'lucide-react';
import { HealthLockerRecord } from '../../types';

export const DigitalHealthLocker: React.FC = () => {
  const [records, setRecords] = useState<HealthLockerRecord[]>([
    {
      id: 'hl-001',
      name: 'Blood Test Report (Lipid Profile & CBC)',
      category: 'Lab Report',
      date: '2025-05-14',
      hospitalOrLab: 'Dr. Lal PathLabs & Civil Hospital Delhi',
      fileName: 'Blood_Test_Lipid_CBC_May2025.pdf',
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

  // Form input states
  const [docName, setDocName] = useState('');
  const [category, setCategory] = useState<HealthLockerRecord['category']>('Lab Report');
  const [hospitalOrLab, setHospitalOrLab] = useState('Govt Civil Hospital & PathLab');
  const [docDate, setDocDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [mockFileName, setMockFileName] = useState('Blood_Test_Report_2025.pdf');
  const [doctorNotes, setDoctorNotes] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccessToast, setUploadSuccessToast] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');

  // QR Code Sharing Modal States
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrExpirySeconds, setQrExpirySeconds] = useState(900); // 15 minutes
  const [accessPin, setAccessPin] = useState('4829');
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

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOpenQrModal = () => {
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

  const handleSelectPreset = (
    presetName: string,
    presetCat: HealthLockerRecord['category'],
    presetLab: string,
    sampleFileName: string
  ) => {
    setDocName(presetName);
    setCategory(presetCat);
    setHospitalOrLab(presetLab);
    setMockFileName(sampleFileName);
    setSelectedFile(null);
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
        : '1.6 MB';

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
      setUploadSuccessToast(`"${newRecord.name}" successfully added to Health Locker timeline!`);

      // Reset form fields
      setDocName('');
      setSelectedFile(null);
      setMockFileName('Blood_Test_Report_2025.pdf');
      setDoctorNotes('');

      setTimeout(() => setUploadSuccessToast(null), 4000);
    }, 500);
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
      {/* Top Hero Banner */}
      <div className="bg-white rounded-xl p-6 sm:p-7 border border-slate-200 shadow-xs relative overflow-hidden">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-indigo-100 flex items-center gap-1">
              <FolderLock className="w-3.5 h-3.5 text-indigo-600" />
              Ayushman Bharat Digital Health Locker (ABDM)
            </span>
            <span className="text-xs text-slate-500">256-Bit Encrypted Citizen Records</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mb-2">
            Digital Health Locker & Temporary Doctor QR Sharing
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5">
            Type a document name (e.g. <em>&quot;Blood Test Report&quot;</em>) and upload or select files to build your
            secure medical history timeline. Generate time-limited QR codes to share your records with doctors in OPD or emergency wards.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleOpenQrModal}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-lg text-xs sm:text-sm transition-colors shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <QrCode className="w-4 h-4" />
              <span>Generate Doctor Share QR Code</span>
            </button>
            <div className="text-xs text-slate-500 flex items-center gap-1.5 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Linked to ABHA: <strong>91-4820-1948-2830</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Success Notification Toast */}
      {uploadSuccessToast && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium">{uploadSuccessToast}</span>
          </div>
          <button
            onClick={() => setUploadSuccessToast(null)}
            className="text-emerald-700 hover:text-emerald-900 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2-Column Main Workspace: (Left: Inline Upload Form | Right: Direct Timeline) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Upload Form */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <FileUp className="w-4 h-4 text-indigo-600" />
              <h2 className="text-sm font-bold text-slate-900">Upload Health Document</h2>
            </div>
            <span className="text-[10px] bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded border border-indigo-100">
              Instant Encrypt
            </span>
          </div>

          <form onSubmit={handleAddRecord} className="space-y-4">
            {/* Document Title Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Document Name / Title *
              </label>
              <input
                type="text"
                required
                value={docName}
                onChange={(e) => setDocName(e.target.value)}
                placeholder="e.g. Blood Test Report (Lipid & CBC)"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:bg-white focus:border-indigo-600 font-medium"
              />
            </div>

            {/* Quick Mock Presets */}
            <div>
              <span className="block text-[10px] font-medium text-slate-400 mb-1.5">
                Quick Document Name Presets:
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() =>
                    handleSelectPreset(
                      'Blood Test Report (Lipid & CBC)',
                      'Lab Report',
                      'Dr. Lal PathLabs / AIIMS',
                      'Blood_Test_Report_May2025.pdf'
                    )
                  }
                  className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded cursor-pointer transition-colors"
                >
                  🧪 Blood Test Report
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleSelectPreset(
                      'OPD Prescription (General Medicine)',
                      'Prescription',
                      'e-Sanjeevani Teleconsultation',
                      'eSanjeevani_Rx_May2025.pdf'
                    )
                  }
                  className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded cursor-pointer transition-colors"
                >
                  💊 OPD Prescription
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleSelectPreset(
                      'Chest X-Ray Digital PA Scan',
                      'Scan & X-Ray',
                      'Civil Hospital Radiology Dept',
                      'Chest_XRay_PA_Scan.pdf'
                    )
                  }
                  className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded cursor-pointer transition-colors"
                >
                  🩻 Chest X-Ray
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleSelectPreset(
                      'Hospital Discharge Summary',
                      'Discharge Summary',
                      'AIIMS New Delhi Internal Medicine',
                      'AIIMS_Discharge_Summary.pdf'
                    )
                  }
                  className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded cursor-pointer transition-colors"
                >
                  📋 Discharge Summary
                </button>
              </div>
            </div>

            {/* Category & Date Grid */}
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
                  {categoriesList.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Record Date
                </label>
                <input
                  type="date"
                  value={docDate}
                  onChange={(e) => setDocDate(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:bg-white focus:border-indigo-600"
                />
              </div>
            </div>

            {/* Hospital / Clinic */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Hospital / Diagnostic Centre / Lab
              </label>
              <input
                type="text"
                value={hospitalOrLab}
                onChange={(e) => setHospitalOrLab(e.target.value)}
                placeholder="e.g. AIIMS New Delhi, Civil Hospital, SRL Diagnostics"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:bg-white focus:border-indigo-600"
              />
            </div>

            {/* File Upload Drop Area */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Attach File (PDF, Image, Scan)
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
                className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${
                  isDragging
                    ? 'border-indigo-600 bg-indigo-50/50'
                    : 'border-slate-300 hover:border-indigo-400 bg-slate-50/50'
                }`}
              >
                <Upload className="w-5 h-5 text-indigo-600 mx-auto mb-1" />
                <p className="text-xs font-semibold text-slate-800">
                  {selectedFile
                    ? `Selected: ${selectedFile.name} (${(selectedFile.size / 1024).toFixed(0)} KB)`
                    : mockFileName
                    ? `Selected Preset: ${mockFileName}`
                    : 'Click or drop PDF/JPG here'}
                </p>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Click to browse computer files or use preset PDF
                </span>
              </div>
            </div>

            {/* Optional Doctor Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Doctor Notes / Key Remarks (Optional)
              </label>
              <textarea
                rows={2}
                value={doctorNotes}
                onChange={(e) => setDoctorNotes(e.target.value)}
                placeholder="e.g. Fasting Sugar 94 mg/dL, Hemoglobin 14.2 g/dL..."
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:bg-white focus:border-indigo-600 resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isUploading || !docName.trim()}
              className={`w-full py-2.5 px-4 text-xs font-semibold text-white rounded-lg transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer ${
                isUploading || !docName.trim()
                  ? 'bg-indigo-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {isUploading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Encrypting & Adding to Timeline...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Add Document to Health Timeline</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Clean Medical History Timeline View */}
        <div className="lg:col-span-7 space-y-4">
          {/* Search & Category Filter Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search timeline documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:bg-white focus:border-indigo-600"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 shrink-0">
              {['All', 'Lab Report', 'Prescription', 'Scan & X-Ray'].map((cat) => (
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

          {/* Timeline Container */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 sm:p-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-5">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-600" />
                <h2 className="text-sm font-bold text-slate-900">Medical Records Timeline</h2>
                <span className="text-[10px] bg-slate-100 text-slate-600 font-medium px-2 py-0.5 rounded-full">
                  {filteredRecords.length} Files
                </span>
              </div>

              <button
                onClick={handleOpenQrModal}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5 cursor-pointer bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Doctor QR Pass</span>
              </button>
            </div>

            {filteredRecords.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                No documents found matching your filter. Use the form on the left to add a record.
              </div>
            ) : (
              <div className="relative pl-6 sm:pl-7 space-y-5 before:absolute before:left-2.5 sm:before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {filteredRecords.map((record) => (
                  <div key={record.id} className="relative group">
                    {/* Timeline Dot */}
                    <div className="absolute -left-6 sm:-left-7 top-1.5 w-4 h-4 rounded-full bg-white border-2 border-indigo-600 flex items-center justify-center shadow-xs">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                    </div>

                    {/* Timeline Item Card */}
                    <div className="bg-slate-50/70 hover:bg-slate-50 border border-slate-200 rounded-xl p-4 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="space-y-1 flex-1 min-w-0">
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
                                <ShieldCheck className="w-3 h-3 text-emerald-600" /> ABDM
                              </span>
                            )}
                          </div>

                          <h3 className="text-sm font-bold text-slate-900">{record.name}</h3>

                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">{record.hospitalOrLab}</span>
                          </div>

                          {record.doctorNotes && (
                            <p className="text-xs text-slate-600 bg-white p-2 rounded-md border border-slate-200/80 leading-relaxed mt-1.5">
                              <strong className="text-slate-700 font-medium">Notes: </strong>
                              {record.doctorNotes}
                            </p>
                          )}

                          {/* File info pill */}
                          <div className="pt-1">
                            <div className="inline-flex items-center gap-1.5 bg-white border border-slate-200 px-2.5 py-1 rounded text-xs text-slate-700">
                              <FileText className="w-3.5 h-3.5 text-indigo-600" />
                              <span className="font-mono text-[11px] font-medium truncate max-w-[200px]">
                                {record.fileName}
                              </span>
                              <span className="text-[10px] text-slate-400">({record.fileSize})</span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1.5 shrink-0 pt-2 sm:pt-0">
                          <button
                            onClick={() => setPreviewRecord(record)}
                            className="p-1.5 text-slate-600 hover:text-indigo-600 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
                            title="Preview Document"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span className="text-xs">Preview</span>
                          </button>

                          <button
                            onClick={() => {
                              alert(`Downloading verified copy of "${record.fileName}" from ABDM repository.`);
                            }}
                            className="p-1.5 text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
                            title="Download Document"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDelete(record.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 bg-white hover:bg-rose-50 border border-slate-200 rounded-lg text-xs transition-colors cursor-pointer shadow-xs"
                            title="Delete Record"
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
        </div>
      </div>

      {/* Temporary Doctor QR Code Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-md w-full p-5 sm:p-6 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <QrCode className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">Doctor Quick-Scan QR Pass</h3>
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
                  <rect x="5" y="5" width="28" height="28" rx="4" fill="none" stroke="currentColor" strokeWidth="6" />
                  <rect x="13" y="13" width="12" height="12" rx="2" fill="currentColor" />
                  <rect x="67" y="5" width="28" height="28" rx="4" fill="none" stroke="currentColor" strokeWidth="6" />
                  <rect x="75" y="13" width="12" height="12" rx="2" fill="currentColor" />
                  <rect x="5" y="67" width="28" height="28" rx="4" fill="none" stroke="currentColor" strokeWidth="6" />
                  <rect x="13" y="75" width="12" height="12" rx="2" fill="currentColor" />
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
                  ABDM Consent Token #CA-2025-8841
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

              <p className="text-xs text-slate-500 leading-relaxed text-left">
                Show this QR code to your doctor. The physician scans it with their hospital management system
                to instantly view your selected health records for this consultation session only.
              </p>

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
                      National Accreditation Board for Testing Laboratories (NABL) Certified
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
