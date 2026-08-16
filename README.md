# AI Coding Agent — Client

React + Vite + TypeScript chat UI for the AI Coding Agent. Talks to a separate backend
(see the `ai-coding-agent-server` repo) over WebSocket, and shows the agent's generated
project in a live preview iframe that auto-refreshes on every file edit.

```
src/
├── App.tsx                    Chat panel + live preview panel
├── config.ts                  Resolves backend URL (dev proxy vs deployed)
├── hooks/useAgentWebSocket.ts State management for chat + connection + preview refresh
├── services/websocket.ts      WebSocket client with reconnect logic
├── components/                ChatMessage, SuggestionButtons, ConnectionStatus, LivePreview
└── types/agent.types.ts       Event + message types (must match the backend's types.ts)
```

## Run it locally

```bash
npm install
npm run dev
```

Open the URL Vite prints (typically `http://localhost:5173`). In dev, Vite's proxy
(`vite.config.ts`) forwards `/ws` and `/preview` to `localhost:3001`, so make sure the
backend is running too — see the server repo's README.

## Deploy → Vercel

1. On https://vercel.com, **New Project**, import this repo. Vercel auto-detects Vite.
   Root directory: `/` (this whole repo is the frontend).
2. Add an environment variable: `VITE_BACKEND_URL` = your deployed backend's URL
   (e.g. `https://ai-coding-agent-server.onrender.com`).
3. Deploy. Vercel gives you a public URL — that's the link you share.

`config.ts` uses `VITE_BACKEND_URL` to build the WebSocket URL and preview iframe src in
production; in local dev it falls back to the Vite proxy instead.

## Known limitations

- Every visitor talks to the *same* backend workspace — there's no per-user isolation yet.
- No auth — anyone with the deployed link can drive the agent (and use up your Groq quota
  on the backend). Worth adding before sharing widely.


