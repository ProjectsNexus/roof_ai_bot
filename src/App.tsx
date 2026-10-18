import { useState, useEffect } from 'react';
import { DEFAULT_CONFIG, INITIAL_SAMPLE_LEADS } from './data/defaultConfig';
import { CompanyConfig, LeadData, ScheduledMeeting } from './types/config';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { TrustBar } from './components/TrustBar';
import { HowItWorks } from './components/HowItWorks';
import { ServicesGrid } from './components/ServicesGrid';
import { Testimonials } from './components/Testimonials';
import { FAQ } from './components/FAQ';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ChatWidget } from './components/ChatWidget';
import { MeetingSchedulerModal } from './components/MeetingSchedulerModal';

export default function App() {
  const [config, setConfig] = useState<CompanyConfig>(DEFAULT_CONFIG);
  const [, setLeads] = useState<LeadData[]>(INITIAL_SAMPLE_LEADS);
  
  // Interactive Modals
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSchedulerOpen, setIsSchedulerOpen] = useState(false);
  const [schedulerPreselectedService, setSchedulerPreselectedService] = useState<string | undefined>(undefined);
  const [activeServiceInquiry, setActiveServiceInquiry] = useState<string | undefined>(undefined);

  // Read URL Parameters on initial mount if customized
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const name = params.get('name');
      const owner = params.get('owner');
      const city = params.get('city');
      const phone = params.get('phone');
      const color = params.get('color');

      if (name || owner || city || phone || color) {
        setConfig((prev) => ({
          ...prev,
          name: name || prev.name,
          owner: owner || prev.owner,
          city: city || prev.city,
          phone: phone || prev.phone,
          phoneRaw: phone ? phone.replace(/[^0-9+]/g, '') : prev.phoneRaw,
          color: color ? (color.startsWith('#') ? color : `#${color}`) : prev.color,
        }));
      }
    }
  }, []);

  const handleLeadCaptured = (newLead: LeadData) => {
    setLeads((prev) => [newLead, ...prev]);
  };

  const handleOpenScheduler = (service?: string) => {
    setSchedulerPreselectedService(service);
    setIsSchedulerOpen(true);
  };

  const handleCloseScheduler = () => {
    setIsSchedulerOpen(false);
  };

  const handleMeetingBooked = (_meeting: ScheduledMeeting, newLead: LeadData) => {
    handleLeadCaptured(newLead);
  };

  const handleSelectService = (serviceTitle: string) => {
    setActiveServiceInquiry(`I need an estimate for: ${serviceTitle}`);
    setIsChatOpen(true);
  };

  const handleScheduleService = (serviceTitle: string) => {
    handleOpenScheduler(serviceTitle);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      
      {/* 1. Sticky Header with Top Bar Contract */}
      <Header
        config={config}
        onOpenChat={() => {
          setActiveServiceInquiry(undefined);
          setIsChatOpen(true);
        }}
        onScheduleMeeting={() => handleOpenScheduler()}
      />

      {/* Main Roofing Contractor Page */}
      <main className="flex-1">
        
        {/* 2. Hero Section with Outcome Value Proposition */}
        <Hero
          config={config}
          onOpenChat={() => {
            setActiveServiceInquiry(undefined);
            setIsChatOpen(true);
          }}
          onScheduleMeeting={() => handleOpenScheduler()}
        />

        {/* 3. Verified Trust & Licensing Row */}
        <TrustBar config={config} />

        {/* 4. How It Works (3-Step Clear Inspection Process) */}
        <HowItWorks
          config={config}
          onOpenChat={() => {
            setActiveServiceInquiry(undefined);
            setIsChatOpen(true);
          }}
        />

        {/* 5. Services Grid with Dual Action (Book Inspection & Ask AI) */}
        <ServicesGrid
          config={config}
          onSelectService={handleSelectService}
          onScheduleService={handleScheduleService}
        />

        {/* 6. Verified Customer Testimonials */}
        <Testimonials config={config} />

        {/* 7. Objections & Frequently Asked Questions Accordion */}
        <FAQ
          config={config}
          onOpenChat={() => {
            setActiveServiceInquiry(undefined);
            setIsChatOpen(true);
          }}
        />

        {/* 8. 24/7 Emergency Dispatch & Schedule Section */}
        <ContactSection
          config={config}
          onOpenChat={() => {
            setActiveServiceInquiry(undefined);
            setIsChatOpen(true);
          }}
          onScheduleMeeting={() => handleOpenScheduler()}
        />

      </main>

      {/* 9. Professional Contractor Footer */}
      <Footer config={config} />

      {/* 10. Floating 24/7 Gemini AI Receptionist Chat Widget */}
      <ChatWidget
        config={config}
        isOpen={isChatOpen}
        onOpen={() => {
          setActiveServiceInquiry(undefined);
          setIsChatOpen(true);
        }}
        onClose={() => setIsChatOpen(false)}
        onLeadCaptured={handleLeadCaptured}
        onOpenScheduler={handleOpenScheduler}
        initialService={activeServiceInquiry}
      />

      {/* 11. Meeting Scheduler Modal (In-Person / Phone Call / Zoom) */}
      <MeetingSchedulerModal
        config={config}
        isOpen={isSchedulerOpen}
        onClose={handleCloseScheduler}
        onMeetingBooked={handleMeetingBooked}
        preselectedService={schedulerPreselectedService}
      />

    </div>
  );
}
