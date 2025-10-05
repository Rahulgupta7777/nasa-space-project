# AresMatrix LEO

AresMatrix LEO is a Next.js application for Low Earth Orbit (LEO) visualization, conjunction awareness, mission planning, and feasibility analysis. It combines CesiumJS for a 3D globe, lightweight orbital analytics, NASA GIBS imagery previews, and a private Feasibility Advisor powered by a local inference server.

## Features

- Dashboard: Interactive Cesium globe and situational awareness. Fetches a subset of active TLEs and computes close approaches.
- Planner: LEO mission planner that suggests launch site, debris risk band, estimated lifetime, and mitigations.
- Earth Observation Resources: Quick previews of GIBS imagery and links to Worldview and EarthExplorer.
- Feasibility Advisor: Commercialization guidance based on mission parameters with partner ecosystem context; runs locally.
- Business and About pages: Branding, offerings, and a curated Partner Ecosystem section.
- Optional GitHub OAuth via NextAuth.

## Tech Stack

- Next.js 15, React 19, TypeScript 5
- CesiumJS, Three.js, satellite.js
- Tailwind CSS 4
- NextAuth (GitHub provider)

## Project Structure

Key routes under `src/app`:

- `/` — Home
- `/dashboard` — Cesium dashboard
- `/planner` — Mission planner UI
- `/business` — Offerings and Partner Ecosystem
- `/about` — Project overview
- `/resources` — Resource hub
  - `/resources/earth-observation` — EO previews and AOI tooling
  - `/resources/data` — Data resources
  - `/resources/debris` — Debris and mitigation
- `/feasibility` — LEO Feasibility Advisor form

APIs under `src/app/api`:

- `/api/alerts` — TLE subset and close-approach calculation
- `/api/tle` — Active TLE proxy (subset)
- `/api/gibs` — NASA GIBS image proxy (WMTS/WMS preview)
- `/api/planner` — Mission planning recommendations
- `/api/feasibility` — Feasibility Advisor (local model)
- `/api/auth/[...nextauth]` — GitHub OAuth

## Getting Started

Install dependencies and run the dev server:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Production build:

```bash
npm run build
npm run start
```

## Environment Variables

Create `orbitguard/.env.local` as needed:

- `OLLAMA_URL` — Local inference server URL (default `http://localhost:11434`)
- `OLLAMA_MODEL` — Default model name (default `llama3`)
- `NEXTAUTH_SECRET` — NextAuth secret
- `GITHUB_ID` and `GITHUB_SECRET` — GitHub OAuth credentials

## Feasibility Advisor

- Page: `src/app/feasibility/page.tsx`
- Form component: `src/components/FeasibilityForm.tsx`
- API: `src/app/api/feasibility/route.ts`
- How it works:
  - Collects mission inputs (purpose, budget, altitude, payload, timeline, risk tolerance)
  - Builds a prompt including partner ecosystem examples (PNT, EO, ground, comms, launch, analytics)
  - Calls the local inference server and returns a structured plan
  - Supports `model` override in the request body; otherwise uses `OLLAMA_MODEL`

Quick test:

```bash
curl -X POST http://localhost:3000/api/feasibility \
  -H "Content-Type: application/json" \
  -d '{
    "purpose":"EO startup",
    "budget":"25",
    "altitude":"550",
    "payload":"60",
    "timeline":"18",
    "riskTolerance":"Moderate",
    "model":"llama3"
  }'
```

## Cesium Assets

- Static workers and assets are included under `public/cesium/`.
- If you see a widget CSS warning (e.g., InfoBoxDescription.css), ensure widget CSS assets are present; functionality should remain normal.

## Known Issues

- Dashboard may log a non-blocking Cesium widget CSS error in dev; globe interaction works.
- External APIs (CelesTrak, GIBS) can rate-limit or change output; the app includes minimal error handling suitable for demos.

## Notes

- This project uses a private, local inference server for the Feasibility Advisor; no data leaves your machine.
- Partner examples on the Business page are illustrative; verify availability, licensing, and fit for your mission.
