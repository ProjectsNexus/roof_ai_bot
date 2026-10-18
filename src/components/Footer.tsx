import { Shield, Phone, MapPin } from 'lucide-react';
import { CompanyConfig } from '../types/config';

interface FooterProps {
  config: CompanyConfig;
  onOpenAdminPortal?: () => void;
}

export function Footer({ config, onOpenAdminPortal }: FooterProps) {
  const isDemo = !config.webhook || config.webhook.trim() === '';

  return (
    <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-900 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-slate-800">
          
          {/* Brand & Licensing Info */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-2">
              <span 
                className="w-7 h-7 rounded flex items-center justify-center font-bold text-white text-xs"
                style={{ backgroundColor: config.color || '#1e3a8a' }}
              >
                {config.name.charAt(0)}
              </span>
              <span className="font-bold text-white text-base tracking-tight">
                {config.name}
              </span>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Providing certified {config.niche.toLowerCase()} across {config.city} and surrounding communities with 24/7 emergency dispatch.
            </p>

            <div className="flex items-center gap-1.5 text-slate-400 pt-1">
              <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-mono text-[11px]">{config.license}</span>
            </div>
          </div>

          {/* Service Areas */}
          <div className="md:col-span-4 space-y-2">
            <div className="text-white font-semibold text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
              <span>Dedicated Service Areas</span>
            </div>
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-slate-400 text-xs">
              {config.areas.map((area, idx) => (
                <span key={area} className="flex items-center gap-1.5">
                  <span>{area}</span>
                  {idx < config.areas.length - 1 && <span aria-hidden="true" className="text-slate-700">·</span>}
                </span>
              ))}
            </div>
            <div className="text-[11px] text-slate-400 pt-1">
              24/7 Virtual Intake · Field Dispatch 7:00 AM – 7:00 PM
            </div>
          </div>

          {/* Direct Contact */}
          <div className="md:col-span-3 space-y-2">
            <div className="text-white font-semibold text-xs uppercase tracking-wider mb-2">
              Direct Contact
            </div>
            <div className="text-xs">
              <div className="text-slate-400">Emergency & Estimates:</div>
              <a 
                href={`tel:${config.phoneRaw}`} 
                className="text-white font-mono font-bold text-sm hover:text-blue-400 transition-colors flex items-center gap-1.5 mt-0.5"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>{config.phone}</span>
              </a>
            </div>
            <div className="text-[11px] text-slate-400 pt-1">
              Contact: {config.owner} (Owner & Operations)
            </div>
          </div>

        </div>

        {/* Quiet Bottom Copyright & Compliance Notes */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400 text-[11px]">
          <div>
            © {new Date().getFullYear()} {config.name}. All rights reserved.
          </div>
          <div className="flex items-center gap-3">
            <span>Privacy Policy</span>
            <span aria-hidden="true">·</span>
            <span>Terms of Service</span>
            <span aria-hidden="true">·</span>
            <span>TCPA SMS Consent Compliant</span>
            <span aria-hidden="true">·</span>
            <span>Licensed & Insured Roofing Contractor</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
