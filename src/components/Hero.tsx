import { ShieldCheck, Clock, Zap, ArrowRight, Phone, CheckCircle2, ChevronRight, AlertTriangle } from 'lucide-react';
import { CompanyConfig } from '../types/config';

interface HeroProps {
  config: CompanyConfig;
  onOpenChat: () => void;
}

export function Hero({ config, onOpenChat }: HeroProps) {
  return (
    <section id="top" className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 pt-10 pb-16 lg:pt-16 lg:pb-24 border-b border-slate-200/80 dark:border-slate-800">
      
      {/* Background Architectural Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none" 
        style={{ 
          backgroundImage: `radial-gradient(${config.color || '#1e3a8a'} 1.5px, transparent 1.5px)`, 
          backgroundSize: '24px 24px' 
        }} 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Value Proposition & Conversion Action */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            
            {/* Subtle editorial kicker without pills */}
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-3">
              <span>{config.city}</span>
              <span aria-hidden="true">·</span>
              <span>Certified 24/7 Dispatch</span>
              <span aria-hidden="true">·</span>
              <span>Under 60s Response Time</span>
            </div>

            {/* Outcome Headline with text-wrap: balance */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12] mb-5 [text-wrap:balance]">
              {config.city} {config.niche} — Answered in 60 Seconds, 24/7.
            </h1>

            {/* Single concrete sentence describing what the business delivers */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-8 max-w-2xl">
              Don't lose thousands to missed calls or delayed callbacks after a storm. Our virtual receptionist answers immediately, collects damage photos and inspection details, and dispatches {config.owner}'s crew for a free on-site roof evaluation.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-8">
              <button
                onClick={onOpenChat}
                className="group flex items-center justify-center gap-2.5 px-6 py-3.5 text-base font-semibold text-white rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer whitespace-nowrap shrink-0"
                style={{ backgroundColor: config.color || '#1e3a8a' }}
              >
                <span>Request Free Roof Inspection</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <a
                href={`tel:${config.phoneRaw}`}
                className="flex items-center justify-center gap-2 px-5 py-3.5 text-base font-semibold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800/90 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
              >
                <Phone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Call {config.phone}</span>
              </a>
            </div>

            {/* High-intent reassurance bullets */}
            <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800/80 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100% Free 21-Point Inspection</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Insurance Claim Specialists</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Emergency 2-Hr Tarping</span>
              </div>
            </div>

          </div>

          {/* Right Column: Architectural Visual & Interactive Proof Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden p-6 sm:p-7">
              
              {/* Header inside card */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-xs font-semibold text-slate-900 dark:text-white">
                    Live Lead Qualification Engine
                  </span>
                </div>
                <span className="text-[11px] font-mono text-slate-500">
                  Avg. Reply: 3 sec
                </span>
              </div>

              {/* Architectural Graphic / Roofing Blueprint Visualization */}
              <div className="my-5 p-4 rounded-lg bg-slate-950 text-slate-200 relative overflow-hidden border border-slate-800">
                <div className="absolute top-0 right-0 p-3 opacity-10">
                  <ShieldCheck className="w-24 h-24 text-white" />
                </div>
                
                <div className="relative z-10 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-amber-400 font-mono flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      HAIL & STORM ADVISORY
                    </span>
                    <span className="text-slate-400 text-[11px]">{config.city}</span>
                  </div>

                  {/* Blueprint diagram representation */}
                  <div className="h-28 rounded border border-dashed border-slate-700/80 bg-slate-900/60 p-3 flex flex-col justify-between">
                    <div className="flex justify-between items-center text-[11px] text-slate-400">
                      <span>Roof Ridge & Valley Diagnostics</span>
                      <span className="text-emerald-400 font-mono font-medium">PASS 21-PT</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                      <div className="bg-slate-800/80 p-1.5 rounded border border-slate-700">
                        <div className="text-slate-400">Shingle Tear</div>
                        <div className="font-semibold text-white">Inspected</div>
                      </div>
                      <div className="bg-slate-800/80 p-1.5 rounded border border-slate-700">
                        <div className="text-slate-400">Flashing Seal</div>
                        <div className="font-semibold text-amber-300">Checked</div>
                      </div>
                      <div className="bg-slate-800/80 p-1.5 rounded border border-slate-700">
                        <div className="text-slate-400">Decking Rot</div>
                        <div className="font-semibold text-emerald-400">Clear</div>
                      </div>
                    </div>

                    <div className="text-[10px] text-slate-400 flex items-center justify-between">
                      <span>Certified Contractor on Call: {config.owner}</span>
                      <span className="text-white font-mono">{config.phone}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Interactive Demo Conversation Snapshot */}
              <div className="space-y-3 bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-lg border border-slate-200/70 dark:border-slate-800 text-xs">
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded bg-slate-900 text-white dark:bg-white dark:text-slate-900 flex items-center justify-center font-bold text-[10px] shrink-0">
                    AI
                  </div>
                  <div className="bg-white dark:bg-slate-800 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 shadow-2xs">
                    "Hi! Thanks for contacting {config.name}. Do you have an active leak, need storm damage inspected, or looking for a quote?"
                  </div>
                </div>

                <div className="flex items-start gap-2.5 justify-end">
                  <div className="bg-blue-600 text-white p-2 rounded-lg text-[11px] shadow-2xs">
                    "Water dripping from our second-floor ceiling after last night's hail."
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded bg-slate-900 text-white dark:bg-white dark:text-slate-900 flex items-center justify-center font-bold text-[10px] shrink-0">
                    AI
                  </div>
                  <div className="bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-[11px] shadow-2xs">
                    "Got it! That is an active leak. What is the best phone number and address so {config.owner} can dispatch emergency tarping?"
                  </div>
                </div>
              </div>

              {/* Try it out button */}
              <button
                onClick={onOpenChat}
                className="w-full mt-4 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Test Live Chat Assistant Now</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
