import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// Guard global references for SSR/prerender
const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';
const hasProcessEnv = typeof process !== 'undefined' && (process as any).env;

const portInfo = hasProcessEnv ? ((process as any).env.PORT || (process as any).env.NG_APP_PORT || 'unknown') : (isBrowser ? 'browser' : 'unknown');
if (typeof console !== 'undefined') {
  console.log(`[startup] Bootstrapping Angular browser app (port: ${portInfo})`);
}

bootstrapApplication(AppComponent, appConfig)
  .then(() => { if (typeof console !== 'undefined') console.log('[startup] Angular browser app bootstrapped'); })
  .catch((err) => { if (typeof console !== 'undefined') console.error(err); });
