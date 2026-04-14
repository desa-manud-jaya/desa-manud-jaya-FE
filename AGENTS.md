# AGENTS.md

## Project Overview
This repository is the frontend for **Desa Manud Jaya**, a sustainable tourism platform.

Main product areas:
- Landing page / marketing site
- Destination catalog and detail pages
- Tour package catalog and detail pages
- Traveler and partner authentication flows
- Backend-integrated package fetching with local mock fallback

## Tech Stack
- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS 4**
- **shadcn/ui** (`components/ui/*`)
- **Redux Toolkit** for package state
- **Vercel Analytics** in `app/layout.tsx`

## Commands
- `npm run dev` — start local dev server
- `npm run build` — production build
- `npm run lint` — run linting

## Environment
Backend base URL is configured in:
- `lib/api-config.ts`

Expected env var:
- `ENV_BASEURL`

Fallback currently points to the Railway backend if `ENV_BASEURL` is not set.

## Directory Guide
- `app/` — App Router routes and route-level metadata
- `components/` — feature components for the landing page and auth flows
- `components/ui/` — shared shadcn/ui primitives
- `hooks/` — custom hooks
- `lib/` — utilities, API wrappers, static data, Redux, domain services
- `public/` — images, icons, and static assets
- `styles/` — additional global styling files

## Important Files
- `app/page.tsx` — root page, renders the landing page
- `app/layout.tsx` — root layout, fonts, analytics, Redux provider
- `components/landing-page.tsx` — top-level client page composition and local session handling
- `components/hero-section.tsx` — hero content plus login/register interactions
- `components/packages-section.tsx` — package listing UI backed by Redux
- `lib/data.ts` — mock destinations and packages, plus `formatRupiah`
- `lib/api.ts` — shared fetch wrapper with JSON/text response handling
- `lib/services/auth-service.ts` — login and registration API calls
- `lib/services/package-service.ts` — package normalization, merge, fallback, and detail lookup logic
- `lib/redux/features/packages/package-slice.ts` — async package fetch state

## Routing Notes
### Static / main routes
- `/` — landing page
- `/destinasi` — destination list
- `/paket` is represented mainly through landing-page links and package detail routes

### Dynamic routes
- `app/destinasi/[id]/page.tsx` — destination details from local data
- `app/paket/[id]/page.tsx` — package details from mock data first, backend fallback second

## Data Model & Flow
### Destinations
Destination data is currently local and comes from:
- `lib/data.ts`

Destination detail pages are statically generated from that local dataset.

### Packages
Package data follows a **hybrid model**:
1. Start with local mock packages from `lib/data.ts`
2. Fetch approved backend packages from `/packages/approved`
3. Normalize backend data into frontend-friendly shapes
4. Merge API and mock packages by `id`
5. Use mock data as resilience/fallback when API calls fail

### Why this matters
When editing package logic:
- **Do not remove the mock fallback** unless the product owner explicitly confirms the backend is complete and reliable
- Keep ID-based deduplication behavior intact
- Keep API-to-UI mapping centralized in `lib/services/package-service.ts`

### Booking / Payment Status Notes
- Booking history UI now supports a display status: `paid_pending_review`.
- This status is derived in the frontend when payment proof exists (`paymentProofUrl` or `paymentUploadedAt`) while backend status is still `pending` or `waiting_for_payment`.
- User-facing label for this state is **"Paid - Pending Pengecekan Admin"**.
- Booking history card also surfaces payment details: upload timestamp, admin review state, and review note when present.

## Auth Notes
Auth is primarily handled on the client side.

Key behaviors:
- Session is stored in `localStorage`
- Storage key: `manud-jaya-traveler-session`
- Login/register UI lives mainly in `components/hero-section.tsx`
- Top-level auth/session orchestration is in `components/landing-page.tsx`

### Role mapping
Backend roles are mapped to frontend roles:
- `ADMIN` → `admin`
- `VENDOR` → `partner`
- `USER` → `traveler`

If you change auth behavior, keep backend/frontend role mapping aligned.

## UI / Content Conventions
- Preserve the current **Indonesian product copy** unless a task explicitly asks for translation or copy rewriting
- Use existing shadcn/ui primitives where possible
- Keep visual style aligned with the current eco-tourism branding
- Reuse `formatRupiah()` for currency display
- Prefer existing section/component patterns before introducing new abstractions

## Coding Conventions
- Put backend calls in `lib/services/*`
- Keep low-level fetch behavior in `lib/api.ts`
- Keep route-specific UI in `app/` or feature components under `components/`
- Prefer typed mapping functions when transforming backend responses
- Avoid scattering API response shape assumptions across components
- Centralize normalization logic in services/slices

## Redux Guidance
Redux is currently used for package list state.

When modifying package state:
- Keep async fetching in the slice or dedicated async flows
- Keep selector/dispatch usage typed through `lib/redux/hooks.ts`
- Do not duplicate package-fetch logic in multiple components without a strong reason

## Known Gaps / Cautions
- `README.md` is currently minimal and does not explain the app
- There is a large shared UI component set; not all components are necessarily in active use
- Some auth/account actions in the navbar appear presentational and may not yet be wired to full flows
- The package feature mixes mock content with live API data by design

## Preferred Editing Strategy for Future Agents
Before making changes:
1. Identify whether the feature is **static content**, **auth flow**, or **API-backed package logic**
2. Check whether the source of truth is `lib/data.ts`, a service in `lib/services/`, or Redux state
3. Reuse existing components and data mappers before creating new patterns

When adding features:
- Keep components focused and composable
- Follow the existing folder structure
- Maintain current fallback behavior for packages
- Avoid breaking static route generation for destinations and package metadata

## If You Need to Extend the Project
Recommended areas:
- Improve `README.md`
- Add tests for package mapping/merge logic
- Introduce stronger auth/session typing and token handling
- Clarify environment setup in project docs
- Wire currently placeholder account actions to real pages or APIs
