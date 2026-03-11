# CRITIQUE — OutingList SPEC
_Reviewed: 2026-03-11 | Reviewer: Rook (Senior Architect Mode)_

---

## 1. GAPS — Underspecified decisions that will block implementation

**Data model is completely absent.**
The spec lists features but never defines how events are structured. Critical unresolved questions:
- What's the canonical schema for an event? What fields are required vs. optional?
- How are "internal," "external," and "scraped" events differentiated — separate tables, a `source_type` enum, or a unified model with nullable fields?
- How are duplicate events handled? If Eventbrite scraper and a user both add the same event, what happens?

**Categories/tags taxonomy: undefined.**
"Deep categorization with multiple tags/categories" — but what are the categories? Who defines them? Are they user-generated folksonomy, a fixed taxonomy, or both? This is a UI/UX and DB schema decision that touches nearly every feature (filtering, recommendations, curator lists). It cannot be deferred.

**Recommendations algorithm: pure wishful thinking.**
"Customized auto-recommendations based on history & activity" — this is an entire product feature listed as one bullet. What history? What activity signals? Rules-based or ML? No data collection strategy is defined. This is underspecified to the point of being unbuildable.

**Private events + invitation management: zero detail.**
"Private events with invitation management" is one line. This is actually an entire messaging/auth system: How are invites sent? Email? Link-only? How does an invitee gain access? Does Clerk handle this or does the app? What prevents uninvited users from guessing event IDs? This could double the auth-related implementation time.

**Curator accounts: how are they created?**
"Trusted curator accounts" — trusted by whom? Is this a manual admin operation? A flag in the DB? Is there an admin UI? An apply flow? The spec says what curators can do but not how the system grants or revokes curator status.

**Share links: how do they work?**
"Advanced sharing: tailored for text messages and social media" — what does this mean technically? Pre-generated Open Graph cards? A `/share/:token` route? Short URLs? Dynamic OG meta tags per event? This needs to be specified or the implementer will build something that doesn't match the vision.

**Multi-metro architecture: required but unspecified.**
"Architecture must support future multi-metro expansion" — this constraint has non-trivial schema and routing implications. Does `atlanta.outinglist.com` imply per-metro subdomains with a separate D1 per metro? Or one DB with a `metro` column everywhere? This decision affects the entire data model and needs to be made now.

---

## 2. ASSUMPTIONS — Things baked in that might be wrong

**Instagram scraping assumption is almost certainly wrong.**
"Instagram scraping = identifying public event-focused accounts, not using Instagram API" — Instagram aggressively blocks headless browsers and unauthorized scraping. This is not a minor risk; scraping Instagram without their API will result in IP bans, CAPTCHAs, and broken scrapers within days of launch. The assumption that this is feasible without API access is likely incorrect and should be validated before any scraper work begins.

**Partiful is semi-private by design.**
Partiful events are typically invite-only or unlisted. "Partiful (Atlanta)" as a scraper source assumes there are publicly discoverable Atlanta events on Partiful. This may yield very few results. Validate before building.

**"Scrapers can run without API keys."**
Eventbrite has a public API. Scraping their HTML is possible but fragile — they change markup frequently and have bot detection. Using the Eventbrite API would be more reliable. The assumption that web scraping is preferable to API access should be a decision, not an assumption.

**Clerk free tier: not validated.**
"Clerk free tier is sufficient for MVP" — Clerk free tier has limits on monthly active users and features (organization features, custom domains for auth, etc.). If curator accounts require Clerk "organizations" or roles, that's a paid Clerk feature. Needs verification before building auth flows that depend on it.

**D1 performance assumption untested.**
D1 is SQLite-based and has known limitations for concurrent writes and full-text search. "Robust filtering" and "search with text matching" may require FTS5 extensions or careful indexing. This needs a spike, not an assumption.

---

## 3. RISKS — Most likely to break, fail, or cause rework

**Scraper reliability will be a maintenance tax from day one.**
Scrapers that parse HTML from Eventbrite, allevents.in, and Instagram will break every time those sites update. The spec lists scrapers as a core feature but has no strategy for: monitoring scraper health, alerting on failures, handling schema changes, or deduplication. If scrapers are in scope for MVP, so is a minimal scraper admin/monitoring interface.

**Cloudflare Workers + Vite + React Router: non-trivial deployment.**
This stack combination has real friction. React Router v6+ with SSR on Cloudflare Workers requires specific adapter configuration. Vite's dev server is localhost-only; the Cloudflare Workers runtime differs from Node.js in important ways (no `process`, limited APIs). If the implementer isn't experienced with this exact combination, plan for significant time debugging deployment before a single line of product code.

**OG/social sharing on Cloudflare Workers.**
If share links need dynamic Open Graph tags (they should, for sharing to look good on iMessage and Twitter), this requires server-side rendering of meta tags per event. On pure Cloudflare Workers with a Vite SPA, this is a non-trivial feature — not a one-liner. It may require a separate Workers route that returns HTML with injected meta, separate from the SPA. This is a significant architectural concern that the spec ignores entirely.

