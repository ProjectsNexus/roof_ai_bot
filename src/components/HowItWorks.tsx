import { MessageSquareText, Search, FileText, ArrowRight } from 'lucide-react';
import { CompanyConfig } from '../types/config';

interface HowItWorksProps {
  config: CompanyConfig;
  onOpenChat: () => void;
}

export function HowItWorks({ config, onOpenChat }: HowItWorksProps) {
  const steps = [
    {
      num: "01",
      title: "Tell Us What Happened",
      desc: `Answer 5 quick questions with our 24/7 assistant in 60 seconds. Whether you have an active leak or need a routine storm inspection, we log your details instantly.`,
      icon: MessageSquareText
    },
    {
      num: "02",
      title: "Free On-Site Inspection",
      desc: `${config.owner}'s certified roof specialists arrive with high-resolution drone cameras and attic thermal diagnostics to inspect shingles, decking, flashing, and gutters.`,
      icon: Search
    },
    {
      num: "03",
      title: "Clear, Itemized Written Quote",
      desc: `Receive an exact, transparent quote with zero hidden surprises. If filing an insurance claim, we supply complete photo evidence to expedite adjuster approval.`,
      icon: FileText
    }
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-20 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-12">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            Painless 3-Step Process
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-4 [text-wrap:balance]">
            How We Get Your Roof Inspected & Protected
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            No waiting on hold. No aggressive sales pitches. Just certified roofing expertise delivered directly when you need it most.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div 
                key={step.num}
                className="relative bg-white dark:bg-slate-900 rounded-xl p-7 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-xs font-bold text-slate-400 dark:text-slate-500">
                      Step {step.num}
                    </span>
                    <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                    {step.title}
                  </h3>

                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800/80 flex items-center text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span>Fast, transparent, guaranteed</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Link below steps */}
        <div className="mt-10 text-center">
          <button
            onClick={onOpenChat}
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors cursor-pointer"
          >
            <span>Start Step 01 now with our 24/7 receptionist</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
}
