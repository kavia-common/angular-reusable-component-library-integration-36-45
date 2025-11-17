import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

const portInfo = (typeof process !== 'undefined' && (process as any).env) ? ((process as any).env.PORT || (process as any).env.NG_APP_PORT || 'unknown') : 'browser';
console.log(`[startup] Bootstrapping Angular browser app (port: ${portInfo})`);
bootstrapApplication(AppComponent, appConfig)
  .then(() => console.log('[startup] Angular browser app bootstrapped'))
  .catch((err) => console.error(err));
