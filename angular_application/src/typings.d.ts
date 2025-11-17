declare var window: any;
declare var fetch: typeof globalThis.fetch;
declare var setTimeout: typeof globalThis.setTimeout;
declare var clearTimeout: typeof globalThis.clearTimeout;
declare var AbortController: typeof globalThis.AbortController;

// Allow Response type in TS without DOM lib conflicts
type Response = globalThis.Response;

// Minimal Event type for component handler where DOM lib may not be present
interface Event {
  preventDefault: () => void;
}
