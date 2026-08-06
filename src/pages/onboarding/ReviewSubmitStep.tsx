import React from 'react';
import { motion } from 'framer-motion';
import { Check, Shield, FileText, ArrowRight } from 'lucide-react';
import type { AadhaarData } from './AadhaarVerificationStep';
import type { PANData } from './PANVerificationStep';
import type { BankData } from './BankDetailsStep';

interface ReviewSubmitStepProps {
  aadhaarData: Partial<AadhaarData>;
  panData: Partial<PANData>;
  bankData: Partial<BankData>;
  onComplete: () => void;
}

export const ReviewSubmitStep: React.FC<ReviewSubmitStepProps> = ({ 
  aadhaarData, 
  panData, 
  bankData, 
  onComplete 
}) => {

  const DataRow = ({ label, value }: { label: string, value: string | undefined }) => (
    <div className="flex justify-between items-center py-3 border-b border-slate-100 last:border-0">
      <span className="text-sm font-medium text-slate-500">{label}</span>
      <span className="text-sm font-bold text-slate-900">{value || 'Not provided'}</span>
    </div>
  );

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Review Application</h2>
        <p className="text-sm text-slate-500 font-medium mt-2 leading-relaxed">
          Please review the details below. Once submitted, your KYC will be processed for account opening.
        </p>
      </div>

      <div className="space-y-6">
        
        {/* Identity Details */}
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">Identity Details</h3>
          </div>
          <div className="bg-white rounded-xl border border-slate-100 px-4">
            <DataRow label="Aadhaar Number" value={aadhaarData.aadhaarNumber?.replace(/.(?=.{4})/g, '*')} />
            <DataRow label="PAN Number" value={panData.panNumber} />
          </div>
        </div>

        {/* Bank Details */}
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
          <div className="flex items-center gap-2 mb-4">
            <Check className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900">Bank Details</h3>
          </div>
          <div className="bg-white rounded-xl border border-slate-100 px-4">
            <DataRow label="Account Number" value={bankData.accountNumber?.replace(/.(?=.{4})/g, '*')} />
            <DataRow label="IFSC Code" value={bankData.ifscCode} />
          </div>
        </div>

        {/* Documents Signed */}
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-purple-600" />
            <h3 className="text-base font-bold text-slate-900">Agreements</h3>
          </div>
          <div className="bg-white rounded-xl border border-slate-100 px-4 py-3 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">Account Opening Form</span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">Digitally Signed</span>
          </div>
        </div>

      </div>

      <div className="mt-10">
        <button 
          onClick={onComplete}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-blue-600/20 active:scale-[0.98]"
        >
          Submit Application
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
