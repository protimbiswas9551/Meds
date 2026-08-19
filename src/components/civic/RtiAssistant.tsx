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
  ExternalLink,
} from 'lucide-react';
import { RTI_TEMPLATES } from '../../data/mockData';
import { RtiTemplate } from '../../types';

export const RtiAssistant: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<RtiTemplate>(RTI_TEMPLATES[0]);
  const [applicantName, setApplicantName] = useState('');
  const [applicantAddress, setApplicantAddress] = useState('');
  const [applicantMobile, setApplicantMobile] = useState('');
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

1. Full Name of Applicant: ${applicantName.trim() || '[Your Full Name]'}
2. Postal Address for Correspondence: ${applicantAddress.trim() || '[Your Postal Address]'}
3. Contact Number / Email: ${applicantMobile.trim() || '[Your Mobile / Email]'}
4. Specific Particulars of Information Required:
${activeQuestions.map((q, i) => `   (${i + 1}) ${q}`).join('\n')}

5. Period to which the information relates: Preceding 3 Years / Current Financial Year
6. Mode of Delivery of Information: Certified Hard Copies / Official Electronic Email PDF
7. Statutory Application Fee Details:
   - Prescribed fee of Rs. 10/- attached via Postal Order / Demand Draft / Online RTI Portal Receipt.
   - (Exempted if applicant belongs to Below Poverty Line / BPL category with attached proof).

Declaration:
I hereby state that I am a citizen of India and the information sought falls within the scope of Section 2(f) and Section 6(1) of the RTI Act, 2005, and does not fall under exemptions of Section 8.

Date: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
Place: [Your City]

_______________________
Signature of Applicant
(${applicantName.trim() || 'Applicant'})`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullRtiText);
    setCopiedLetter(true);
    setTimeout(() => setCopiedLetter(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Scale className="w-5 h-5 text-indigo-600" />
            <h1 className="text-xl font-bold text-slate-900">
              RTI Legal Application Drafter
            </h1>
          </div>
          <p className="text-xs text-slate-600">
            Generate legally compliant RTI applications under Section 6(1) of the Right to Information Act, 2005.
          </p>
        </div>

        <a
          href="https://rtionline.gov.in"
          target="_blank"
          rel="noreferrer"
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer self-start md:self-auto"
        >
          <span>Official RTI Online Portal</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: Template Selector & Applicant details */}
        <div className="lg:col-span-5 space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Step 1: Choose RTI Subject
          </div>

          <div className="space-y-2">
            {RTI_TEMPLATES.map((tmpl) => (
              <button
                key={tmpl.id}
                onClick={() => handleSelectTemplate(tmpl)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                  selectedTemplate.id === tmpl.id
                    ? 'bg-indigo-50/70 border-indigo-300 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="font-bold text-slate-900 text-xs mb-1">{tmpl.title}</div>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{tmpl.description}</p>
              </button>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 shadow-xs">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Step 2: Enter Applicant Details
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">Your Full Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={applicantName}
                onChange={(e) => setApplicantName(e.target.value)}
                className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:bg-white focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">Postal Address</label>
              <input
                type="text"
                placeholder="Enter correspondence address"
                value={applicantAddress}
                onChange={(e) => setApplicantAddress(e.target.value)}
                className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:bg-white focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">Mobile / Email</label>
              <input
                type="text"
                placeholder="+91 98765 43210 or email@domain.com"
                value={applicantMobile}
                onChange={(e) => setApplicantMobile(e.target.value)}
                className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:bg-white focus:border-indigo-600"
              />
            </div>
          </div>
        </div>

        {/* Right column: Form Preview & Questions editor */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Drafted Legal RTI Application
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedLetter ? 'Copied!' : 'Copy Letter'}</span>
              </button>
              <button
                onClick={() => window.print()}
                className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>
            </div>
          </div>

          {/* Letter Draft Preview */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 font-mono text-xs text-slate-800 whitespace-pre-wrap leading-relaxed max-h-[520px] overflow-y-auto">
            {fullRtiText}
          </div>

          {/* RTI Rule Guidelines */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-700 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Statutory RTI Rights Under Section 7(1)</span>
            </div>
            <p className="leading-relaxed text-slate-600">
              The Public Information Officer (PIO) is mandated by law to provide certified information within
              <strong> 30 days</strong> (or <strong>48 hours</strong> if concerning life and personal liberty).
              Filing fee is ₹10 (Free for BPL cardholders). Applications can be submitted online via{' '}
              <a
                href="https://rtionline.gov.in"
                target="_blank"
                rel="noreferrer"
                className="text-indigo-600 underline font-medium"
              >
                rtionline.gov.in
              </a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
