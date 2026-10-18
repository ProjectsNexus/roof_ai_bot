import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, Clock, Phone, Video, Home, CheckCircle2, 
  X, ArrowRight, ShieldCheck, User, Mail, MapPin, Sparkles, AlertCircle, Check 
} from 'lucide-react';
import { CompanyConfig, ScheduledMeeting, LeadData } from '../types/config';

interface MeetingSchedulerModalProps {
  config: CompanyConfig;
  isOpen: boolean;
  onClose: () => void;
  onMeetingBooked: (meeting: ScheduledMeeting, lead: LeadData) => void;
  preselectedService?: string;
}

export function MeetingSchedulerModal({
  config,
  isOpen,
  onClose,
  onMeetingBooked,
  preselectedService
}: MeetingSchedulerModalProps) {
  const [meetingType, setMeetingType] = useState<'in_person' | 'phone' | 'zoom'>('in_person');
  const [selectedDate, setSelectedDate] = useState<string>('Tomorrow');
  const [selectedTime, setSelectedTime] = useState<string>('10:00 AM');
  
  // Contact Form
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState(preselectedService ? `Inquiring about: ${preselectedService}` : '');
  const [confirmedMeeting, setConfirmedMeeting] = useState<ScheduledMeeting | null>(null);

  if (!isOpen) return null;

  // Available dates for quick booking
  const dateOptions = [
    { label: 'Today (Priority)', value: 'Today', note: 'Emergency Tarping Available' },
    { label: 'Tomorrow', value: 'Tomorrow', note: 'Morning & Afternoon open' },
    { label: 'In 2 Days', value: 'In 2 Days', note: 'Full slots open' },
    { label: 'This Weekend', value: 'This Weekend', note: 'Flexible dispatch' }
  ];

  const timeSlots = [
    '08:30 AM', '10:00 AM', '11:30 AM', 
    '01:00 PM', '02:30 PM', '04:00 PM', '05:30 PM'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    const meeting: ScheduledMeeting = {
      id: 'meet_' + Date.now(),
      name,
      phone,
      email,
      address: address || config.city,
      meetingType,
      date: selectedDate,
      time: selectedTime,
      service: preselectedService || 'Free 21-Point Inspection',
      notes,
      status: 'confirmed'
    };

    const lead: LeadData = {
      id: 'lead_meet_' + Date.now(),
      timestamp: 'Just now',
      session: 'sched_' + Date.now().toString(36),
      name,
      phone,
      email,
      service: preselectedService || 'Roof Inspection',
      location: address || config.city,
      urgency: selectedDate === 'Today' ? 'emergency' : 'this_week',
      budget: 'Free inspection scheduled',
      booked: true,
      sms_consent: true,
      needs_human: true,
      meetingType,
      meetingDate: selectedDate,
      meetingTime: selectedTime,
      score: 100,
      intent: 'inspection_booked',
      sentiment: 'positive',
      summary: `Confirmed ${meetingType.toUpperCase()} inspection on ${selectedDate} at ${selectedTime}.`
    };

    setConfirmedMeeting(meeting);
    onMeetingBooked(meeting, lead);
  };

  const handleReset = () => {
    setConfirmedMeeting(null);
    setName('');
    setPhone('');
    setEmail('');
    setAddress('');
    setNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between"
          style={{ backgroundColor: config.color || '#1e3a8a' }}>
          <div className="text-white">
            <div className="text-xs font-semibold uppercase tracking-wider text-white/80 flex items-center gap-1.5">
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Certified Roof Consultation</span>
            </div>
            <h3 className="font-extrabold text-lg text-white mt-0.5">
              Schedule with {config.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Confirmed State Screen */}
        {confirmedMeeting ? (
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Booking Confirmed · Zero Obligation
              </span>
              <h4 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                You're On The Schedule!
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto mt-2">
                {config.owner}'s crew has locked in your appointment. A confirmation text has been prepped for {confirmedMeeting.phone}.
              </p>
            </div>

            {/* Meeting Card Summary */}
            <div className="max-w-md mx-auto p-5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-left text-xs sm:text-sm space-y-2.5">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700">
                <span className="text-slate-500 dark:text-slate-400">Meeting Format:</span>
                <span className="font-bold text-slate-900 dark:text-white capitalize flex items-center gap-1.5">
                  {confirmedMeeting.meetingType === 'in_person' && <Home className="w-4 h-4 text-emerald-500" />}
                  {confirmedMeeting.meetingType === 'phone' && <Phone className="w-4 h-4 text-blue-500" />}
                  {confirmedMeeting.meetingType === 'zoom' && <Video className="w-4 h-4 text-purple-500" />}
                  {confirmedMeeting.meetingType === 'in_person' ? 'In-Person On-Site Inspection' : confirmedMeeting.meetingType === 'phone' ? 'Phone Consultation' : 'Zoom Video Consultation'}
                </span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700">
                <span className="text-slate-500 dark:text-slate-400">Date & Time:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {confirmedMeeting.date} at {confirmedMeeting.time}
                </span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700">
                <span className="text-slate-500 dark:text-slate-400">Contact:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {confirmedMeeting.name} ({confirmedMeeting.phone})
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400">Location:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {confirmedMeeting.address}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <a
                href={`tel:${config.phoneRaw}`}
                className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 font-semibold text-xs text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-500" />
                <span>Call Dispatch Desk: {config.phone}</span>
              </a>

              <button
                onClick={handleReset}
                className="w-full sm:w-auto px-6 py-2.5 rounded-lg text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                style={{ backgroundColor: config.color || '#1e3a8a' }}
              >
                Return to Site
              </button>
            </div>
          </div>
        ) : (
          /* Booking Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto text-xs sm:text-sm">
            
            {/* Step 1: Choose Meeting Type */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2.5">
                1. Select Meeting Format:
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                
                {/* Option 1: In-Person On-Site */}
                <button
                  type="button"
                  onClick={() => setMeetingType('in_person')}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    meetingType === 'in_person'
                      ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 ring-2 ring-blue-500/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                      <Home className="w-4 h-4" />
                    </div>
                    {meetingType === 'in_person' && <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white text-xs">
                      In-Person On-Site
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">
                      Free 21-point drone & physical inspection at your roof.
                    </div>
                  </div>
                </button>

                {/* Option 2: Phone Call */}
                <button
                  type="button"
                  onClick={() => setMeetingType('phone')}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    meetingType === 'phone'
                      ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 ring-2 ring-blue-500/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                      <Phone className="w-4 h-4" />
                    </div>
                    {meetingType === 'phone' && <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white text-xs">
                      Phone Consultation
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">
                      15-min call with {config.owner} to review damage & ballpark costs.
                    </div>
                  </div>
                </button>

                {/* Option 3: Zoom / Video */}
                <button
                  type="button"
                  onClick={() => setMeetingType('zoom')}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    meetingType === 'zoom'
                      ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 ring-2 ring-blue-500/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                      <Video className="w-4 h-4" />
                    </div>
                    {meetingType === 'zoom' && <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white text-xs">
                      Zoom Video Call
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">
                      Virtual screen-share to review drone imagery & estimates.
                    </div>
                  </div>
                </button>

              </div>
            </div>

            {/* Step 2: Choose Date & Time */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2.5">
                2. Select Preferred Day & Time Window:
              </label>

              {/* Day presets */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                {dateOptions.map((d) => (
                  <button
                    key={d.value}
                    type="button"
                    onClick={() => setSelectedDate(d.value)}
                    className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer ${
                      selectedDate === d.value
                        ? 'border-blue-600 bg-blue-600 text-white font-bold shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-xs">{d.label}</div>
                    <div className={`text-[10px] mt-0.5 truncate ${selectedDate === d.value ? 'text-white/80' : 'text-slate-400'}`}>
                      {d.note}
                    </div>
                  </button>
                ))}
              </div>

              {/* Time Slots */}
              <div className="flex flex-wrap gap-2">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setSelectedTime(time)}
                    className={`px-3 py-1.5 rounded-md text-xs font-mono transition-all cursor-pointer ${
                      selectedTime === time
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Homeowner Contact Information */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                3. Your Information:
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Your Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Marcus Vance"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Direct Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. (214) 555-0142"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Email Address (for Zoom or Confirmation)
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. marcus@gmail.com"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Property Address / Zip Code {meetingType === 'in_person' ? '*' : ''}
                  </label>
                  <div className="relative">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required={meetingType === 'in_person'}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder={`e.g. 1420 Main St, ${config.city}`}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Describe Roof Problem (Leak, Hail, Shingle Blow-off, Age)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Hail storm yesterday damaged front shingles; water dripping in master bath."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>100% Free · No Payment Required · Verified Dispatch</span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 font-semibold text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2.5 rounded-lg text-white font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                  style={{ backgroundColor: config.color || '#1e3a8a' }}
                >
                  <span>Confirm Scheduled Inspection</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
