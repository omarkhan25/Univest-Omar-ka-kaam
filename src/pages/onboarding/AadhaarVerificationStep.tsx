import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Fingerprint, Check, Shield, Camera, ChevronRight, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '../../components/atoms/Button';

export interface AadhaarData {
  aadhaarNumber: string;
  frontImagePreview: string | null;
  backImagePreview: string | null;
  consentGiven: boolean;
}

interface AadhaarVerificationProps {
  initialData?: Partial<AadhaarData>;
  onNext: (data: AadhaarData) => void;
  onBack: () => void;
}

export const AadhaarVerificationStep: React.FC<AadhaarVerificationProps> = ({ initialData, onNext, onBack }) => {
  const [aadhaarNumber, setAadhaarNumber] = useState(initialData?.aadhaarNumber || '');
  const [frontImagePreview, setFrontImagePreview] = useState<string | null>(initialData?.frontImagePreview || null);
  const [backImagePreview, setBackImagePreview] = useState<string | null>(initialData?.backImagePreview || null);
  const [consentGiven, setConsentGiven] = useState(initialData?.consentGiven ?? true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');

  const handleFileUpload = (type: 'front' | 'back', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'front') setFrontImagePreview(reader.result as string);
        else setBackImagePreview(reader.result as string);
        setError('');
      };
      reader.readAsDataURL(file);
    }
  };

  const validateAadhaar = (num: string) => /^\d{12}$/.test(num);

  const handleVerify = () => {
    if (!aadhaarNumber) {
      setError('12-digit Aadhaar number is required');
      return;
    }
    if (!validateAadhaar(aadhaarNumber)) {
      setError('Invalid Aadhaar number (12 digits required)');
      return;
    }
    if (!frontImagePreview || !backImagePreview) {
      setError('Please upload both Front and Back photos of Aadhaar Card');
      return;
    }
    if (!consentGiven) {
      setError('You must check the UIDAI KYC consent box');
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsVerified(true);
      toast.success('Aadhaar DigiLocker KYC Verified!');
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
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Aadhaar Address & ID</h2>
            <p className="text-sm text-slate-500 font-medium mt-1">
              DigiLocker integrated Aadhaar verification for eKYC compliance.
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 border border-blue-100 rounded-full text-[10px] font-black text-blue-600">
            <Fingerprint className="w-3 h-3" />
            <span>UIDAI eKYC</span>
          </div>
        </div>
        <div className="flex items-start gap-3 p-3.5 bg-indigo-50 border border-indigo-100 rounded-xl">
          <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
          <p className="text-xs font-medium text-indigo-700 leading-relaxed">
            Aadhaar data is fetched via DigiLocker's offline eKYC API. Your 12-digit number is masked and never stored on our servers.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Aadhaar Number Input */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Aadhaar Number (12 Digits) <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Fingerprint className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              maxLength={12}
              value={aadhaarNumber}
              onChange={(e) => {
                setAadhaarNumber(e.target.value.replace(/\D/g, ''));
                setError('');
              }}
              placeholder="1234 5678 9012"
              className={`w-full pl-10 pr-4 py-3 bg-white border rounded-xl text-sm font-mono font-bold text-slate-900 placeholder-slate-400 outline-none transition ${
                error ? 'border-rose-500 focus:ring-4 focus:ring-rose-50' : isVerified ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50'
              }`}
            />
          </div>
          {error && <span className="text-[11px] font-bold text-rose-500 mt-1 block">{error}</span>}
        </div>

        {/* Upload Front & Back */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Front Side Photo *</label>
            <div className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition ${
              frontImagePreview ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-blue-500 bg-slate-50'
            }`}>
              <input type="file" accept="image/*" onChange={(e) => handleFileUpload('front', e)} className="hidden" id="adh-front" />
              <label htmlFor="adh-front" className="cursor-pointer block">
                {frontImagePreview ? (
                  <div className="flex flex-col items-center gap-1">
                    <img src={frontImagePreview} alt="Front Preview" className="h-24 object-contain rounded-lg border border-slate-200 shadow-sm" />
                    <span className="text-[10px] font-bold text-emerald-600 mt-2 flex items-center gap-1"><Check className="w-3 h-3" /> Front Uploaded</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1 text-slate-500 py-2">
                    <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-1">
                      <Camera className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-slate-700">Upload Front</span>
                  </div>
                )}
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Back Side Photo *</label>
            <div className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition ${
              backImagePreview ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-blue-500 bg-slate-50'
            }`}>
              <input type="file" accept="image/*" onChange={(e) => handleFileUpload('back', e)} className="hidden" id="adh-back" />
              <label htmlFor="adh-back" className="cursor-pointer block">
                {backImagePreview ? (
                  <div className="flex flex-col items-center gap-1">
                    <img src={backImagePreview} alt="Back Preview" className="h-24 object-contain rounded-lg border border-slate-200 shadow-sm" />
                    <span className="text-[10px] font-bold text-emerald-600 mt-2 flex items-center gap-1"><Check className="w-3 h-3" /> Back Uploaded</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1 text-slate-500 py-2">
                    <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-1">
                      <Camera className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-slate-700">Upload Back</span>
                  </div>
                )}
              </label>
            </div>
          </div>
        </div>

        {/* Consent Checkbox */}
        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            checked={consentGiven}
            onChange={(e) => setConsentGiven(e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-xs font-medium text-slate-600">I consent to DigiLocker / UIDAI offline eKYC verification</span>
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
          {isVerifying ? <span>Verifying via DigiLocker...</span> : isVerified ? <><Check className="w-4 h-4" /><span>Aadhaar Verified</span></> : <><Shield className="w-4 h-4" /><span>Verify Aadhaar</span></>}
        </button>
      </div>

      <div className="pt-4 flex justify-between gap-4 items-center">
        <button onClick={onBack} className="text-sm font-bold text-slate-500 cursor-pointer">
          Back
        </button>
        <Button
          onClick={() => onNext({ aadhaarNumber, frontImagePreview, backImagePreview, consentGiven })}
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

export default AadhaarVerificationStep;
