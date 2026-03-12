import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { cors } from 'hono/cors'
import Database from 'better-sqlite3'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { nanoid } from 'nanoid'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dbPath = join(__dirname, '../db/outinglist.db')

const db = new Database(dbPath)
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

const app = new Hono()

app.use('*', cors({
  origin: ['http://localhost:5173', 'http://localhost:4173'],
  allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))

// ─── OG Meta: /share/events/:id ───────────────────────────────────────────────
app.get('/share/events/:id', (c) => {
  const { id } = c.req.param()
  const event = db.prepare('SELECT * FROM events WHERE id = ?').get(id)

  if (!event) {
    return c.html(`<!DOCTYPE html><html><head><title>Event Not Found</title></head><body>Not found</body></html>`, 404)
  }

  const title = event.title
  const description = event.description
    ? event.description.substring(0, 160)
    : `${event.location_name ? event.location_name + ' · ' : ''}Check out this event on OutingList`
  const image = event.image_url || 'https://outinglist.com/og-default.png'
  const url = `https://outinglist.com/events/${id}`

  const dateStr = event.start_at
    ? new Date(event.start_at).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
    : ''

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} — OutingList</title>
  <meta name="description" content="${description}">
  <meta property="og:type" content="event">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${image}">
  <meta property="og:url" content="${url}">
  <meta property="og:site_name" content="OutingList">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${image}">
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": "${title}",
    "description": "${description}",
    "startDate": "${event.start_at}",
    ${event.end_at ? `"endDate": "${event.end_at}",` : ''}
    "location": {
      "@type": "Place",
      "name": "${event.location_name || 'Atlanta, GA'}",
      "address": "${event.location_address || 'Atlanta, GA'}"
    }
  }
  </script>
  <meta http-equiv="refresh" content="0;url=/events/${id}">
</head>
<body>
  <p>Redirecting to <a href="/events/${id}">${title}</a>...</p>
  <p>${dateStr}</p>
  ${event.location_name ? `<p>📍 ${event.location_name}</p>` : ''}
</body>
</html>`

  return c.html(html)
})

// ─── OG Meta: /share/lists/:id ────────────────────────────────────────────────
app.get('/share/lists/:id', (c) => {
  const { id } = c.req.param()
  const list = db.prepare('SELECT * FROM lists WHERE id = ?').get(id)

  if (!list) {
    return c.html(`<!DOCTYPE html><html><head><title>List Not Found</title></head><body>Not found</body></html>`, 404)
  }

  const eventCount = db.prepare('SELECT COUNT(*) as n FROM list_events WHERE list_id = ?').get(id)
  const title = list.title
  const description = list.description
    ? list.description.substring(0, 160)
    : `A curated list of ${eventCount.n} Atlanta events on OutingList`
  const image = list.cover_image_url || 'https://outinglist.com/og-default.png'
  const url = `https://outinglist.com/lists/${id}`

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} — OutingList</title>
  <meta name="description" content="${description}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${image}">
  <meta property="og:url" content="${url}">
  <meta property="og:site_name" content="OutingList">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${image}">
  <meta http-equiv="refresh" content="0;url=/lists/${id}">
</head>
<body>
  <p>Redirecting to <a href="/lists/${id}">${title}</a>...</p>
  <p>${description}</p>
