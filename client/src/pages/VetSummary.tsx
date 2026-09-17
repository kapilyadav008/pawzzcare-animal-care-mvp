import React, { useEffect, useState } from 'react';
import { Sparkles, Copy, Check, Dog, HelpCircle, ShieldCheck, Calendar, Pill } from 'lucide-react';
import { fetchVetSummary } from '../api/client';
import { VetSummaryData } from '../types';

export const VetSummary: React.FC = () => {
  const [summary, setSummary] = useState<VetSummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadSummary() {
      setLoading(true);
      try {
        // Use demo pet Bruno ID
        const data = await fetchVetSummary('66e9a1234567890123456789');
        if (isMounted) setSummary(data);
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadSummary();
    return () => { isMounted = false; };
  }, []);

  const handleCopy = () => {
    if (!summary) return;
    const textToCopy = `PAWZZCARE VET VISIT PREPARATION SUMMARY
----------------------------------------
PET: ${summary.petName} (${summary.species}, ${summary.breed})
AGE: ${summary.age} years

RECENT HEALTH EVENTS:
${summary.recentEvents.join('\n')}

CURRENT MEDICATIONS:
${summary.currentMedications}

KNOWN HEALTH HISTORY:
${summary.knownHistory}

QUESTIONS TO ASK THE VET:
${summary.questionsToAskVet.map((q, i) => `${i + 1}. ${q}`).join('\n')}

Notice: Aggregated automatically by PawzzCare AI Health Vault for veterinary consultations.`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cream-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-coral-500" />
            <h1 className="text-2xl font-bold text-charcoal-900 tracking-tight">Prepare for Vet Visit</h1>
          </div>
          <p className="text-xs sm:text-sm text-charcoal-600 mt-0.5">Concise shareable summary of recent pet events and vet questions</p>
        </div>

        {summary && (
          <button
            type="button"
            onClick={handleCopy}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-sm self-start sm:self-auto ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-coral-500 hover:bg-coral-600 text-white'
            }`}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Summary Copied!' : 'Copy Summary'}</span>
          </button>
        )}
      </div>

      {loading && (
        <div className="py-12 text-center text-charcoal-600 space-y-2">
          <div className="w-8 h-8 border-3 border-coral-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-medium">Aggregating Bruno's recent medical records...</p>
        </div>
      )}

      {!loading && summary && (
        <div className="space-y-6">
          
          {/* MAIN VET PREP CARD */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-cream-200 shadow-warm space-y-6">
            
            {/* PET HEADER */}
            <div className="flex items-center justify-between border-b border-cream-200 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-coral-50 text-coral-500 flex items-center justify-center font-bold text-xl">
                  🐶
                </div>
                <div>
                  <h2 className="text-xl font-bold text-charcoal-900">{summary.petName}</h2>
                  <span className="text-xs text-charcoal-600">{summary.species} • {summary.breed} • {summary.age} years old</span>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Ready for Consultation
              </span>
            </div>

            {/* RECENT EVENTS */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal-900 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-coral-500" />
                <span>Recent Events</span>
              </h3>
              <div className="p-4 bg-cream-50 rounded-2xl border border-cream-200 space-y-2 text-xs text-charcoal-800 font-medium">
                {summary.recentEvents.map((evt, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-coral-500 mt-1.5 flex-shrink-0"></span>
                    <span>{evt}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CURRENT MEDICATIONS */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal-900 flex items-center gap-1.5">
                <Pill className="w-4 h-4 text-amber-500" />
                <span>Current Medications</span>
              </h3>
              <p className="p-4 bg-cream-50 rounded-2xl border border-cream-200 text-xs text-charcoal-700">
                {summary.currentMedications}
              </p>
            </div>

            {/* KNOWN HISTORY */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal-900 flex items-center gap-1.5">
                <Dog className="w-4 h-4 text-charcoal-700" />
                <span>Known Medical History</span>
              </h3>
              <p className="p-4 bg-cream-50 rounded-2xl border border-cream-200 text-xs text-charcoal-700 leading-relaxed">
                {summary.knownHistory}
              </p>
            </div>

            {/* QUESTIONS TO ASK THE VET */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal-900 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-coral-500" />
                <span>Recommended Questions to Ask Your Vet</span>
              </h3>
              <div className="space-y-2">
                {summary.questionsToAskVet.map((question, idx) => (
                  <div key={idx} className="p-3.5 bg-coral-50/50 rounded-xl border border-coral-100 flex items-start gap-2.5 text-xs text-charcoal-900 font-semibold">
                    <span className="w-5 h-5 rounded-full bg-coral-500 text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="leading-relaxed">{question}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* BOTTOM COPY ACTION */}
            <div className="pt-4 border-t border-cream-200 flex items-center justify-between">
              <span className="text-xs text-charcoal-600">Present or copy this summary before your vet appointment.</span>
              <button
                type="button"
                onClick={handleCopy}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 shadow-sm ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-coral-500 hover:bg-coral-600 text-white'
                }`}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Summary'}</span>
              </button>
            </div>

          </div>

          {/* DISCLAIMER */}
          <div className="p-4 bg-cream-100/60 rounded-2xl border border-cream-200 text-xs text-charcoal-600 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span>{summary.disclaimer}</span>
          </div>

        </div>
      )}

    </div>
  );
};
