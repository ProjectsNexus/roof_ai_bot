import { Phone, Calendar, Sparkles } from 'lucide-react';
import { CompanyConfig } from '../types/config';

interface HeaderProps {
  config: CompanyConfig;
  onOpenChat: () => void;
  onScheduleMeeting: () => void;
}

export function Header({ config, onOpenChat, onScheduleMeeting }: HeaderProps) {
  // First letter badge for the company when logos are not loaded via URL params
  const initialLetter = config.name ? config.name.charAt(0).toUpperCase() : 'S';

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single Brand element wordmark */}
        <a href="#top" className="flex items-center gap-2.5 whitespace-nowrap shrink-0 group">
          <span 
            className="w-9 h-9 rounded-md flex items-center justify-center font-bold text-white shadow-sm text-base transition-transform group-hover:scale-105"
            style={{ backgroundColor: config.color || '#1e3a8a' }}
          >
            {initialLetter}
          </span>
          <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
            {config.name}
          </span>
        </a>

        {/* Zone 2: 4-5 concise single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <a href="#services" className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0">
            Services
          </a>
          <a href="#how-it-works" className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0">
            How It Works
          </a>
          <a href="#reviews" className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0">
            Reviews
          </a>
          <a href="#faq" className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0">
            FAQ
          </a>
          <a href="#contact" className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0">
            Contact
          </a>
        </nav>

        {/* Zone 3: Direct Actions (Call, Schedule Meeting, AI Receptionist) */}
        <div className="flex items-center gap-2.5 shrink-0">
          <a
            href={`tel:${config.phoneRaw}`}
            className="flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
          >
            <Phone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden lg:inline">{config.phone}</span>
            <span className="lg:hidden">Call</span>
          </a>

          <button
            onClick={onScheduleMeeting}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white rounded-lg shadow-sm hover:opacity-95 transition-all whitespace-nowrap shrink-0 cursor-pointer"
            style={{ backgroundColor: config.color || '#1e3a8a' }}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Schedule Inspection</span>
          </button>
        </div>

      </div>
    </header>
  );
}
