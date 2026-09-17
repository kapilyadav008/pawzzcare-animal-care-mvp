import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HeartPulse, Search, Dog, FileText, Sparkles } from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { label: 'Home', path: '/', icon: HeartPulse },
    { label: 'Find Care', path: '/find-care', icon: Search },
    { label: 'My Pets', path: '/my-pets', icon: Dog },
    { label: 'Health Records', path: '/medical-organizer', icon: FileText },
  ];

  return (
    <>
      {/* Desktop Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-cream-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-coral-500 text-white flex items-center justify-center font-bold text-xl shadow-sm group-hover:bg-coral-600 transition-colors">
              🐾
            </div>
            <div>
              <span className="font-bold text-xl text-charcoal-900 tracking-tight">PawzzCare</span>
              <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase bg-coral-50 text-coral-600 rounded-full border border-coral-100">
                AI Health Assistant
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                    isActive
                      ? 'bg-coral-50 text-coral-600 font-semibold'
                      : 'text-charcoal-700 hover:text-coral-600 hover:bg-cream-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/vet-summary"
              className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-charcoal-900 text-white hover:bg-charcoal-800 transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-coral-500" />
              <span>Prepare for Vet</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-cream-200 px-2 py-2 flex justify-around shadow-lg">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center py-1 px-3 rounded-lg text-xs font-medium transition-colors ${
                isActive ? 'text-coral-600 font-bold' : 'text-charcoal-600 hover:text-coral-600'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </>
  );
};
