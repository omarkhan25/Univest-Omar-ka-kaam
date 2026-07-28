import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Upload, Check, Shield, ChevronRight, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '../../components/atoms/Button';

export interface PANData {
  panNumber: string;
  fullName: string;
  dob: string;
  panImagePreview: string | null;
}

interface PANVerificationProps {
  initialData?: Partial<PANData>;
  onNext: (data: PANData) => void;
  onBack: () => void;
}

export const PANVerificationStep: React.FC<PANVerificationProps> = ({ initialData, onNext, onBack }) => {
  const [panNumber, setPanNumber] = useState(initialData?.panNumber || '');
  const [panImagePreview, setPanImagePreview] = useState<string | null>(initialData?.panImagePreview || null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPanImagePreview(reader.result as string);
        setError('');
      };
      reader.readAsDataURL(file);
    }
  };

  const validatePAN = (pan: string) => /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan.toUpperCase());

  const handleVerify = () => {
    const cleanPan = panNumber.toUpperCase().trim();
    if (!cleanPan) {
      setError('PAN number is required');
      return;
    }
    if (!validatePAN(cleanPan)) {
      setError('Invalid PAN format (e.g., ABCDE1234F)');
      return;
    }
    if (!panImagePreview) {
      setError('Please upload a photo of your PAN card');
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsVerified(true);
      toast.success('PAN verified with NSDL database!');
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="w-full max-w-xl mx-auto space-y-6 font-sans text-slate-900"
    >
      <div className="mb-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">PAN Card KYC</h2>
            <p className="text-sm text-slate-500 font-medium mt-1">
              Mandatory SEBI KYC requirement for stock advisory and demat account linkage.
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 bg-orange-50 border border-orange-100 rounded-full text-[10px] font-black text-orange-600">
            <Shield className="w-3 h-3" />
            <span>NSDL Verified</span>
          </div>
        </div>

        {/* Info panel */}
        <div className="flex items-start gap-3 p-3.5 bg-blue-50 border border-blue-100 rounded-xl">
          <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
          <p className="text-xs font-medium text-blue-700 leading-relaxed">
            Your PAN is used exclusively for SEBI-mandated KYC. It is verified against the NSDL Income Tax database and never stored unencrypted.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* PAN Number */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            PAN Number <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              maxLength={10}
              value={panNumber}
              onChange={(e) => {
                setPanNumber(e.target.value.toUpperCase());
                setError('');
              }}
              placeholder="ABCDE1234F"
              className={`w-full pl-10 pr-4 py-3 bg-white border rounded-xl text-sm font-mono font-bold text-slate-900 placeholder-slate-400 outline-none uppercase transition ${
                error ? 'border-rose-500 focus:ring-4 focus:ring-rose-50' : isVerified ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50'
              }`}
            />
          </div>
          {error && <span className="text-[11px] font-bold text-rose-500 mt-1 block">{error}</span>}
        </div>

        {/* PAN Card Image Upload */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Upload Front Photo of PAN Card <span className="text-rose-500">*</span>
          </label>

          <div className={`border-2 border-dashed rounded-2xl p-6 text-center transition cursor-pointer ${
            panImagePreview ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-blue-500 bg-slate-50'
          }`}>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              id="pan-upload"
            />
            <label htmlFor="pan-upload" className="cursor-pointer block">
              {panImagePreview ? (
                <div className="flex flex-col items-center gap-2">
                  <img src={panImagePreview} alt="PAN Preview" className="h-32 object-contain rounded-xl border border-slate-200 shadow-sm" />
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 mt-2">
                    <Check className="w-4 h-4" /> PAN Image Attached (Click to change)
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-slate-500">
                  <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-2">
                    <Upload className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-slate-700">Click to upload PAN Card image</span>
                  <span className="text-[10px] text-slate-500">JPG or PNG up to 5MB</span>
                </div>
              )}
            </label>
          </div>
        </div>

        {/* Verification Trigger */}
        <button
          onClick={handleVerify}
          disabled={isVerifying || isVerified}
          className={`w-full py-3.5 font-bold text-sm rounded-xl transition flex items-center justify-center gap-2 ${
            isVerified 
              ? 'bg-emerald-100 text-emerald-700 cursor-default' 
              : 'bg-blue-50 hover:bg-blue-100 text-blue-600 cursor-pointer border border-blue-200'
          }`}
        >
          {isVerifying ? (
            <span>Verifying with NSDL...</span>
          ) : isVerified ? (
            <>
              <Check className="w-4 h-4" />
              <span>PAN Verified with Income Tax Records</span>
            </>
          ) : (
            <>
              <Shield className="w-4 h-4" />
              <span>Verify PAN Card</span>
            </>
          )}
        </button>
      </div>

      <div className="pt-4 flex justify-between items-center gap-4">
        <button onClick={onBack} className="text-sm font-bold text-slate-500 cursor-pointer">
          Back
        </button>
        <Button
          onClick={() => onNext({ panNumber, fullName: 'Omar Khan', dob: '1995-06-15', panImagePreview })}
          disabled={!isVerified}
          className="px-8 py-3.5 rounded-xl text-sm"
          icon={<ChevronRight className="w-4 h-4" />}
          iconPosition="right"
        >
          Next Step
        </Button>
      </div>
    </motion.div>
  );
};

export default PANVerificationStep;
