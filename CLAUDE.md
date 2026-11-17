# AI Helper

**Last Updated:** 2026-03-22
**Purpose:** Quick-start reference for development sessions on the hgraph_oms_ui project.

---

## Project Overview

### What is hgraph_oms_ui?

A React + TypeScript frontend for the hgraph Order Management System. Provides credit dashboards,
order entry (structured form, chat paste, natural language), order blotters, counterparty/portfolio
views, and entitlements-based auth. Runs as a web app, Electron desktop app, and PWA mobile app.

The backend API lives in the [hgraph_platform_tools](https://github.com/sijkelly/hgraph_platform_tools)
repo (`hgraph_api` package) and serves REST + WebSocket endpoints on port 8000.

### Key Principles

1. **TypeScript strict mode** — `strict: true` in tsconfig, no `any` types.
2. **Path alias** — use `@/` to import from `src/` (e.g. `import Card from "@/components/shared/Card"`).
3. **Functional components only** — no class components, use hooks for state and effects.
4. **React Query for data fetching** — all API calls go through hooks in `src/api/hooks.ts`.
5. **Tailwind CSS v4** — utility-first styling, no CSS modules or styled-components.

---

## First Time Setup

```bash
# 1. Install dependencies
npm install

# 2. Start the backend API (in the hgraph_platform_tools repo)
cd ../hgraph_platform_tools
uv run hgraph-tools serve --port 8000 --db-dir ./data/

# 3. Start the dev server (in this repo)
npm run dev
# Opens at http://localhost:5173 — Vite proxies /api and /ws to localhost:8000
```

---

## Development Commands

```bash
# Dev server with hot reload
npm run dev

# Type-check (no emit)
npx tsc --noEmit

# Production build
npm run build

# Preview production build
npm run preview

# Lint
npm run lint

# Electron desktop (dev)
npm run electron:dev

# Electron desktop (build)
npm run electron:build
```

---

## Project Structure

```
hgraph_oms_ui/
├── CLAUDE.md                           # This file
├── package.json                        # Dependencies and scripts
├── vite.config.ts                      # Vite + React + Tailwind + proxy config
├── tsconfig.app.json                   # TypeScript config (strict, @/ alias)
├── index.html                          # Entry HTML with PWA manifest + service worker
├── electron/                           # Electron desktop wrapper
│   ├── main.cjs                        # Main process (window, tray, shortcuts)
│   └── preload.cjs                     # Context bridge
├── public/                             # Static assets
│   ├── manifest.json                   # PWA manifest
│   ├── sw.js                           # Service worker
│   └── icon-192.svg                    # App icon
└── src/
    ├── main.tsx                        # App entry point
    ├── App.tsx                         # Routes + QueryClient + AuthProvider
    ├── index.css                       # Tailwind v4 import + CSS custom properties
    ├── api/                            # Backend communication
    │   ├── client.ts                   # HTTP fetch wrapper (get, post, patch)
    │   ├── types.ts                    # TypeScript interfaces matching API schemas
    │   ├── hooks.ts                    # React Query hooks for all endpoints
    │   ├── websocket.ts               # WebSocketManager with auto-reconnect
    │   └── useWebSocket.ts            # useCreditWebSocket React hook
    ├── auth/                           # Authentication
    │   ├── AuthContext.tsx             # AuthProvider: session, sign-in/out, dev or sso mode
    │   ├── AuthGate.tsx               # App-level gate: login screen until signed in
    │   ├── LoginPrompt.tsx            # Demo accounts (dev) or "Sign in with SSO" (sso)
    │   ├── oidc.ts                    # OpenID Connect sign-in (authorization code + PKCE)
    │   ├── SSOCallback.tsx            # /auth/callback: exchanges the code, asks the API who the user is
    │   └── RequireAuth.tsx            # Action-level permission gate
    ├── components/
    │   ├── layout/
    │   │   ├── AppShell.tsx           # Flex layout with Sidebar + Outlet + shortcuts
    │   │   └── Sidebar.tsx            # Nav links + user info + sign out
    │   ├── credit/
    │   │   ├── CreditSummary.tsx      # Utilization cards with progress bars
    │   │   ├── CreditLimitsTable.tsx  # Limits table
    │   │   └── CreditBlotter.tsx      # Perspective grid wrapper
    │   ├── orders/
    │   │   ├── OrderFields.tsx        # Shared types, constants, EMPTY_ORDER
    │   │   ├── StructuredOrderForm.tsx # Full form with confidence indicators
    │   │   ├── ChatPasteEntry.tsx     # Paste + parse mode
    │   │   ├── NLPOrderEntry.tsx      # Natural language with debounced parsing
    │   │   ├── OrderTicket.tsx        # Tabbed container (3 entry modes)
    │   │   ├── OrderBlotter.tsx       # Order table with status colors + cancel
    │   │   └── OrderDetailPanel.tsx   # Detail panel with amend/cancel actions
    │   ├── parties/
    │   │   └── EntityDetail.tsx       # Entity profile with credit + relationships
    │   ├── portfolios/
    │   │   └── PortfolioDetail.tsx    # Portfolio info + book hierarchy
    │   └── shared/
    │       ├── Card.tsx               # Reusable card component
    │       └── StatusBadge.tsx        # Color-coded status badges
    ├── pages/                          # Route-level pages
    │   ├── Dashboard.tsx
    │   ├── CreditPage.tsx
    │   ├── OrdersPage.tsx
    │   ├── PartiesPage.tsx
    │   └── PortfoliosPage.tsx
    └── lib/                            # Utilities
        ├── utils.ts                   # cn(), formatCurrency(), formatPercent()
        └── shortcuts.ts               # Keyboard shortcut handler (F2, F5, Esc)
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TypeScript |
| Build tool | Vite 8 |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite` plugin) |
| Data fetching | TanStack React Query v5 |
| Routing | React Router v7 |
| Data grids | FINOS Perspective |
| Desktop | Electron |
| Mobile | PWA (manifest.json + service worker) |
| Icons | Lucide React |

