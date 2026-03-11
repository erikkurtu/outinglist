# Task 001 — Foundation (Stage 1)

## Context
Building OutingList.com from scratch. This is the first task — sets up the entire project scaffold, brand, auth, database, API, and routing. Everything else builds on this.

Read SPEC.md for the full data model and feature list.

## What To Build

### 1. Project Scaffold
- Vite + React + TypeScript
- Tailwind CSS v4
- shadcn/ui (install and configure)
- Hono for API server (runs alongside Vite dev server, or integrated)
- better-sqlite3 for local database
- React Router v7 for client routing
- Package structure:
  ```
  outinglist/
  ├── src/
  │   ├── components/    # UI components
  │   ├── pages/         # Route pages
  │   ├── lib/           # Utils, db, auth
  │   ├── api/           # Hono API routes
  │   └── styles/        # Global styles, brand tokens
  ├── db/
  │   ├── schema.sql     # Full schema from SPEC
  │   ├── seed.sql       # Seed data
  │   └── outinglist.db  # SQLite file (gitignored)
  ├── scrapers/          # Scraper scripts (Stage 4)
  ├── public/
  └── .rook/
  ```

### 2. Brand & Design System
Color palette inspired by gumroad + wisprflow:
- Primary: warm coral/orange (#FF6B35 or similar)
- Dark: rich charcoal (#1A1A2E)
- Accent: electric teal (#00D4AA)
- Background: warm off-white (#FAFAF8)
- Text: near-black (#1A1A1A)
- Muted: warm gray (#94A3B8)

Typography:
- Display: Inter or Space Grotesk (bold, modern)
- Body: Inter (clean readability)

Components to build:
- Button (primary, secondary, ghost, danger variants)
- Card (event card with image, title, date, location, category badges, like button)
- Input, Textarea, Select
- Modal/Dialog
- Badge (for categories)
- Avatar
- Layout (header, main content, footer)
- Navigation (desktop header + mobile bottom nav)
- Toast notifications

### 3. Clerk Auth
- Install @clerk/clerk-react
- ClerkProvider in app root
- SignIn, SignUp, UserButton components
- Protected route wrapper
- Routes: /sign-in, /sign-up
- Use Clerk publishable key from env (VITE_CLERK_PUBLISHABLE_KEY)
- If no key available, create a mock auth context that simulates sign-in for development

### 4. Database
- Create all tables from SPEC data model (events, categories, event_categories, lists, list_events, likes, user_profiles, scraper_runs)
- Create schema.sql and seed.sql
- Seed 15 categories (from SPEC taxonomy)
- Seed 20 sample Atlanta events with realistic data:
  - Mix of concerts, food events, art shows, community events, outdoor activities
  - Real Atlanta venues: The Tabernacle, Ponce City Market, Piedmont Park, Fox Theatre, etc.
  - Future dates (March-April 2026)
  - Mix of free and paid
  - Multiple categories per event

### 5. API Server
- Hono server on port 3001 (or integrated with Vite)
- GET /api/events — list events with filter params
- GET /api/events/:id — single event
- GET /api/categories — all categories
- POST /api/events — create event (requires auth)
- CORS configured for frontend
- JSON responses

### 6. Routing
All routes defined (pages can be stubs with headers):
- / — Home
- /browse — Event listing/search
- /events/:id — Event detail
- /events/new — Create event (protected)
- /lists — My lists (protected)
- /lists/:id — List detail
- /lists/new — Create list (protected)
- /profile — User profile (protected)
- /sign-in, /sign-up — Auth

### 7. Git
- git init
- .gitignore (node_modules, .db files, .env)
- .env.example with required vars
- First commit: "feat: project scaffold + brand + auth + DB schema 🤖 Rook (AI-assisted)"
- Create GitHub repo: outinglist
- Push to origin

## Acceptance Criteria
- [ ] `npm run dev` serves the app on localhost
- [ ] App has custom brand colors, fonts, not default Tailwind
- [ ] Navigation works between all routes
- [ ] Auth flow works (or mock auth if no Clerk key)
- [ ] Database created with all tables
- [ ] 20 sample events visible via API
- [ ] At least the browse page shows event cards with brand styling
- [ ] Committed and pushed to GitHub

## Do NOT
- Don't use Next.js
- Don't use default Tailwind colors — apply the custom palette
- Don't build features beyond scaffold — just get the foundation solid
- Don't spend excessive time on pixel-perfect design — bold direction over polish
- Don't use any external image hosting — use placeholder images or emoji for now
