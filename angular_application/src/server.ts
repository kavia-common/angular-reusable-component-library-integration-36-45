import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine, isMainModule } from '@angular/ssr/node';
import express from 'express';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import bootstrap from './main.server';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');
const indexHtml = join(serverDistFolder, 'index.server.html');

const app = express();
const commonEngine = new CommonEngine();

// Middleware: JSON body parser and basic logging for API routes
app.use(express.json());
app.use((req, _res, next) => {
  if (req.path.startsWith('/api/')) {
    console.log(`[API] ${req.method} ${req.originalUrl}`);
  }
  next();
});

import { createRequire } from 'node:module';
// Ensure fetch and AbortController exist in Node SSR environment
const ensureServerFetch = async () => {
  const g: any = globalThis as any;
  if (typeof g.fetch !== 'function') {
    // Lazy require node-fetch for SSR if missing; guard to avoid bundler resolution failures
    try {
      const require = createRequire(import.meta.url);
      const mod: any = (() => { try { return require('node-fetch'); } catch { return null; } })();
      if (mod) {
        g.fetch = (mod as any).default || (mod as any);
      }
    } catch {
      // ignore; if still unavailable, API calls below will be skipped by feature flag checks
    }
  }
  if (typeof g.AbortController === 'undefined') {
    try {
      const require = createRequire(import.meta.url);
      const acMod: any = (() => { try { return require('abort-controller'); } catch { return null; } })();
      if (acMod) {
        g.AbortController = (acMod as any).default || (acMod as any);
      }
    } catch {
      // Node 18+ has AbortController; ignore if require fails.
    }
  }
};

/**
 * PUBLIC_INTERFACE
 * POST /api/figma/add_figma_data
 * This endpoint receives Figma import requests and validates input payload.
 * Query params:
 *  - project_id: string|number (required)
 * Body:
 *  - fileKey: string (required) - Figma file key
 *  - accessToken: string (required) - Figma Personal Access Token
 * Returns:
 *  - 200: { message, projectId, fileKey }
 *  - 400: { error, details }
 *  - 500: { error, requestId }
 */
app.post('/api/figma/add_figma_data', async (req, res) => {
  const requestId = Math.random().toString(36).slice(2, 10);
  try {
    const projectId = (req.query['project_id'] ?? '').toString().trim();
    const { fileKey, accessToken } = req.body ?? {};

    // Defensive validation
    const errors: string[] = [];
    if (!projectId || projectId === 'undefined' || projectId === 'null') {
      errors.push('Missing or invalid project_id query parameter.');
    }
    if (!fileKey || typeof fileKey !== 'string' || fileKey.trim().length === 0) {
      errors.push('Missing or invalid fileKey in request body.');
    }
    if (!accessToken || typeof accessToken !== 'string' || accessToken.trim().length === 0) {
      errors.push('Missing or invalid accessToken in request body.');
    }

    if (errors.length) {
      console.warn(`[API][${requestId}] Validation failed`, { projectId, hasToken: !!accessToken, hasKey: !!fileKey, errors });
      return res.status(400).json({
        error: 'Invalid request payload',
        details: errors,
      });
    }

    // Optional: Enforce allowed origins/backend mode via env flags
    const nodeEnv = process.env['NG_APP_NODE_ENV'] || process.env['NODE_ENV'] || 'production';
    const allowOutbound = (process.env['NG_APP_FEATURE_FLAGS'] || '').includes('allowFigmaOutbound');

    // If outbound allowed, verify fileKey/token with Figma API (lightweight probe)
    if (allowOutbound) {
      await ensureServerFetch();
      try {
        const controller = new (globalThis as any).AbortController();
        const timeout = (globalThis as any).setTimeout ? (globalThis as any).setTimeout(() => controller.abort(), 3500) : undefined;
        const resp = await (globalThis as any).fetch(`https://api.figma.com/v1/files/${encodeURIComponent(fileKey)}`, {
          method: 'GET',
          headers: {
            'X-Figma-Token': accessToken,
          },
          signal: controller.signal,
        });
        if ((globalThis as any).clearTimeout && timeout !== undefined) {
          (globalThis as any).clearTimeout(timeout as any);
        }
        if (resp.status === 404) {
          return res.status(400).json({
            error: 'Figma file not found',
            details: [`File key ${fileKey} does not exist or is not accessible.`],
          });
        }
        if (resp.status === 403) {
          return res.status(400).json({
            error: 'Unauthorized',
            details: ['Invalid accessToken or no access to the Figma file.'],
          });
        }
        if (!resp.ok) {
          let t = '';
          try { t = await resp.text(); } catch {}
          console.warn(`[API][${requestId}] Figma probe non-OK`, resp.status, t);
        }
      } catch (probeErr: any) {
        console.warn(`[API][${requestId}] Figma probe failed:`, probeErr?.message || probeErr);
      }
    }

    // Simulate persistence/processing step success.
    const responsePayload = {
      message: 'Figma data accepted for processing',
      projectId,
      fileKey,
      env: process.env['NG_APP_NODE_ENV'] || process.env['NODE_ENV'] || 'production',
    };
    console.log(`[API][${requestId}] Accepted Figma import`, { projectId, fileKey, nodeEnv: responsePayload.env });
    return res.status(200).json(responsePayload);
  } catch (err: any) {
    console.error(`[API][${requestId}] Unexpected error`, err?.stack || err?.message || err);
    return res.status(500).json({
      error: 'Internal server error',
      requestId,
    });
  }
});

/**
 * Serve static files from /browser
 */
app.get(
  '**',
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: 'index.html'
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.get('**', (req, res, next) => {
  const { protocol, originalUrl, baseUrl, headers } = req;

  commonEngine
    .render({
      bootstrap,
      documentFilePath: indexHtml,
      url: `${protocol}://${headers.host}${originalUrl}`,
      publicPath: browserDistFolder,
      providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
    })
    .then((html) => res.send(html))
    .catch((err) => next(err));
});

/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url)) {
  const portRaw = process.env['PORT'] || process.env['NG_APP_PORT'] || '3001';
  const port = typeof portRaw === 'string' ? parseInt(portRaw as string, 10) || 3001 : (portRaw as any);
  const host = '0.0.0.0';
  const healthPath = process.env['NG_APP_HEALTHCHECK_PATH'] || '/healthz';
  // Lightweight health endpoint
  app.get(healthPath, (_req, res) => res.status(200).json({ status: 'ok' }));

  app.listen(port, host, () => {
    // Health/readiness logs
    console.log(`[startup] Angular SSR/Express server listening on http://${host}:${port}`);
    console.log(`[startup] Health endpoint: http://${host}:${port}${healthPath}`);
  });
}

export default app;
