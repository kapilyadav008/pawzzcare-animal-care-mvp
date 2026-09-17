import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, MapPin, Phone, Star, ShieldCheck, AlertTriangle, ExternalLink, Filter } from 'lucide-react';
import { fetchProviders } from '../api/client';
import { Provider } from '../types';

export const FindCare: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialType = searchParams.get('type') || 'All';
  const initialSearch = searchParams.get('search') || '';

  const [selectedType, setSelectedType] = useState(initialType);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<string | null>(null);

  const filterTabs = ['All', 'Clinic', 'Vet', 'Emergency', 'Ambulance', 'NGO', 'Rescue'];

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      try {
        const res = await fetchProviders(selectedType, searchTerm);
        if (isMounted) {
          setProviders(res.data);
          setNotice(res.notice || null);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, [selectedType, searchTerm]);

  const handleTabClick = (tab: string) => {
    setSelectedType(tab);
    setSearchParams({ type: tab, search: searchTerm });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ type: selectedType, search: searchTerm });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-cream-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">🏥</span>
            <h1 className="text-2xl sm:text-3xl font-bold text-charcoal-900 tracking-tight">Find Animal Care Services</h1>
          </div>
          <p className="text-xs sm:text-sm text-charcoal-600">
            Discover veterinary clinics, ambulances, NGOs, and rescue services in Gurgaon.
          </p>
        </div>

        {/* DATA TRANSPARENCY BADGE */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-cream-100 border border-cream-300 text-charcoal-700 text-xs font-semibold self-start md:self-auto">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Demo Provider Directory (Gurgaon)</span>
        </div>
      </div>

      {/* SEARCH BAR & FILTER TABS */}
      <div className="space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-charcoal-600" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by clinic name, service (e.g. vaccination, ICU), or sector..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-cream-300 bg-white text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-coral-500 shadow-sm"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-3 bg-charcoal-900 hover:bg-charcoal-800 text-white rounded-2xl text-sm font-bold transition-colors"
          >
            Search
          </button>
        </form>

        {/* FILTER CATEGORY TABS */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-xs font-bold text-charcoal-600 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" />
            Category:
          </span>
          {filterTabs.map((tab) => {
            const isActive = selectedType.toLowerCase() === tab.toLowerCase();
            return (
              <button
                key={tab}
                type="button"
                onClick={() => handleTabClick(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap border ${
                  isActive
                    ? 'bg-coral-500 text-white border-coral-500 shadow-sm'
                    : 'bg-white text-charcoal-700 border-cream-200 hover:bg-cream-100'
                }`}
              >
                {tab === 'All' ? 'All Providers' : tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* LOADING STATE */}
      {loading && (
        <div className="py-12 text-center text-charcoal-600 space-y-2">
          <div className="w-8 h-8 border-3 border-coral-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-medium">Finding relevant nearby animal care providers...</p>
        </div>
      )}

      {/* PROVIDER CARDS GRID */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {providers.length > 0 ? (
            providers.map((provider) => (
              <div
                key={provider._id}
                className="bg-white p-6 rounded-3xl border border-cream-200 shadow-warm hover:shadow-lg transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* Top Bar */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cream-100 text-charcoal-700 border border-cream-200">
                        {provider.type}
                      </span>
                      <h3 className="text-lg font-bold text-charcoal-900 mt-1">{provider.name}</h3>
                    </div>
                    <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200 text-amber-800 text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                      <span>Demo {provider.rating}</span>
                    </div>
                  </div>

                  {/* Location & Distance */}
                  <div className="flex items-center gap-2 text-xs text-charcoal-600">
                    <MapPin className="w-4 h-4 text-coral-500 flex-shrink-0" />
                    <span>{provider.address || provider.location}</span>
                    {provider.distanceKm && (
                      <span className="ml-auto font-bold text-coral-600 bg-coral-50 px-2 py-0.5 rounded-md border border-coral-100">
                        {provider.distanceKm} km away
                      </span>
                    )}
                  </div>

                  {/* Services Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {provider.services.map((srv, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 bg-cream-50 text-charcoal-700 rounded-lg text-[11px] font-medium border border-cream-200"
                      >
                        {srv}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Status & Actions */}
                <div className="pt-4 border-t border-cream-200 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="w-2 h-2 rounded-full bg-coral-500"></span>
                    <span className="font-semibold text-charcoal-700">
                      Demo directory
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${provider.phone}`}
                      className="px-3.5 py-2 bg-coral-50 text-coral-600 hover:bg-coral-100 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 border border-coral-100"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call</span>
                    </a>
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(provider.name + ' ' + provider.location)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 bg-charcoal-900 hover:bg-charcoal-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Directions</span>
                    </a>
                  </div>
                </div>

              </div>
            ))
          ) : (
            <div className="col-span-full p-12 text-center bg-white rounded-3xl border border-cream-200 space-y-3">
              <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
              <h3 className="font-bold text-charcoal-900 text-base">No providers found for this category</h3>
              <p className="text-xs text-charcoal-600">Try clearing search filters or switching category tabs.</p>
              <button
                type="button"
                onClick={() => { setSelectedType('All'); setSearchTerm(''); }}
                className="px-4 py-2 bg-coral-500 text-white rounded-xl text-xs font-bold"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* DIRECTORY DEMO FOOTNOTE */}
      <div className="p-4 bg-cream-100/60 rounded-2xl border border-cream-200 text-center text-xs text-charcoal-600">
        📌 <strong>Demo Directory Notice:</strong> All listed providers are realistic demonstration entries in Gurgaon for prototype testing. Phone numbers and location coordinates are formatted for live demo evaluation.
      </div>

    </div>
  );
};
