# OutingList Scraper Sources Research

_Researched: 2026-03-12_

## ✅ BUILT — Active Scrapers

### 1. Eventbrite (`scrapers/eventbrite.js`)
- **URL:** https://www.eventbrite.com/d/ga--atlanta/events/
- **Method:** HTML + LD+JSON structured data (`window.__REACT_QUERY_STATE__` + `<script type="application/ld+json">`)
- **Data quality:** Excellent — full event schema including title, dates, location (with lat/lng), image, price, URL
- **Events/page:** ~28
- **Pages scraped:** 5 (targeting 140+ raw events)
- **Rate limiting:** 1.5s delay between pages, retry logic
- **Notes:** No auth needed. LD+JSON is reliably structured.

### 2. AllEvents.in (`scrapers/allevents.js`)
- **URL:** https://allevents.in/atlanta
- **Method:** HTML + LD+JSON (individual Event blocks per page)
- **Data quality:** Good — title, dates, location, image, offers/price
- **Events/page:** ~56 on page 1
- **Pages scraped:** 4 (targeting 80+ events)
- **Rate limiting:** 2s delay between pages
- **Notes:** Returns 200 with rich data. Multiple LD+JSON blocks per page.

### 3. Meetup.com (`scrapers/meetup.js`)
- **URL:** https://www.meetup.com/find/?location=Atlanta%2C+GA&source=EVENTS
- **Method:** HTML + LD+JSON (Event arrays in page source)
- **Data quality:** Good — title, description, dates, location, URL
- **Events/page:** ~10
- **URLs scraped:** 7 (different category filters)
- **Notes:** Returns LD+JSON events. Many Meetup events are free community events (tech, fitness, social).

---

## ❌ NOT BUILT — Blocked or Insufficient Data

### do404.com
- **Status:** ❌ Connection failed (timeout/block)
- **Notes:** Site did not respond to curl requests. Likely blocks headless scraping or server-side rendering. Could try with browser scraping via OpenClaw browser in future.
- **Verdict:** Skip for now, revisit with browser automation.

### Atlanta Magazine Events (atlantamagazine.com/events/)
- **Status:** ❌ No usable event data
- **Notes:** Returns 200 but events page shows editorial content (articles), not structured events. LD+JSON present but only for articles, not event listings. No event schema found.
- **Verdict:** Not a scrape target. Content is editorial, not listings.

### Creative Loafing Atlanta (creativeloafing.com/events/)
- **Status:** ❌ No LD+JSON event data
- **Notes:** Page returns 200 but only 19KB (likely JS-rendered, no SSR). No structured event data in HTML. Would require full browser automation to access.
- **Verdict:** Future work with browser automation.

### BeltLine Events (beltline.org/events/)
- **Status:** ❌ No structured event data
- **Notes:** Returns 200 (272KB) but no LD+JSON and no parseable event markup. WordPress-based with custom event format requiring deep HTML parsing.
- **Verdict:** Future work — could build a WordPress REST API scraper (`/wp-json/tribe/events/v1/events`).

### Meetup.com API (api.meetup.com)
- **Status:** ❌ API deprecated
- **Notes:** The old REST API returns 404. Meetup deprecated their free API. Web scraping of meetup.com works fine via LD+JSON.
- **Verdict:** Use web scraper (already built above).

---

## 🔮 Future Sources

| Source | Approach | Effort |
|--------|----------|--------|
| BeltLine events | WordPress REST API `/wp-json/tribe/events/v1/events` | Low |
| Creative Loafing | Browser automation (openclaw browser) | Medium |
| do404.com | Browser automation | Medium |
| Instagram (public accounts) | oEmbed API for public posts from known ATL event accounts | High |
| Partiful | Requires auth — not scrapeable | N/A |
| Facebook Events | Deprecated API — not scrapeable | N/A |
| Atlanta.org events | Check for public API or LD+JSON | Low |
| ArtsATL | LD+JSON present on event pages | Low |

---

## Deduplication Strategy

- **Key:** `scraped_id` = `{platform}-{platform_event_id}`
- **On conflict:** UPSERT updates mutable fields (title, description, dates, price, image)
- **Cross-platform:** Same event on both Eventbrite and AllEvents gets two rows (different scraped_ids) — acceptable since they have different URLs
