# AGENTS.md

## Project Overview
This repository is the frontend for **Desa Manud Jaya**, a sustainable tourism platform.

Main product areas:
- Landing page / marketing site
- Destination catalog and detail pages
- Tour package catalog and detail pages
- Traveler and partner authentication flows
- Traveler booking flow for tour packages
- Traveler booking history
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
- `components/` — feature components for the landing page, auth flows, and booking flows
- `components/ui/` — shared shadcn/ui primitives
- `hooks/` — custom hooks
- `lib/` — utilities, API wrappers, static data, Redux, types, and domain services
- `public/` — images, icons, and static assets
- `styles/` — additional global styling files

## Important Files
- `app/page.tsx` — root page, renders the landing page
- `app/layout.tsx` — root layout, fonts, analytics, Redux provider
- `components/landing-page.tsx` — top-level client page composition and local session handling
- `components/hero-section.tsx` — hero content plus login/register interactions
- `components/packages-section.tsx` — package listing UI backed by Redux
- `app/pemesanan/[id]/page.tsx` — booking page for a selected package
- `app/riwayat-pemesanan/page.tsx` — traveler booking history page
- `components/booking/booking-form.tsx` — booking form UI and traveler-side booking flow
- `components/booking/booking-history-list.tsx` — booking history rendering
- `lib/data.ts` — mock destinations and packages, plus `formatRupiah`
- `lib/api.ts` — shared fetch wrapper with JSON/text response handling
- `lib/services/auth-service.ts` — login and registration API calls
- `lib/services/package-service.ts` — package normalization, merge, fallback, and detail lookup logic
- `lib/services/booking-service.ts` — localStorage-backed booking persistence helpers
- `lib/types/booking.ts` — shared booking types
- `lib/redux/features/packages/package-slice.ts` — async package fetch state

## Routing Notes
### Static / main routes
- `/` — landing page
- `/destinasi` — destination list
- `/riwayat-pemesanan` — logged-in traveler booking history
- `/paket` is represented mainly through landing-page links and package detail routes

### Dynamic routes
- `app/destinasi/[id]/page.tsx` — destination details from local data
- `app/paket/[id]/page.tsx` — package details from mock data first, backend fallback second
- `app/pemesanan/[id]/page.tsx` — booking form for a selected package

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

### Bookings
Bookings currently use a **frontend-persisted model**:
- Booking records are stored in `localStorage`
- Storage key: `manud-jaya-bookings`
- Shared booking types live in `lib/types/booking.ts`
- Booking CRUD/read helpers live in `lib/services/booking-service.ts`

Current booking fields include:
- `id`
- `bookingCode`
- `userId`
- `username`
- `packageId`
- `packageTitle`
- `packageImage`
- `travelDate`
- `participantCount`
- `contactName`
- `contactPhone`
- `notes`
- `pricePerPerson`
- `totalPrice`
- `status`
- `createdAt`

### Booking flow
Current traveler booking flow:
1. User opens package detail page
2. User clicks **Pesan Sekarang**
3. User is routed to `/pemesanan/[id]`
4. User must be logged in as **traveler**
5. User fills booking form
6. Booking is saved to localStorage
7. Success state is shown
8. User can open `/riwayat-pemesanan`

### Booking history
Booking history currently:
- Reads bookings from localStorage
- Filters records by the current logged-in traveler
- Shows booking code, date, participant count, total price, and status
- Allows navigation back to package detail or booking again

### Why this matters
When editing booking logic:
- Keep booking storage behavior centralized in `lib/services/booking-service.ts`
- Do not scatter localStorage access directly across many components
- Preserve user-scoped filtering by `userId`
- Preserve price calculation consistency: `totalPrice = pricePerPerson × participantCount`
- If migrating to backend APIs later, keep the UI contract and booking types as stable as possible

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

### Booking-specific auth rules
- Only `traveler` users can create bookings
- Booking history is intended for the logged-in traveler
- Navbar booking history entry should stay visible only for traveler users

## UI / Content Conventions
- Preserve the current **Indonesian product copy** unless a task explicitly asks for translation or copy rewriting
- Use existing shadcn/ui primitives where possible
- Keep visual style aligned with the current eco-tourism branding
- Reuse `formatRupiah()` for currency and booking totals
- Prefer existing section/component patterns before introducing new abstractions

## Coding Conventions
- Put backend calls and domain persistence logic in `lib/services/*`
- Keep low-level fetch behavior in `lib/api.ts`
- Keep shared type definitions in `lib/types/*` when the model is reused
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

### Note on bookings and Redux
Bookings are **not** in Redux right now.

Unless there is a strong product reason, keep booking persistence in the dedicated booking service and local component state. Do not move bookings into Redux casually.

## Known Gaps / Cautions
- `README.md` is currently minimal and does not explain the app
- There is a large shared UI component set; not all components are necessarily in active use
- Some auth/account actions in the navbar remain presentational
- The package feature mixes mock content with live API data by design
- The booking feature is currently **localStorage-backed**, not backend-backed
- `npm run build` requires Node `>=20.9.0` because the project uses Next.js 16

## Preferred Editing Strategy for Future Agents
Before making changes:
1. Identify whether the feature is **static content**, **auth flow**, **booking flow**, or **API-backed package logic**
2. Check whether the source of truth is `lib/data.ts`, `lib/services/*`, `lib/types/*`, or Redux state
3. Reuse existing components and data mappers before creating new patterns

When adding features:
- Keep components focused and composable
- Follow the existing folder structure
- Maintain current fallback behavior for packages
- Avoid breaking static route generation for destinations and package metadata
- Keep booking rules consistent with traveler-only access

## If You Need to Extend the Project
Recommended areas:
- Improve `README.md`
- Add tests for package mapping/merge logic and booking service logic
- Introduce stronger auth/session typing and token handling
- Clarify environment setup in project docs
- Wire currently placeholder account actions to real pages or APIs
- Migrate booking persistence from localStorage to a backend API when available
- Add booking detail, cancel booking, and admin confirmation flows
