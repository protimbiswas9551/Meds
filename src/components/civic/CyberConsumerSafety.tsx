import React, { useState } from 'react';
import {
  ShieldAlert,
  PhoneCall,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileWarning,
  Copy,
  ExternalLink,
  Sparkles,
  Scale,
} from 'lucide-react';

export const CyberConsumerSafety: React.FC = () => {
  const [fraudType, setFraudType] = useState('UPI / QR Code Fraud');
  const [fraudAmount, setFraudAmount] = useState('');
  const [transactionRef, setTransactionRef] = useState('');
  const [copiedBankMsg, setCopiedBankMsg] = useState(false);

  const bankFreezeMessage = `URGENT NOTICE OF FRAUDULENT TRANSACTION - IMMEDIATE FREEZE REQUEST

To,
The Nodal Officer / Fraud Risk Management (FRM),
Bank & Payment Gateway

I hereby formally report an unauthorized/fraudulent transaction:
- Incident Category: ${fraudType}
- Transaction Reference / UTR No: ${transactionRef.trim() || '[Your UTR Number]'}
- Amount Deducted: Rs. ${fraudAmount.trim() || '[Amount]'}
- Date & Time: ${new Date().toLocaleTimeString()} ${new Date().toLocaleDateString('en-IN')}

As per Reserve Bank of India (RBI) Circular on Limiting Liability of Customers in Unauthorized Electronic Banking Transactions (Zero Liability), I am notifying the bank within the mandatory reporting window. Please immediately initiate an inter-bank freeze request on the beneficiary account, log this under NCRP 1930, and reverse the funds.

Applicant Name: [Your Name]
Contact: [Your Mobile Number]`;

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(bankFreezeMessage);
    setCopiedBankMsg(true);
    setTimeout(() => setCopiedBankMsg(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            <h1 className="text-xl font-bold text-slate-900">
              National Cyber Financial Fraud (1930) & Consumer Helpline
            </h1>
          </div>
          <p className="text-xs text-slate-600">
            Emergency protocols for freezing fraudulent bank deductions and lodging statutory consumer complaints.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <a
            href="https://cybercrime.gov.in"
            target="_blank"
            rel="noreferrer"
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200"
          >
            <span>cybercrime.gov.in</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-600" />
          </a>
          <a
            href="tel:1930"
            className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Call 1930 Helpline</span>
          </a>
        </div>
      </div>

      {/* Golden Hour Action Stepper */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-5 h-5 text-rose-600" />
          <h2 className="text-sm font-bold text-slate-900">
            The 120-Minute &quot;Golden Hour&quot; Emergency Protocol
          </h2>
          <span className="text-xs bg-rose-50 text-rose-700 font-semibold px-2.5 py-0.5 rounded-full ml-auto border border-rose-200">
            94% Recovery Rate within 2 Hours
          </span>
        </div>
        <p className="text-xs text-slate-500 mb-4">
          If you have encountered unauthorized banking, UPI, or OTP fraud, follow these steps immediately:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-rose-600 text-white text-[11px] font-bold flex items-center justify-center">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-xs">Dial 1930 Immediately</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              National Cyber Financial Fraud Reporting System registers your UTR and flags the recipient wallet/account.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-amber-600 text-white text-[11px] font-bold flex items-center justify-center">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-xs">Beneficiary Freeze</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Real-time API alerts are dispatched to recipient banks/gateways to lock funds prior to cash withdrawal.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] font-bold flex items-center justify-center">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-xs">Bank Notice Submission</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Submit written incident notice to your branch within 72 hours for RBI Zero Liability indemnity.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Bank Notice Generator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-3.5">
          <h3 className="font-bold text-sm text-slate-900">Bank Incident Notice Drafter</h3>
          <p className="text-xs text-slate-500">
            Fulfills RBI customer protection guidelines for zero liability
          </p>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Incident Category</label>
            <select
              value={fraudType}
              onChange={(e) => setFraudType(e.target.value)}
              className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:bg-white focus:border-indigo-600"
            >
              <option value="UPI / QR Code Fraud">UPI / QR Code Fraud</option>
              <option value="Fake Customer Care Helpline">Fake Search Engine Helpline Scam</option>
              <option value="Electricity Bill Disconnection SMS Scam">Bill Disconnection SMS Scam</option>
              <option value="Part-Time Job / Task Scam">Online Task / Telegram Scam</option>
              <option value="Credit Card KYC Update Link">KYC Update Phishing Link</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Amount Deducted (₹)</label>
            <input
              type="text"
              placeholder="e.g. 15000"
              value={fraudAmount}
              onChange={(e) => setFraudAmount(e.target.value)}
              className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:bg-white focus:border-indigo-600"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Transaction Reference / UTR Number
            </label>
            <input
              type="text"
              placeholder="e.g. UPI/2025/12345678"
              value={transactionRef}
              onChange={(e) => setTransactionRef(e.target.value)}
              className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:bg-white focus:border-indigo-600 font-mono"
            />
          </div>
        </div>

        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Ready-to-Send Bank Notice
            </span>
            <button
              onClick={handleCopyMessage}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedBankMsg ? 'Copied!' : 'Copy Notice'}</span>
            </button>
          </div>

          <div className="bg-slate-900 text-slate-100 rounded-xl p-5 font-mono text-xs whitespace-pre-wrap leading-relaxed border border-slate-800 shadow-xs">
            {bankFreezeMessage}
          </div>
        </div>
      </div>
    </div>
  );
};
