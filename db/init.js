#!/usr/bin/env node
import Database from 'better-sqlite3'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dbPath = join(__dirname, 'outinglist.db')

const db = new Database(dbPath)
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

const schema = readFileSync(join(__dirname, 'schema.sql'), 'utf8')
const seed = readFileSync(join(__dirname, 'seed.sql'), 'utf8')

db.exec(schema)
console.log('✅ Schema created')

db.exec(seed)
console.log('✅ Seed data inserted')

const count = db.prepare('SELECT COUNT(*) as n FROM events').get()
const cats = db.prepare('SELECT COUNT(*) as n FROM categories').get()
console.log(`📊 Events: ${count.n}, Categories: ${cats.n}`)

db.close()
console.log('✅ Database ready at', dbPath)
