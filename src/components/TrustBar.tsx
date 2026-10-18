import { Shield, Star, Award, CheckCircle } from 'lucide-react';
import { CompanyConfig } from '../types/config';

interface TrustBarProps {
  config: CompanyConfig;
}

export function TrustBar({ config }: TrustBarProps) {
  return (
    <section className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Clean, unboxed 4-column trust strip with tabular numbers */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 items-center justify-between text-center md:text-left">
          
          {/* Trust Metric 1: Rating */}
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Star className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                {config.rating.toFixed(1)} / 5.0
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {config.reviews}+ Verified Reviews
              </div>
            </div>
          </div>

          {/* Trust Metric 2: Completed Projects */}
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                {config.projects.toLocaleString()}+
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Completed Roofs
              </div>
            </div>
          </div>

          {/* Trust Metric 3: Licensing & Insurance */}
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Licensed & Insured
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                $2M General Liability Protection
              </div>
            </div>
          </div>

          {/* Trust Metric 4: Free Inspections */}
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                100% Free Inspection
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                No Obligation · Written Estimate
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
