# OutingList Build Progress

## Stage 3 — Lists, Likes, Sharing, Profile ✅
_Completed: 2026-03-12_

### What Was Built

**API Enhancements**
- `POST /api/lists` — create list (title, description, is_public, cover_image_url)
- `GET /api/lists?user_id=` — all user's lists with event_count, like_count, preview_events
- `GET /api/lists/:id?user_id=` — list detail with events, liked status, owner profile
- `PUT /api/lists/:id` — update list (owner only)
- `DELETE /api/lists/:id` — delete list (owner only)
- `POST /api/lists/:id/events` — add event to list (owner only)
- `DELETE /api/lists/:id/events/:eventId` — remove event from list (owner only)
- `GET /api/likes/check?user_id=&target_type=&target_id=` — check like status
- `GET /api/users/:id/profile` — profile with stats, public_lists, liked_events, my_events
- `PUT /api/users/:id/profile` — update display_name, bio
- `GET /share/lists/:id` — OG meta middleware for list sharing (og:title, og:description, og:image, Twitter card)

**Lists Pages**
- `My Lists (/lists)` — grid of user's lists separated into Public/Private sections, event count + like count chips, 4-image preview collage
- `Create List (/lists/new)` — title, description, cover image URL with live preview, public/private toggle, validation
- `List Detail (/lists/:id)` — cover image/gradient, description, curator badge, Like button (optimistic), Share button (copies /share/lists/:id), Edit button (owner), event grid with remove button (owner), "Add more events" link

**Likes**
- Like/unlike events: heart button on EventCards and detail page, optimistic UI update, persisted to DB
- Like/unlike lists: same pattern on ListDetail page — button turns orange, count updates, persists
- Profile Likes tab shows all liked events

**Share Buttons**
- Events: Share button on EventDetail copies `/share/events/:id` with toast confirmation
- Lists: Share button on ListDetail copies `/share/lists/:id` with toast confirmation
- OG meta for lists returns proper og: + Twitter card tags

**AddToListModal**
- Floating modal on EventCard (+ button appears on hover) and EventDetail ("Add to List" button)
- Shows user's lists with event count
- Add button marks as "✓ Added" immediately (optimistic)
- "Create New List" button routes to /lists/new

**Profile Page (full rebuild)**
- Avatar (initial letter in coral circle)
- Edit profile inline (display_name, bio) — saves to API
- Stats row: My Events / My Lists / My Likes (counts clickable to tab)
- Tab switcher: My Events / My Lists (public only) / My Likes
- Each tab has proper empty state with CTA

**Curator Badge**
- Shows on ListDetail "by Curator" section if `user_profiles.is_curator = 1`
- Shows on Profile header next to display name if curator

**Git**
- Committed and pushed: `feat(stage-3): lists, likes, sharing, profiles`
- GitHub: https://github.com/erikkurtu/outinglist

### Screenshots Verified
- My Lists page: list card with 4-image grid, Public badge, event count, like count ✅
- Create List form: all fields, public/private toggle ✅
- List created → redirected to ListDetail with toast ✅
- List Detail with 4 events, Like/Share/Edit buttons ✅
- Like button toggled (orange "1 Liked" state) ✅
- OG meta for lists: curl confirms og:title, og:description, twitter:card ✅
- Event Detail: "1 Liked" (orange), Share button, Add to List button ✅
- Add to List modal: shows list with "Best Atlanta Weekend Picks - 4 events" ✅
- Profile: avatar, stats (0 events, 1 list, 6 likes), 3 tabs ✅
- Profile Likes tab: 5 liked events with orange heart badges ✅
- Profile Lists tab: "Best Atlanta Weekend Picks" card ✅

### Known Gaps (for Stage 4)
- Curator badge only shows as "Curator" since display_name defaults from mock auth
- No event date bug: some events show "Invalid Date" (seeding issue, not Stage 3 bug)
- Profile only shows public lists (by design in spec)

---


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

---

## Design Revolution (March 12, 2026)

### Status: ✅ DONE

### What Changed

**Visual Identity Overhaul:**
- Font: Replaced Space Grotesk with **Playfair Display** (editorial serif with character) + Inter for body
- Palette: Charcoal (#1C1C1E) + Cream (#F5F0E8) + **Terracotta (#C2582A)** — ditched the generic coral
- 15 custom SVG category icons (music note, fork+knife, palette, mountains, etc.) — NO EMOJI anywhere

**Component Redesigns:**
- `EventCard`: Image-dominant, zero borders, category dot + text labels, hover scale
- `Nav`: Dark (#1C1C1E) wordmark-only, transparent over hero, terracotta CTA button
- `Layout`: Updated for fullWidth/noPad support, dark footer with wordmark
- `Button`: New variants matching new palette
- Added `CategoryIcons.tsx` with 15 SVG icons + color map

**Page Redesigns:**
- **Homepage**: Dark hero section with real Picsum photos, "Your city. *This weekend.*" headline, mixed editorial grid (1 large featured + smaller cards), dark category matrix, terracotta CTA banner
- **Browse**: "What's on." header, large featured card hero + 3-col card grid, text-link filters, minimal search bar, clean pagination

**Data:**
- Updated all 55 events in DB with Picsum photo URLs (seed = event ID)

**Server:**
- Added static file serving to Hono server — both API + frontend served from port 3001
