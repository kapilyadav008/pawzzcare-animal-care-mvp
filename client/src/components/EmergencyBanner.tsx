import React from 'react';
import { AlertTriangle, PhoneCall, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export const EmergencyBanner: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-red-500 to-rose-600 text-white py-3 px-4 shadow-sm">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
        <div className="flex items-center gap-2.5 text-center sm:text-left">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 animate-bounce" />
          <div>
            <span className="font-bold">Need Immediate Emergency Veterinary Help?</span>
            <span className="hidden md:inline ml-2 text-rose-100">Find nearby emergency veterinary care and animal assistance.</span>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link
            to="/find-care?type=Ambulance"
            className="px-3 py-1.5 bg-white text-rose-600 rounded-lg text-xs font-bold hover:bg-rose-50 transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Find Emergency Care</span>
          </Link>
          <Link
            to="/find-care?type=Emergency"
            className="px-3 py-1.5 bg-rose-800/80 text-white rounded-lg text-xs font-semibold hover:bg-rose-900 transition-colors flex items-center gap-1"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Emergency Clinics</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
