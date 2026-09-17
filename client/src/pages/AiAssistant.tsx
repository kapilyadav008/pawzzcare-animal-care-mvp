import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { AlertCircle, ArrowRight, HelpCircle, ShieldCheck, Sparkles, MapPin, RefreshCw, Dog, Clock } from 'lucide-react';
import { analyzeCareQuery } from '../api/client';
import { AssistantAnalysis } from '../types';

export const AiAssistant: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || 'My dog has been vomiting since this morning';

  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState<AssistantAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});

  useEffect(() => {
    let isMounted = true;
    async function loadAnalysis() {
      setLoading(true);
      setError(null);
      try {
        const result = await analyzeCareQuery(query);
        if (isMounted) setAnalysis(result);
      } catch (err: any) {
        if (isMounted) setError(err.message || 'Failed to analyze query');
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadAnalysis();
    return () => { isMounted = false; };
  }, [query]);

  const handleAnswerSelect = (index: number, answer: string) => {
    setUserAnswers(prev => ({ ...prev, [index]: answer }));
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'emergency':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200">Critical / Emergency</span>;
      case 'high':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">Needs Prompt Attention</span>;
      case 'low':
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">Routine Care</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">Moderate Urgency</span>;
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cream-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🐾</span>
            <h1 className="text-2xl font-bold text-charcoal-900 tracking-tight">AI Care Guidance</h1>
          </div>
          <p className="text-xs text-charcoal-600 mt-0.5">Analyzing care needs safely without medical diagnosis</p>
        </div>
        {analysis?.isDemoFallback && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Demo AI Fallback Engine</span>
          </div>
        )}
      </div>

      {/* USER QUERY SUMMARY */}
      <div className="p-4 bg-white rounded-2xl border border-cream-200 shadow-sm flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-cream-100 text-charcoal-700 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
          You
        </div>
        <div>
          <span className="text-xs font-semibold text-charcoal-600 block">Reported Query:</span>
          <p className="text-base text-charcoal-900 font-medium">"{query}"</p>
        </div>
      </div>

      {/* LOADING STATE */}
      {loading && (
        <div className="p-12 text-center bg-white rounded-3xl border border-cream-200 space-y-4 shadow-sm">
          <div className="w-12 h-12 border-4 border-coral-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <div>
            <h3 className="font-bold text-charcoal-900 text-base">PawzzCare is understanding your situation...</h3>
            <p className="text-xs text-charcoal-600 mt-1">Extracting structured care context and matching recommended service types.</p>
          </div>
        </div>
      )}

      {/* ERROR STATE */}
      {error && (
        <div className="p-6 bg-red-50 rounded-2xl border border-red-200 text-red-700 space-y-3">
          <div className="flex items-center gap-2 font-bold text-base">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span>Unable to analyze request</span>
          </div>
          <p className="text-xs">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Analysis</span>
          </button>
        </div>
      )}

      {/* ANALYSIS RESULT */}
      {!loading && analysis && (
        <div className="space-y-6">
          
          {/* PAWZZCARE UNDERSTANDING CARD */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-cream-200 shadow-warm space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cream-200 pb-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-coral-600 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-coral-500" />
                <span>PawzzCare Understanding</span>
              </h2>
              <div>{getUrgencyBadge(analysis.urgency)}</div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-3.5 bg-cream-50 rounded-2xl border border-cream-200">
                <span className="text-[11px] font-semibold text-charcoal-600 block flex items-center gap-1">
                  <Dog className="w-3.5 h-3.5 text-coral-500" />
                  Animal
                </span>
                <span className="text-sm font-bold text-charcoal-900 capitalize block mt-1">{analysis.animalType}</span>
              </div>

              <div className="p-3.5 bg-cream-50 rounded-2xl border border-cream-200">
                <span className="text-[11px] font-semibold text-charcoal-600 block">Reported Issue</span>
                <span className="text-sm font-bold text-charcoal-900 capitalize block mt-1">
                  {analysis.symptoms.join(', ') || 'General query'}
                </span>
              </div>

              <div className="p-3.5 bg-cream-50 rounded-2xl border border-cream-200">
                <span className="text-[11px] font-semibold text-charcoal-600 block flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-coral-500" />
                  Duration
                </span>
                <span className="text-sm font-bold text-charcoal-900 block mt-1">{analysis.duration}</span>
              </div>

              <div className="p-3.5 bg-cream-50 rounded-2xl border border-cream-200">
                <span className="text-[11px] font-semibold text-charcoal-600 block">Suggested Service</span>
                <span className="text-sm font-bold text-charcoal-900 capitalize block mt-1">{analysis.recommendedServiceType}</span>
              </div>
            </div>

            {/* WHY WE'RE SUGGESTING THIS */}
            <div className="p-4 bg-cream-50/80 rounded-2xl border border-cream-200 space-y-1.5">
              <h3 className="text-xs font-bold text-charcoal-900 uppercase tracking-wide">Why we're suggesting this</h3>
              <p className="text-xs sm:text-sm text-charcoal-700 leading-relaxed">{analysis.reasoning}</p>
            </div>

            {/* CLARIFYING QUESTIONS */}
            {analysis.clarifyingQuestions && analysis.clarifyingQuestions.length > 0 && (
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold text-charcoal-900 uppercase tracking-wide flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-coral-500" />
                  <span>Useful Clarification Questions</span>
                </h3>
                <div className="space-y-2">
                  {analysis.clarifyingQuestions.map((qText, qIdx) => (
                    <div key={qIdx} className="p-3.5 bg-white rounded-xl border border-cream-300 space-y-2">
                      <p className="text-xs sm:text-sm font-semibold text-charcoal-900">{qText}</p>
                      <div className="flex gap-2">
                        {['Yes', 'No', 'Not Sure'].map((ans) => (
                          <button
                            key={ans}
                            type="button"
                            onClick={() => handleAnswerSelect(qIdx, ans)}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors border ${
                              userAnswers[qIdx] === ans
                                ? 'bg-coral-500 text-white border-coral-500'
                                : 'bg-cream-50 text-charcoal-700 border-cream-200 hover:bg-cream-100'
                            }`}
                          >
                            {ans}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* NEXT STEP CTA */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-cream-200">
              <div>
                <span className="text-xs font-bold text-charcoal-900 uppercase block">Next Step</span>
                <span className="text-xs text-charcoal-600">Connect with nearby verified care providers in Gurgaon</span>
              </div>
              <button
                type="button"
                onClick={() => navigate(`/find-care?type=${encodeURIComponent(analysis.recommendedServiceType)}`)}
                className="w-full sm:w-auto px-6 py-3 bg-coral-500 hover:bg-coral-600 text-white font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <MapPin className="w-4 h-4" />
                <span>Find nearby {analysis.recommendedServiceType}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* AI SAFETY DISCLAIMER BANNER */}
          <div className="p-4 bg-cream-100/70 rounded-2xl border border-cream-200 flex items-start gap-3 text-xs text-charcoal-700">
            <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-charcoal-900 block font-semibold mb-0.5">Important Safety Notice</strong>
              <p className="leading-relaxed">{analysis.disclaimer}</p>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
