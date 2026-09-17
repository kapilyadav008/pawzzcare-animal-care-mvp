import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Sparkles, Stethoscope, AlertTriangle, FileUp, ArrowRight, Dog, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { CarePassportModal } from '../components/CarePassportModal';

export const Home: React.FC = () => {
  const [query, setQuery] = useState('');
  const [showPassport, setShowPassport] = useState(false);
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const queryLower = query.toLowerCase();

    // Intelligent Search Routing Rule:
    // If it's a pure service lookup query (e.g., "vet near me", "ambulance in gurgaon"), route to Find Care.
    // Otherwise, route to AI Care Assistant!
    if (/vet near me|find a vet|clinic near me|ambulance|ngo|rescuer/.test(queryLower)) {
      navigate(`/find-care?search=${encodeURIComponent(query)}`);
    } else {
      navigate(`/assistant?q=${encodeURIComponent(query)}`);
    }
  };

  const sampleQueries = [
    "My dog has been vomiting since this morning...",
    "My cat needs a vaccination.",
    "My dog injured its paw.",
    "I need an animal ambulance.",
    "I want to find a vet near me."
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12">
      
      {/* HERO SECTION */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-coral-50 border border-coral-100 text-coral-600 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-coral-500" />
          <span>Intelligent Animal Care Assistant</span>
        </div>
        
        <h1 className="text-3xl sm:text-5xl font-bold text-charcoal-900 tracking-tight leading-tight">
          Care shouldn't be hard to find.
        </h1>
        
        <p className="text-base sm:text-lg text-charcoal-600 leading-relaxed">
          Find the right animal-care service and keep your pet's health information organized in one trustworthy place.
        </p>
      </div>

      {/* PRIMARY INTERACTION: SEARCH BOX */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-cream-200 shadow-warm space-y-4">
        <form onSubmit={handleSearchSubmit} className="space-y-4">
          <label htmlFor="care-search" className="block text-sm font-bold text-charcoal-900">
            What's happening with your animal?
          </label>
          
          <div className="relative">
            <textarea
              id="care-search"
              rows={3}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="My dog has been vomiting since this morning..."
              className="w-full p-4 pr-12 rounded-2xl border border-cream-300 bg-cream-50/50 text-charcoal-900 text-base focus:outline-none focus:ring-2 focus:ring-coral-500 focus:bg-white transition-all resize-none"
            />
            <div className="absolute right-4 bottom-4">
              <button
                type="submit"
                className="px-5 py-2.5 bg-coral-500 hover:bg-coral-600 text-white rounded-xl font-semibold text-sm transition-colors flex items-center gap-2 shadow-sm"
              >
                <span>Ask PawzzCare</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </form>

        {/* TRY ASKING EXAMPLES */}
        <div className="pt-2">
          <span className="text-xs font-semibold text-charcoal-600 block mb-2">Try asking:</span>
          <div className="flex flex-wrap gap-2">
            {sampleQueries.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setQuery(sample)}
                className="px-3 py-1.5 rounded-full bg-cream-100 hover:bg-cream-200 text-charcoal-700 text-xs font-medium transition-colors border border-cream-200 text-left"
              >
                "{sample}"
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SECONDARY QUICK ACTIONS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          to="/find-care"
          className="p-5 bg-white rounded-2xl border border-cream-200 hover:border-coral-200 shadow-warm-hover flex items-center gap-4 group"
        >
          <div className="w-12 h-12 rounded-xl bg-coral-50 text-coral-500 flex items-center justify-center flex-shrink-0 group-hover:bg-coral-500 group-hover:text-white transition-colors">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-charcoal-900 text-sm">Find a Vet</h3>
            <p className="text-xs text-charcoal-600 mt-0.5">Clinics & doctors nearby</p>
          </div>
        </Link>

        <Link
          to="/find-care?type=Ambulance"
          className="p-5 bg-white rounded-2xl border border-cream-200 hover:border-red-200 shadow-warm-hover flex items-center gap-4 group"
        >
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-500 flex items-center justify-center flex-shrink-0 group-hover:bg-red-500 group-hover:text-white transition-colors">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-charcoal-900 text-sm">Emergency Help</h3>
            <p className="text-xs text-charcoal-600 mt-0.5">Ambulances & NGOs</p>
          </div>
        </Link>

        <Link
          to="/medical-organizer"
          className="p-5 bg-white rounded-2xl border border-cream-200 hover:border-emerald-200 shadow-warm-hover flex items-center gap-4 group"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
            <FileUp className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-charcoal-900 text-sm">Upload Record</h3>
            <p className="text-xs text-charcoal-600 mt-0.5">Extract PDF/Image values</p>
          </div>
        </Link>
      </div>

      {/* MY PETS SUMMARY CARD */}
      <div className="bg-white p-6 rounded-3xl border border-cream-200 shadow-warm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Dog className="w-5 h-5 text-coral-500" />
            <h2 className="font-bold text-charcoal-900 text-base">My Pets</h2>
          </div>
          <Link to="/my-pets" className="text-xs font-semibold text-coral-600 hover:text-coral-700 flex items-center gap-1">
            <span>Manage Pets</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="p-4 bg-cream-50/80 rounded-2xl border border-cream-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src="https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=400&q=80"
              alt="Bruno"
              className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-charcoal-900 text-base">Bruno</h3>
                <span className="text-xs text-charcoal-600 font-medium">Dog • 4 years</span>
              </div>
              <div className="flex items-center gap-1.5 mt-1 text-xs text-emerald-600 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Health Status: 3 Records Organized</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowPassport(true)}
            className="w-full sm:w-auto px-4 py-2 bg-charcoal-900 hover:bg-charcoal-800 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm"
          >
            <ShieldCheck className="w-4 h-4 text-coral-500" />
            <span>View Care Passport</span>
          </button>
        </div>
      </div>

      {/* CARE PASSPORT MODAL */}
      {showPassport && (
        <CarePassportModal
          pet={{
            _id: '66e9a1234567890123456789',
            name: 'Bruno',
            species: 'Dog',
            breed: 'Beagle',
            age: 4,
            sex: 'Male',
            photo: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=400&q=80',
            isDemoData: true
          }}
          events={[
            {
              _id: 'evt-001',
              petId: '66e9a1234567890123456789',
              date: '2026-03-03',
              type: 'Consultation',
              title: 'Veterinary Consultation',
              description: 'Routine wellness checkup at Pawzz Veterinary Clinic.',
              isDemoData: true
            },
            {
              _id: 'evt-002',
              petId: '66e9a1234567890123456789',
              date: '2026-02-18',
              type: 'Lab Result',
              title: 'Blood Test Uploaded',
              description: 'Blood report organized in vault. Hemoglobin 12.4 g/dL.',
              isDemoData: true
            },
            {
              _id: 'evt-003',
              petId: '66e9a1234567890123456789',
              date: '2026-01-12',
              type: 'Vaccination',
              title: 'Rabies Booster Vaccination',
              description: 'Anti-Rabies booster dose administered by Dr. Sharma.',
              isDemoData: true
            }
          ]}
          onClose={() => setShowPassport(false)}
        />
      )}

    </div>
  );
};
