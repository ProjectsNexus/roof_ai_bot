import { Phone, Calendar, Clock, MapPin, ShieldCheck, ArrowRight } from 'lucide-react';
import { CompanyConfig } from '../types/config';

interface ContactSectionProps {
  config: CompanyConfig;
  onOpenChat: () => void;
}

export function ContactSection({ config, onOpenChat }: ContactSectionProps) {
  return (
    <section id="contact" className="py-16 sm:py-24 bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-slate-900 text-white rounded-2xl p-8 sm:p-12 border border-slate-800 shadow-xl overflow-hidden relative">
          
          {/* Subtle architectural background pattern */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
                Fast Emergency Dispatch & Estimates
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-4 [text-wrap:balance]">
                Have Storm Damage or an Active Leak? Let's Get Your Roof Inspected Today.
              </h2>
              <p className="text-sm sm:text-base text-slate-300 mb-8 max-w-xl leading-relaxed">
                Our 24/7 digital intake qualifies your need instantly and dispatches {config.owner}'s crew. We provide a 100% free, 21-point on-site assessment with full photographic insurance evidence.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <button
                  onClick={onOpenChat}
                  className="px-6 py-3.5 rounded-lg text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                  style={{ backgroundColor: config.color || '#1e3a8a' }}
                >
                  <Calendar className="w-4 h-4" />
                  <span>Start Free 60-Second Online Assessment</span>
                </button>

                <a
                  href={`tel:${config.phoneRaw}`}
                  className="px-6 py-3.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>Call {config.phone}</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-5 bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-xs space-y-4 text-xs sm:text-sm">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white">Emergency Response Hours</div>
                  <div className="text-slate-300 text-xs mt-0.5">
                    Virtual Assistant: 24/7/365
                    <br />
                    Field Crew Dispatch: 7:00 AM – 7:00 PM Daily
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-3 border-t border-white/10">
                <MapPin className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white">Service Territory</div>
                  <div className="text-slate-300 text-xs mt-0.5">
                    {config.areas.join(' · ')}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-3 border-t border-white/10">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white">Certified & Insured</div>
                  <div className="text-slate-300 text-xs mt-0.5">
                    {config.license}
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