## API Proxy

In development, Vite proxies API and WebSocket requests to the FastAPI backend:

- `/api/*` → `http://localhost:8000`
- `/ws/*` → `ws://localhost:8000`

This is configured in `vite.config.ts`. In production, set `VITE_API_BASE_URL` to the backend origin.

## Authentication

Set with `VITE_AUTH_MODE` (see `.env.example`); it must match the backend's `AUTH_MODE`.

- **`dev`** (default; backend `AUTH_MODE=header`) — pick a demo account. The user ID is sent as `X-User-Id`
  and remembered in `localStorage`.
- **`sso`** (backend `AUTH_MODE=oidc`) — OpenID Connect authorization-code flow with PKCE. Set
  `VITE_OIDC_ISSUER` (same value as the backend's `OIDC_ISSUER`) and `VITE_OIDC_CLIENT_ID`, and register the
  app at the provider as a public (SPA) client with redirect URI `<origin>/auth/callback`. The access token
  is sent as a bearer token on API calls and as the subprotocol pair `["bearer", token]` on WebSockets, and
  is kept in `sessionStorage` only. The user ID comes from the backend (`GET /api/v1/me`), never from the URL.
  The user is signed out when the token expires or the API answers 401; there is no silent refresh.
  Signing out clears this app's session; it does not sign the user out of the identity provider.

## Keyboard Shortcuts (Electron)

| Key | Action |
|-----|--------|
| F2 | New order |
| F5 | Refresh |
| Esc | Close panel/modal |

## Conventions

- All API response types are defined in `src/api/types.ts` and must match the FastAPI Pydantic schemas.
- All data fetching uses React Query hooks from `src/api/hooks.ts` — never call `fetch` directly in components.
- Components are default-exported, one component per file.
- Use `@/` path alias for all imports from `src/`.
