import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const DEFAULT_N8N_URL = 'https://jefose.app.n8n.cloud/webhook/45df9c9a-30b7-4bc3-9cd0-bb3d1400b60b/chat';

app.use(express.json());

app.post('/api/chat', async (req, res) => {
  const targetUrl = req.body.webhookUrl || DEFAULT_N8N_URL;
  const { webhookUrl, ...payload } = req.body;
  const startTime = Date.now();

  console.log(`[n8n Proxy] Forwarding request to: ${targetUrl}`);
  console.log(`[n8n Proxy] Payload:`, JSON.stringify(payload));

  try {
    const n8nResponse = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const elapsed = Date.now() - startTime;
    const contentType = n8nResponse.headers.get('content-type') || '';
    let responseData: any;

    if (contentType.includes('application/json')) {
      responseData = await n8nResponse.json();
    } else {
      const text = await n8nResponse.text();
      responseData = { text };
    }

    console.log(`[n8n Proxy] n8n responded in ${elapsed}ms with HTTP ${n8nResponse.status}:`, responseData);

    if (!n8nResponse.ok) {
      return res.status(n8nResponse.status).json({
        ok: false,
        status: n8nResponse.status,
        elapsedMs: elapsed,
        error: responseData?.message || 'n8n webhook error',
        hint: responseData?.hint || (n8nResponse.status === 500 ? 'Workflow ran into an error in one of its nodes. Check n8n Executions list.' : 'Check if workflow toggle is Active in n8n.'),
        data: responseData
      });
    }

    return res.json({
      ok: true,
      status: 200,
      elapsedMs: elapsed,
      data: responseData
    });
  } catch (error: any) {
    console.error('Proxy call to n8n failed:', error);
    return res.status(502).json({
      ok: false,
      error: error.message || 'Failed to reach n8n server',
      hint: 'Check if the n8n cloud instance is awake.'
    });
  }
});

// Check status endpoint
app.get('/api/check-webhook', async (req, res) => {
  const targetUrl = (req.query.url as string) || DEFAULT_N8N_URL;
  try {
    const testResponse = await fetch(targetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'ping', test: true })
    });

    const is404 = testResponse.status === 404;
    const data = await testResponse.json().catch(() => null);

    return res.json({
      url: targetUrl,
      status: testResponse.status,
      isActive: testResponse.status >= 200 && testResponse.status < 300,
      isInactive: is404,
      hint: data?.hint || (is404 ? 'Workflow is currently inactive. Click the Active toggle in n8n top-right.' : 'Active')
    });
  } catch (err: any) {
    return res.status(500).json({
      url: targetUrl,
      error: err.message
    });
  }
});

// Mount Vite or static assets
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
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
