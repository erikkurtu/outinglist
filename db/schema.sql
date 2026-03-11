-- OutingList SQLite Schema
-- Compatible with Cloudflare D1

CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  source_type TEXT NOT NULL DEFAULT 'internal',
  source_url TEXT,
  source_platform TEXT,
  image_url TEXT,
  start_at TEXT NOT NULL,
  end_at TEXT,
  timezone TEXT DEFAULT 'America/New_York',
  location_name TEXT,
  location_address TEXT,
  location_lat REAL,
  location_lng REAL,
  price_min REAL,
  price_max REAL,
  price_currency TEXT DEFAULT 'USD',
  is_free INTEGER DEFAULT 0,
  is_private INTEGER DEFAULT 0,
  created_by TEXT,
  metro TEXT DEFAULT 'atlanta',
  status TEXT DEFAULT 'active',
  scraped_id TEXT UNIQUE,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT,
  color TEXT,
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS event_categories (
  event_id TEXT REFERENCES events(id) ON DELETE CASCADE,
  category_id TEXT REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (event_id, category_id)
);

CREATE TABLE IF NOT EXISTS lists (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  user_id TEXT NOT NULL,
  is_public INTEGER DEFAULT 0,
  is_curator_list INTEGER DEFAULT 0,
  cover_image_url TEXT,
  metro TEXT DEFAULT 'atlanta',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS list_events (
  list_id TEXT REFERENCES lists(id) ON DELETE CASCADE,
  event_id TEXT REFERENCES events(id) ON DELETE CASCADE,
  added_at TEXT DEFAULT (datetime('now')),
  sort_order INTEGER DEFAULT 0,
  PRIMARY KEY (list_id, event_id)
);

CREATE TABLE IF NOT EXISTS likes (
  user_id TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  PRIMARY KEY (user_id, target_type, target_id)
);

CREATE TABLE IF NOT EXISTS user_profiles (
  user_id TEXT PRIMARY KEY,
  display_name TEXT,
  bio TEXT,
  is_curator INTEGER DEFAULT 0,
  metro TEXT DEFAULT 'atlanta',
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS scraper_runs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  scraper_name TEXT NOT NULL,
  started_at TEXT NOT NULL,
  finished_at TEXT,
  events_found INTEGER DEFAULT 0,
  events_inserted INTEGER DEFAULT 0,
  errors TEXT,
  status TEXT DEFAULT 'running'
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_events_start_at ON events(start_at);
CREATE INDEX IF NOT EXISTS idx_events_metro ON events(metro);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_is_free ON events(is_free);
CREATE INDEX IF NOT EXISTS idx_event_categories_category ON event_categories(category_id);
CREATE INDEX IF NOT EXISTS idx_lists_user ON lists(user_id);
CREATE INDEX IF NOT EXISTS idx_likes_target ON likes(target_type, target_id);