</body>
</html>`

  return c.html(html)
})

// ─── Categories ───────────────────────────────────────────────────────────────
app.get('/api/categories', (c) => {
  const categories = db.prepare('SELECT * FROM categories ORDER BY sort_order ASC').all()
  return c.json(categories)
})

// ─── Helper ───────────────────────────────────────────────────────────────────
function timeOfDayHours(tod) {
  switch (tod) {
    case 'morning':   return { gte: 6,  lt: 12 }
    case 'afternoon': return { gte: 12, lt: 17 }
    case 'evening':   return { gte: 17, lt: 21 }
    case 'night':     return { gte: 21, lt: 30 }
    default: return null
  }
}

// ─── Events ───────────────────────────────────────────────────────────────────
app.get('/api/events', (c) => {
  const {
    category, search, free, date_from, date_to, time_of_day,
    limit = '24', offset = '0',
  } = c.req.query()

  let where = ['e.status = ?', 'e.metro = ?']
  let params = ['active', 'atlanta']

  if (free === '1') where.push('e.is_free = 1')
  if (date_from) { where.push('e.start_at >= ?'); params.push(date_from) }
  if (date_to) { where.push('e.start_at <= ?'); params.push(date_to + 'T23:59:59') }

  if (time_of_day) {
    const range = timeOfDayHours(time_of_day)
    if (range) {
      if (range.lt <= 24) {
        where.push(`CAST(SUBSTR(e.start_at, 12, 2) AS INTEGER) >= ? AND CAST(SUBSTR(e.start_at, 12, 2) AS INTEGER) < ?`)
        params.push(range.gte, range.lt)
      } else {
        where.push(`(CAST(SUBSTR(e.start_at, 12, 2) AS INTEGER) >= ? OR CAST(SUBSTR(e.start_at, 12, 2) AS INTEGER) < ?)`)
        params.push(range.gte, 6)
      }
    }
  }

  if (search) {
    where.push('(e.title LIKE ? OR e.description LIKE ? OR e.location_name LIKE ?)')
    const q = `%${search}%`
    params.push(q, q, q)
  }

  let sql = `SELECT DISTINCT e.* FROM events e`

  if (category) {
    const slugs = category.split(',').map(s => s.trim()).filter(Boolean)
    if (slugs.length > 0) {
      const placeholders = slugs.map(() => '?').join(',')
      sql += ` JOIN event_categories ec ON e.id = ec.event_id JOIN categories cat ON ec.category_id = cat.id AND cat.slug IN (${placeholders})`
      params.unshift(...slugs)
    }
  }

  sql += ` WHERE ${where.join(' AND ')} ORDER BY e.start_at ASC LIMIT ? OFFSET ?`
  params.push(parseInt(limit), parseInt(offset))

  const events = db.prepare(sql).all(...params)
  const catStmt = db.prepare(`SELECT cat.* FROM categories cat JOIN event_categories ec ON cat.id = ec.category_id WHERE ec.event_id = ? ORDER BY cat.sort_order`)
  const enriched = events.map(e => ({ ...e, categories: catStmt.all(e.id) }))

  let countSql = `SELECT COUNT(DISTINCT e.id) as n FROM events e`
  if (category) {
    const slugs = category.split(',').map(s => s.trim()).filter(Boolean)
    if (slugs.length > 0) {
      const placeholders = slugs.map(() => '?').join(',')
      countSql += ` JOIN event_categories ec ON e.id = ec.event_id JOIN categories cat ON ec.category_id = cat.id AND cat.slug IN (${placeholders})`
    }
  }
  countSql += ` WHERE ${where.join(' AND ')}`
  const countParams = params.slice(0, -2)
  const { n: total } = db.prepare(countSql).get(...countParams)

  return c.json({ events: enriched, total, limit: parseInt(limit), offset: parseInt(offset) })
})

app.get('/api/events/:id', (c) => {
  const { id } = c.req.param()
  const event = db.prepare('SELECT * FROM events WHERE id = ?').get(id)
  if (!event) return c.json({ error: 'Not found' }, 404)

  const categories = db.prepare(`SELECT cat.* FROM categories cat JOIN event_categories ec ON cat.id = ec.category_id WHERE ec.event_id = ? ORDER BY cat.sort_order`).all(id)
  return c.json({ ...event, categories })
})

app.post('/api/events', async (c) => {
  const body = await c.req.json()
  const id = nanoid(12)
  const now = new Date().toISOString()

  db.prepare(`INSERT INTO events (id, title, description, source_type, source_url, source_platform, image_url, start_at, end_at, location_name, location_address, price_min, price_max, is_free, created_by, metro, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'atlanta', 'active', ?, ?)`).run(
    id, body.title, body.description || null, body.source_type || 'internal',
    body.source_url || null, body.source_platform || null, body.image_url || null,
    body.start_at, body.end_at || null, body.location_name || null, body.location_address || null,
    body.price_min ?? null, body.price_max ?? null, body.is_free ?? 0,
    body.created_by || null, now, now
  )

  if (body.category_ids && Array.isArray(body.category_ids)) {
    const insertCat = db.prepare('INSERT OR IGNORE INTO event_categories (event_id, category_id) VALUES (?, ?)')
    for (const catId of body.category_ids) insertCat.run(id, catId)
  }

  const event = db.prepare('SELECT * FROM events WHERE id = ?').get(id)
  const categories = db.prepare(`SELECT cat.* FROM categories cat JOIN event_categories ec ON cat.id = ec.category_id WHERE ec.event_id = ?`).all(id)
  return c.json({ ...event, categories }, 201)
})

// ─── Likes ────────────────────────────────────────────────────────────────────
app.post('/api/likes', async (c) => {
  const body = await c.req.json()
  const { user_id, target_type, target_id } = body

  if (!user_id || !target_type || !target_id) return c.json({ error: 'Missing fields' }, 400)

  const existing = db.prepare('SELECT * FROM likes WHERE user_id = ? AND target_type = ? AND target_id = ?').get(user_id, target_type, target_id)

  if (existing) {
    db.prepare('DELETE FROM likes WHERE user_id = ? AND target_type = ? AND target_id = ?').run(user_id, target_type, target_id)
    return c.json({ liked: false })
  } else {
    db.prepare('INSERT INTO likes (user_id, target_type, target_id) VALUES (?, ?, ?)').run(user_id, target_type, target_id)
    return c.json({ liked: true })
  }
})

app.get('/api/likes/:target_type/:target_id', (c) => {
  const { target_type, target_id } = c.req.param()
  const { user_id } = c.req.query()

  const { n: count } = db.prepare('SELECT COUNT(*) as n FROM likes WHERE target_type = ? AND target_id = ?').get(target_type, target_id)

  let liked = false
  if (user_id) {
    const row = db.prepare('SELECT 1 FROM likes WHERE user_id = ? AND target_type = ? AND target_id = ?').get(user_id, target_type, target_id)
    liked = !!row
  }

  return c.json({ count, liked })
})

// GET /api/likes/check?user_id=&target_type=&target_id=
app.get('/api/likes/check', (c) => {
  const { user_id, target_type, target_id } = c.req.query()
  if (!user_id || !target_type || !target_id) return c.json({ liked: false })

  const row = db.prepare('SELECT 1 FROM likes WHERE user_id = ? AND target_type = ? AND target_id = ?').get(user_id, target_type, target_id)
  return c.json({ liked: !!row })
})

// ─── Lists ────────────────────────────────────────────────────────────────────
// POST /api/lists — create list
app.post('/api/lists', async (c) => {
  const body = await c.req.json()
  const { user_id, title, description, is_public, cover_image_url } = body

  if (!user_id || !title) return c.json({ error: 'user_id and title required' }, 400)

  const id = nanoid(12)
  const now = new Date().toISOString()

  db.prepare(`INSERT INTO lists (id, title, description, user_id, is_public, cover_image_url, metro, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, 'atlanta', ?, ?)`).run(
    id, title, description || null, user_id, is_public ? 1 : 0, cover_image_url || null, now, now
  )

  const list = db.prepare('SELECT * FROM lists WHERE id = ?').get(id)
  return c.json(list, 201)
})

// GET /api/lists — user's lists (auth required via query param)
app.get('/api/lists', (c) => {
  const { user_id } = c.req.query()
  if (!user_id) return c.json({ error: 'user_id required' }, 400)

  const lists = db.prepare('SELECT * FROM lists WHERE user_id = ? ORDER BY created_at DESC').all(user_id)

  const enriched = lists.map(list => {
    const { n: event_count } = db.prepare('SELECT COUNT(*) as n FROM list_events WHERE list_id = ?').get(list.id)
    const preview_events = db.prepare(`
      SELECT e.id, e.title, e.image_url, e.start_at FROM events e
      JOIN list_events le ON e.id = le.event_id
      WHERE le.list_id = ?
      ORDER BY le.added_at DESC
      LIMIT 4
    `).all(list.id)
    const { n: like_count } = db.prepare("SELECT COUNT(*) as n FROM likes WHERE target_type = 'list' AND target_id = ?").get(list.id)
    return { ...list, event_count, preview_events, like_count }
  })

  return c.json(enriched)
})

// GET /api/lists/:id — list detail with events
app.get('/api/lists/:id', (c) => {
  const { id } = c.req.param()
  const { user_id } = c.req.query()

  const list = db.prepare('SELECT * FROM lists WHERE id = ?').get(id)
  if (!list) return c.json({ error: 'Not found' }, 404)

  // Only allow private list access to owner
  if (!list.is_public && list.user_id !== user_id) {
    return c.json({ error: 'Forbidden' }, 403)
  }

  const events = db.prepare(`
    SELECT e.* FROM events e
    JOIN list_events le ON e.id = le.event_id
    WHERE le.list_id = ?
    ORDER BY le.sort_order ASC, le.added_at DESC
  `).all(id)

  const catStmt = db.prepare(`SELECT cat.* FROM categories cat JOIN event_categories ec ON cat.id = ec.category_id WHERE ec.event_id = ? ORDER BY cat.sort_order`)
  const enrichedEvents = events.map(e => ({ ...e, categories: catStmt.all(e.id) }))

  const { n: like_count } = db.prepare("SELECT COUNT(*) as n FROM likes WHERE target_type = 'list' AND target_id = ?").get(id)

  let liked = false
  if (user_id) {
    const row = db.prepare("SELECT 1 FROM likes WHERE user_id = ? AND target_type = 'list' AND target_id = ?").get(user_id, id)
    liked = !!row
  }

  // Owner info from user_profiles
  const profile = db.prepare('SELECT * FROM user_profiles WHERE user_id = ?').get(list.user_id)

  return c.json({ ...list, events: enrichedEvents, like_count, liked, profile: profile || null })
})

// PUT /api/lists/:id
app.put('/api/lists/:id', async (c) => {
  const { id } = c.req.param()
  const body = await c.req.json()

  const list = db.prepare('SELECT * FROM lists WHERE id = ?').get(id)
  if (!list) return c.json({ error: 'Not found' }, 404)
  if (list.user_id !== body.user_id) return c.json({ error: 'Forbidden' }, 403)

  const now = new Date().toISOString()
  db.prepare('UPDATE lists SET title = ?, description = ?, is_public = ?, cover_image_url = ?, updated_at = ? WHERE id = ?').run(
    body.title ?? list.title,
    body.description ?? list.description,
    body.is_public !== undefined ? (body.is_public ? 1 : 0) : list.is_public,
    body.cover_image_url ?? list.cover_image_url,
    now, id
  )

  return c.json(db.prepare('SELECT * FROM lists WHERE id = ?').get(id))
})

// DELETE /api/lists/:id
app.delete('/api/lists/:id', async (c) => {
  const { id } = c.req.param()
  const body = await c.req.json()

  const list = db.prepare('SELECT * FROM lists WHERE id = ?').get(id)
  if (!list) return c.json({ error: 'Not found' }, 404)
  if (list.user_id !== body.user_id) return c.json({ error: 'Forbidden' }, 403)

  db.prepare('DELETE FROM lists WHERE id = ?').run(id)
  return c.json({ ok: true })
})

// POST /api/lists/:id/events — add event to list
app.post('/api/lists/:id/events', async (c) => {
  const { id: list_id } = c.req.param()
  const body = await c.req.json()
  const { event_id, user_id } = body

  const list = db.prepare('SELECT * FROM lists WHERE id = ?').get(list_id)
  if (!list) return c.json({ error: 'List not found' }, 404)
  if (list.user_id !== user_id) return c.json({ error: 'Forbidden' }, 403)

  const event = db.prepare('SELECT * FROM events WHERE id = ?').get(event_id)
  if (!event) return c.json({ error: 'Event not found' }, 404)

  const now = new Date().toISOString()
  db.prepare('INSERT OR IGNORE INTO list_events (list_id, event_id, added_at) VALUES (?, ?, ?)').run(list_id, event_id, now)

  return c.json({ ok: true })
})

// DELETE /api/lists/:id/events/:eventId
app.delete('/api/lists/:id/events/:eventId', async (c) => {
  const { id: list_id, eventId: event_id } = c.req.param()
  const body = await c.req.json()
  const { user_id } = body

  const list = db.prepare('SELECT * FROM lists WHERE id = ?').get(list_id)
  if (!list) return c.json({ error: 'Not found' }, 404)
  if (list.user_id !== user_id) return c.json({ error: 'Forbidden' }, 403)

  db.prepare('DELETE FROM list_events WHERE list_id = ? AND event_id = ?').run(list_id, event_id)
  return c.json({ ok: true })
})

// ─── User Profiles ────────────────────────────────────────────────────────────
// GET /api/users/:id/profile
app.get('/api/users/:id/profile', (c) => {
  const { id } = c.req.param()

  let profile = db.prepare('SELECT * FROM user_profiles WHERE user_id = ?').get(id)

  // If no profile exists, return minimal data
  if (!profile) {
    profile = { user_id: id, display_name: null, bio: null, is_curator: 0, metro: 'atlanta' }
  }

  const { n: event_count } = db.prepare("SELECT COUNT(*) as n FROM events WHERE created_by = ? AND status = 'active'").get(id)
  const { n: list_count } = db.prepare('SELECT COUNT(*) as n FROM lists WHERE user_id = ?').get(id)
  const { n: like_count } = db.prepare('SELECT COUNT(*) as n FROM likes WHERE user_id = ?').get(id)

  const public_lists = db.prepare(`
    SELECT l.*, (SELECT COUNT(*) FROM list_events le WHERE le.list_id = l.id) as event_count
    FROM lists l WHERE l.user_id = ? AND l.is_public = 1 ORDER BY l.created_at DESC
  `).all(id)

  const liked_events = db.prepare(`
    SELECT e.* FROM events e
    JOIN likes lk ON e.id = lk.target_id AND lk.target_type = 'event'
    WHERE lk.user_id = ? AND e.status = 'active'
    ORDER BY lk.created_at DESC LIMIT 12
  `).all(id)

  const catStmt = db.prepare(`SELECT cat.* FROM categories cat JOIN event_categories ec ON cat.id = ec.category_id WHERE ec.event_id = ? ORDER BY cat.sort_order`)
  const liked_events_enriched = liked_events.map(e => ({ ...e, categories: catStmt.all(e.id) }))

  const my_events = db.prepare(`SELECT e.* FROM events e WHERE e.created_by = ? AND e.status = 'active' ORDER BY e.created_at DESC LIMIT 12`).all(id)
  const my_events_enriched = my_events.map(e => ({ ...e, categories: catStmt.all(e.id) }))

  return c.json({
    ...profile,
    stats: { event_count, list_count, like_count },
    public_lists,
    liked_events: liked_events_enriched,
    my_events: my_events_enriched,
  })
})

// PUT /api/users/:id/profile
app.put('/api/users/:id/profile', async (c) => {
  const { id } = c.req.param()
  const body = await c.req.json()

  if (body.user_id && body.user_id !== id) return c.json({ error: 'Forbidden' }, 403)

  const now = new Date().toISOString()
  db.prepare(`INSERT INTO user_profiles (user_id, display_name, bio, metro, created_at)
    VALUES (?, ?, ?, 'atlanta', ?)
    ON CONFLICT(user_id) DO UPDATE SET display_name = excluded.display_name, bio = excluded.bio`
  ).run(id, body.display_name || null, body.bio || null, now)

  return c.json(db.prepare('SELECT * FROM user_profiles WHERE user_id = ?').get(id))
})

const port = 3001
serve({ fetch: app.fetch, port }, () => {
  console.log(`🚀 OutingList API running on http://localhost:${port}`)
})