**"Done When" criteria #11 is unverifiable.**
"Brand feels distinct and polished (not generic)" — this is a judgment call, not a completion criterion. It will cause scope creep and delay sign-off. It needs to be replaced with specific, verifiable criteria (e.g., "custom logo, 3 distinct brand colors, 2 custom illustration assets, copy reviewed and approved by Erik").

---

## 4. SCOPE CREEP — Features pretending to be one

**"Lists" is actually 3 features.**
Personal lists, public lists, and curator lists are described as one feature but have meaningfully different access control, visibility, discovery, and editing rules. A personal list is a private collection. A public list is a publication. A curator list is an editorial product. Each has its own CRUD surface, permissions model, and UI. Treating them as one feature will produce an underdesigned system.

**"Calendars" is a separate feature, not a view.**
"Personal and public calendars (optionally filtered by saved list)" — a calendar view involves date-range navigation, time-grid or month-grid rendering, iCal export expectations, and timezone handling. This is not a filter variant on the events list; it's a distinct UI component. It's buried as a sub-bullet under User Features.

**"Recommendations" should be cut from MVP.**
"Customized auto-recommendations based on history & activity" requires: activity tracking infrastructure, a recommendation algorithm, enough data to make meaningful recommendations, and UI to surface them. For an MVP with no users yet, this will produce low-quality results and distract from core value. It should be explicitly deferred to v2.

**Private events with invitation management.**
This is a full separate product. It involves: private event creation, an invite flow, access-gated event pages, and likely some notification mechanism (but email is out of scope). These constraints make it nearly unbuildable in MVP. It should either be fully specced or cut.

---

## 5. MISSING PIECES — What the implementer needs to know

**Error states: completely absent.**
What happens when a scraper fails silently? When an event image fails to load from R2? When Clerk auth throws? When D1 returns an error? The spec describes the happy path only. Error states for every major surface need to be defined — even at a high level — or the implementer will make inconsistent choices throughout.

**Image handling: underspecified.**
"R2 (images)" appears in the stack, but: How are event images uploaded? By the user creating an internal event? Scraped from the source? What are the size limits, accepted formats, and fallback for missing images? What does the UI show when there's no image? This affects every event card in the app.

**Timezone handling.**
Atlanta events are in EST/EDT, but the spec never mentions it. D1 stores timestamps as strings or integers — how are they stored and displayed? What happens to recurring events? (Wait, there's no mention of recurring events at all — are they in scope?)

**No admin interface.**
The spec has no admin surface. But the system needs: scraper management, event moderation (spam, bad content), curator account promotion, and likely some way to seed the initial 50 events. Without an admin interface, these all require direct DB writes or CLI scripts. This is a real operational gap.

**Rate limiting and abuse prevention.**
User-created events + public lists = potential spam vector. The spec has no mention of content moderation, rate limits on creation, or any abuse mitigation. For a public web app, this matters from day one.

**SEO strategy: absent.**
For an events discovery product, SEO is arguably more important than recommendations. The spec doesn't mention it. A Vite SPA with no SSR is bad for SEO by default. This is a fundamental architectural tension that needs resolution before building.

**Deployment pipeline: undefined.**
The spec mentions "Builds for Cloudflare Workers deployment" as a "Done When" criterion but gives no detail on how deployment works — GitHub Actions? Manual `wrangler deploy`? The Mac mini scrapers run separately — how are they scheduled? Cron? A process manager?

---

## 6. VERDICT

**This spec is not ready to build from.**

It's a good product brief — it communicates vision clearly and makes reasonable high-level choices. But it is not a build spec. It describes outcomes, not implementations. An implementer following this will make dozens of schema, API, and UX decisions on the fly, many of which will conflict with each other or with Erik's actual intent.

**What must change before building:**

1. **Data model required first.** Define the event schema, the list schema, the user schema, and the curator flag. Every feature depends on this. A schema diagram or even a written field list would unblock 80% of implementation decisions.

2. **Cut or fully spec three features.** Recommendations, private events/invitations, and public calendars should either be cut from MVP or given their own mini-specs with acceptance criteria. As written, they will cause scope thrash.

3. **Validate Instagram and Partiful scrapers before coding them.** Spike these manually (one hour, no code) to confirm public events are discoverable. If they aren't, the scraper list needs to change.

4. **Resolve the SPA vs. SSR tension.** If share links need good OG tags (they do), a pure SPA won't work. Decide now: render meta tags in Workers middleware, add SSR, or accept that sharing will look bad. This decision affects the entire frontend architecture.

5. **Replace criterion #11 with specifics.** "Brand feels polished" is not a shipping criterion. Define what brand deliverables constitute done.

The foundation is solid. The vision is clear. The build spec needs another pass.
