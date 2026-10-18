import { useState } from 'react';
import { 
  X, Video, FileCode, CheckSquare, Layers, ShieldCheck, 
  Copy, Check, ExternalLink, ArrowRight, Play, Clock, AlertTriangle, Terminal, Sparkles
} from 'lucide-react';
import { CompanyConfig, TestCase } from '../types/config';
import { TEST_CHECKLIST } from '../data/defaultConfig';
import { N8N_AI_AGENT_WORKFLOW_V2, N8N_MISSED_CALL_TEXTBACK_V2 } from '../data/workflows';

interface SalesKitDrawerProps {
  config: CompanyConfig;
  isOpen: boolean;
  onClose: () => void;
  onRunTestInChat: (testPrompt: string) => void;
}

export function SalesKitDrawer({
  config,
  isOpen,
  onClose,
  onRunTestInChat
}: SalesKitDrawerProps) {
  const [activeTab, setActiveTab] = useState<'video' | 'problems' | 'n8n' | 'tests' | 'compliance'>('video');
  const [workflowTab, setWorkflowTab] = useState<'chat' | 'missed-call'>('chat');
  const [copiedWorkflow, setCopiedWorkflow] = useState(false);
  const [videoTimer, setVideoTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  if (!isOpen) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedWorkflow(true);
    setTimeout(() => setCopiedWorkflow(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-3xl bg-white dark:bg-slate-900 h-full flex flex-col shadow-2xl border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-200">
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-base flex items-center gap-2">
                <span>AI Lead-Capture Solution Guide & Sales Kit</span>
              </div>
              <div className="text-xs text-slate-300">
                Built by an AI automation specialist in Islamabad, Pakistan (+92 313 5227047)
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto bg-slate-50 dark:bg-slate-950/50 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('video')}
            className={`px-4 py-3 border-b-2 flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'video'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>60s Video Script</span>
          </button>

          <button
            onClick={() => setActiveTab('problems')}
            className={`px-4 py-3 border-b-2 flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'problems'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Problem Audit Matrix</span>
          </button>

          <button
            onClick={() => setActiveTab('n8n')}
            className={`px-4 py-3 border-b-2 flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'n8n'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Gemini AI & JSON Prompts</span>
          </button>

          <button
            onClick={() => setActiveTab('tests')}
            className={`px-4 py-3 border-b-2 flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'tests'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>13-Point Test Checklist</span>
          </button>

          <button
            onClick={() => setActiveTab('compliance')}
            className={`px-4 py-3 border-b-2 flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'compliance'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Pricing & Compliance</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs sm:text-sm">
          
          {/* TAB 1: 60-Second Video Script */}
          {activeTab === 'video' && (
            <div className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-950/40 p-4 rounded-xl border border-blue-200 dark:border-blue-800 flex items-start gap-3">
                <Video className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">
                    Section 3.1: The 60-Second Prospect Video Strategy
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Record this with Loom or Tella. Show their real ad or page first, then open this prototype with their company name, answer 5 questions in the chat, show the Telegram lead card, and give your 48-hour risk-reversal offer.
                  </p>
                </div>
              </div>

              {/* Script Timeline Breakdown */}
              <div className="space-y-4">
                
                {/* 0 to 15s */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                      0 to 15 Seconds: The Proof of Leakage
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">Screen: Their live site</span>
                  </div>
                  <div className="text-xs text-slate-700 dark:text-slate-300 font-mono bg-white dark:bg-slate-900 p-3 rounded border border-slate-200 dark:border-slate-800 italic">
                    "Hey {config.owner}, I came across your Facebook ads and filled in your contact form at 6:15 PM yesterday. It's now 11 AM and I still haven't received a response. In roofing, whoever answers first gets the $15,000 job."
                  </div>
                </div>

                {/* 15 to 40s */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                      15 to 40 Seconds: The Working Prototype
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">Screen: This demo page</span>
                  </div>
                  <div className="text-xs text-slate-700 dark:text-slate-300 font-mono bg-white dark:bg-slate-900 p-3 rounded border border-slate-200 dark:border-slate-800 italic">
                    "So I built this working prototype for {config.name}. When a homeowner clicks your ad at 10 PM on a Sunday, our virtual assistant greets them instantly, qualifies whether it's an emergency leak or hail damage, checks their address in {config.city}, and books their free inspection."
                  </div>
                </div>

                {/* 40 to 55s */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                      40 to 55 Seconds: The Owner Alert Proof
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">Screen: "What the owner receives"</span>
                  </div>
                  <div className="text-xs text-slate-700 dark:text-slate-300 font-mono bg-white dark:bg-slate-900 p-3 rounded border border-slate-200 dark:border-slate-800 italic">
                    "And here is what you receive on your phone in under 60 seconds: name, phone number, exact urgency, insurance preference, and a 1-tap button to call them back while they are still holding their phone."
                  </div>
                </div>

                {/* 55 to 60s */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                      55 to 60 Seconds: The Risk-Reversal Close
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">Screen: Contact block</span>
                  </div>
                  <div className="text-xs text-slate-700 dark:text-slate-300 font-mono bg-white dark:bg-slate-900 p-3 rounded border border-slate-200 dark:border-slate-800 italic">
                    "I can connect this to your domain and CRM within 48 hours. If it doesn't capture qualified leads in the first week, you don't pay a cent. Reply to this message and I'll send you the live link."
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: Problems Solved Matrix */}
          {activeTab === 'problems' && (
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                Section 2: The 5 Core Revenue Leaks in Local Home Services
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Use this 30-second audit method to spot lost leads before you reach out to a business owner.
              </p>

              <div className="space-y-3">
                <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                    <span>1. Slow or no response to web leads</span>
                    <span className="text-emerald-600 text-xs font-semibold">Fixed by this page + AI chat</span>
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    <strong>What is lost:</strong> Visitor contacts 2–3 competitors while waiting.
                    <br />
                    <strong>30s spot-check:</strong> Contact form has no instant SMS/WhatsApp confirmation or live booking link.
                  </div>
                </div>

                <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                    <span>2. Missed phone calls after 5 PM</span>
                    <span className="text-blue-600 text-xs font-semibold">Fixed by Missed-Call Text-Back</span>
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    <strong>What is lost:</strong> Caller hits voicemail and immediately dials the next Google map listing.
                    <br />
                    <strong>30s spot-check:</strong> Call their number after 5 PM and see if you reach voicemail without instant text reply.
                  </div>
                </div>

                <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                    <span>3. Abandoned long booking forms</span>
                    <span className="text-emerald-600 text-xs font-semibold">Fixed by conversational intake</span>
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    <strong>What is lost:</strong> Homeowner drops out midway; business has zero contact record.
                    <br />
                    <strong>30s spot-check:</strong> A "Get a Quote" page asking for 12 fields on one screen.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: n8n Workflows */}
          {activeTab === 'n8n' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setWorkflowTab('chat')}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors cursor-pointer ${
                      workflowTab === 'chat' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    AI Agent Workflow v2
                  </button>
                  <button
                    onClick={() => setWorkflowTab('missed-call')}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors cursor-pointer ${
                      workflowTab === 'missed-call' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Missed-Call Text-Back v2
                  </button>
                </div>

                <button
                  onClick={() => copyToClipboard(JSON.stringify(workflowTab === 'chat' ? N8N_AI_AGENT_WORKFLOW_V2 : N8N_MISSED_CALL_TEXTBACK_V2, null, 2))}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  {copiedWorkflow ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedWorkflow ? 'Copied Workflow!' : 'Copy n8n JSON'}</span>
                </button>
              </div>

              {/* Architecture Pipeline Explanation */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-slate-200">
                <div className="text-[11px] font-mono text-amber-400 mb-2 font-bold uppercase tracking-wider">
                  Workflow Node Pipeline (Section 8.1):
                </div>
                <div className="text-xs font-mono text-slate-300 leading-relaxed">
                  [Visitor on Page] ➔ [Chat Trigger Webhook] ➔ [Client Config] ➔ [Claude 3.5 Sonnet + Memory] ➔ [Parse Lead & Formula Sanitizer] ➔ [Reply to Visitor] ➔ [Google Sheet Append] ➔ [Telegram Alert to Owner]
                </div>
              </div>

              {/* JSON preview */}
              <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 max-h-80 overflow-y-auto">
                <pre className="text-[11px] font-mono text-emerald-400 leading-relaxed">
                  {JSON.stringify(workflowTab === 'chat' ? N8N_AI_AGENT_WORKFLOW_V2 : N8N_MISSED_CALL_TEXTBACK_V2, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 4: 13-Point Test Checklist */}
          {activeTab === 'tests' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    Section 11: Production Verification Checklist
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Click any test scenario to test the assistant directly.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {TEST_CHECKLIST.map((test) => (
                  <div
                    key={test.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white text-xs">
                          {test.title}
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {test.category}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        Input: <span className="font-mono text-slate-700 dark:text-slate-300">"{test.userPrompt}"</span>
                      </div>
                      <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                        Expected: {test.expectedResult}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        onRunTestInChat(test.userPrompt);
                        onClose();
                      }}
                      className="px-3 py-1.5 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 font-semibold text-xs flex items-center justify-center gap-1.5 shrink-0 transition-colors cursor-pointer"
                    >
                      <span>Run Test</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: Pricing & Compliance */}
          {activeTab === 'compliance' && (
            <div className="space-y-5 text-xs sm:text-sm">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-2">
                  Commercial Offer Structure (Section 3.3)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                    <div className="text-slate-500 font-medium">Setup Fee</div>
                    <div className="text-lg font-bold text-slate-900 dark:text-white">$500 – $900</div>
                    <div className="text-slate-500 text-[11px] mt-1">Landing page, AI receptionist logic, n8n pipeline, Telegram alerts, CRM.</div>
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                    <div className="text-slate-500 font-medium">Monthly Retainer</div>
                    <div className="text-lg font-bold text-slate-900 dark:text-white">$149 – $299 / mo</div>
                    <div className="text-slate-500 text-[11px] mt-1">Hosting, uptime monitoring, monthly prompt tuning, and lead logs.</div>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-xl border border-amber-200 dark:border-amber-900/50">
                <h4 className="font-bold text-amber-900 dark:text-amber-300 text-sm mb-2 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Compliance & Regulatory Safeguards (Section 12)</span>
                </h4>
                <ul className="space-y-2 text-xs text-amber-900 dark:text-amber-200 leading-relaxed list-disc list-inside">
                  <li><strong>A2P 10DLC Registration:</strong> US carriers require formal brand registration for automated business texting. Use demo flows until carrier approval is granted.</li>
                  <li><strong>TCPA & CAN-SPAM:</strong> Explicit opt-in checkbox ("Is it OK if we text you?") asked before sending any follow-up SMS.</li>
                  <li><strong>Formula Injection Sanitization:</strong> All form inputs starting with =, +, -, @ are escaped with leading single quotes to prevent CSV/Sheet formula execution.</li>
                  <li><strong>Client Ownership:</strong> The Twilio account, domain, and Google Sheet belong directly to the contractor; you are added as a manager/developer.</li>
                </ul>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>AI Automation Specialist · Islamabad, Pakistan</span>
          <a
            href="https://wa.me/923135227047"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
          >
            WhatsApp Support: +92 313 5227047
          </a>
        </div>

      </div>
    </div>
  );
}
