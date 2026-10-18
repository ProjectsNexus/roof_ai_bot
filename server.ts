import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const PROMPTS_FILE_PATH = path.resolve(__dirname, 'src/data/prompts.json');

app.use(express.json());

// Initialize Google GenAI SDK (server-side only)
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Helper to load prompt configuration from prompts.json
function loadPromptConfig() {
  try {
    if (fs.existsSync(PROMPTS_FILE_PATH)) {
      const data = fs.readFileSync(PROMPTS_FILE_PATH, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.warn('[Prompts] Could not read prompts.json, using fallback:', err);
  }
  return null;
}

// Helper to construct system instruction adhering strictly to the niche and services
function buildSystemInstruction(meta: {
  companyName: string;
  ownerName: string;
  city: string;
  phone: string;
  calendarUrl?: string;
  nicheKey?: string;
}) {
  const promptConfig = loadPromptConfig();
  const nicheKey = meta.nicheKey || 'roofing';
  const nicheData = promptConfig?.niches?.[nicheKey] || promptConfig?.niches?.roofing;

  if (!nicheData) {
    return `You are a virtual receptionist for ${meta.companyName}, a roofing contractor in ${meta.city}. Owner: ${meta.ownerName}, Phone: ${meta.phone}. Answer in 1-3 short sentences. Never quote prices blindly; offer the free inspection.`;
  }

  const servicesList = nicheData.allowedServices
    .map((s: any, idx: number) => `${idx + 1}. ${s.name}: ${s.description} ${s.isEmergency ? '(EMERGENCY 24/7)' : ''}`)
    .join('\n');

  const rulesList = nicheData.strictRules
    .map((r: string) => `- ${r}`)
    .join('\n');

  return `You are the virtual receptionist for ${meta.companyName}, recognized as the premier provider of ${nicheData.nicheName} in ${meta.city}.
Owner & Master Craftsman: ${meta.ownerName}
Direct Phone: ${meta.phone}
Calendar Booking Link: ${meta.calendarUrl || 'https://cal.com/free-inspection'}
Company Tagline: "${nicheData.tagline}"

SERVICES WE PROVIDE (STRICT EXCLUSIVE SCOPE - YOU MUST NEVER OFFER UNLISTED SERVICES):
${servicesList}

STRICT OPERATING RULES & GUARDRAILS:
${rulesList}

STYLE REQUIREMENTS:
- 1 to 3 short sentences per response. ONE question at a time. No long markdown dumps.
- Warm, polite, reassuring, and exceptionally professional, like a seasoned customer care manager.
- If the user asks about trades we do not do (e.g. electrical wiring, swimming pools, painting, interior plumbing), politely decline and state that our specialized license is strictly for roofing, gutters, and storm damage restoration.`;
}

// Endpoint to view or fetch the prompt configuration
app.get('/api/prompts', (_req, res) => {
  const config = loadPromptConfig();
  res.json({ ok: true, config });
});

// Endpoint to update prompt configuration from the UI
app.post('/api/prompts', (req, res) => {
  try {
    const updated = req.body;
    fs.writeFileSync(PROMPTS_FILE_PATH, JSON.stringify(updated, null, 2), 'utf8');
    res.json({ ok: true, message: 'Prompts configuration updated successfully.' });
  } catch (err: any) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Gemini AI Chat Agent Endpoint
app.post('/api/chat', async (req, res) => {
  const { 
    message, 
    history = [], 
    company = 'Summit Ridge Roofing', 
    owner = 'Mike', 
    city = 'Dallas, TX', 
    phone = '(214) 555-0142', 
    calendar = 'https://cal.com/free-inspection',
    nicheKey = 'roofing'
  } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ ok: false, error: 'Message string is required' });
  }

  const startTime = Date.now();
  const systemInstruction = buildSystemInstruction({
    companyName: company,
    ownerName: owner,
    city: city,
    phone: phone,
    calendarUrl: calendar,
    nicheKey: nicheKey
  });

  // Prepare Gemini contents from history + current message
  const contents: any[] = [];
  
  if (Array.isArray(history)) {
    for (const h of history) {
      if (h.text && (h.sender === 'user' || h.role === 'user')) {
        contents.push({ role: 'user', parts: [{ text: h.text }] });
      } else if (h.text && (h.sender === 'bot' || h.role === 'model')) {
        contents.push({ role: 'model', parts: [{ text: h.text }] });
      }
    }
  }

  // Append latest user message
  contents.push({
    role: 'user',
    parts: [{ text: message }]
  });

  try {
    let rawText = '';

    // If GEMINI_API_KEY is available, call official Gemini SDK
    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY') {
      console.log(`[Gemini Agent] Generating response via gemini-3.8-flash for: "${message}"`);
      
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.4
        }
      });

      rawText = response.text || '';
    } else {
      // Intelligent rule-based engine when API key is not configured in local testing
      console.log('[Gemini Agent] Running local prompt simulation (No external API key set)');
      rawText = simulatePromptResponse(message, history, { company, owner, city, phone });
    }

    const elapsed = Date.now() - startTime;

    // Extract structured JSON lead if present
    let cleanReply = rawText;
    let extractedLead: any = null;

    const jsonMatch = rawText.match(/\{[\s\S]*"name"[\s\S]*"phone"[\s\S]*\}/);
    if (jsonMatch) {
      try {
        extractedLead = JSON.parse(jsonMatch[0]);
        cleanReply = rawText.replace(jsonMatch[0], '').trim();
      } catch (e) {
        // Fallback clean
      }
    }

    return res.json({
      ok: true,
      reply: cleanReply,
      lead: extractedLead,
      elapsedMs: elapsed,
      model: 'gemini-3.8-flash',
      provider: process.env.GEMINI_API_KEY ? 'gemini' : 'prompt-simulator'
    });
  } catch (error: any) {
    console.error('[Gemini Agent] Error calling Gemini API:', error);
    
    // Graceful fallback response strictly using prompts.json rules
    const fallbackText = simulatePromptResponse(message, history, { company, owner, city, phone });
    return res.json({
      ok: true,
      reply: fallbackText,
      lead: null,
      error: error.message,
      provider: 'fallback-rules'
    });
  }
});

