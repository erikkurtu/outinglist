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

// OG meta middleware for /events/:id — must be before SPA catch-all
// Returns HTML with OG tags for social sharing bots
app.get('/share/events/:id', (c) => {
  const { id } = c.req.param()
  const event = db.prepare('SELECT * FROM events WHERE id = ?').get(id)

  if (!event) {
    return c.html(`<!DOCTYPE html><html><head><title>Event Not Found</title></head><body>Not found</body></html>`, 404)
  }

  const categories = db.prepare(`
    SELECT cat.* FROM categories cat
    JOIN event_categories ec ON cat.id = ec.category_id
    WHERE ec.event_id = ?
  `).all(id)

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
  
  <!-- Open Graph -->
  <meta property="og:type" content="event">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${image}">
  <meta property="og:url" content="${url}">
  <meta property="og:site_name" content="OutingList">
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${image}">
  
  <!-- Event structured data -->
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
  
  <!-- Redirect to SPA -->
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

// GET /api/categories
app.get('/api/categories', (c) => {
  const categories = db.prepare(
    'SELECT * FROM categories ORDER BY sort_order ASC'
  ).all()
  return c.json(categories)
})

// Helper: time_of_day to hour ranges (Eastern local time heuristic)
function timeOfDayHours(tod) {
  switch (tod) {
    case 'morning':   return { gte: 6,  lt: 12 }
    case 'afternoon': return { gte: 12, lt: 17 }
    case 'evening':   return { gte: 17, lt: 21 }
    case 'night':     return { gte: 21, lt: 30 } // 30 = past midnight
    default: return null
  }
}

// GET /api/events
app.get('/api/events', (c) => {
  const {
    category,
    search,
    free,
    date_from,
    date_to,
    time_of_day,
    limit = '24',
    offset = '0',
  } = c.req.query()

  let where = ['e.status = ?', 'e.metro = ?']
  let params = ['active', 'atlanta']

  if (free === '1') {
    where.push('e.is_free = 1')
  }

  if (date_from) {
    where.push('e.start_at >= ?')
    params.push(date_from)
  }

  if (date_to) {
    where.push('e.start_at <= ?')
    params.push(date_to + 'T23:59:59')
  }

  if (time_of_day) {
    const range = timeOfDayHours(time_of_day)
    if (range) {
      // Extract local hour from ISO string (position 11-12), e.g. '2026-03-14T18:00:00-05:00' → 18
      if (range.lt <= 24) {
        where.push(`CAST(SUBSTR(e.start_at, 12, 2) AS INTEGER) >= ? AND CAST(SUBSTR(e.start_at, 12, 2) AS INTEGER) < ?`)
        params.push(range.gte, range.lt)
      } else {
        // Night: 21-24 OR 0-6
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
      sql += `
        JOIN event_categories ec ON e.id = ec.event_id
        JOIN categories cat ON ec.category_id = cat.id AND cat.slug IN (${placeholders})`
      params.unshift(...slugs)
    }
  }

  sql += ` WHERE ${where.join(' AND ')} ORDER BY e.start_at ASC LIMIT ? OFFSET ?`
  params.push(parseInt(limit), parseInt(offset))

  const events = db.prepare(sql).all(...params)

  const catStmt = db.prepare(`
    SELECT cat.* FROM categories cat
    JOIN event_categories ec ON cat.id = ec.category_id
    WHERE ec.event_id = ?
    ORDER BY cat.sort_order
  `)

  const enriched = events.map(e => ({
    ...e,
    categories: catStmt.all(e.id),
  }))

  // Count total (without limit/offset)
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

// GET /api/events/:id
app.get('/api/events/:id', (c) => {
  const { id } = c.req.param()
  const event = db.prepare('SELECT * FROM events WHERE id = ?').get(id)

  if (!event) {
    return c.json({ error: 'Not found' }, 404)
  }

  const categories = db.prepare(`
    SELECT cat.* FROM categories cat
    JOIN event_categories ec ON cat.id = ec.category_id
    WHERE ec.event_id = ?
    ORDER BY cat.sort_order
  `).all(id)

  return c.json({ ...event, categories })
})

// POST /api/events
app.post('/api/events', async (c) => {
  const body = await c.req.json()

  const id = nanoid(12)
  const now = new Date().toISOString()

  const stmt = db.prepare(`
    INSERT INTO events (
      id, title, description, source_type, source_url, source_platform,
      image_url, start_at, end_at, location_name, location_address,
      price_min, price_max, is_free, created_by, metro, status,
      created_at, updated_at
    ) VALUES (
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?,
      ?, ?, ?, ?, 'atlanta', 'active',
      ?, ?
    )
  `)

  stmt.run(
    id,
    body.title,
    body.description || null,
    body.source_type || 'internal',
    body.source_url || null,
    body.source_platform || null,
    body.image_url || null,
    body.start_at,
    body.end_at || null,
    body.location_name || null,
    body.location_address || null,
    body.price_min ?? null,
    body.price_max ?? null,
    body.is_free ?? 0,
    body.created_by || null,
    now,
    now
  )

  // Handle categories
  if (body.category_ids && Array.isArray(body.category_ids)) {
    const insertCat = db.prepare('INSERT OR IGNORE INTO event_categories (event_id, category_id) VALUES (?, ?)')
    for (const catId of body.category_ids) {
      insertCat.run(id, catId)
    }
  }

  const event = db.prepare('SELECT * FROM events WHERE id = ?').get(id)
  const categories = db.prepare(`
    SELECT cat.* FROM categories cat
    JOIN event_categories ec ON cat.id = ec.category_id
    WHERE ec.event_id = ?
  `).all(id)

  return c.json({ ...event, categories }, 201)
})

// POST /api/likes
app.post('/api/likes', async (c) => {
  const body = await c.req.json()
  const { user_id, target_type, target_id } = body

  if (!user_id || !target_type || !target_id) {
    return c.json({ error: 'Missing fields' }, 400)
  }

  const existing = db.prepare(
    'SELECT * FROM likes WHERE user_id = ? AND target_type = ? AND target_id = ?'
  ).get(user_id, target_type, target_id)

  if (existing) {
    db.prepare(
      'DELETE FROM likes WHERE user_id = ? AND target_type = ? AND target_id = ?'
    ).run(user_id, target_type, target_id)
    return c.json({ liked: false })
  } else {
    db.prepare(
      'INSERT INTO likes (user_id, target_type, target_id) VALUES (?, ?, ?)'
    ).run(user_id, target_type, target_id)
    return c.json({ liked: true })
  }
})

// GET /api/likes/:target_type/:target_id — count + user status
app.get('/api/likes/:target_type/:target_id', (c) => {
  const { target_type, target_id } = c.req.param()
  const { user_id } = c.req.query()

  const { n: count } = db.prepare(
    'SELECT COUNT(*) as n FROM likes WHERE target_type = ? AND target_id = ?'
  ).get(target_type, target_id)

  let liked = false
  if (user_id) {
    const row = db.prepare(
      'SELECT 1 FROM likes WHERE user_id = ? AND target_type = ? AND target_id = ?'
    ).get(user_id, target_type, target_id)
    liked = !!row
  }

  return c.json({ count, liked })
})

const port = 3001
serve({ fetch: app.fetch, port }, () => {
  console.log(`🚀 OutingList API running on http://localhost:${port}`)
})
