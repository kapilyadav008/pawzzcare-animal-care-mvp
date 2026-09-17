import React, { useState } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, Sparkles, FileCheck, ShieldCheck, ArrowRight, RefreshCw, FileImage } from 'lucide-react';
import { uploadAndAnalyzeDocument } from '../api/client';
import { ExtractedData } from '../types';
import { Link } from 'react-router-dom';

export const MedicalOrganizer: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [stageIndex, setStageIndex] = useState(0);
  const [extractedResult, setExtractedResult] = useState<ExtractedData | null>(null);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [savedEventId, setSavedEventId] = useState<string | null>(null);

  const stages = [
    'Reading document buffer...',
    'Extracting raw text / vision data...',
    'Identifying document dates & clinic details...',
    'Organizing structured health events...',
    'Adding to Bruno\'s pet medical timeline...'
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setExtractedResult(null);
      setErrorMessage(null);
      setWarningMessage(null);
    }
  };

  const processUpload = async (fileToUpload: File) => {
    setUploading(true);
    setErrorMessage(null);
    setWarningMessage(null);
    setExtractedResult(null);

    // Animate stage progress for friendly UI feedback
    setStageIndex(0);
    const interval = setInterval(() => {
      setStageIndex((prev) => (prev < stages.length - 1 ? prev + 1 : prev));
    }, 600);

    try {
      // Use demo pet Bruno ID
      const res = await uploadAndAnalyzeDocument(fileToUpload, '66e9a1234567890123456789');
      clearInterval(interval);
      setStageIndex(stages.length - 1);
      setExtractedResult(res.extractedData);
      if (res.warning) {
        setWarningMessage(res.warning);
      }
      if (res.savedEventId) {
        setSavedEventId(res.savedEventId);
      }
    } catch (err: any) {
      clearInterval(interval);
      setErrorMessage(err.message || 'Document extraction failed');
    } finally {
      setUploading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (file) processUpload(file);
  };

  // Quick Demo Document Testers
  const loadSampleDoc = (type: 'blood' | 'vaccine') => {
    let mockFile: File;
    if (type === 'blood') {
      const content = `PET BLOOD TEST REPORT
Patient: Bruno
Species: Dog
Breed: Beagle
Date: 2026-02-18
Clinic: Pawzz Veterinary Care
Veterinarian: Dr. R. K. Sharma

TEST RESULTS:
Hemoglobin: 12.4 g/dL (Reference: 12.0 - 18.0)
WBC Total Count: 14.2 10^3/uL (Reference: 6.0 - 17.0)
Platelets: 280 10^3/uL (Reference: 200 - 500)

Observations: Hemoglobin within normal parameters. Routine follow-up recommended in 6 months.`;
      mockFile = new File([content], 'bruno_blood_report_sample.pdf', { type: 'application/pdf' });
    } else {
      const content = `VACCINATION CERTIFICATE
Patient: Bruno
Species: Dog
Breed: Beagle
Date: 2026-01-12
Clinic: Pawzz Veterinary Care
Doctor: Dr. R. K. Sharma

Vaccine: Anti-Rabies Booster Vaccine administered successfully. Next due date: 2027-01-12.`;
      mockFile = new File([content], 'bruno_vaccine_certificate_sample.pdf', { type: 'application/pdf' });
    }
    setFile(mockFile);
    processUpload(mockFile);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      
      {/* HEADER */}
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-coral-50 border border-coral-100 text-coral-600 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Health Vault & Document Organizer</span>
        </div>
        
        <h1 className="text-3xl font-bold text-charcoal-900 tracking-tight">
          Turn scattered reports into a usable health history.
        </h1>
        
        <p className="text-sm text-charcoal-600 leading-relaxed">
          Upload vet consultation notes, lab reports, or vaccination certificates. PawzzCare extracts key facts without diagnosing diseases.
        </p>
      </div>

      {/* UPLOAD DROPZONE CARD */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-cream-200 shadow-warm space-y-6">
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="border-2 border-dashed border-cream-300 hover:border-coral-400 bg-cream-50/50 rounded-2xl p-8 text-center transition-colors cursor-pointer relative">
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            
            <div className="w-12 h-12 bg-coral-50 text-coral-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Upload className="w-6 h-6" />
            </div>

            <h3 className="font-bold text-charcoal-900 text-base">
              {file ? file.name : 'Upload PDF or Image Document'}
            </h3>
            
            <p className="text-xs text-charcoal-600 mt-1">
              {file ? `${(file.size / 1024).toFixed(1)} KB selected` : 'Drag and drop or browse from your computer (PDF, JPG, PNG up to 10MB)'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2 text-xs text-charcoal-600">
              <span className="font-medium">Try Sample Demo Document:</span>
              <button
                type="button"
                onClick={() => loadSampleDoc('blood')}
                className="px-2.5 py-1 bg-cream-100 hover:bg-cream-200 text-charcoal-900 rounded-lg font-semibold text-xs transition-colors"
              >
                Sample Blood Test
              </button>
              <button
                type="button"
                onClick={() => loadSampleDoc('vaccine')}
                className="px-2.5 py-1 bg-cream-100 hover:bg-cream-200 text-charcoal-900 rounded-lg font-semibold text-xs transition-colors"
              >
                Sample Vaccine Cert
              </button>
            </div>

            <button
              type="submit"
              disabled={!file || uploading}
              className={`w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-bold text-white transition-colors flex items-center justify-center gap-2 shadow-sm ${
                file && !uploading ? 'bg-coral-500 hover:bg-coral-600' : 'bg-charcoal-600 cursor-not-allowed'
              }`}
            >
              {uploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Analyzing Document...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Organize Medical Document</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* EXTRACTION PROGRESS STAGES */}
        {uploading && (
          <div className="p-6 bg-cream-50 rounded-2xl border border-cream-200 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-900 flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-coral-500 animate-spin" />
              <span>Document Extraction Stages</span>
            </h4>
            
            <div className="space-y-2">
              {stages.map((stageText, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-xs">
                  {idx < stageIndex ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  ) : idx === stageIndex ? (
                    <div className="w-4 h-4 border-2 border-coral-500 border-t-transparent rounded-full animate-spin flex-shrink-0"></div>
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-cream-300 flex-shrink-0"></div>
                  )}
                  <span className={idx <= stageIndex ? 'font-semibold text-charcoal-900' : 'text-charcoal-600'}>
                    {stageText}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ERROR MESSAGE */}
      {errorMessage && (
        <div className="p-5 bg-red-50 rounded-2xl border border-red-200 text-red-700 text-xs font-medium flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* WARNING MESSAGE (e.g. Gemini key missing for image) */}
      {warningMessage && (
        <div className="p-5 bg-amber-50 rounded-2xl border border-amber-200 text-amber-800 text-xs font-medium flex items-center gap-3">
          <FileImage className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <div>
            <strong className="block font-bold mb-0.5">Image Multimodal Notice:</strong>
            <p>{warningMessage}</p>
          </div>
        </div>
      )}

      {/* EXTRACTED DOCUMENT RESULT VIEW */}
      {extractedResult && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-cream-200 shadow-warm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cream-200 pb-4">
            <div className="flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-emerald-600" />
              <h2 className="text-base font-bold text-charcoal-900">Extracted Document Facts</h2>
            </div>
            {extractedResult.isDemoFallback && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                Fallback Fact Extractor
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-3.5 bg-cream-50 rounded-xl border border-cream-200">
              <span className="text-[11px] font-semibold text-charcoal-600 block">Pet Name</span>
              <span className="text-sm font-bold text-charcoal-900 block mt-1">
                {extractedResult.petName || <em className="text-charcoal-600 font-normal">Not found in document</em>}
              </span>
            </div>

            <div className="p-3.5 bg-cream-50 rounded-xl border border-cream-200">
              <span className="text-[11px] font-semibold text-charcoal-600 block">Document Type</span>
              <span className="text-sm font-bold text-charcoal-900 block mt-1">
                {extractedResult.documentType || 'Medical Report'}
              </span>
            </div>

            <div className="p-3.5 bg-cream-50 rounded-xl border border-cream-200">
              <span className="text-[11px] font-semibold text-charcoal-600 block">Report Date</span>
              <span className="text-sm font-bold text-charcoal-900 block mt-1">
                {extractedResult.documentDate || <em className="text-charcoal-600 font-normal">Not found in document</em>}
              </span>
            </div>

            <div className="p-3.5 bg-cream-50 rounded-xl border border-cream-200">
              <span className="text-[11px] font-semibold text-charcoal-600 block">Veterinarian / Clinic</span>
              <span className="text-sm font-bold text-charcoal-900 block mt-1">
                {extractedResult.veterinarian || extractedResult.clinicName || <em className="text-charcoal-600 font-normal">Not found in document</em>}
              </span>
            </div>
          </div>

          {/* TEST VALUES TABLE */}
          {extractedResult.testValues && extractedResult.testValues.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal-900">Extracted Test Values</h3>
              <div className="overflow-x-auto rounded-xl border border-cream-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-cream-100 text-charcoal-900 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="p-3">Test Parameter</th>
                      <th className="p-3">Value</th>
                      <th className="p-3">Unit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cream-200 bg-white">
                    {extractedResult.testValues.map((tv, idx) => (
                      <tr key={idx}>
                        <td className="p-3 font-semibold text-charcoal-900">{tv.testName}</td>
                        <td className="p-3 font-bold text-coral-600">{tv.value}</td>
                        <td className="p-3 text-charcoal-600">{tv.unit || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* OBSERVATIONS */}
          {extractedResult.observations && extractedResult.observations.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal-900">Explicit Observations</h3>
              <ul className="list-disc list-inside space-y-1 text-xs text-charcoal-700 bg-cream-50 p-4 rounded-xl border border-cream-200">
                {extractedResult.observations.map((obs, idx) => (
                  <li key={idx}>{obs}</li>
                ))}
              </ul>
            </div>
          )}

          {/* SAFETY DISCLAIMER */}
          <div className="p-4 bg-cream-100/60 rounded-xl border border-cream-200 text-xs text-charcoal-600 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Medical Safety Rule:</strong> Extracted metrics reflect explicit document text only. PawzzCare does not infer medical conditions or diagnoses.
            </span>
          </div>

          {/* NEXT STEPS */}
          <div className="pt-4 border-t border-cream-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-emerald-700 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Organized & saved to Bruno's pet timeline</span>
            </span>

            <Link
              to="/my-pets"
              className="px-5 py-2.5 bg-coral-500 hover:bg-coral-600 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <span>View Pet Timeline</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      )}

    </div>
  );
};
