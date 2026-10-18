import { ArrowUpRight, ShieldAlert, CloudRain, Hammer, Building2, Droplets, Camera } from 'lucide-react';
import { CompanyConfig, ServiceItem } from '../types/config';

interface ServicesGridProps {
  config: CompanyConfig;
  onSelectService: (serviceName: string) => void;
  onScheduleService?: (serviceName: string) => void;
}

export function ServicesGrid({ config, onSelectService, onScheduleService }: ServicesGridProps) {
  // Mapping service icons cleanly
  const getIcon = (id: string) => {
    switch (id) {
      case 'emergency-repair': return ShieldAlert;
      case 'storm-hail': return CloudRain;
      case 'roof-replacement': return Hammer;
      case 'commercial-flat': return Building2;
      case 'gutters-flashing': return Droplets;
      case 'drone-inspection': return Camera;
      default: return Hammer;
    }
  };

  return (
    <section id="services" className="py-16 sm:py-24 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="max-w-2xl">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Comprehensive Roofing Solutions
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white [text-wrap:balance]">
              Certified Services for {config.city} Homeowners & Commercial Buildings
            </h2>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Serving {config.areas.slice(0, 4).join(', ')} & surrounding regions
          </div>
        </div>

        {/* 6 Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {config.services.map((service: ServiceItem, index: number) => {
            const Icon = getIcon(service.id);
            return (
              <div
                key={service.id}
                className="group relative bg-slate-50/60 dark:bg-slate-800/40 rounded-xl p-6 border border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-10 h-10 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-900 dark:text-white">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-xs text-slate-400">
                      0{index + 1}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {service.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                    {service.description}
                  </p>
                </div>

                <div>
                  {/* Clean unboxed tags with subtle separators */}
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 mb-4 pt-3 border-t border-slate-200/60 dark:border-slate-800">
                    {service.tags.map((tag, tIdx) => (
                      <span key={tag} className="flex items-center gap-1.5">
                        <span>{tag}</span>
                        {tIdx < service.tags.length - 1 && <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    {onScheduleService && (
                      <button
                        onClick={() => onScheduleService(service.title)}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded text-white shadow-2xs hover:opacity-95 transition-all cursor-pointer"
                        style={{ backgroundColor: config.color || '#1e3a8a' }}
                      >
                        <span>Book Inspection</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => onSelectService(service.title)}
                      className={`${onScheduleService ? 'px-3' : 'w-full'} flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer`}
                      title="Ask 24/7 AI Receptionist about this service"
                    >
                      <span>Ask AI</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
