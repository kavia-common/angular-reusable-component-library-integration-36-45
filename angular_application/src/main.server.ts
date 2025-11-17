import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';

const bootstrap = () => {
  const portInfo = process.env['PORT'] || process.env['NG_APP_PORT'] || 'unknown';
  if (typeof console !== 'undefined') {
    console.log(`[startup] Bootstrapping Angular SSR app (port: ${portInfo})`);
  }
  return bootstrapApplication(AppComponent, config);
};

export default bootstrap;
