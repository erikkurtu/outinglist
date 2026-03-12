/**
 * Shared scraper utilities for OutingList
 */

import { createRequire } from 'module'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

// ─── DB Setup ─────────────────────────────────────────────────────────────────

let _db = null

export function getDb() {
  if (_db) return _db
  const require = createRequire(import.meta.url)
  const Database = require('better-sqlite3')
  const dbPath = join(__dirname, '../db/outinglist.db')
  _db = new Database(dbPath)
  _db.pragma('journal_mode = WAL')
  _db.pragma('foreign_keys = ON')
  return _db
}

// ─── Category Mapping ─────────────────────────────────────────────────────────

export const CATEGORY_MAP = {
  // Music
  music: 'cat-01', concert: 'cat-01', 'live music': 'cat-01', band: 'cat-01',
  jazz: 'cat-01', hip: 'cat-01', rap: 'cat-01', rock: 'cat-01', pop: 'cat-01',
  // Food & Drink
  food: 'cat-02', drink: 'cat-02', wine: 'cat-02', beer: 'cat-02', cocktail: 'cat-02',
  restaurant: 'cat-02', dinner: 'cat-02', brunch: 'cat-02', tasting: 'cat-02',
  // Arts & Culture
  art: 'cat-03', culture: 'cat-03', museum: 'cat-03', gallery: 'cat-03',
  exhibit: 'cat-03', film: 'cat-03', movie: 'cat-03', photo: 'cat-03',
  // Sports & Fitness
  sport: 'cat-04', fitness: 'cat-04', yoga: 'cat-04', run: 'cat-04',
  race: 'cat-04', game: 'cat-04', basketball: 'cat-04', soccer: 'cat-04',
  // Nightlife
  nightlife: 'cat-05', club: 'cat-05', party: 'cat-05', dance: 'cat-05', dj: 'cat-05',
  // Family & Kids
  family: 'cat-06', kid: 'cat-06', child: 'cat-06', parent: 'cat-06',
  // Outdoor & Nature
  outdoor: 'cat-07', nature: 'cat-07', hike: 'cat-07', park: 'cat-07', garden: 'cat-07',
  beltline: 'cat-07', trail: 'cat-07',
  // Tech
  tech: 'cat-08', technology: 'cat-08', startup: 'cat-08', code: 'cat-08', ai: 'cat-08',
  // Community & Civic
  community: 'cat-09', civic: 'cat-09', volunteer: 'cat-09', neighborhood: 'cat-09',
  // Workshops
  workshop: 'cat-10', class: 'cat-10', learn: 'cat-10', course: 'cat-10', seminar: 'cat-10',
  // Markets
  market: 'cat-11', 'pop-up': 'cat-11', popup: 'cat-11', vendor: 'cat-11', craft: 'cat-11',
  // Comedy & Theater
  comedy: 'cat-12', theater: 'cat-12', theatre: 'cat-12', improv: 'cat-12', standup: 'cat-12',
  // Festivals
  festival: 'cat-13', fair: 'cat-13', expo: 'cat-13',
  // Networking
  network: 'cat-14', professional: 'cat-14', business: 'cat-14', career: 'cat-14',
  // Wellness
  wellness: 'cat-15', meditation: 'cat-15', spiritual: 'cat-15', mindful: 'cat-15',
  health: 'cat-15',
}

/**
 * Map a string of text to a category ID
 * @param {string} text - title + description + eventbrite category name etc.
 * @returns {string} category ID (defaults to cat-03 Arts & Culture)
 */
export function mapCategory(text) {
  const lower = text.toLowerCase()
  for (const [keyword, catId] of Object.entries(CATEGORY_MAP)) {
    if (lower.includes(keyword)) return catId
  }
  return 'cat-03' // default: Arts & Culture
}

// ─── DB Helpers ───────────────────────────────────────────────────────────────

/**
 * Upsert an event by scraped_id. Returns 'inserted' | 'updated' | 'skipped'
 */
