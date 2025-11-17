import { defineConfig } from 'vite';

// Resolve port with fallbacks:
// - PORT (common env)
// - NG_APP_PORT (project env)
// - default 4200 (Angular default)
const rawPort = process.env.PORT || process.env.NG_APP_PORT || '4200';
const port = typeof rawPort === 'string' ? parseInt(rawPort, 10) || 4200 : (rawPort as any);

// Helper to safely extract hostname from a URL-like string without relying on global URL constructor
function extractHostname(input?: string): string | undefined {
  if (!input || typeof input !== 'string') return undefined;
  // Trim and ensure it looks like a URL; prepend protocol if missing
  const val = input.trim();
  const candidate = /^(https?:)?\/\//i.test(val) ? val : `http://${val}`;
  const match = candidate.match(/^[a-z]+:\/\/([^/:?#\s]+)(?::\d+)?(?:[/?#]|$)/i);
  return match && match[1] ? match[1] : undefined;
}

// Build allowed hosts list:
// - Always include localhost forms
// - Include the reported workspace host
// - Include any explicit NG_APP_FRONTEND_URL host (if provided)
// - Include '*' for broad allowance in tunnel/proxy environments
const reportedHost = 'vscode-internal-22785-beta.beta01.cloud.kavia.ai';
const envFrontendUrl = process.env.NG_APP_FRONTEND_URL || '';
const envFrontendHost = extractHostname(envFrontendUrl);

const allowedHosts = Array.from(
  new Set(
    [
      'localhost',
      '127.0.0.1',
      '[::1]',
      reportedHost,
      envFrontendHost,
      // Wildcard to avoid host-block in ephemeral environments
      '*',
    ].filter(Boolean) as string[],
  ),
);

// Diagnostic log on Vite config evaluation (visible on server startup)
console.log(
  `[vite-config] server.host=0.0.0.0, server.port=${port}, allowedHosts=${JSON.stringify(
    allowedHosts,
  )}`,
);

// Export Vite config; Angular CLI Vite builder will pick this up if present
export default defineConfig({
  server: {
    host: '0.0.0.0',
    port,
    // Vite 5: allowedHosts as array of strings or patterns
    allowedHosts,
  },
});
