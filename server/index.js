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

// GET /api/categories
app.get('/api/categories', (c) => {
  const categories = db.prepare(
    'SELECT * FROM categories ORDER BY sort_order ASC'
  ).all()
  return c.json(categories)
})

// GET /api/events
app.get('/api/events', (c) => {
  const { category, search, free, from, to, limit = '50', offset = '0' } = c.req.query()

  let where = ['e.status = ?', 'e.metro = ?']
  let params = ['active', 'atlanta']

  if (free === '1') {
    where.push('e.is_free = 1')
  }

  if (from) {
    where.push('e.start_at >= ?')
    params.push(from)
  }

  if (to) {
    where.push('e.start_at <= ?')
    params.push(to)
  }

  if (search) {
    where.push('(e.title LIKE ? OR e.description LIKE ? OR e.location_name LIKE ?)')
    const q = `%${search}%`
    params.push(q, q, q)
  }

  let sql = `
    SELECT DISTINCT e.*
    FROM events e
  `

  if (category) {
    sql += `
      JOIN event_categories ec ON e.id = ec.event_id
      JOIN categories cat ON ec.category_id = cat.id AND cat.slug = ?
    `
    params.unshift(category)
  }

  sql += ` WHERE ${where.join(' AND ')} ORDER BY e.start_at ASC LIMIT ? OFFSET ?`
  params.push(parseInt(limit), parseInt(offset))

  const events = db.prepare(sql).all(...params)

  // Attach categories to each event
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

  // Count total
  let countSql = `SELECT COUNT(DISTINCT e.id) as n FROM events e`
  if (category) {
    countSql += ` JOIN event_categories ec ON e.id = ec.event_id JOIN categories cat ON ec.category_id = cat.id AND cat.slug = ?`
  }
  countSql += ` WHERE ${where.join(' AND ')}`

  // Remove limit/offset from params for count
  const countParams = params.slice(0, -2)
  const { n: total } = db.prepare(countSql).get(...countParams)

  return c.json({ events: enriched, total })
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
      id, title, description, source_type, source_url,
      start_at, end_at, location_name, location_address,
      price_min, price_max, is_free, created_by, metro, status,
      created_at, updated_at
    ) VALUES (
      ?, ?, ?, ?, ?,
      ?, ?, ?, ?,
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

  const event = db.prepare('SELECT * FROM events WHERE id = ?').get(id)
  return c.json(event, 201)
})

const port = 3001
serve({ fetch: app.fetch, port }, () => {
  console.log(`🚀 OutingList API running on http://localhost:${port}`)
})
