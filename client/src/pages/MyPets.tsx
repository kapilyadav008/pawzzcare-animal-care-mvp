import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Dog, ShieldCheck, FileUp, Sparkles, Plus, Calendar, Activity, CheckCircle2, ChevronRight, Pill } from 'lucide-react';
import { fetchPets, fetchPetTimeline } from '../api/client';
import { Pet, MedicalEvent } from '../types';
import { CarePassportModal } from '../components/CarePassportModal';

export const MyPets: React.FC = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [events, setEvents] = useState<MedicalEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPassport, setShowPassport] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadPets() {
      setLoading(true);
      try {
        const petList = await fetchPets();
        if (isMounted) {
          setPets(petList);
          const firstPet = petList[0] || null;
          setSelectedPet(firstPet);
          if (firstPet) {
            const timelineData = await fetchPetTimeline(firstPet._id);
            if (isMounted) setEvents(timelineData);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadPets();
    return () => { isMounted = false; };
  }, []);

  const getEventBadge = (type: string) => {
    switch (type) {
      case 'Vaccination':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">Vaccination</span>;
      case 'Lab Result':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">Lab Result</span>;
      case 'Consultation':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">Consultation</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cream-200 text-charcoal-700">Health Record</span>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cream-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Dog className="w-6 h-6 text-coral-500" />
            <h1 className="text-2xl font-bold text-charcoal-900 tracking-tight">Pet Health Profiles</h1>
          </div>
          <p className="text-xs sm:text-sm text-charcoal-600 mt-0.5">Lightweight organized medical history & care timeline</p>
        </div>

        <Link
          to="/medical-organizer"
          className="px-4 py-2.5 bg-coral-500 hover:bg-coral-600 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-sm self-start sm:self-auto"
        >
          <FileUp className="w-4 h-4" />
          <span>Upload New Record</span>
        </Link>
      </div>

      {loading && (
        <div className="py-12 text-center text-charcoal-600">
          <div className="w-8 h-8 border-3 border-coral-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-medium mt-2">Loading pet health records...</p>
        </div>
      )}

      {!loading && selectedPet && (
        <div className="space-y-8">
          
          {/* PET PROFILE HERO CARD */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-cream-200 shadow-warm relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              
              <div className="flex items-center gap-5">
                <img
                  src={selectedPet.photo || 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=400&q=80'}
                  alt={selectedPet.name}
                  className="w-20 h-20 rounded-2xl object-cover border-4 border-cream-100 shadow-md flex-shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold text-charcoal-900">{selectedPet.name}</h2>
                    {selectedPet.isDemoData && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cream-100 text-charcoal-600 border border-cream-200">
                        Demo Profile
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-charcoal-600 mt-0.5">
                    {selectedPet.species} • {selectedPet.breed} • {selectedPet.age} years old • {selectedPet.sex}
                  </p>
                  
                  <div className="flex items-center gap-2 mt-2">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold bg-cream-100 text-charcoal-700 px-2.5 py-1 rounded-full border border-cream-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-coral-500" />
                      Demo Health Record
                    </span>
                  </div>
                </div>
              </div>

              {/* CARE PASSPORT & VET PREP BUTTONS */}
              <div className="flex flex-col sm:flex-row gap-2.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setShowPassport(true)}
                  className="px-4 py-2.5 bg-cream-100 hover:bg-cream-200 text-charcoal-900 rounded-xl text-xs font-bold transition-colors border border-cream-300 flex items-center justify-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4 text-coral-500" />
                  <span>Care Passport</span>
                </button>
                <Link
                  to="/vet-summary"
                  className="px-4 py-2.5 bg-charcoal-900 hover:bg-charcoal-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Sparkles className="w-4 h-4 text-coral-500" />
                  <span>Prep for Vet Visit</span>
                </Link>
              </div>

            </div>
          </div>

          {/* HEALTH OVERVIEW STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 bg-white rounded-2xl border border-cream-200 shadow-sm">
              <span className="text-xs font-bold text-charcoal-600 uppercase tracking-wider block">Vaccinations</span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-2xl font-bold text-charcoal-900">
                  {events.filter(e => e.type === 'Vaccination').length} Dose(s)
                </span>
                <span className="text-xs text-charcoal-600 font-semibold bg-cream-100 px-2 py-0.5 rounded-md">1 vaccination record</span>
              </div>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-cream-200 shadow-sm">
              <span className="text-xs font-bold text-charcoal-600 uppercase tracking-wider block">Health Vault Records</span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-2xl font-bold text-charcoal-900">{events.length} Events</span>
                <span className="text-xs text-coral-600 font-semibold bg-coral-50 px-2 py-0.5 rounded-md">Parsed by AI</span>
              </div>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-cream-200 shadow-sm">
              <span className="text-xs font-bold text-charcoal-600 uppercase tracking-wider block">Current Medications</span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-sm font-bold text-charcoal-800">None Active</span>
                <Pill className="w-4 h-4 text-amber-500" />
              </div>
            </div>
          </div>

          {/* MEDICAL TIMELINE */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-cream-200 shadow-warm space-y-6">
            <div className="flex items-center justify-between border-b border-cream-200 pb-4">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-coral-500" />
                <h3 className="font-bold text-charcoal-900 text-base">Medical Event Timeline</h3>
              </div>
              <span className="text-xs text-charcoal-600 font-medium">Chronological record history</span>
            </div>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-cream-200">
              {events.map((evt) => (
                <div key={evt._id} className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-cream-50/70 p-4 rounded-2xl border border-cream-200">
                  {/* Dot icon on line */}
                  <div className="absolute -left-[1.4rem] top-5 w-3 h-3 rounded-full bg-coral-500 border-2 border-white shadow-xs"></div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {getEventBadge(evt.type)}
                      <h4 className="font-bold text-charcoal-900 text-sm">{evt.title}</h4>
                    </div>
                    <p className="text-xs text-charcoal-700 leading-relaxed">{evt.description}</p>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-semibold text-charcoal-600 flex-shrink-0">
                    <Calendar className="w-3.5 h-3.5 text-coral-500" />
                    <span>{evt.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* CARE PASSPORT MODAL */}
      {showPassport && selectedPet && (
        <CarePassportModal
          pet={selectedPet}
          events={events}
          onClose={() => setShowPassport(false)}
        />
      )}

    </div>
  );
};
