import { Star, Quote } from 'lucide-react';
import { CompanyConfig, TestimonialItem } from '../types/config';

interface TestimonialsProps {
  config: CompanyConfig;
}

export function Testimonials({ config }: TestimonialsProps) {
  return (
    <section id="reviews" className="py-16 sm:py-24 bg-slate-50 dark:bg-slate-950/40 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="max-w-2xl">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Verified Homeowner Feedback
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white [text-wrap:balance]">
              What Neighbors in {config.city} Say About Our Work
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400">
            <span className="flex text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </span>
            <span>{config.rating.toFixed(1)} / 5.0 Rating · Verified Customers</span>
          </div>
        </div>

        {/* 3 Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {config.testimonials.map((item: TestimonialItem) => (
            <div
              key={item.id}
              className="relative bg-white dark:bg-slate-900 rounded-xl p-7 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                </div>

                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-6 italic">
                  "{item.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="font-bold text-slate-900 dark:text-white text-sm">
                  {item.name}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                  <span>{item.location}</span>
                  <span aria-hidden="true">·</span>
                  <span>{item.service}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
