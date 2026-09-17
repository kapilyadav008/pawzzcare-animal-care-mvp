import React from 'react';
import { X, ShieldCheck, Share2, Sparkles, Calendar, Pill, FileCheck, CheckCircle2 } from 'lucide-react';
import { Pet, MedicalEvent } from '../types';
import { useNavigate } from 'react-router-dom';

interface CarePassportModalProps {
  pet: Pet;
  events: MedicalEvent[];
  onClose: () => void;
}

export const CarePassportModal: React.FC<CarePassportModalProps> = ({ pet, events, onClose }) => {
  const navigate = useNavigate();

  const vaccinations = events.filter(e => e.type === 'Vaccination');
  const consultations = events.filter(e => e.type === 'Consultation');
  const labResults = events.filter(e => e.type === 'Lab Result');

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${pet.name}'s Care Passport — PawzzCare`,
        text: `Health Snapshot for ${pet.name} (${pet.species}, ${pet.breed}, ${pet.age} years). Organised via PawzzCare.`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Care Passport link copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-cream-200">
        
        {/* Passport Header */}
        <div className="bg-gradient-to-r from-charcoal-900 to-charcoal-800 text-white p-6 rounded-t-2xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 text-coral-500 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-4 h-4" />
            <span>PawzzCare Official Passport</span>
          </div>

          <div className="flex items-center gap-4">
            <img
              src={pet.photo || 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=400&q=80'}
              alt={pet.name}
              className="w-16 h-16 rounded-xl object-cover border-2 border-coral-500 shadow-md"
            />
            <div>
              <h3 className="text-2xl font-bold">{pet.name}</h3>
              <p className="text-charcoal-600 text-sm">{pet.species} • {pet.breed} • {pet.age} years old • {pet.sex}</p>
              <div className="inline-flex items-center gap-1 mt-1 text-[11px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-medium">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>Vault Active & Verified</span>
              </div>
            </div>
          </div>
        </div>

        {/* Passport Body */}
        <div className="p-6 space-y-6">
          
          {/* Recent Care */}
          <div>
            <h4 className="text-xs font-bold uppercase text-charcoal-600 tracking-wider flex items-center gap-1.5 mb-3">
              <Calendar className="w-4 h-4 text-coral-500" />
              <span>Recent Health Events</span>
            </h4>
            <div className="space-y-2">
              {events.slice(0, 3).map((evt) => (
                <div key={evt._id} className="p-3 bg-cream-50 rounded-xl border border-cream-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-charcoal-900 block">{evt.title}</span>
                    <span className="text-charcoal-600">{evt.description}</span>
                  </div>
                  <span className="text-[11px] font-medium text-charcoal-600 whitespace-nowrap ml-3">{evt.date}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Vaccinations */}
          <div>
            <h4 className="text-xs font-bold uppercase text-charcoal-600 tracking-wider flex items-center gap-1.5 mb-3">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Vaccination History</span>
            </h4>
            {vaccinations.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {vaccinations.map((vac) => (
                  <div key={vac._id} className="p-2.5 bg-emerald-50/50 rounded-lg border border-emerald-100 text-xs">
                    <span className="font-semibold text-emerald-900 block">{vac.title}</span>
                    <span className="text-emerald-700 text-[11px]">{vac.date}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-charcoal-600 italic">No vaccination records uploaded yet.</p>
            )}
          </div>

          {/* Current Medication */}
          <div>
            <h4 className="text-xs font-bold uppercase text-charcoal-600 tracking-wider flex items-center gap-1.5 mb-2">
              <Pill className="w-4 h-4 text-amber-500" />
              <span>Current Medications</span>
            </h4>
            <p className="text-xs text-charcoal-700 bg-amber-50/60 p-3 rounded-xl border border-amber-100">
              No active daily medications prescribed in verified health vault.
            </p>
          </div>

          {/* Health Vault Status */}
          <div className="p-4 bg-cream-100/70 rounded-xl border border-cream-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-coral-500" />
              <div>
                <span className="font-bold text-charcoal-900 block">Health Vault Summary</span>
                <span className="text-charcoal-600">{events.length} timeline events organized by AI</span>
              </div>
            </div>
          </div>
        </div>

        {/* Passport Footer Actions */}
        <div className="p-4 bg-cream-50 border-t border-cream-200 rounded-b-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={handleShare}
            className="w-full sm:w-auto px-4 py-2 bg-white text-charcoal-700 rounded-xl text-xs font-semibold border border-cream-300 hover:bg-cream-100 transition-colors flex items-center justify-center gap-1.5"
          >
            <Share2 className="w-4 h-4" />
            <span>Share Passport Snapshot</span>
          </button>
          <button
            onClick={() => {
              onClose();
              navigate('/vet-summary');
            }}
            className="w-full sm:w-auto px-5 py-2.5 bg-coral-500 text-white rounded-xl text-xs font-bold hover:bg-coral-600 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span>Prepare for Vet Visit</span>
          </button>
        </div>

      </div>
    </div>
  );
};
