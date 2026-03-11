# Statement of Work — OutingList.com (Atlanta MVP)
_Created: 2026-03-11 | Updated after critique_

## Stages (5 total — scope tightened after critique)

### Stage 1 — Foundation (scaffold, brand, auth, DB, routing)
1. Init Vite + React + TypeScript + Tailwind + shadcn/ui
2. Design brand: color palette, fonts, CSS variables, logo concept
3. Build component library: Button, Card, Input, Modal, Badge, Nav, EventCard, Layout
4. Clerk auth integration: sign up, sign in, sign out, protected routes
5. SQLite database setup (better-sqlite3): all tables from SPEC data model
6. Seed: 15 categories, 20 sample Atlanta events
7. Hono API server: GET /api/events, GET /api/categories, health check
8. React Router: all planned routes (home, browse, event detail, lists, profile, auth)
9. Git init + push to GitHub
10. Launch dev server, take screenshot confirming app loads with brand

### Stage 2 — Event Core (browse, detail, create, filter, search)
1. Event browse page: grid of EventCards, pagination
2. Category browser sidebar/header
3. Filter bar: date range, category, free/paid, time of day
4. Text search (LIKE queries)
5. Event detail page: full info, image, map placeholder, category tags, like button, share
6. Event creation form (authed): title, description, date, location, category, image URL
7. External event posting: URL input + metadata extraction
8. OG meta tag middleware in Hono for /events/:id sharing
9. Seed 30 more varied Atlanta events
10. Launch, screenshot: browse page, detail page, filters working, event creation

### Stage 3 — Lists, Likes, Sharing, Profile
1. List creation: title, description, public/private toggle
2. Add/remove events from lists
3. List detail page: description + event cards
4. My Lists page
5. Like/unlike events (heart on cards, persisted)
6. Like/unlike lists
7. Share button: copy link for events and lists
8. User profile page: my events, my lists, my likes
9. Curator badge display (manual DB flag)
10. OG meta for /lists/:id
11. Launch, screenshot: list created, likes working, share link, profile page

### Stage 4 — Scrapers
1. Scraper framework: shared utils (fetch, parse, dedup, DB write, health logging)
2. scraper_runs table for health tracking
3. Eventbrite API scraper (Atlanta metro events)
4. allevents.in/atlanta HTML scraper
5. Manual spike: test Partiful + Instagram feasibility, document findings
6. Research 5 additional Atlanta sources, document in scraper-sources.md
7. Launchd plist for periodic scraping
8. Run scrapers, confirm events appear in app
9. Launch, screenshot: scraped events visible in browse, 50+ total events

### Stage 5 — Polish, Homepage, QA, Deploy Prep
1. Homepage: hero section, upcoming events, popular categories, new lists
2. Trending section (most-liked last 7 days) if data supports it
3. Full responsive pass: mobile, tablet, desktop
4. Loading states, error states, empty states for every page
5. Custom copy throughout (not placeholder text)
6. SEO: meta tags, sitemap concept
7. Performance: lazy loading images, code splitting routes
8. Cloudflare Workers wrangler.toml (deploy-ready config)
9. Full QA: every page, every feature, browser screenshots as evidence
10. Final git commit + push
11. MC project update: vision, status, next steps

## Execution
- Each stage = Option C cron (isolated session, 2hr timeout, sonnet model)
- Each stage posts progress to #outinglist (channel:1480347402576859147)
- Each stage ends with dev server launch + browser screenshots
- Stage N completion message includes "ready for Stage N+1" signal
- I (Rook) review screenshots and fire next stage

## Risk Mitigation
- Clerk issues → mock auth with local user store
- SQLite FTS needed → add FTS5 index in Stage 2 if LIKE is too slow
- Scraper anti-bot → use Mac mini browser (profile="openclaw")
- Stage timeout → progress saved in .rook/PROGRESS.md, next run continues
