# OutingList Build Progress

## Stage 1 — Foundation ✅
_Completed: 2026-03-11_

### What Was Built

**Project Scaffold**
- Vite 7 + React 19 + TypeScript (zero TS errors)
- Tailwind CSS v4 with `@tailwindcss/vite` plugin
- React Router v7 with all planned routes
- `concurrently` runs API + UI servers together with `npm run dev`

**Brand System**
- Custom color palette: `#FF6B35` coral primary, `#1A1A2E` dark, `#00D4AA` teal accent
- Space Grotesk display font + Inter body font (Google Fonts)
- CSS variables via `@theme` block in Tailwind v4
- Applied consistently across all components

**Components Built**
- `Button` — 5 variants (primary, secondary, ghost, danger, accent), 3 sizes, loading state
- `Badge` — dynamic color from category, icon support
- `EventCard` — gradient fallback, like button, FREE badge, category pills, hover animations
- `Nav` — sticky header with OL logo, mobile bottom nav
- `Layout` — max-width wrapper, footer
- `Toast` — provider + hook, 4 toast types

**Auth**
- Mock auth context (email → name extraction, no Clerk key required)
- All protected routes functional
- Sign In / Sign Up pages with form validation

**Database**
- SQLite via better-sqlite3
- 8 tables: events, categories, event_categories, lists, list_events, likes, user_profiles, scraper_runs
- 15 categories seeded (full taxonomy from SPEC)
- 20 realistic Atlanta events seeded (The Tabernacle, Piedmont Park, Fox Theatre, BeltLine, etc.)
- Date range: March–April 2026

**API (Hono on port 3001)**
- `GET /api/events` — category, search, free filters, pagination
- `GET /api/events/:id` — with categories attached
- `GET /api/categories` — all 15 sorted
- `POST /api/events` — create new event
- CORS configured for Vite dev server

**Pages (all 9 routes)**
- `/` — Hero with dark bg, category grid, CTA section
- `/browse` — Event grid with live filters (20 events showing)
- `/events/:id` — Full event detail page
- `/events/new` — Create event form (auth-gated)
- `/lists` — Lists placeholder with auth gate
- `/profile` — Profile with stats, sign out
- `/sign-in` — Auth form
- `/sign-up` — Auth form

**Git**
- Initialized with `.gitignore` (excludes `.db`, `node_modules`, `.env`)
- `.env.example` with Clerk key placeholder
- GitHub: https://github.com/erikkurtu/outinglist
- Pushed to `main`

### Screenshots Verified
- Homepage: Dark hero, coral CTAs, category grid, footer ✅
- Browse page: 20 events in 3-column grid, category filters, search, FREE badges, price ranges ✅

### Known Gaps (for Stage 2)
- Category emoji icons rendering as bitmap (font rendering issue) — cosmetic
- No image uploads yet (gradient fallbacks used)
- Lists and Profiles are stub pages
- Clerk real auth not wired (mock works fine)
