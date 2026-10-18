export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  tags: string[];
}

export interface TestimonialItem {
  id: string;
  name: string;
  location: string;
  service: string;
  quote: string;
  date: string;
  isSample: boolean;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface CompanyConfig {
  name: string;
  owner: string;
  niche: string;
  city: string;
  phone: string;
  phoneRaw: string;
  license: string;
  rating: number;
  reviews: number;
  projects: number;
  areas: string[];
  color: string;
  calendar: string;
  webhook: string; // empty means demo mode
  services: ServiceItem[];
  testimonials: TestimonialItem[];
  faqs: FAQItem[];
}

export interface LeadData {
  id: string;
  timestamp: string;
  session: string;
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
  meetingType?: 'phone' | 'in_person' | 'zoom';
  meetingDate?: string;
  meetingTime?: string;
  notes?: string;
  score?: number;
  intent?: string;
  sentiment?: 'positive' | 'neutral' | 'frustrated' | 'angry';
  summary?: string;
}

export interface ScheduledMeeting {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  meetingType: 'phone' | 'in_person' | 'zoom';
  date: string;
  time: string;
  service: string;
  notes?: string;
  status: 'confirmed' | 'pending';
}

export interface TestCase {
  id: string;
  title: string;
  userPrompt: string;
  expectedResult: string;
  category: 'flow' | 'emergency' | 'objection' | 'security' | 'validation';
}
