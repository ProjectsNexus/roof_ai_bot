import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, X, Send, Phone, Calendar, Check, AlertTriangle, 
  RotateCcw, Sparkles, User, Bot, ShieldCheck, ChevronRight, FileText, CheckCircle2
} from 'lucide-react';
import { CompanyConfig, LeadData } from '../types/config';

interface ChatWidgetProps {
  config: CompanyConfig;
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  onLeadCaptured: (lead: LeadData) => void;
  onOpenScheduler?: (service?: string) => void;
  initialService?: string;
}

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  options?: string[];
  isEmergency?: boolean;
  isMeetingOffer?: boolean;
  timestamp: string;
}

export function ChatWidget({
  config,
  isOpen,
  onClose,
  onOpen,
  onLeadCaptured,
  onOpenScheduler,
  initialService
}: ChatWidgetProps) {
  // Session ID for conversation continuity
  const sessionIdRef = useRef<string>(
    'sess_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6)
  );

  const [inputVal, setInputVal] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize greeting on load or reset
  const initChat = () => {
    setMessages([
      {
        id: 'msg-1',
        sender: 'bot',
        text: `Hello! I'm the 24/7 virtual receptionist for ${config.name}. How can we assist you with your roof today in ${config.city}?`,
        options: [
          '📅 Schedule Meeting (In-Person / Call / Zoom)',
          '🚨 Emergency Leak / Tarping',
          'Storm & Hail Damage Inspection',
          'Full Roof Replacement',
          'Free 21-Point Drone Check'
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

  const addBotMessage = (text: string, options?: string[], isEmergency?: boolean, isMeetingOffer?: boolean) => {
    setMessages(prev => [
      ...prev,
      {
        id: 'bot-' + Date.now(),
        sender: 'bot',
        text,
        options,
        isEmergency,
        isMeetingOffer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const handleUserSubmit = async (overrideText?: string) => {
    const text = (overrideText || inputVal).trim();
    if (!text) return;

    // Check if user clicked the schedule meeting button or option
    if (text.includes('Schedule Meeting') || text === '📅 Schedule Meeting (In-Person / Call / Zoom)') {
      const newMsg: Message = {
        id: 'user-' + Date.now(),
        sender: 'user',
        text: 'I would like to schedule a consultation / inspection.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, newMsg]);
      setInputVal('');
      
      setTimeout(() => {
        addBotMessage(
          `I've opened our consultation booking calendar for you! You can choose an In-Person On-Site Inspection, a 15-minute Phone Call with ${config.owner}, or a Zoom Video Consultation at your preferred date and time.`,
          undefined,
          false,
          true
        );
        if (onOpenScheduler) {
          onOpenScheduler(initialService);
        }
      }, 400);
      return;
    }

    // Append user message to thread
    const newMsg: Message = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    const updatedMessages = [...messages, newMsg];
    setMessages(updatedMessages);
    setInputVal('');
    setIsTyping(true);

    try {
      // Send conversation history to server-side Gemini AI agent
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: updatedMessages.map(m => ({
            role: m.sender === 'user' ? 'user' : 'model',
            text: m.text
          })),
          company: config.name,
          owner: config.owner,
          city: config.city,
          phone: config.phone,
          calendar: config.calendar,
          nicheKey: 'roofing'
        })
      });

      const data = await res.json();
      setIsTyping(false);

      if (data.ok && data.reply) {
        const isEmerg = text.toLowerCase().includes('leak') || text.toLowerCase().includes('emergency') || text.toLowerCase().includes('water');
        const lowerReply = data.reply.toLowerCase();
        const mentionsBooking = lowerReply.includes('schedule') || lowerReply.includes('meeting') || lowerReply.includes('inspection') || lowerReply.includes('calendar') || lowerReply.includes('zoom');
        
        addBotMessage(data.reply, undefined, isEmerg, mentionsBooking);

        // If Gemini extracted structured lead data
        if (data.lead && data.lead.phone) {
          const capturedLead: LeadData = {
            id: 'lead-' + Date.now(),
            timestamp: 'Just now',
            session: sessionIdRef.current,
            name: data.lead.name || 'Homeowner',
            phone: data.lead.phone,
            email: data.lead.email || '',
            service: data.lead.service || 'Roof Inspection',
            location: data.lead.location || config.city,
            urgency: data.lead.urgency || 'this_week',
            budget: data.lead.budget || 'Free estimate first',
            booked: !!data.lead.booked,
            sms_consent: data.lead.sms_consent !== false,
            needs_human: !!data.lead.needs_human,
            score: data.lead.urgency === 'emergency' ? 95 : 85,
            intent: isEmerg ? 'emergency' : 'inspection',
            sentiment: 'positive',
            summary: `Gemini AI qualified lead for ${data.lead.service || 'roofing'} in ${data.lead.location || config.city}.`
          };

          onLeadCaptured(capturedLead);
        }
      } else {
        addBotMessage(
          `Thank you for your message! ${config.owner}'s team is on call. For immediate emergency service or free estimates, call ${config.phone} or reply with your address and phone number.`,
          undefined,
          false,
          true
        );
      }
    } catch (err) {
      setIsTyping(false);
      addBotMessage(
        `We received your request. ${config.owner}'s crew will contact you shortly. You can also reach our 24/7 dispatch desk directly at ${config.phone}.`
      );
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
                <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-emerald-500 text-white flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" />
                  Gemini AI
                </span>
              </div>
              <div className="text-[11px] text-white/80">
                Direct dispatch to {config.owner}'s certified crew
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={initChat}
              title="Reset Conversation"
              className="p-1.5 rounded-md hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              title="Close Chat"
              className="p-1.5 rounded-md hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Meeting Scheduler Banner */}
        <div className="bg-slate-100 dark:bg-slate-800/80 px-4 py-2.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
            <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
            <span className="font-semibold truncate">Schedule Consultation:</span>
          </div>
          {onOpenScheduler && (
            <button
              onClick={() => onOpenScheduler(initialService)}
              className="px-2.5 py-1 rounded-md text-white font-semibold text-[11px] shadow-2xs hover:opacity-95 transition-all cursor-pointer flex items-center gap-1 shrink-0"
              style={{ backgroundColor: config.color || '#1e3a8a' }}
            >
              <span>Book Call / In-Person / Zoom</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          )}
        </div>

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

              {/* Inline Schedule Action Button when message offers meeting */}
              {msg.isMeetingOffer && onOpenScheduler && (
                <div className="ml-8 mt-2">
                  <button
                    onClick={() => onOpenScheduler(initialService)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-2xs transition-colors cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Choose Time (In-Person / Call / Zoom)</span>
                  </button>
                </div>
              )}

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
            placeholder="Type your message, issue, or address..."
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

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-slate-100 dark:bg-slate-950 text-[11px] text-slate-500 text-center flex items-center justify-between border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-slate-600 dark:text-slate-400 font-medium">{config.city} 24/7 Desk · Gemini AI</span>
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
