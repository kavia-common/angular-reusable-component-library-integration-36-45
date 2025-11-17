 // PUBLIC_INTERFACE
 /** Service for interacting with the Figma import API. */
 export class FigmaService {
   /** Post add_figma_data to backend.
    * @param projectId Project identifier (string|number).
    * @param fileKey Figma file key.
    * @param accessToken Figma personal access token.
    */
   static async addFigmaData(projectId: string | number, fileKey: string, accessToken: string) {
     if (projectId === undefined || projectId === null || String(projectId).trim().length === 0) {
       throw new Error('projectId is required');
     }
     if (!fileKey || fileKey.trim().length === 0) {
       throw new Error('fileKey is required');
     }
     if (!accessToken || accessToken.trim().length === 0) {
       throw new Error('accessToken is required');
     }
     const base = (await import('../env.config')).EnvConfig.apiBase();
     const url = `${base}/api/figma/add_figma_data?project_id=${encodeURIComponent(String(projectId))}`;
     const g: any = (typeof globalThis !== 'undefined' ? (globalThis as any) : {});
     const f = typeof g.fetch === 'function' ? g.fetch : (typeof fetch !== 'undefined' ? fetch : undefined);
     if (!f) throw new Error('Fetch API is not available in this environment');
     return f(url, {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ fileKey, accessToken }),
     });
   }
 }
