import { useState, useEffect } from 'react';
import { DEFAULT_CONFIG, INITIAL_SAMPLE_LEADS } from './data/defaultConfig';
import { CompanyConfig, LeadData } from './types/config';
import { DemoBanner } from './components/DemoBanner';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { TrustBar } from './components/TrustBar';
import { HowItWorks } from './components/HowItWorks';
import { ServicesGrid } from './components/ServicesGrid';
import { Testimonials } from './components/Testimonials';
import { FAQ } from './components/FAQ';
import { ContactSection } from './components/ContactSection';
import { OwnerLeadPreview } from './components/OwnerLeadPreview';
import { DeveloperPitch } from './components/DeveloperPitch';
import { Footer } from './components/Footer';
import { ChatWidget } from './components/ChatWidget';
import { DemoUrlCustomizer } from './components/DemoUrlCustomizer';
import { SalesKitDrawer } from './components/SalesKitDrawer';

export default function App() {
  const [config, setConfig] = useState<CompanyConfig>(DEFAULT_CONFIG);
  const [leads, setLeads] = useState<LeadData[]>(INITIAL_SAMPLE_LEADS);
  const [forceDemoMode, setForceDemoMode] = useState<boolean>(false);
  
  // Interactive Modals and Drawers
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [isSalesKitOpen, setIsSalesKitOpen] = useState(false);
  const [activeServiceInquiry, setActiveServiceInquiry] = useState<string | undefined>(undefined);

  // Read URL Parameters on initial mount (Section 3.2)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const name = params.get('name');
      const owner = params.get('owner');
      const city = params.get('city');
      const phone = params.get('phone');
      const color = params.get('color');
      const webhook = params.get('webhook');
      const demo = params.get('demo') || params.get('mode');

      if (demo === 'true' || demo === 'demo') {
        setForceDemoMode(true);
      }

      if (name || owner || city || phone || color || webhook !== null) {
        setConfig((prev) => ({
          ...prev,
          name: name || prev.name,
          owner: owner || prev.owner,
          city: city || prev.city,
          phone: phone || prev.phone,
          phoneRaw: phone ? phone.replace(/[^0-9+]/g, '') : prev.phoneRaw,
          color: color ? (color.startsWith('#') ? color : `#${color}`) : prev.color,
          webhook: webhook !== null ? webhook : prev.webhook
        }));
      }
    }
  }, []);

  const handleUpdateConfig = (newVals: Partial<CompanyConfig>) => {
    setConfig((prev) => ({
      ...prev,
      ...newVals
    }));
  };

  const handleLeadCaptured = (newLead: LeadData) => {
    setLeads((prev) => [newLead, ...prev]);
  };

  const handleSelectService = (serviceTitle: string) => {
    setActiveServiceInquiry(`I need an estimate for: ${serviceTitle}`);
    setIsChatOpen(true);
  };

  const handleRunTestInChat = (prompt: string) => {
    setActiveServiceInquiry(prompt);
    setIsChatOpen(true);
  };

  const handleSimulateEmergency = () => {
    const emergLead: LeadData = {
      id: 'lead-' + Date.now(),
      timestamp: 'Just now',
      session: 'sess_' + Math.floor(Math.random() * 8999 + 1000) + '_emergency',
      name: 'Michael Henderson',
      phone: '+1 (214) 555-8912',
      email: 'mhenderson@dallastx.com',
      service: 'Active Leak / Emergency Tarping',
      location: `${config.city} (Highland Park)`,
      urgency: 'emergency',
      budget: 'Insurance claim / urgent repair',
      booked: false,
      sms_consent: true,
      needs_human: true,
      score: 95,
      intent: 'emergency',
      sentiment: 'frustrated',
      summary: 'Heavy hail broke through master bedroom skylight and ceiling drywall. Water actively entering.'
    };
    setLeads((prev) => [emergLead, ...prev]);
  };

  // Publish mode vs Demo mode
  const isPublishMode = !forceDemoMode && Boolean(config.webhook && config.webhook.trim() !== '');

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      
      {/* 1. Demo Mode Prototype Banner (Only shown in demo mode, hidden in publish view) */}
      {!isPublishMode && (
        <DemoBanner
          config={config}
          onOpenCustomizer={() => setIsCustomizerOpen(true)}
          onOpenSalesKit={() => setIsSalesKitOpen(true)}
        />
      )}

      {/* 2. Sticky Header (Clean 3-zone Top Bar Contract) */}
      <Header
        config={config}
        onOpenChat={() => {
          setActiveServiceInquiry(undefined);
          setIsChatOpen(true);
        }}
        onOpenSalesKit={() => setIsSalesKitOpen(true)}
      />

      {/* Main Page Content */}
      <main className="flex-1">
        
        {/* 3. Hero Section */}
        <Hero
          config={config}
          onOpenChat={() => {
            setActiveServiceInquiry(undefined);
            setIsChatOpen(true);
          }}
        />

        {/* 4. Verified Trust Row */}
        <TrustBar config={config} />

        {/* 5. How It Works (3 Steps) */}
        <HowItWorks
          config={config}
          onOpenChat={() => {
            setActiveServiceInquiry(undefined);
            setIsChatOpen(true);
          }}
        />

        {/* 6. Services Grid */}
        <ServicesGrid
          config={config}
          onSelectService={handleSelectService}
        />

        {/* 7. Homeowner Reviews */}
        <Testimonials config={config} />

        {/* 8. FAQ Objections Handler */}
        <FAQ
          config={config}
          onOpenChat={() => {
            setActiveServiceInquiry(undefined);
            setIsChatOpen(true);
          }}
        />

        {/* 9. Contact & Emergency Dispatch Section (For Real Homeowners & Publish View) */}
        <ContactSection
          config={config}
          onOpenChat={() => {
            setActiveServiceInquiry(undefined);
            setIsChatOpen(true);
          }}
        />

        {/* 10. Owner Proof Panel & Developer Pitch (Hidden in Publish View, Only Shown in Demo Mode) */}
        {!isPublishMode && (
          <>
            <OwnerLeadPreview
              config={config}
              leads={leads}
              onSimulateEmergency={handleSimulateEmergency}
            />

            <DeveloperPitch
              config={config}
              onOpenCustomizer={() => setIsCustomizerOpen(true)}
              onOpenSalesKit={() => setIsSalesKitOpen(true)}
            />
          </>
        )}

      </main>

      {/* 11. Footer */}
      <Footer
        config={config}
        onOpenAdminPortal={() => setIsSalesKitOpen(true)}
      />

      {/* 12. Floating 24/7 AI Receptionist Chat Widget (Connected to n8n Webhook) */}
      <ChatWidget
        config={config}
        isOpen={isChatOpen}
        onOpen={() => {
          setActiveServiceInquiry(undefined);
          setIsChatOpen(true);
        }}
        onClose={() => setIsChatOpen(false)}
        onLeadCaptured={handleLeadCaptured}
        initialService={activeServiceInquiry}
        isDemoMode={!isPublishMode}
      />

      {/* 13. Prospect Demo URL Customizer Modal */}
      <DemoUrlCustomizer
        config={config}
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        onUpdateConfig={handleUpdateConfig}
      />

      {/* 14. Full Sales Kit & Solution Guide Drawer */}
      <SalesKitDrawer
        config={config}
        isOpen={isSalesKitOpen}
        onClose={() => setIsSalesKitOpen(false)}
        onRunTestInChat={handleRunTestInChat}
      />

    </div>
  );
}
