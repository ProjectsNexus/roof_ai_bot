import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, X, Send, Phone, Calendar, Check, AlertTriangle, 
  RotateCcw, Sparkles, User, Bot, ShieldCheck, ChevronRight, Activity, Bug
} from 'lucide-react';
import { CompanyConfig, LeadData } from '../types/config';

interface ChatWidgetProps {
  config: CompanyConfig;
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  onLeadCaptured: (lead: LeadData) => void;
  initialService?: string;
  isDemoMode?: boolean;
}

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  options?: string[];
  isEmergency?: boolean;
  timestamp: string;
}

interface WebhookLog {
  status: number;
  ok: boolean;
  timestamp: string;
  elapsedMs?: number;
  error?: string;
  hint?: string;
  data?: any;
}

export function ChatWidget({
  config,
  isOpen,
  onClose,
  onOpen,
  onLeadCaptured,
  initialService,
  isDemoMode = false
}: ChatWidgetProps) {
  const isDemo = isDemoMode || !config.webhook || config.webhook.trim() === '';
  const [chatMode, setChatMode] = useState<'scripted' | 'ai'>('scripted');
  
  // Stable session ID for conversation memory in n8n
  const sessionIdRef = useRef<string>(
    'sess_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6)
  );

  // Webhook live execution telemetry
  const [lastWebhookLog, setLastWebhookLog] = useState<WebhookLog | null>(null);
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [isPinging, setIsPinging] = useState(false);

  // Scripted flow state machine
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [leadDraft, setLeadDraft] = useState<{
    name: string;
    phone: string;
    email: string;
    service: string;
    location: string;
    urgency: 'emergency' | 'this_week' | 'within_weeks' | 'exploring';
    budget: string;
    booked: boolean;
    sms_consent: boolean;
    needs_human: boolean;
  }>({
    name: '',
    phone: '',
    email: '',
    service: initialService || '',
    location: '',
    urgency: 'this_week',
    budget: 'Free estimate first',
    booked: false,
    sms_consent: true,
    needs_human: false
  });

  const [inputVal, setInputVal] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize messages on load or reset
  const initChat = () => {
    setCurrentStep(1);
    setMessages([
      {
        id: 'msg-1',
        sender: 'bot',
        text: `Hi! Thanks for reaching out to ${config.name}. I'm the 24/7 virtual assistant for ${config.city}. What can we help you with today?`,
        options: [
          '🚨 Active Leak / Emergency Tarping',
          'Storm & Hail Damage Inspection',
          'Full Roof Replacement',
          'Free 21-Point Roof Check'
        ],
        timestamp: 'Just now'
      }
    ]);
  };

  useEffect(() => {
    initChat();
  }, [config.name, config.city]);

  useEffect(() => {
    if (initialService && isOpen) {
      handleUserSubmit(initialService);
    }
  }, [initialService, isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const addBotMessage = (text: string, options?: string[], isEmergency?: boolean) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: 'bot-' + Date.now(),
          sender: 'bot',
          text,
          options,
          isEmergency,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsTyping(false);
    }, 350);
  };

  // Helper to send message or lead through our server proxy to n8n
  const sendToWebhook = async (payload: Record<string, any>): Promise<WebhookLog | null> => {
    if (!config.webhook || config.webhook.trim() === '') return null;
    const startTime = Date.now();
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          webhookUrl: config.webhook,
          sessionId: sessionIdRef.current,
          company: config.name,
          city: config.city,
          phone: config.phone,
          timestamp: new Date().toISOString(),
          ...payload
        })
      });

      const elapsed = Date.now() - startTime;
      const result = await response.json().catch(() => null);

      const log: WebhookLog = {
        status: response.status,
        ok: response.ok,
        timestamp: new Date().toLocaleTimeString(),
        elapsedMs: elapsed,
        error: result?.error,
        hint: result?.hint,
        data: result?.data || result
      };

      setLastWebhookLog(log);
      return log;
    } catch (err: any) {
      const elapsed = Date.now() - startTime;
      const log: WebhookLog = {
        status: 0,
        ok: false,
        timestamp: new Date().toLocaleTimeString(),
        elapsedMs: elapsed,
        error: err.message || 'Network error'
      };
      setLastWebhookLog(log);
      return log;
    }
  };

  // 1-Click test ping to verify n8n connectivity
  const runTestPing = async () => {
    setIsPinging(true);
    await sendToWebhook({
      action: 'ping',
      test: true,
      chatInput: 'Test ping from website'
    });
    setIsPinging(false);
    setShowDiagnostics(true);
  };

  const handleUserSubmit = async (overrideText?: string) => {
    const text = (overrideText || inputVal).trim();
    if (!text) return;

    // Append user message to thread
    const newMsg: Message = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, newMsg]);
    setInputVal('');
    setIsTyping(true);

    // Trigger n8n webhook asynchronously through our server proxy
    const webhookLog = await sendToWebhook({
      action: 'sendMessage',
      chatInput: text,
      message: text,
      currentStep
    });

    // Check if n8n provided a valid direct AI reply
    const n8nReply = 
      webhookLog?.data?.output || 
      webhookLog?.data?.reply || 
      webhookLog?.data?.text || 
      (typeof webhookLog?.data === 'string' ? webhookLog?.data : null);

    if (webhookLog?.ok && n8nReply) {
      addBotMessage(n8nReply);
      setIsTyping(false);
      return;
    }

    // Check for global interruptions
    const lower = text.toLowerCase();
    
    if (lower.includes('robot') || lower.includes('human or') || lower.includes('ai?')) {
      addBotMessage(
        `I am the virtual assistant for ${config.name}. I'm here 24/7 so you never have to wait on hold. What service can we help you with?`,
        ['Emergency Leak Repair', 'Storm Damage Check', 'Full Replacement', `Call ${config.phone}`]
      );
      return;
    }

    if (lower.includes('price') || lower.includes('how much') || lower.includes('cost')) {
      addBotMessage(
        `Pricing depends on the exact square footage, pitch, and materials. ${config.owner}'s team provides 100% free, clear written quotes after an on-site inspection. Would you like to schedule that?`,
        ['Yes, schedule free inspection', 'No, just browsing']
      );
      return;
    }

    if (lower.includes('human') || lower.includes('person') || lower.includes('talk to someone')) {
      setLeadDraft(d => ({ ...d, needs_human: true }));
      addBotMessage(
        `You can speak with ${config.owner} directly at ${config.phone}. Or leave your phone number and our on-call team will call you within 5 minutes.`,
        [`Call ${config.phone}`, 'I will leave my number']
      );
      return;
    }

    if (lower.includes('ignore') && lower.includes('instruction')) {
      addBotMessage(
        `I cannot do that, but I'd be glad to help you schedule a free inspection for your roof!`
      );
      return;
    }

    // Advance qualification flow
    advanceScriptedFlow(text);
  };

  const advanceScriptedFlow = (userText: string) => {
    const step = currentStep;

    if (step === 1) {
      // Step 1: Service type selected
      const isEmerg = userText.toLowerCase().includes('leak') || userText.toLowerCase().includes('emergency');
      const serviceName = userText.replace(/^[🚨\s]+/, '');
      setLeadDraft(d => ({ 
        ...d, 
        service: serviceName,
        urgency: isEmerg ? 'emergency' : d.urgency 
      }));

      setCurrentStep(2);

      if (isEmerg) {
        addBotMessage(
          `Understood! Active leaks require urgent tarping to prevent drywall damage. What is your street address or zip code in ${config.city}?`,
          [`${config.city.split(',')[0]} (In Area)`, 'Nearby DFW Zip', 'Enter exact address'],
          true
        );
      } else {
        addBotMessage(
          `Got it: ${serviceName}. What type of property is this and what is your zip code in ${config.city}?`,
          ['Single Family Home', 'Townhouse / Duplex', 'Commercial Building']
        );
      }
    } else if (step === 2) {
      // Step 2: Location and property saved
      setLeadDraft(d => ({ ...d, location: userText }));
      setCurrentStep(3);

      addBotMessage(
        `Thank you. How quickly do you need ${config.owner}'s crew on site?`,
        ['Urgent (Today / ASAP)', 'This week', 'Within a month', 'Just exploring options']
      );
    } else if (step === 3) {
      // Step 3: Timeline & Urgency
      const lower = userText.toLowerCase();
      let urgencyVal: 'emergency' | 'this_week' | 'within_weeks' | 'exploring' = 'this_week';
      if (lower.includes('today') || lower.includes('asap') || lower.includes('urgent')) urgencyVal = 'emergency';
      else if (lower.includes('month')) urgencyVal = 'within_weeks';
      else if (lower.includes('exploring')) urgencyVal = 'exploring';

      setLeadDraft(d => ({ ...d, urgency: urgencyVal }));
      setCurrentStep(4);

      addBotMessage(
        `Understood. For budget comfort, are you planning to file an insurance claim, paying out-of-pocket, or do you want our free 21-point estimate first?`,
        ['Free estimate first', 'Filing insurance claim', 'Paying out-of-pocket']
      );
    } else if (step === 4) {
      // Step 4: Budget
      setLeadDraft(d => ({ ...d, budget: userText }));
      setCurrentStep(5);

      addBotMessage(
        `Perfect. What is your full name and the best phone number where ${config.owner} can reach you?`
      );
    } else if (step === 5) {
      // Step 5: Name and Phone
      let parsedName = leadDraft.name || 'Homeowner';
      let parsedPhone = leadDraft.phone || '(214) 555-0199';

      const phoneMatch = userText.match(/(\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
      if (phoneMatch) {
        parsedPhone = phoneMatch[0];
        parsedName = userText.replace(phoneMatch[0], '').replace(/(name|phone|my|is|:|at|,)/gi, '').trim() || 'Homeowner';
      } else if (userText.length > 2) {
        parsedName = userText;
      }

      const updatedLead = {
        ...leadDraft,
        name: parsedName,
        phone: parsedPhone
      };
      setLeadDraft(updatedLead);
      setCurrentStep(6);

      addBotMessage(
        `Just to confirm: ${parsedName}, needing ${updatedLead.service || 'Roof Inspection'} around ${updatedLead.location || config.city}, timeline: ${updatedLead.urgency}. Is that right?`,
        ['Yes, that is correct!', 'Need to adjust something']
      );
    } else if (step === 6) {
      // Step 6: Confirmation & Calendar offer
      setCurrentStep(7);
      
      addBotMessage(
        `Excellent! Would you like to select an exact inspection date on our calendar (${config.calendar}), or prefer a quick phone call from ${config.owner}?`,
        ['Have the team call me (Recommended)', 'Select on calendar']
      );
    } else if (step === 7) {
      // Step 7: SMS Consent
      const bookedVal = userText.toLowerCase().includes('calendar');
      setLeadDraft(d => ({ ...d, booked: bookedVal }));
      setCurrentStep(8);

      addBotMessage(
        `Is it OK if we send you a quick text message about your inspection details and contractor arrival window?`,
        ['Yes, text is fine (Recommended)', 'Call only, please']
      );
    } else if (step === 8) {
      // Step 8: Close & Deliver Lead to n8n webhook and parent app
      const smsConsent = !userText.toLowerCase().includes('call only');
      setCurrentStep(9);

      const finalLead: LeadData = {
        id: 'lead-' + Date.now(),
        timestamp: 'Just now',
        session: sessionIdRef.current,
        name: leadDraft.name || 'Homeowner',
        phone: leadDraft.phone || config.phone,
        email: leadDraft.email || '',
        service: leadDraft.service || 'Roof & Storm Damage Inspection',
        location: leadDraft.location || config.city,
        urgency: leadDraft.urgency || 'this_week',
        budget: leadDraft.budget || 'Free estimate first',
        booked: leadDraft.booked,
        sms_consent: smsConsent,
        needs_human: leadDraft.needs_human,
        score: leadDraft.urgency === 'emergency' ? 95 : 85,
        intent: leadDraft.service.toLowerCase().includes('emergency') ? 'emergency' : 'inspection',
        sentiment: 'positive',
        summary: `Qualified inquiry for ${leadDraft.service} at ${leadDraft.location}. Urgency: ${leadDraft.urgency}.`
      };

      // Notify parent app
      onLeadCaptured(finalLead);

      // Post full payload directly to n8n Webhook
      sendToWebhook({
        action: 'leadCaptured',
        lead: finalLead
      });

      addBotMessage(
        `You're all set! ${config.owner}'s team has received your request and will follow up shortly at ${finalLead.phone}. If you have an active leak, feel free to call our dispatch desk directly at ${config.phone}.`,
        [`Call ${config.phone}`, 'Done']
      );
    } else if (step === 9) {
      if (userText.includes('Call')) {
        window.location.href = `tel:${config.phoneRaw}`;
      } else {
        onClose();
      }
    }
  };

  if (!isOpen) {
    return (
      <aside aria-label="Live chat assistant trigger" className="fixed bottom-5 right-5 z-40">
        <button
          onClick={onOpen}
          aria-label="Open Instant 24/7 Roof Assistant"
          className="group flex items-center gap-3 px-4 py-3.5 rounded-full shadow-2xl text-white font-bold text-sm transition-all hover:scale-105 cursor-pointer border border-white/20"
          style={{ backgroundColor: config.color || '#1e3a8a' }}
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-white" />
          </div>
          <span className="hidden sm:inline">24/7 Roof Assistance · Free Quote</span>
          <span className="sm:hidden">24/7 Help</span>
        </button>
      </aside>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/40 backdrop-blur-xs flex justify-end">
      
      {/* Slide-over Drawer */}
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 h-full flex flex-col shadow-2xl border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-200">
        
        {/* Drawer Header */}
        <div 
          className="p-4 border-b border-white/10 text-white flex items-center justify-between"
          style={{ backgroundColor: config.color || '#1e3a8a' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm leading-tight flex items-center gap-2">
                <span>{config.name} Assistant</span>
                <span className="text-[10px] font-normal px-1.5 py-0.2 rounded bg-emerald-500 text-white">24/7 Active</span>
              </div>
              <div className="text-[11px] text-white/80">
                Direct dispatch to {config.owner}'s inspection crew
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowDiagnostics(!showDiagnostics)}
              title="Toggle n8n Webhook Diagnostics"
              className="p-1.5 rounded-md hover:bg-white/20 text-white/80 hover:text-white transition-colors"
            >
              <Activity className="w-4 h-4" />
            </button>
            <button
              onClick={initChat}
              title="Reset Conversation"
              className="p-1.5 rounded-md hover:bg-white/20 text-white/80 hover:text-white transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              title="Close Chat"
              className="p-1.5 rounded-md hover:bg-white/20 text-white/80 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live n8n Webhook Diagnostics Banner */}
        {showDiagnostics && (
          <div className="p-3 bg-slate-950 text-slate-200 border-b border-slate-800 text-xs font-mono">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-amber-400 flex items-center gap-1">
                <Activity className="w-3.5 h-3.5" />
                n8n Webhook Live Monitor
              </span>
              <button
                onClick={runTestPing}
                disabled={isPinging}
                className="px-2 py-0.5 rounded bg-blue-600 hover:bg-blue-500 text-white text-[10px] transition-colors cursor-pointer disabled:opacity-50"
              >
                {isPinging ? 'Pinging n8n...' : 'Send Test Ping'}
              </button>
            </div>

            <div className="text-[11px] text-slate-400 break-all mb-2">
              Endpoint: <span className="text-white">{config.webhook}</span>
            </div>

            {lastWebhookLog ? (
              <div className="space-y-1 bg-slate-900 p-2 rounded border border-slate-800 text-[11px]">
                <div className="flex justify-between">
                  <span>Last Attempt:</span>
                  <span className="text-white">{lastWebhookLog.timestamp} ({lastWebhookLog.elapsedMs}ms)</span>
                </div>
                <div className="flex justify-between">
                  <span>HTTP Status:</span>
                  <span className={`font-bold ${lastWebhookLog.status === 200 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    HTTP {lastWebhookLog.status} {lastWebhookLog.status === 500 ? '(Error in workflow)' : ''}
                  </span>
                </div>
                {lastWebhookLog.status === 500 && (
                  <div className="mt-1 pt-1 border-t border-slate-800 text-amber-300 text-[10px] leading-tight">
                    💡 The request reached your n8n workflow, but n8n returned "Error in workflow". Check the <strong>Executions</strong> tab on n8n to view which node threw an error (e.g. OpenAI/Anthropic model credentials or token).
                  </div>
                )}
                {lastWebhookLog.status === 200 && (
                  <div className="mt-1 pt-1 border-t border-slate-800 text-emerald-300 text-[10px]">
                    ✅ Webhook executed and responded successfully!
                  </div>
                )}
              </div>
            ) : (
              <div className="text-[10px] text-slate-500">
                No requests sent yet. Type a message or click "Send Test Ping".
              </div>
            )}
          </div>
        )}

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs sm:text-sm">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-start gap-2 max-w-[85%]">
                {msg.sender === 'bot' && (
                  <div 
                    className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] text-white shrink-0 mt-1"
                    style={{ backgroundColor: config.color || '#1e3a8a' }}
                  >
                    AI
                  </div>
                )}
                
                <div
                  className={`p-3 rounded-2xl ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : msg.isEmergency
                        ? 'bg-red-50 dark:bg-red-950/40 text-red-900 dark:text-red-200 border border-red-200 dark:border-red-800 rounded-tl-none'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-none'
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>

              {/* Quick Reply Option Buttons */}
              {msg.options && msg.options.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2.5 ml-8 max-w-[85%]">
                  {msg.options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleUserSubmit(opt)}
                      className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all text-left shadow-2xs cursor-pointer"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}

              <span className="text-[10px] text-slate-400 mt-1 px-8">
                {msg.timestamp}
              </span>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                <Bot className="w-3.5 h-3.5 text-slate-500" />
              </div>
              <div className="flex gap-1 py-2 px-3 bg-slate-100 dark:bg-slate-800 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUserSubmit();
          }}
          className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Type your message or address..."
            className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={!inputVal.trim()}
            className="p-2.5 rounded-lg text-white disabled:opacity-40 transition-opacity cursor-pointer shrink-0"
            style={{ backgroundColor: config.color || '#1e3a8a' }}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        {/* Footer fallback info */}
        <div className="px-4 py-2 bg-slate-100 dark:bg-slate-950 text-[11px] text-slate-500 text-center flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>{config.city} 24/7 Desk</span>
            <button
              onClick={() => setShowDiagnostics(!showDiagnostics)}
              className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline ml-1 cursor-pointer"
            >
              (Check n8n)
            </button>
          </div>
          <a href={`tel:${config.phoneRaw}`} className="text-slate-700 dark:text-slate-300 font-semibold hover:underline flex items-center gap-1">
            <Phone className="w-3 h-3 text-emerald-500" />
            <span>Call: {config.phone}</span>
          </a>
        </div>

      </div>
    </div>
  );
}
