/**
 * Eventbrite Scraper — OutingList
 * Scrapes Atlanta events from Eventbrite using LD+JSON structured data
 * Target: 30+ events
 */

import { getDb, upsertEvent, logScraperRun, mapCategory, parsePrice, fetchWithRetry, sleep, ensureScraperRunsTable } from './utils.js'

const PAGES_TO_SCRAPE = 5 // 28 events/page approx → ~100+ events

async function scrapeEventbritePage(pageNum) {
  const url = `https://www.eventbrite.com/d/ga--atlanta/events/?page=${pageNum}`
  console.log(`  Fetching Eventbrite page ${pageNum}...`)

  const res = await fetchWithRetry(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate, br',
    }
  })

  if (!res.ok) {
    console.warn(`  Page ${pageNum} returned ${res.status}`)
    return []
  }

  const html = await res.text()

  // Extract LD+JSON structured data
  const jsonMatches = html.match(/application\/ld\+json[^>]*>([\s\S]*?)<\/script>/g) || []
  let events = []

  for (const match of jsonMatches) {
    const content = match.replace(/application\/ld\+json[^>]*>/, '').replace(/<\/script>$/, '').trim()
    try {
      const data = JSON.parse(content)
      if (data['@type'] === 'ItemList' && data.itemListElement) {
        events = events.concat(data.itemListElement.map(item => item.item))
      } else if (data['@type'] === 'Event') {
        events.push(data)
      }
    } catch (e) {
      // skip malformed JSON
    }
  }

  return events
}

function eventbriteToDbEvent(rawEvent, position) {
  const title = rawEvent.name || ''
  const description = rawEvent.description || ''
  const url = rawEvent.url || ''
  const image = rawEvent.image || null

  // Extract event ID from URL for dedup
  const idMatch = url.match(/tickets-(\d+)/)
  const scrapedId = `eventbrite-${idMatch ? idMatch[1] : Math.random().toString(36).slice(2)}`

  // Dates
  const startAt = rawEvent.startDate ? new Date(rawEvent.startDate).toISOString() : null
  const endAt = rawEvent.endDate ? new Date(rawEvent.endDate).toISOString() : null

  // Location
  const loc = rawEvent.location || {}
  const addr = loc.address || {}
  const locationName = loc.name || ''
  const locationAddress = [addr.streetAddress, addr.addressLocality, addr.addressRegion]
    .filter(Boolean).join(', ')

  // Price
  const offers = rawEvent.offers || rawEvent.offer || null
  let priceData = { price_min: 0, price_max: 0, is_free: true }
  if (offers) {
    const offerList = Array.isArray(offers) ? offers : [offers]
    const prices = offerList
      .map(o => o.price)
      .filter(p => p !== undefined && p !== null && p !== '')
      .map(Number)
      .filter(p => !isNaN(p))

    if (prices.length > 0) {
      priceData = {
        price_min: Math.min(...prices),
        price_max: Math.max(...prices),
        is_free: Math.min(...prices) === 0
      }
    }
  }

  // Category from title + description
  const categoryId = mapCategory(`${title} ${description}`)

  return {
    title,
    description,
    source_url: url,
    source_platform: 'eventbrite',
    image_url: typeof image === 'string' ? image : (image?.url || null),
    start_at: startAt,
    end_at: endAt,
    location_name: locationName,
    location_address: locationAddress,
    ...priceData,
    scraped_id: scrapedId,
    category_id: categoryId,
  }
}

export async function runEventbriteScraper() {
  const db = getDb()
  ensureScraperRunsTable(db)

  console.log('\n🎟️  Eventbrite Scraper Starting...')
  const errors = []
  let inserted = 0
  let updated = 0
  let total = 0

  for (let page = 1; page <= PAGES_TO_SCRAPE; page++) {
    try {
      const rawEvents = await scrapeEventbritePage(page)
      console.log(`  Page ${page}: ${rawEvents.length} events found`)

      for (const raw of rawEvents) {
        if (!raw || !raw.name) continue
        total++

        try {
          const event = eventbriteToDbEvent(raw, total)
          if (!event.start_at) continue // skip events without dates

          const result = upsertEvent(db, event)
          if (result.status === 'inserted') inserted++
          else if (result.status === 'updated') updated++
        } catch (e) {
          errors.push({ event: raw.name, error: e.message })
        }
      }

      // Polite delay between pages
      if (page < PAGES_TO_SCRAPE) await sleep(1500)
    } catch (e) {
      console.error(`  Page ${page} error:`, e.message)
      errors.push({ page, error: e.message })
    }
  }

  // Log run
  logScraperRun(db, 'eventbrite', inserted + updated, errors)

  console.log(`\n✅ Eventbrite done: ${inserted} new, ${updated} updated, ${errors.length} errors`)
  return { platform: 'eventbrite', inserted, updated, errors }
}

// Allow running directly
if (process.argv[1].endsWith('eventbrite.js')) {
  runEventbriteScraper().then(r => {
    console.log('Result:', JSON.stringify(r, null, 2))
    process.exit(0)
  }).catch(e => {
    console.error('Fatal:', e)
    process.exit(1)
  })
}
