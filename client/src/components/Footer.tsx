import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-cream-200 py-10 mt-16 text-charcoal-600 text-xs sm:text-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🐾</span>
              <span className="font-bold text-base text-charcoal-900">PawzzCare</span>
            </div>
            <p className="text-charcoal-600 leading-relaxed text-xs">
              Animal Care Discovery & AI Health Organizer. Helping pet parents understand what information they have, what type of care they need, and where to find it.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-charcoal-900 mb-3 text-xs uppercase tracking-wider">Safety & Disclaimer</h4>
            <p className="text-charcoal-600 leading-relaxed text-xs bg-cream-50 p-3 rounded-lg border border-cream-200">
              <strong className="text-charcoal-900">Medical Notice:</strong> PawzzCare is an information organization tool and does NOT diagnose animal diseases, prescribe medication, or replace a licensed veterinarian. In medical emergencies, contact a local clinic or emergency animal ambulance immediately.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-charcoal-900 mb-3 text-xs uppercase tracking-wider">Assignment Project</h4>
            <p className="text-charcoal-600 leading-relaxed text-xs">
              Built as a Product & Technology Internship screening assignment for Pawzz Foundation ("Practo for Animals" concept).
            </p>
            <div className="mt-2 text-[11px] text-charcoal-600">
              Directory provider data in Gurgaon is seeded for demonstration purposes.
            </div>
          </div>
        </div>

        <div className="border-t border-cream-200 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-charcoal-600 gap-4">
          <p>© {new Date().getFullYear()} PawzzCare MVP Prototype. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1 text-[11px] bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full font-medium border border-emerald-100">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              AI Safety Guardrails Active
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
