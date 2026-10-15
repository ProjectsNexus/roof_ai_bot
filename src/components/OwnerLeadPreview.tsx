import { useState } from 'react';
import { Send, Table, PhoneCall, Zap, CheckCircle, ShieldAlert, Sparkles, RefreshCw } from 'lucide-react';
import { CompanyConfig, LeadData } from '../types/config';

interface OwnerLeadPreviewProps {
  config: CompanyConfig;
  leads: LeadData[];
  onSelectLead?: (lead: LeadData) => void;
  onSimulateEmergency: () => void;
}

export function OwnerLeadPreview({ config, leads, onSimulateEmergency }: OwnerLeadPreviewProps) {
  const [activeTab, setActiveTab] = useState<'telegram' | 'sheet'>('telegram');
  const [selectedLeadId, setSelectedLeadId] = useState<string>(leads[0]?.id || '');

  const activeLead = leads.find(l => l.id === selectedLeadId) || leads[0];

  return (
    <section id="owner-preview" className="py-16 sm:py-24 bg-slate-900 text-slate-100 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Proof Context */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div className="max-w-2xl">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
              The Sales Proof Moment
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white [text-wrap:balance]">
              What {config.owner} Receives on Their Phone in Seconds
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2">
              When a visitor finishes the chat, ad money stops leaking. The owner receives an immediate instant alert with contact details, damage photos, urgency rating, and a 1-tap call button.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onSimulateEmergency}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-md bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors cursor-pointer"
              title="Inject a realistic emergency lead"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Test Emergency Lead Push</span>
            </button>
          </div>
        </div>

        {/* View Switcher Tabs: Telegram Alert vs Google Sheets CRM */}
        <div className="flex items-center gap-1 p-1 bg-slate-800 rounded-lg max-w-xs mb-6">
          <button
            onClick={() => setActiveTab('telegram')}
            className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-md flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'telegram'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Telegram Alert</span>
          </button>
          <button
            onClick={() => setActiveTab('sheet')}
            className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-md flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'sheet'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>Google Sheet CRM</span>
          </button>
        </div>

        {/* Tab 1: Telegram Alert View */}
        {activeTab === 'telegram' && activeLead && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Phone Mockup Container */}
            <div className="lg:col-span-6 xl:col-span-5 bg-slate-950 rounded-2xl p-4 sm:p-5 border border-slate-800 shadow-2xl">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <span className="font-semibold text-slate-200">Telegram Bot Alert</span>
                </div>
                <span className="font-mono text-[11px]">{activeLead.timestamp}</span>
              </div>

              {/* The Exact Telegram Card from Section 8.6 */}
              <div className={`p-4 rounded-xl border ${
                activeLead.urgency === 'emergency'
                  ? 'bg-red-950/40 border-red-800/80'
                  : 'bg-slate-900 border-slate-800'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <span className={`font-mono text-xs font-bold ${
                    activeLead.urgency === 'emergency' ? 'text-red-400' : 'text-blue-400'
                  }`}>
                    {activeLead.urgency === 'emergency' ? '🚨 URGENT EMERGENCY LEAD' : '⚡ NEW QUALIFIED LEAD'}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {config.name}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-200 font-mono">
                  <div className="flex justify-between py-0.5 border-b border-slate-800/50">
                    <span className="text-slate-400">Name:</span>
                    <span className="font-bold text-white">{activeLead.name}</span>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-slate-800/50">
                    <span className="text-slate-400">Phone:</span>
                    <span className="font-bold text-emerald-400">{activeLead.phone}</span>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-slate-800/50">
                    <span className="text-slate-400">Service:</span>
                    <span>{activeLead.service}</span>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-slate-800/50">
                    <span className="text-slate-400">Where:</span>
                    <span>{activeLead.location}</span>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-slate-800/50">
                    <span className="text-slate-400">Urgency:</span>
                    <span className={`font-semibold ${activeLead.urgency === 'emergency' ? 'text-red-400' : 'text-amber-400'}`}>
                      {activeLead.urgency.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-slate-800/50">
                    <span className="text-slate-400">Budget:</span>
                    <span>{activeLead.budget}</span>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-slate-800/50">
                    <span className="text-slate-400">Booked:</span>
                    <span>{activeLead.booked ? 'Yes (Confirmed slot)' : 'No (Requires phone call)'}</span>
                  </div>
                  <div className="flex justify-between py-0.5">
                    <span className="text-slate-400">SMS Consent:</span>
                    <span>{activeLead.sms_consent ? 'Granted (TCPA ok)' : 'Not granted'}</span>
                  </div>
                </div>

                {activeLead.summary && (
                  <div className="mt-3 p-2.5 rounded bg-slate-950/70 border border-slate-800 text-[11px] text-slate-300">
                    <div className="text-[10px] text-slate-400 font-semibold mb-0.5 uppercase tracking-wider">
                      AI Lead Summary:
                    </div>
                    {activeLead.summary}
                  </div>
                )}

                {/* Tap to Call Action Button */}
                <a
                  href={`tel:${activeLead.phone.replace(/[^0-9+]/g, '')}`}
                  className="mt-4 w-full py-2.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Tap to Call {activeLead.name} ({activeLead.phone})</span>
                </a>
              </div>
            </div>

            {/* Right Column: Routing & Intelligence Explanation */}
            <div className="lg:col-span-6 xl:col-span-7 space-y-6">
              <div className="bg-slate-800/60 rounded-xl p-6 border border-slate-700/80">
                <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
                  Deterministic Score & Routing Rules (Section 8.3)
                </div>
                <h3 className="text-lg font-bold text-white mb-4">
                  How This Lead Was Analyzed & Scored
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6 font-mono text-xs">
                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-700">
                    <div className="text-slate-400 text-[11px]">Calculated Score</div>
                    <div className="text-xl font-bold text-emerald-400 tabular-nums">
                      {activeLead.score || 85} / 100
                    </div>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-700">
                    <div className="text-slate-400 text-[11px]">Routing Rule</div>
                    <div className="text-sm font-bold text-amber-400">
                      {(activeLead.score || 85) >= 70 ? '🚨 CALL NOW' : '⚡ STANDARD'}
                    </div>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-700">
                    <div className="text-slate-400 text-[11px]">Sentiment</div>
                    <div className="text-sm font-bold text-slate-200 capitalize">
                      {activeLead.sentiment || 'neutral'}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Valid Phone Number verified (+20 pts)</span>
                  </div>
                  {activeLead.urgency === 'emergency' && (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Active emergency leak detected (+40 pts)</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Location within service area ({activeLead.location}) (+10 pts)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Sanitized against formula injection (=, +, -, @)</span>
                  </div>
                </div>
              </div>

              {/* Quick lead switcher to inspect other captured leads */}
              <div>
                <div className="text-xs font-semibold text-slate-400 mb-2">
                  Select captured lead to inspect:
                </div>
                <div className="flex flex-wrap gap-2">
                  {leads.map((l) => (
                    <button
                      key={l.id}
                      onClick={() => setSelectedLeadId(l.id)}
                      className={`px-3 py-1.5 rounded text-xs font-mono font-medium transition-colors cursor-pointer ${
                        l.id === activeLead.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {l.name} · {l.urgency}
                    </button>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* Tab 2: Google Sheets CRM Table */}
        {activeTab === 'sheet' && (
          <div className="bg-slate-950 rounded-xl border border-slate-800 p-5 overflow-hidden">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <Table className="w-4 h-4 text-emerald-400" />
                <span className="font-semibold text-white">Google Sheet CRM Auto-Sync: Leads!A:N</span>
              </div>
              <span className="text-slate-400 font-mono text-[11px]">{leads.length} Records</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 bg-slate-900/60">
                    <th className="py-2.5 px-3">Timestamp</th>
                    <th className="py-2.5 px-3">Name</th>
                    <th className="py-2.5 px-3">Phone</th>
                    <th className="py-2.5 px-3">Service</th>
                    <th className="py-2.5 px-3">Location</th>
                    <th className="py-2.5 px-3">Urgency</th>
                    <th className="py-2.5 px-3">Budget</th>
                    <th className="py-2.5 px-3">Score</th>
                    <th className="py-2.5 px-3">Booked</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-200">
                  {leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="py-2.5 px-3 text-slate-400">{lead.timestamp}</td>
                      <td className="py-2.5 px-3 font-semibold text-white">{lead.name}</td>
                      <td className="py-2.5 px-3 text-emerald-400">{lead.phone}</td>
                      <td className="py-2.5 px-3 text-slate-300">{lead.service}</td>
                      <td className="py-2.5 px-3 text-slate-300">{lead.location}</td>
                      <td className="py-2.5 px-3">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          lead.urgency === 'emergency' ? 'bg-red-950 text-red-300' : 'bg-slate-800 text-amber-300'
                        }`}>
                          {lead.urgency}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-300">{lead.budget}</td>
                      <td className="py-2.5 px-3 font-bold text-emerald-400 tabular-nums">{lead.score || 80}</td>
                      <td className="py-2.5 px-3">{lead.booked ? '✅ Yes' : '❌ Needs Call'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
