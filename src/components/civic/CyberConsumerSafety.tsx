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
  const [fraudAmount, setFraudAmount] = useState('15000');
  const [transactionRef, setTransactionRef] = useState('UPI/2025/94829104');
  const [copiedBankMsg, setCopiedBankMsg] = useState(false);

  const bankFreezeMessage = `URGENT NOTICE OF FRAUDULENT TRANSACTION - IMMEDIATE FREEZE REQUEST

To,
The Nodal Officer / Fraud Risk Management (FRM),
My Bank & Payment Gateway

I hereby report an unauthorized/fraudulent transaction:
- Fraud Category: ${fraudType}
- Transaction Reference / UTR No: ${transactionRef}
- Amount Deducted: Rs. ${fraudAmount}
- Date & Time: ${new Date().toLocaleTimeString()} ${new Date().toLocaleDateString()}

As per RBI Circular on Limiting Liability of Customers in Unauthorized Electronic Banking Transactions, I am reporting within the ZERO LIABILITY golden hour window. Please immediately freeze the beneficiary account / reverse the funds and register this under NCRP 1930.`;

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(bankFreezeMessage);
    setCopiedBankMsg(true);
    setTimeout(() => setCopiedBankMsg(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-linear-to-r from-rose-950 via-slate-900 to-indigo-950 rounded-2xl p-5 sm:p-6 text-white shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-rose-500/20 text-rose-300 border border-rose-400/30 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" /> I4C (Indian Cyber Crime Coordination Centre)
          </span>
          <span className="text-xs text-slate-300">Ministry of Home Affairs & Department of Consumer Affairs</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight mb-2">
          Cyber Financial Fraud Helpline (1930) & Consumer Forum
        </h1>
        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-3xl">
          Actionable protocols for freezing unauthorized bank deductions within the crucial 2-hour golden window
          and lodging statutory complaints against deceptive business practices.
        </p>

        <div className="flex flex-wrap gap-2.5 mt-4">
          <a
            href="tel:1930"
            className="bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-bold px-4 py-2 rounded-xl text-xs sm:text-sm shadow-md transition-colors flex items-center gap-2"
          >
            <PhoneCall className="w-4 h-4 animate-pulse" />
            <span>Call 1930 Cyber Cell Now</span>
          </a>
          <a
            href="tel:1915"
            className="bg-white/10 hover:bg-white/20 text-white font-semibold border border-white/20 px-4 py-2 rounded-xl text-xs sm:text-sm transition-all flex items-center gap-2"
          >
            <Scale className="w-4 h-4 text-amber-300" />
            <span>Call 1915 Consumer Helpline</span>
          </a>
        </div>
      </div>

      {/* Golden Hour Action Stepper */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-5 h-5 text-rose-600" />
          <h2 className="text-base font-bold text-slate-900">
            The 120-Minute &quot;Golden Hour&quot; Emergency Protocol
          </h2>
          <span className="text-xs bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-full ml-auto">
            94% Recovery Rate within 2 Hours
          </span>
        </div>
        <p className="text-xs text-slate-500 mb-4">
          If you have fallen victim to online banking, OTP, or UPI fraud, follow these steps immediately:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200 space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-rose-600 text-white text-xs font-bold flex items-center justify-center">
                1
              </div>
              <h4 className="font-bold text-slate-900 text-xs sm:text-sm">Call 1930 Immediately</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Dial 1930 (NCRP Citizen Financial Cyber Fraud Reporting System). Operator flags your transaction in the
              national banking clearing network.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-amber-600 text-white text-xs font-bold flex items-center justify-center">
                2
              </div>
              <h4 className="font-bold text-slate-900 text-xs sm:text-sm">Beneficiary Account Freeze</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              1930 system sends real-time API freeze commands to recipient banks/wallets (Paytm, PhonePe, SBI, HDFC)
              preventing fraudsters from withdrawing cash.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                3
              </div>
              <h4 className="font-bold text-slate-900 text-xs sm:text-sm">Formal Bank Notice</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Send the written notice generated below to your bank branch within 72 hours for full RBI Zero Liability
              protection.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Bank Notice Generator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-3.5">
          <h3 className="font-bold text-base text-slate-900">Generate Bank Incident Notice</h3>
          <p className="text-xs text-slate-500">
            Fulfills RBI customer protection guidelines for zero liability
          </p>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Fraud Technique</label>
            <select
              value={fraudType}
              onChange={(e) => setFraudType(e.target.value)}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold focus:outline-hidden"
            >
              <option value="UPI / QR Code Fraud">UPI / QR Code Phishing Fraud</option>
              <option value="Fake Customer Care Helpline">Fake Customer Care Number on Search Engine</option>
              <option value="Electricity Bill Disconnection SMS Scam">Electricity Bill Disconnection SMS Scam</option>
              <option value="Part-Time Job / Telegram Task Scam">Part-Time Job / Telegram Task Scam</option>
              <option value="Credit Card KYC Update Link">Credit Card KYC Update Phishing Link</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Amount Deducted (₹)</label>
            <input
              type="text"
              value={fraudAmount}
              onChange={(e) => setFraudAmount(e.target.value)}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Transaction Reference / UTR Number
            </label>
            <input
              type="text"
              value={transactionRef}
              onChange={(e) => setTransactionRef(e.target.value)}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold focus:outline-hidden font-mono"
            />
          </div>
        </div>

        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Ready-to-Send Legal Notice Copy
            </span>
            <button
              onClick={handleCopyMessage}
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedBankMsg ? 'Copied to Clipboard!' : 'Copy Notice Text'}</span>
            </button>
          </div>

          <div className="bg-slate-900 text-slate-100 rounded-2xl p-5 font-mono text-xs whitespace-pre-wrap leading-relaxed border border-slate-800 shadow-xs">
            {bankFreezeMessage}
          </div>
        </div>
      </div>
    </div>
  );
};