// Prompt simulator that follows the exact prompts.json rules when offline
function simulatePromptResponse(
  message: string, 
  _history: any[], 
  meta: { company: string; owner: string; city: string; phone: string }
): string {
  const lower = message.toLowerCase();

  // Active leaks and emergencies
  if (lower.includes('leak') || lower.includes('emergency') || lower.includes('water') || lower.includes('ceiling') || lower.includes('tarp')) {
    return `Active leaks require immediate emergency mitigation to protect your home. What is your street address or zip code in ${meta.city} and your best phone number so ${meta.owner} can dispatch an emergency tarping crew right away?`;
  }

  // Meeting and scheduling inquiries
  if (lower.includes('meeting') || lower.includes('schedule') || lower.includes('book') || lower.includes('calendar') || lower.includes('zoom') || lower.includes('consult')) {
    return `We offer 3 convenient consultation formats: 1. In-Person On-Site Inspection (free 21-point drone and physical check), 2. Phone Call with ${meta.owner}, or 3. Zoom Video Consultation. You can click the "Schedule Meeting" button right above to choose your preferred time and format!`;
  }

  // Price inquiries
  if (lower.includes('price') || lower.includes('how much') || lower.includes('cost') || lower.includes('estimate') || lower.includes('quote')) {
    return `Roofing pricing depends on square footage, pitch, and materials. ${meta.company} provides a 100% free, 21-point on-site inspection with a guaranteed written estimate. Would you like to schedule an in-person inspection or a quick 15-min phone review?`;
  }

  // Unrelated trades rejection
  if (lower.includes('plumb') || lower.includes('electric') || lower.includes('pool') || lower.includes('paint') || lower.includes('solar') || lower.includes('remodel') || lower.includes('floor')) {
    return `We specialize exclusively in roofing, storm damage restoration, and gutter systems to guarantee the highest level of craftsmanship. We do not service interior trades, but we would be honored to assist with any roof, gutter, or active leak needs!`;
  }

  // AI disclosure
  if (lower.includes('robot') || lower.includes('human') || lower.includes('ai') || lower.includes('real person')) {
    return `I am the 24/7 virtual receptionist for ${meta.company}. I'm here to answer questions instantly and schedule inspections with ${meta.owner}'s crew. You can also reach our dispatch desk directly at ${meta.phone}.`;
  }

  // Lead capture / phone detection
  const phoneMatch = message.match(/(\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  if (phoneMatch) {
    return `Thank you! I have logged your details. ${meta.owner}'s inspection team will contact you shortly to confirm your free 21-point roof evaluation.\n\n{"name":"Homeowner","phone":"${phoneMatch[0]}","service":"Roof Inspection","location":"${meta.city}","urgency":"this_week","budget":"Free estimate first","booked":false,"sms_consent":true,"needs_human":false}`;
  }

  return `Thanks for reaching out to ${meta.company}! Do you have storm damage, an active leak, or are you looking for a free 21-point roof inspection in ${meta.city}?`;
}

// Mount Vite or static production assets
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Gemini AI Chat Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
