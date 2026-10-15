import { useState } from 'react';
import { CompanyConfig } from '../types/config';
import { AlertCircle, Sliders, X, CheckCircle, ExternalLink } from 'lucide-react';

interface DemoBannerProps {
  config: CompanyConfig;
  onOpenCustomizer: () => void;
  onOpenSalesKit: () => void;
}

export function DemoBanner({ config, onOpenCustomizer, onOpenSalesKit }: DemoBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  // If live mode (webhook URL is configured), banner is hidden per section 5
  if (config.webhook && config.webhook.trim() !== '') {
    return null;
  }

  if (dismissed) {
    return (
      <aside aria-label="Demo mode control" className="fixed top-2 right-4 z-50">
        <button
          onClick={() => setDismissed(false)}
          className="text-xs bg-slate-900 text-amber-300 font-medium px-3 py-1.5 rounded-md shadow-md border border-amber-400/40 hover:bg-slate-800 transition-colors flex items-center gap-1.5"
          title="Restore Prototype Notice"
        >
          <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
          <span>Demo Prototype Mode</span>
        </button>
      </aside>
    );
  }

  return (
    <div className="bg-amber-500/10 border-b border-amber-500/25 px-4 py-2 text-xs text-amber-950 dark:text-amber-200 transition-all">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="font-semibold px-2 py-0.5 rounded bg-amber-500/20 text-amber-900 dark:text-amber-300 uppercase tracking-wider text-[10px]">
            Sales Prototype
          </span>
          <span className="font-medium">
            Demo built for <span className="font-bold underline decoration-amber-400/60">{config.name}</span>. Not live yet.
          </span>
          <span className="hidden md:inline text-amber-800/80 dark:text-amber-400/70">
            · Ready to connect to n8n webhook and go live in 48 hours.
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenCustomizer}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 font-medium text-amber-900 dark:text-amber-100 transition-colors whitespace-nowrap cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Customize Demo for Prospect</span>
          </button>

          <button
            onClick={onOpenSalesKit}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 text-white dark:bg-amber-400 dark:text-slate-950 font-medium hover:opacity-90 transition-opacity whitespace-nowrap cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Sales Guide & n8n Kit</span>
          </button>

          <button
            onClick={() => setDismissed(true)}
            aria-label="Dismiss banner"
            className="p-1 hover:bg-amber-500/20 rounded text-amber-800 dark:text-amber-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
