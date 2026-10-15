import { MessageSquare, Phone, CheckCircle2, ShieldCheck, ArrowRight, Sliders, ExternalLink } from 'lucide-react';
import { CompanyConfig } from '../types/config';

interface DeveloperPitchProps {
  config: CompanyConfig;
  onOpenCustomizer: () => void;
  onOpenSalesKit: () => void;
}

export function DeveloperPitch({ config, onOpenCustomizer, onOpenSalesKit }: DeveloperPitchProps) {
  // Hidden when live mode is active (webhook configured) per section 5
  if (config.webhook && config.webhook.trim() !== '') {
    return null;
  }

  return (
    <section className="py-16 bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 text-white border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="rounded-2xl bg-white/5 border border-white/10 p-8 sm:p-10 backdrop-blur-sm">
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-8 pb-8 border-b border-white/10">
            <div>
              <div className="text-xs font-mono font-semibold uppercase tracking-wider text-amber-400 mb-2">
                Turnkey Implementation · Live in 48 Hours
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 [text-wrap:balance]">
                Want This Lead-Capture Engine on {config.name}'s Website?
              </h2>
              <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
                Built by a web developer and AI automation specialist based in Islamabad, Pakistan. I set up the landing page, brand styling, receptionist qualification logic, Google Sheets CRM, and instant Telegram/SMS alerts for your business.
              </p>
            </div>

            {/* Price & Risk Reversal */}
            <div className="bg-white/10 rounded-xl p-5 border border-white/15 text-left shrink-0">
              <div className="text-xs text-slate-300 font-medium">Standard Offer</div>
              <div className="text-2xl font-bold font-mono text-emerald-400 my-1">
                $500 – $900 <span className="text-xs text-slate-300 font-normal">setup</span>
              </div>
              <div className="text-xs text-slate-300">
                + $149 – $299/mo <span className="text-slate-400">(hosting & maintenance)</span>
              </div>
              <div className="mt-3 text-[11px] font-semibold text-amber-300 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Risk Reversal: Live in 48 hrs or no payment</span>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            
            <div className="flex flex-wrap items-center gap-3">
              {/* WhatsApp button */}
              <a
                href="https://wa.me/923135227047?text=Hi%2C%20I%20saw%20your%20AI%20lead-capture%20landing%20page%20demo%20and%20would%20like%20to%20discuss%20setting%20it%20up."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 font-bold text-sm text-white transition-colors cursor-pointer shadow-sm"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp (+92 313 5227047)</span>
              </a>

              {/* Direct call button */}
              <a
                href="tel:+923135227047"
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-white/10 hover:bg-white/15 border border-white/20 font-semibold text-sm text-white transition-colors"
              >
                <Phone className="w-4 h-4 text-slate-300" />
                <span>Direct Call</span>
              </a>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onOpenCustomizer}
                className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5 text-amber-400" />
                <span>Generate Prospect URL</span>
              </button>

              <button
                onClick={onOpenSalesKit}
                className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-xs font-bold text-slate-950 transition-colors cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>View Full Solution Guide</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
