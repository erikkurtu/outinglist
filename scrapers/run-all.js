/**
 * OutingList — Run All Scrapers
 * Runs all scrapers in sequence, logs results, exits with error code on failure
 *
 * Usage: node scrapers/run-all.js
 */

import { runEventbriteScraper } from './eventbrite.js'
import { runAlleventsScraper } from './allevents.js'
import { runMeetupScraper } from './meetup.js'
import { getDb } from './utils.js'

const START = Date.now()

function printSection(title) {
  console.log('\n' + '═'.repeat(60))
  console.log(`  ${title}`)
  console.log('═'.repeat(60))
}

async function runAll() {
  printSection('OutingList Scraper Runner — Starting')
  console.log(`Time: ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })}`)

  const results = []
  const allErrors = []

  // 1. Eventbrite
  try {
    printSection('1/3 — Eventbrite')
    const r = await runEventbriteScraper()
    results.push(r)
    allErrors.push(...r.errors)
  } catch (e) {
    console.error('Eventbrite scraper CRASHED:', e.message)
    results.push({ platform: 'eventbrite', inserted: 0, updated: 0, errors: [{ fatal: e.message }] })
  }

  // 2. AllEvents.in
  try {
    printSection('2/3 — AllEvents.in')
    const r = await runAlleventsScraper()
    results.push(r)
    allErrors.push(...r.errors)
  } catch (e) {
    console.error('AllEvents scraper CRASHED:', e.message)
    results.push({ platform: 'allevents', inserted: 0, updated: 0, errors: [{ fatal: e.message }] })
  }

  // 3. Meetup.com
  try {
    printSection('3/3 — Meetup.com')
    const r = await runMeetupScraper()
    results.push(r)
    allErrors.push(...r.errors)
  } catch (e) {
    console.error('Meetup scraper CRASHED:', e.message)
    results.push({ platform: 'meetup', inserted: 0, updated: 0, errors: [{ fatal: e.message }] })
  }

  // Summary
  printSection('Summary')

  const totalInserted = results.reduce((s, r) => s + r.inserted, 0)
  const totalUpdated = results.reduce((s, r) => s + r.updated, 0)
  const elapsed = ((Date.now() - START) / 1000).toFixed(1)

  console.log('\n📊 Results by platform:')
  for (const r of results) {
    const status = r.inserted + r.updated > 0 ? '✅' : '⚠️'
    console.log(`  ${status} ${r.platform.padEnd(12)} — ${r.inserted} new, ${r.updated} updated, ${r.errors.length} errors`)
  }

  console.log(`\n🎯 Total: ${totalInserted} new events, ${totalUpdated} updated`)

  // Check DB for total scraped event count
  try {
    const db = getDb()
    const total = db.prepare("SELECT count(*) as c FROM events WHERE source_type = 'scraped'").get()
    const byPlatform = db.prepare("SELECT source_platform, count(*) as c FROM events WHERE source_type = 'scraped' GROUP BY source_platform").all()
    console.log(`\n📦 DB scraped events total: ${total.c}`)
    for (const row of byPlatform) {
      console.log(`   ${row.source_platform}: ${row.c}`)
    }

    const grandTotal = db.prepare("SELECT count(*) as c FROM events").get()
    console.log(`\n📦 DB total events (all sources): ${grandTotal.c}`)
  } catch (e) {
    console.error('Could not query DB:', e.message)
  }

  console.log(`\n⏱️  Elapsed: ${elapsed}s`)

  if (allErrors.length > 0) {
    console.log(`\n⚠️  Total errors: ${allErrors.length}`)
    allErrors.slice(0, 5).forEach(e => console.log(`   - ${JSON.stringify(e)}`))
  }

  const exitCode = results.every(r => r.inserted + r.updated > 0) ? 0 : 1
  console.log(`\nExit code: ${exitCode}`)
  process.exit(exitCode)
}

runAll().catch(e => {
  console.error('Fatal error in run-all.js:', e)
  process.exit(1)
})
