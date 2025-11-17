import { defineConfig } from 'vite';

/**
 * Vite dev server hardening for proxied/cloud workspaces:
 * - Allow wildcard hosts or permissive patterns (*.cloud.kavia.ai, *.kavia.ai)
 * - Bind to 0.0.0.0 and allow dynamic ports (strictPort=false)
 * - Configure HMR host/clientPort from env for reverse proxies
 * - Derive server.origin from X-Forwarded-Host to satisfy Vite origin checks
 * - Enable CORS
 * - Log effective config (allowed hosts, HMR, origin)
 */

// Port resolution with fallbacks
const rawPort = process.env.PORT || process.env.NG_APP_PORT || '4200';
const port = typeof rawPort === 'string' ? parseInt(rawPort, 10) || 4200 : (rawPort as any);

// Helper: extract hostname without requiring URL constructor availability
function extractHostname(input?: string): string | undefined {
  if (!input || typeof input !== 'string') return undefined;
  const val = input.trim();
  const candidate = /^(https?:)?\/\//i.test(val) ? val : `http://${val}`;
  const match = candidate.match(/^[a-z]+:\/\/([^/:?#\s]+)(?::\d+)?(?:[/?#]|$)/i);
  return match && match[1] ? match[1] : undefined;
}

// Environment-driven HMR options (works behind proxies)
const hmrHost = process.env.VITE_HMR_HOST || process.env.NG_APP_FRONTEND_URL && extractHostname(process.env.NG_APP_FRONTEND_URL) || undefined;
const hmrPortRaw = process.env.VITE_HMR_PORT || process.env.VITE_HMR_CLIENT_PORT || '';
const hmrClientPort = typeof hmrPortRaw === 'string' && hmrPortRaw.length ? (parseInt(hmrPortRaw, 10) || undefined) : undefined;

// Determine allowedHosts strategy.
// Vite 5 supports boolean "true" to allow all hosts. Some environments (vite-node variants) may still require an array.
// We provide both: an "allowedHostsAny" flag for Vite 5, and a robust array for stricter variants.
const reportedHost = 'vscode-internal-22785-beta.beta01.cloud.kavia.ai';
const envFrontendUrl = process.env.NG_APP_FRONTEND_URL || '';
const envFrontendHost = extractHostname(envFrontendUrl);

// Array form for stricter tooling (vite-node)
const allowedHostsArray: (string | RegExp)[] = Array.from(
  new Set(
    [
      'localhost',
      '127.0.0.1',
      '[::1]',
      reportedHost,
      envFrontendHost,
    ].filter(Boolean) as string[],
  ),
);
// Add permissive regexes for workspace domains
allowedHostsArray.push(/.*\.cloud\.kavia\.ai$/);
allowedHostsArray.push(/.*\.kavia\.ai$/);

// Vite 5 boolean allows all
const allowedHostsAny: boolean = true;

/**
 * server.origin:
 * Prefer forwarded host if available (set by proxies). Fall back to NG_APP_FRONTEND_URL host.
 * Note: Environment variables cannot contain hyphens in Node.js accessors; proxies typically
 * pass these as HTTP headers, not env vars. We only attempt to use env variants if the runtime
 * has explicitly mapped them (with underscores).
 */
const forwardedHost =
  process.env.X_FORWARDED_HOST ||
  process.env.X_FORWARDED_SERVER ||
  process.env.FORWARDED_HOST ||
  undefined;
const forwardedProto =
  process.env.X_FORWARDED_PROTO ||
  process.env.FORWARDED_PROTO ||
  'https';
const originHost = (forwardedHost || envFrontendHost || 'localhost');
const origin = `${forwardedProto}://${originHost}`;

// Diagnostic log
const diag = {
  host: '0.0.0.0',
  port,
  strictPort: false,
  cors: true,
  allowedHostsAny,
  allowedHostsArray: allowedHostsArray.map((v) => (v instanceof RegExp ? v.toString() : v)),
  hmr: {
    host: hmrHost || '(not set)',
    clientPort: hmrClientPort || '(default)',
  },
  origin,
};
console.log(`[vite-config] server.host=${diag.host}, server.port=${diag.port}, strictPort=${diag.strictPort}, cors=${diag.cors}`);
console.log(`[vite-config] allowedHostsAny=${diag.allowedHostsAny}, allowedHostsArray=${JSON.stringify(diag.allowedHostsArray)}`);
console.log(`[vite-config] hmr.host=${diag.hmr.host}, hmr.clientPort=${diag.hmr.clientPort}, origin=${diag.origin}`);

// Export Vite config; Angular CLI Vite builder will pick this up if present
export default defineConfig({
  server: {
    host: '0.0.0.0',
    port,
    strictPort: false,
    cors: true,
    // For Vite 5, boolean true allows all. Keep array variant as a compatibility fallback for environments that require it.
    // The builder uses Vite under the hood and will honor boolean true.
    allowedHosts: allowedHostsAny ? true : (allowedHostsArray as any),
    // HMR settings for proxied environments
    hmr: {
      host: hmrHost,
      clientPort: hmrClientPort,
    },
    // Use an origin that matches forwarded host/proto to avoid origin checks failing
    origin,
  },
});
