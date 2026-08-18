import React, { useState } from 'react';
import {
  FileText,
  Copy,
  CheckCircle,
  Download,
  Printer,
  Sparkles,
  HelpCircle,
  ShieldCheck,
  Scale,
  Send,
} from 'lucide-react';
import { RTI_TEMPLATES } from '../../data/mockData';
import { RtiTemplate } from '../../types';

export const RtiAssistant: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<RtiTemplate>(RTI_TEMPLATES[0]);
  const [applicantName, setApplicantName] = useState('Rajesh Kumar Sharma');
  const [applicantAddress, setApplicantAddress] = useState('Flat 402, Block B, Lajpat Nagar, New Delhi - 110024');
  const [applicantMobile, setApplicantMobile] = useState('+91 98765 43210');
  const [customQuestion, setCustomQuestion] = useState('');
  const [activeQuestions, setActiveQuestions] = useState<string[]>(RTI_TEMPLATES[0].questions);
  const [copiedLetter, setCopiedLetter] = useState(false);

  const handleSelectTemplate = (template: RtiTemplate) => {
    setSelectedTemplate(template);
    setActiveQuestions(template.questions);
  };

  const handleAddQuestion = () => {
    if (customQuestion.trim()) {
      setActiveQuestions([...activeQuestions, customQuestion.trim()]);
      setCustomQuestion('');
    }
  };

  const handleRemoveQuestion = (idx: number) => {
    setActiveQuestions(activeQuestions.filter((_, i) => i !== idx));
  };

  // Generate full official RTI letter text
  const fullRtiText = `APPLICATION UNDER SECTION 6(1) OF THE RIGHT TO INFORMATION ACT, 2005

To,
The Public Information Officer (PIO),
${selectedTemplate.publicAuthority}

Subject: Request for Information under Right to Information Act, 2005 regarding: ${selectedTemplate.title}

1. Full Name of the Applicant: ${applicantName || '[Your Full Name]'}
2. Postal Address for Correspondence: ${applicantAddress || '[Your Address]'}
3. Contact Number: ${applicantMobile || '[Your Mobile]'}
4. Particulars of Information Required:
${activeQuestions.map((q, i) => `   (${i + 1}) ${q}`).join('\n')}

5. Period to which the information relates: Preceding 3 Years / Current Financial Year
6. Format of Information: Certified Hard Copies / Electronic email PDF
7. Application Fee Details:
   - Fee of Rs. 10/- attached via Postal Order / Demand Draft / Online RTI Portal Receipt
   - (Exempted if applicant belongs to Below Poverty Line / BPL category)

Declaration:
I hereby state that I am a citizen of India and the information sought falls within the scope of Section 2(f) of the RTI Act, 2005.

Date: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
Place: New Delhi

_______________________
Signature of Applicant
(${applicantName})`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullRtiText);
    setCopiedLetter(true);
    setTimeout(() => setCopiedLetter(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-linear-to-r from-slate-900 via-indigo-950 to-blue-950 rounded-2xl p-5 sm:p-6 text-white shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <Scale className="w-3.5 h-3.5 text-indigo-300" /> Right to Information Act, 2005
          </span>
          <span className="text-xs text-slate-300">Central & State Information Commission</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight mb-2">
          RTI Legal Application Drafter & Generator
        </h1>
        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-3xl">
          Hold government bodies accountable. Generate legally sound, certified RTI queries for road tenders,
          ration allocations, delayed citizen certificates, and municipal fund audits in seconds.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: Template Selector & Applicant details */}
        <div className="lg:col-span-5 space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Step 1: Choose RTI Template
          </div>

          <div className="space-y-2.5">
            {RTI_TEMPLATES.map((tmpl) => (
              <button
                key={tmpl.id}
                onClick={() => handleSelectTemplate(tmpl)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                  selectedTemplate.id === tmpl.id
                    ? 'bg-indigo-50/70 border-indigo-400 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-slate-900">{tmpl.title}</span>
                </div>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{tmpl.description}</p>
              </button>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 shadow-xs">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Step 2: Applicant Information
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Your Full Name</label>
              <input
                type="text"
                value={applicantName}
                onChange={(e) => setApplicantName(e.target.value)}
                className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Postal Address</label>
              <input
                type="text"
                value={applicantAddress}
                onChange={(e) => setApplicantAddress(e.target.value)}
                className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Mobile / Email</label>
              <input
                type="text"
                value={applicantMobile}
                onChange={(e) => setApplicantMobile(e.target.value)}
                className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Right column: Form Preview & Questions editor */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Generated Legal RTI Application
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedLetter ? 'Copied to Clipboard!' : 'Copy Letter'}</span>
              </button>
              <button
                onClick={() => window.print()}
                className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>
            </div>
          </div>

          {/* Letter Draft Preview */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 font-mono text-xs text-slate-800 whitespace-pre-wrap leading-relaxed max-h-[550px] overflow-y-auto border-l-4 border-l-indigo-600">
            {fullRtiText}
          </div>

          {/* RTI Rule Guidelines */}
          <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 text-xs text-indigo-950 space-y-1.5">
            <div className="flex items-center gap-2 font-bold">
              <ShieldCheck className="w-4 h-4 text-indigo-700" />
              <span>Statutory RTI Rights Under Section 7(1)</span>
            </div>
            <p className="leading-relaxed text-indigo-900/80">
              The Public Information Officer (PIO) is mandated by law to provide certified information within
              <strong> 30 days</strong> (or <strong>48 hours</strong> if it concerns life and personal liberty).
              Filing fee is strictly ₹10 (Free for BPL cardholders).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
