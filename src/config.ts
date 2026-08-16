// In local dev, Vite's proxy (vite.config.ts) forwards /ws and /preview to
// localhost:3001, so requests can stay relative to the current origin.
// In production the frontend (Vercel) and backend (Render) live on different
// domains, so VITE_BACKEND_URL must be set at build time, e.g.
// VITE_BACKEND_URL=https://ai-coding-agent-server.onrender.com
const backendUrl = (import.meta.env.VITE_BACKEND_URL as string | undefined)?.replace(/\/+$/, '');

export function getWsUrl(): string {
  if (backendUrl) {
    const proto = backendUrl.startsWith('https') ? 'wss' : 'ws';
    const host = backendUrl.replace(/^https?:\/\//, '');
    return `${proto}://${host}/ws`;
  }
  const proto = window.location.protocol === 'https:' ? 'wss' : 'ws';
  return `${proto}://${window.location.host}/ws`;
}

// Returns the origin to prefix /preview requests with. Empty string in dev,
// since the Vite proxy already handles relative /preview requests.
export function getBackendOrigin(): string {
  return backendUrl ?? '';
}