export function upsertEvent(db, event) {
  // Check if event already exists
  const existing = db.prepare('SELECT id FROM events WHERE scraped_id = ?').get(event.scraped_id)

  if (existing) {
    // Update key fields that might have changed
    db.prepare(`
      UPDATE events SET
        title = ?, description = ?, start_at = ?, end_at = ?,
        location_name = ?, location_address = ?, price_min = ?, price_max = ?,
        is_free = ?, image_url = ?, source_url = ?, updated_at = datetime('now')
      WHERE scraped_id = ?
    `).run(
      event.title, event.description, event.start_at, event.end_at,
      event.location_name, event.location_address, event.price_min, event.price_max,
      event.is_free ? 1 : 0, event.image_url, event.source_url,
      event.scraped_id
    )
    return { status: 'updated', id: existing.id }
  } else {
    const id = `evt-scraped-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    db.prepare(`
      INSERT INTO events (
        id, title, description, source_type, source_url, source_platform,
        image_url, start_at, end_at, timezone, location_name, location_address,
        price_min, price_max, is_free, metro, status, scraped_id, created_at, updated_at
      ) VALUES (?, ?, ?, 'scraped', ?, ?, ?, ?, ?, 'America/New_York', ?, ?, ?, ?, ?, 'atlanta', 'active', ?, datetime('now'), datetime('now'))
    `).run(
      id, event.title, event.description, event.source_url, event.source_platform,
      event.image_url, event.start_at, event.end_at,
      event.location_name, event.location_address,
      event.price_min ?? 0, event.price_max ?? 0, event.is_free ? 1 : 0,
      event.scraped_id
    )

    // Link category
    if (event.category_id) {
      try {
        db.prepare('INSERT OR IGNORE INTO event_categories (event_id, category_id) VALUES (?, ?)').run(id, event.category_id)
      } catch (e) {
        // ignore
      }
    }

    return { status: 'inserted', id }
  }
}

/**
 * Log a scraper run to scraper_runs table
 */
export function logScraperRun(db, platform, eventsFound, errors) {
  try {
    db.prepare(`
      INSERT INTO scraper_runs (scraper_name, started_at, events_found, errors, status, platform, ran_at)
      VALUES (?, datetime('now'), ?, ?, 'success', ?, datetime('now'))
    `).run(platform, eventsFound, JSON.stringify(errors), platform)
  } catch (e) {
    console.warn('Could not log scraper run:', e.message)
  }
}

/**
 * Ensure scraper_runs table has all needed columns
 */
export function ensureScraperRunsTable(db) {
  const cols = db.prepare("PRAGMA table_info(scraper_runs)").all().map(c => c.name)
  if (!cols.includes('platform')) {
    try {
      db.prepare("ALTER TABLE scraper_runs ADD COLUMN platform TEXT").run()
    } catch (e) {}
  }
  if (!cols.includes('ran_at')) {
    try {
      db.prepare("ALTER TABLE scraper_runs ADD COLUMN ran_at TEXT").run()
    } catch (e) {}
  }
  if (!cols.includes('errors')) {
    try {
      db.prepare("ALTER TABLE scraper_runs ADD COLUMN errors TEXT").run()
    } catch (e) {}
  }
}

/**
 * Fetch with retries and timeout
 */
export async function fetchWithRetry(url, options = {}, retries = 3) {
  const { timeout = 15000, ...fetchOpts } = options
  let lastErr

  for (let i = 0; i < retries; i++) {
    try {
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), timeout)
      const res = await fetch(url, { ...fetchOpts, signal: controller.signal })
      clearTimeout(timer)
      return res
    } catch (e) {
      lastErr = e
      if (i < retries - 1) {
        await new Promise(r => setTimeout(r, 1000 * (i + 1)))
      }
    }
  }
  throw lastErr
}

/**
 * Parse a price string like "$10", "Free", "$5-$20" → { min, max, is_free }
 */
export function parsePrice(priceStr) {
  if (!priceStr) return { price_min: 0, price_max: 0, is_free: true }
  const lower = priceStr.toLowerCase()
  if (lower.includes('free') || lower === '0') return { price_min: 0, price_max: 0, is_free: true }

  const nums = priceStr.match(/[\d.]+/g)?.map(Number) || []
  if (nums.length === 0) return { price_min: 0, price_max: 0, is_free: true }
  return {
    price_min: Math.min(...nums),
    price_max: Math.max(...nums),
    is_free: false
  }
}

/**
 * Sleep helper
 */
export const sleep = (ms) => new Promise(r => setTimeout(r, ms))
