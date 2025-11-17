 // PUBLIC_INTERFACE
 /** Centralized environment variable accessor for client and SSR.
  * Exposes runtime-configurable URLs via NG_APP_* variables.
  */
 export class EnvConfig {
   /** Base URL for backend API (optional). Falls back to relative '/'. */
   static apiBase(): string {
     const g: any = (typeof globalThis !== 'undefined' ? (globalThis as any) : {});
     const w: any = (typeof g.window !== 'undefined' ? g.window : undefined);
     const v =
       g['NG_APP_API_BASE'] ||
       (typeof w !== 'undefined' ? w['NG_APP_API_BASE'] : undefined) ||
       (typeof process !== 'undefined' ? (process as any).env?.['NG_APP_API_BASE'] : undefined);
     return (typeof v === 'string' && v.length ? v : '').replace(/\/+$/, '');
   }
 }
