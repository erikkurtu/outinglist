# SPEC — OutingList.com (Atlanta MVP)
_Generated: 2026-03-11 | Updated after critique_

## What We're Building

OutingList is a web app for discovering and curating local events and activities. Starting with Atlanta (atlanta.outinglist.com). Events come from multiple sources: direct internal listings, external links (Eventbrite, Partiful, etc.), automated scrapers, and user-curated lists. Users can create personal/public lists around any topic, share them, and discover events through robust categorization and filtering.

Bold, opinionated brand — think gumroad.com and wisprflow.ai.

## Stack & Location

- **Frontend:** React + Vite + React Router + Tailwind CSS + shadcn/ui (customized)
- **Backend:** Hono on Cloudflare Workers (or local dev server for MVP)
- **Database:** SQLite (better-sqlite3 for local dev, D1-compatible schema for future deploy)
- **Images:** Local storage for MVP, R2 later
- **Auth:** Clerk (free tier — verified: 10k MAU, roles via metadata, sufficient for MVP)
- **SSR for sharing:** Hono middleware renders OG meta tags for /events/:id and /lists/:id routes — SPA for everything else. Solves the SPA vs. social sharing tension.
- **Repo:** `/Users/shmergle/.openclaw/workspace/outinglist/`
- **Git:** Push to GitHub
- **Domain:** outinglist.com (atlanta.outinglist.com subdomain later)

## Data Model

### events
```sql
CREATE TABLE events (
  id TEXT PRIMARY KEY,          -- nanoid
  title TEXT NOT NULL,
  description TEXT,
  source_type TEXT NOT NULL,    -- 'internal' | 'external' | 'scraped'
  source_url TEXT,              -- original URL for external/scraped events
  source_platform TEXT,         -- 'eventbrite' | 'partiful' | 'allevents' | 'manual' | etc
  image_url TEXT,               -- URL or local path
  start_at TEXT NOT NULL,       -- ISO 8601 in America/New_York
  end_at TEXT,
  timezone TEXT DEFAULT 'America/New_York',
  location_name TEXT,
  location_address TEXT,
  location_lat REAL,
  location_lng REAL,
  price_min REAL,               -- 0 = free
  price_max REAL,
  price_currency TEXT DEFAULT 'USD',
  is_free INTEGER DEFAULT 0,
  is_private INTEGER DEFAULT 0,
  created_by TEXT,              -- clerk user ID (null for scraped)
  metro TEXT DEFAULT 'atlanta', -- future multi-metro support
  status TEXT DEFAULT 'active', -- 'active' | 'cancelled' | 'draft' | 'pending_review'
  scraped_id TEXT UNIQUE,       -- dedup key for scraped events
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);
```

### categories
```sql
CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT,                    -- emoji or icon name
  color TEXT,                   -- hex color
  sort_order INTEGER DEFAULT 0
);
```

### event_categories (many-to-many)
```sql
CREATE TABLE event_categories (
  event_id TEXT REFERENCES events(id) ON DELETE CASCADE,
  category_id TEXT REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (event_id, category_id)
);
```

### lists
```sql
CREATE TABLE lists (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  user_id TEXT NOT NULL,        -- clerk user ID
  is_public INTEGER DEFAULT 0,
  is_curator_list INTEGER DEFAULT 0,
  cover_image_url TEXT,
  metro TEXT DEFAULT 'atlanta',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);
```

### list_events
```sql
CREATE TABLE list_events (
  list_id TEXT REFERENCES lists(id) ON DELETE CASCADE,
  event_id TEXT REFERENCES events(id) ON DELETE CASCADE,
  added_at TEXT DEFAULT (datetime('now')),
  sort_order INTEGER DEFAULT 0,
  PRIMARY KEY (list_id, event_id)
);
```

### likes
```sql
CREATE TABLE likes (
  user_id TEXT NOT NULL,
  target_type TEXT NOT NULL,    -- 'event' | 'list'
  target_id TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  PRIMARY KEY (user_id, target_type, target_id)
);
```

### user_profiles
```sql
CREATE TABLE user_profiles (
  user_id TEXT PRIMARY KEY,     -- clerk user ID
  display_name TEXT,
  bio TEXT,
  is_curator INTEGER DEFAULT 0, -- set manually by admin (DB flag)
  metro TEXT DEFAULT 'atlanta',
  created_at TEXT DEFAULT (datetime('now'))
);
```

**Deduplication strategy:** Scraped events use `scraped_id` (platform-specific ID) as unique key. On insert, UPSERT by scraped_id — update if exists, insert if new. External events linked by URL — check for existing `source_url` before inserting.

