# OutingList Build Progress

## Stage 2 — Event Core ✅
_Completed: 2026-03-11_

### What Was Built

**API Enhancements**
- `time_of_day` filter: morning/afternoon/evening/night (extracts local hour from ISO timestamp)
- `date_from` / `date_to` date range filter
- Multi-category filter (comma-separated slugs)
- Likes endpoints: `POST /api/likes` (toggle), `GET /api/likes/:type/:id`
- OG meta middleware at `/share/events/:id` — og:title, og:description, og:image, Twitter card, JSON-LD Event schema
- Image URL support in `POST /api/events`
- Category multi-select support in event creation (`category_ids` array)

**Browse Page (full rebuild)**
- Debounced search input (400ms) with clear button
- Date range picker (From/To)
- Time of day buttons: Any time / Morning / Afternoon / Evening / Night
- Category pills (all 15) — multi-select with active chips display
- Free only toggle
- 4-column responsive grid (1→2→3→4 cols)
- Pagination: 12 per page, page number buttons, Prev/Next, result count
- URL sync — all filters persisted in URL params

**Event Detail Page (rebuilt)**
- Large hero gradient (category-colored) with emoji icon
- Price badge in hero overlay
- Category badges that link to filtered browse
- Date/time grid with end time, Google Maps link for address
- Price, source platform info cards
- Like button with count (requires auth), toggle
- Share button (copies `/share/events/:id` OG URL)
- "Sign in to like events" prompt when logged out

**Create Event Form (enhanced)**
- My Event vs External Event source toggle
- External event info banner
- Category multi-select (colored pills)
- Price range (min + max)
- Image URL with live preview
- Required field client-side validation with error display
- Auth persistence via localStorage (mock user survives navigation)

**Data**
- 35 more events seeded (55 total)
- All 15 categories represented
- Mix: free/paid, morning/afternoon/evening/night, internal/external

**Git**
- Committed and pushed: `feat(stage-2): event core — browse, detail, create, filters`
- GitHub: https://github.com/erikkurtu/outinglist (commit a2ad8ad)

### Screenshots Verified
- Browse page: 55 events in 4-col grid, all filters, pagination ✅
- Event detail: Orchid Daze — hero gradient, date/location cards, actions ✅
- Create event: auth gate → sign in → full form with category pills ✅
- Category filter: Music & Concerts = 9 events, active chip shown ✅
- Time+free filter: Morning + Free Only = 13 events ✅
- OG meta: curl /share/events/evt-49 returns proper og: tags ✅

### Known Gaps (for Stage 3)
- Like button doesn't visually persist between page loads (DB works, but auth is mock)
- Lists page is still a stub
- Profile page needs likes/events sections

---

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
