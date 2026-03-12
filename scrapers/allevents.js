/**
 * AllEvents.in Scraper — OutingList
 * Scrapes Atlanta events from allevents.in using LD+JSON structured data
 * Target: 20+ events
 */

import { getDb, upsertEvent, logScraperRun, mapCategory, fetchWithRetry, sleep, ensureScraperRunsTable } from './utils.js'

const PAGES_TO_SCRAPE = 4

async function scrapeAlleventsPage(pageNum) {
  // allevents.in uses ?page=N for pagination (1-indexed)
  const url = pageNum === 1
    ? 'https://allevents.in/atlanta'
    : `https://allevents.in/atlanta?page=${pageNum}`

  console.log(`  Fetching allevents.in page ${pageNum}... (${url})`)

  const res = await fetchWithRetry(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
      'Referer': 'https://allevents.in/',
    }
  })

  if (!res.ok) {
    console.warn(`  Page ${pageNum} returned ${res.status}`)
    return []
  }

  const html = await res.text()
  const events = extractEventsFromHtml(html)
  return events
}

function extractEventsFromHtml(html) {
  // allevents.in embeds individual LD+JSON blocks per event
  const jsonMatches = html.match(/application\/ld\+json[^>]*>([\s\S]*?)<\/script>/g) || []
  const events = []

  for (const match of jsonMatches) {
    const content = match.replace(/application\/ld\+json[^>]*>/, '').replace(/<\/script>$/, '').trim()
    try {
      const data = JSON.parse(content)
      if (Array.isArray(data)) {
        for (const item of data) {
          if (item['@type'] === 'Event') events.push(item)
        }
      } else if (data['@type'] === 'Event') {
        events.push(data)
      }
    } catch (e) {
      // skip
    }
  }

  return events
}

function alleventsToDbEvent(rawEvent) {
  const title = rawEvent.name || ''
  const description = rawEvent.description || ''
  const url = rawEvent.url || ''
  const image = rawEvent.image || null

  // Extract ID from URL for dedup
  const urlParts = url.split('/')
  const scrapedId = `allevents-${urlParts[urlParts.length - 1] || Math.random().toString(36).slice(2)}`

  // Dates
  let startAt = null, endAt = null
  try {
    if (rawEvent.startDate) startAt = new Date(rawEvent.startDate).toISOString()
    if (rawEvent.endDate) endAt = new Date(rawEvent.endDate).toISOString()
  } catch (e) {}

  // Location
  const loc = rawEvent.location || {}
  const addr = loc.address || {}
  const locationName = loc.name || ''
  const locationAddress = [addr.streetAddress, addr.addressLocality, addr.addressRegion]
    .filter(Boolean).join(', ')

  // Price from offers
  const offers = rawEvent.offers
  let priceData = { price_min: 0, price_max: 0, is_free: true }
  if (offers) {
    const offerList = Array.isArray(offers) ? offers : [offers]
    const prices = offerList
      .map(o => parseFloat(o.price))
      .filter(p => !isNaN(p))

    if (prices.length > 0) {
      priceData = {
        price_min: Math.min(...prices),
        price_max: Math.max(...prices),
        is_free: Math.min(...prices) === 0
      }
    }
  }

  const categoryId = mapCategory(`${title} ${description}`)

  return {
    title,
    description,
    source_url: url,
    source_platform: 'allevents',
    image_url: typeof image === 'string' ? image : (image?.[0] || null),
    start_at: startAt,
    end_at: endAt,
    location_name: locationName,
    location_address: locationAddress || 'Atlanta, GA',
    ...priceData,
    scraped_id: scrapedId,
    category_id: categoryId,
  }
}

export async function runAlleventsScraper() {
  const db = getDb()
  ensureScraperRunsTable(db)

  console.log('\n🌐 AllEvents.in Scraper Starting...')
  const errors = []
  let inserted = 0
  let updated = 0

  for (let page = 1; page <= PAGES_TO_SCRAPE; page++) {
    try {
      const rawEvents = await scrapeAlleventsPage(page)
      console.log(`  Page ${page}: ${rawEvents.length} events found`)

      for (const raw of rawEvents) {
        if (!raw || !raw.name) continue

        try {
          const event = alleventsToDbEvent(raw)
          if (!event.start_at) continue

          const result = upsertEvent(db, event)
          if (result.status === 'inserted') inserted++
          else if (result.status === 'updated') updated++
        } catch (e) {
          errors.push({ event: raw.name, error: e.message })
        }
      }

      if (page < PAGES_TO_SCRAPE) await sleep(2000)
    } catch (e) {
      console.error(`  Page ${page} error:`, e.message)
      errors.push({ page, error: e.message })
    }
  }

  logScraperRun(db, 'allevents', inserted + updated, errors)
  console.log(`\n✅ AllEvents done: ${inserted} new, ${updated} updated, ${errors.length} errors`)
  return { platform: 'allevents', inserted, updated, errors }
}

if (process.argv[1].endsWith('allevents.js')) {
  runAlleventsScraper().then(r => {
    console.log('Result:', JSON.stringify(r, null, 2))
    process.exit(0)
  }).catch(e => {
    console.error('Fatal:', e)
    process.exit(1)
  })
}