**Multi-metro:** Single DB, `metro` column everywhere. Queries always filter by metro. Subdomain routing maps to metro slug.

## Fixed Category Taxonomy (admin-managed, not user-generated)
Music & Concerts, Food & Drink, Arts & Culture, Sports & Fitness, Nightlife & Parties, Family & Kids, Outdoor & Nature, Tech & Innovation, Community & Civic, Workshops & Classes, Markets & Pop-ups, Comedy & Theater, Festivals, Networking & Professional, Wellness & Spirituality

Users can't create categories. Future: user-generated tags layered on top.

## Features — MVP

### Tier 1 (Must Ship)
- Event browse/search/filter page
- Event detail page with full info
- Category browser
- Filters: date range, category, free/paid, time of day
- Text search (LIKE queries for MVP — FTS later)
- Clerk auth: sign up, sign in, sign out
- Create/edit internal events (authed)
- Post external event links (authed) — URL + basic metadata
- Personal lists (private): create, edit, add/remove events
- Public lists: same + visibility toggle + description
- Like events and lists
- Share events and lists: copy link + OG meta tags for social previews
- User profile page: my events, my lists, my likes
- Curator badge on profiles (manual DB flag — no admin UI needed yet)

### Tier 2 (Build if time allows)
- Personal calendar view (month grid showing events from saved lists)
- "Trending" section (most-liked in last 7 days)
- Basic homepage feed: upcoming events, new lists, popular categories

### Deferred to v2
- ❌ Recommendations engine
- ❌ Private events with invitations
- ❌ Public calendars
- ❌ Admin UI
- ❌ Email notifications
- ❌ Native mobile app
- ❌ Flyer/screenshot parsing

## Scrapers

### Build (validated feasible)
- **Eventbrite API** — use their public API (free, 1000 req/hour) instead of HTML scraping. More reliable.
- **allevents.in/atlanta** — public HTML, scrapeable, good event density

### Spike First (may not be feasible)
- **Partiful** — semi-private platform, may yield few public results. Test manually before coding.
- **Instagram** — blocks headless browsers aggressively. Research which Atlanta event accounts post publicly and whether any structured data is extractable. May become a manual curation source instead.

### Additional Sources to Research
- Atlanta Magazine events calendar
- Creative Loafing Atlanta
- do404.com
- Atlanta BeltLine events
- meetup.com (API available)

### Scraper Infrastructure
- Standalone Node.js scripts in `/outinglist/scrapers/`
- Run on Mac mini via launchd plists
- Write to local SQLite DB (same schema)
- Health check: each scraper logs last_run, events_found, errors to `scraper_runs` table
- Dedup on insert via `scraped_id`

## Brand

- **Colors:** Bold primary (coral/orange-red), dark background option, warm accents
- **Typography:** One display font (personality), one body font (readability)
- **Tone:** Friendly, opinionated, local. "Your friend who always knows what's happening."
- **Logo:** Stylized "OL" monogram or simple wordmark
- **Illustrations:** Category icons as custom illustrated set
- **Empty states:** Friendly, never generic ("No events here yet — be the first to add one!")

### Done criteria for brand (replaces "feels polished"):
- [ ] Custom color palette applied consistently (not default Tailwind)
- [ ] Display font + body font chosen and applied
- [ ] Logo or wordmark in header
- [ ] Event cards have distinct visual style
- [ ] At least 3 pages have custom copy (not lorem ipsum)

## Error Handling
- API errors → toast notification with retry option
- Image load failure → category-colored placeholder with icon
- Auth errors → redirect to sign-in with return URL
- Scraper failures → logged to `scraper_runs` table, don't surface to users
- Empty states → friendly message + CTA on every list/search/filter page

## Out of Scope (v1)
- Native mobile app, flyer parsing, chat, payments, multi-metro, email notifications
- Recommendations engine, private events/invitations, public calendars
- Admin UI (curator flags set via direct DB update)
- Recurring events (all events are single-occurrence for MVP)
- Content moderation (low risk at MVP scale — address when needed)

## Done When
1. App runs at localhost, all pages render correctly
2. Clerk auth works: sign up, sign in, sign out
3. Can browse 50+ events by category, filter, search
4. Can create internal events when logged in
5. Can create personal + public lists, add events
6. Can like events and lists
7. Share links generate proper OG previews
8. At least 2 scrapers produce real Atlanta events
9. Custom brand applied: colors, fonts, logo, event card style, custom copy
10. Responsive on mobile viewport
11. Git repo created and pushed to GitHub
12. Rook has launched the app and taken screenshots confirming each criterion above
