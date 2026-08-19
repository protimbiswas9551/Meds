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
  const [records, setRecords] = useState<HealthLockerRecord[]>([
    {
      id: 'hl-001',
      name: 'Blood Test Report (Lipid Profile & CBC)',
      category: 'Lab Report',
      date: '2025-05-14',
      hospitalOrLab: 'Dr. Lal PathLabs & Civil Hospital',
      fileName: 'Blood_Test_Lipid_CBC.pdf',
      fileSize: '1.8 MB',
      fileType: 'pdf',
      doctorNotes: 'Fasting glucose: 94 mg/dL, Total cholesterol: 182 mg/dL. Normal limits.',
      isAbdmLinked: true,
    },
    {
      id: 'hl-002',
      name: 'Cardiology ECG & Holter Summary',
      category: 'Scan & X-Ray',
      date: '2025-04-20',
      hospitalOrLab: 'AIIMS New Delhi - Cardiology',
      fileName: 'AIIMS_Cardio_ECG.pdf',
      fileSize: '3.4 MB',
      fileType: 'pdf',
      doctorNotes: 'Normal sinus rhythm, HR 72 bpm. No ST-T segment deviation.',
      isAbdmLinked: true,
    },
    {
      id: 'hl-003',
      name: 'OPD Prescription - General Medicine',
      category: 'Prescription',
      date: '2025-03-10',
      hospitalOrLab: 'e-Sanjeevani Telemedicine',
      fileName: 'eSanjeevani_Rx.pdf',
      fileSize: '840 KB',
      fileType: 'pdf',
      doctorNotes: 'Tab. Paracetamol 650mg SOS, Tab. Cetirizine 10mg OD x 5 days.',
      isAbdmLinked: true,
    },
    {
      id: 'hl-004',
      name: 'Vaccination Certificate (Tetanus & Booster)',
      category: 'Vaccine Certificate',
      date: '2024-11-18',
      hospitalOrLab: 'Urban Primary Health Centre',
      fileName: 'Vaccination_Pass.pdf',
      fileSize: '620 KB',
      fileType: 'pdf',
      doctorNotes: 'Batch #COV-8491. Fully immunized under UIP.',
      isAbdmLinked: true,
    },
  ]);

  // Form states
  const [docName, setDocName] = useState('');
  const [category, setCategory] = useState<HealthLockerRecord['category']>('Lab Report');
  const [hospitalOrLab, setHospitalOrLab] = useState('AIIMS / Civil Hospital');
  const [docDate, setDocDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [mockFileName, setMockFileName] = useState('Blood_Test_Report_2025.pdf');
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

  const handleAddRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim()) return;

    setIsUploading(true);

    setTimeout(() => {
      const finalFileName =
        selectedFile?.name ||
        mockFileName.trim() ||
        `${docName.replace(/\s+/g, '_')}_2025.pdf`;

      const finalFileSize = selectedFile
        ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`
        : '1.5 MB';

      const newRecord: HealthLockerRecord = {
        id: `hl-${Date.now().toString().slice(-4)}`,
        name: docName.trim(),
        category,
        date: docDate || new Date().toISOString().split('T')[0],
        hospitalOrLab: hospitalOrLab.trim() || 'AIIMS / Civil Hospital',
        fileName: finalFileName,
        fileSize: finalFileSize,
        fileType: 'pdf',
        doctorNotes: doctorNotes.trim() || undefined,
        isAbdmLinked: true,
      };

      setRecords([newRecord, ...records]);
      setIsUploading(false);
      setToastMessage(`"${newRecord.name}" added to timeline`);

      // Reset
      setDocName('');
      setSelectedFile(null);
      setMockFileName('Blood_Test_Report_2025.pdf');
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
      {/* Hero Header */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FolderLock className="w-5 h-5 text-indigo-600" />
            <h1 className="text-xl font-bold text-slate-900">Digital Health Locker</h1>
          </div>
          <p className="text-xs text-slate-600">
            Upload medical documents and generate time-limited QR passes for doctor consultations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs text-slate-600 flex items-center gap-1.5 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>ABHA: <strong>91-4820-1948-2830</strong></span>
          </div>
          <button
            onClick={handleOpenQrModal}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-lg text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <QrCode className="w-4 h-4" />
            <span>Doctor QR Pass</span>
          </button>
        </div>
      </div>

      {/* Toast */}
      {toastMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-emerald-700 hover:text-emerald-900 cursor-pointer">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 2-Column Clean Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Upload Form */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900">Upload Document</h2>
            <p className="text-xs text-slate-500 mt-0.5">Add a new health record to your timeline</p>
          </div>

          <form onSubmit={handleAddRecord} className="space-y-3.5">
            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Document Title
              </label>
              <input
                type="text"
                required
                value={docName}
                onChange={(e) => setDocName(e.target.value)}
                placeholder="e.g. Blood Test Report (Lipid Profile)"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:bg-white focus:border-indigo-600"
              />
            </div>

            {/* Presets */}
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setDocName('Blood Test Report (Lipid Profile)');
                  setCategory('Lab Report');
                  setHospitalOrLab('Dr. Lal PathLabs');
                  setMockFileName('Blood_Test_Report.pdf');
                }}
                className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded cursor-pointer transition-colors"
              >
                + Blood Test
              </button>
              <button
                type="button"
                onClick={() => {
                  setDocName('OPD Prescription');
                  setCategory('Prescription');
                  setHospitalOrLab('e-Sanjeevani');
                  setMockFileName('Prescription_OPD.pdf');
                }}
                className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded cursor-pointer transition-colors"
              >
                + Prescription
              </button>
              <button
                type="button"
                onClick={() => {
                  setDocName('Chest X-Ray Scan');
                  setCategory('Scan & X-Ray');
                  setHospitalOrLab('Civil Hospital');
                  setMockFileName('Chest_XRay.pdf');
                }}
                className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded cursor-pointer transition-colors"
              >
                + X-Ray Scan
              </button>
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
                Hospital / Diagnostic Centre
              </label>
              <input
                type="text"
                value={hospitalOrLab}
                onChange={(e) => setHospitalOrLab(e.target.value)}
                placeholder="e.g. AIIMS New Delhi"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:bg-white focus:border-indigo-600"
              />
            </div>

            {/* File Drop */}
            <div>
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
                className={`border border-dashed rounded-lg p-3 text-center cursor-pointer transition-colors ${
                  isDragging
                    ? 'border-indigo-600 bg-indigo-50/50'
                    : 'border-slate-300 hover:border-slate-400 bg-slate-50/50'
                }`}
              >
                <Upload className="w-4 h-4 text-slate-400 mx-auto mb-1" />
                <p className="text-xs font-medium text-slate-700">
                  {selectedFile ? selectedFile.name : mockFileName || 'Select or drop file'}
                </p>
                <span className="text-[10px] text-slate-400">PDF, PNG, or JPG up to 10MB</span>
              </div>
            </div>

            {/* Doctor Remark */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Doctor Notes (Optional)
              </label>
              <textarea
                rows={2}
                value={doctorNotes}
                onChange={(e) => setDoctorNotes(e.target.value)}
                placeholder="e.g. Fasting sugar: 94 mg/dL, normal..."
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
                  <span>Adding Document...</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Document</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Timeline */}
        <div className="lg:col-span-7 space-y-4">
          {/* Search & Filter */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search documents..."
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

          {/* Timeline List */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-600" />
                <h2 className="text-sm font-bold text-slate-900">Medical Timeline</h2>
              </div>
              <span className="text-xs text-slate-500">{filteredRecords.length} Records</span>
            </div>

            {filteredRecords.length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-xs space-y-2">
                <p>No documents found matching your filter.</p>
                {records.length === 0 && (
                  <button
                    onClick={() => {
                      setRecords([
                        {
                          id: 'hl-001',
                          name: 'Blood Test Report (Lipid Profile & CBC)',
                          category: 'Lab Report',
                          date: '2025-05-14',
                          hospitalOrLab: 'Dr. Lal PathLabs & Civil Hospital',
                          fileName: 'Blood_Test_Lipid_CBC.pdf',
                          fileSize: '1.8 MB',
                          fileType: 'pdf',
                          doctorNotes: 'Fasting glucose: 94 mg/dL, Total cholesterol: 182 mg/dL. Normal limits.',
                          isAbdmLinked: true,
                        },
                        {
                          id: 'hl-002',
                          name: 'Cardiology ECG & Holter Summary',
                          category: 'Scan & X-Ray',
                          date: '2025-04-20',
                          hospitalOrLab: 'AIIMS New Delhi - Cardiology',
                          fileName: 'AIIMS_Cardio_ECG.pdf',
                          fileSize: '3.4 MB',
                          fileType: 'pdf',
                          doctorNotes: 'Normal sinus rhythm, HR 72 bpm. No ST-T segment deviation.',
                          isAbdmLinked: true,
                        },
                      ]);
                      setToastMessage('Sample documents restored');
                      setTimeout(() => setToastMessage(null), 3000);
                    }}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 underline cursor-pointer"
                  >
                    Restore sample documents
                  </button>
                )}
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

                          <div className="flex items-center gap-1.5 text-xs text-slate-500">
                            <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">{record.hospitalOrLab}</span>
                          </div>

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

      {/* QR Code Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-sm w-full p-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <QrCode className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">Doctor QR Pass</h3>
              </div>
              <button
                onClick={() => setShowQrModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full text-xs text-amber-800 font-medium">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>Expires in: {formatTimer(qrExpirySeconds)}</span>
              </div>

              {/* Minimal SVG QR */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg inline-block">
                <svg className="w-40 h-40 mx-auto text-slate-900" viewBox="0 0 100 100" fill="currentColor">
                  <rect x="6" y="6" width="26" height="26" rx="3" fill="none" stroke="currentColor" strokeWidth="5" />
                  <rect x="13" y="13" width="12" height="12" rx="1" fill="currentColor" />
                  <rect x="68" y="6" width="26" height="26" rx="3" fill="none" stroke="currentColor" strokeWidth="5" />
                  <rect x="75" y="13" width="12" height="12" rx="1" fill="currentColor" />
                  <rect x="6" y="68" width="26" height="26" rx="3" fill="none" stroke="currentColor" strokeWidth="5" />
                  <rect x="13" y="75" width="12" height="12" rx="1" fill="currentColor" />
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
              </div>

              {/* PIN Box */}
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex items-center justify-between">
                <div className="text-left">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">Doctor Security PIN</span>
                  <span className="font-mono text-base font-bold text-slate-900 tracking-wider">{accessPin}</span>
                </div>
                <button
                  onClick={handleCopyPin}
                  className="px-2.5 py-1 text-xs font-medium text-indigo-700 bg-white border border-indigo-200 rounded hover:bg-indigo-50 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  {copiedPin ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedPin ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setQrExpirySeconds(900);
                    setAccessPin(Math.floor(1000 + Math.random() * 9000).toString());
                  }}
                  className="flex-1 py-2 px-3 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                >
                  Regenerate
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
                <div className="flex justify-between">
                  <span className="text-slate-500">Hospital:</span>
                  <span className="font-semibold text-slate-800">{previewRecord.hospitalOrLab}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">File:</span>
                  <span className="font-mono text-slate-800">{previewRecord.fileName} ({previewRecord.fileSize})</span>
                </div>
              </div>

              {previewRecord.doctorNotes && (
                <div className="p-3 bg-white border border-slate-200 rounded-lg">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Clinical Remarks</span>
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
