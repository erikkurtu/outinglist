/**
 * Meetup.com Scraper — OutingList
 * Scrapes Atlanta events from Meetup using LD+JSON structured data
 * Target: 20+ events
 */

import { getDb, upsertEvent, logScraperRun, mapCategory, fetchWithRetry, sleep, ensureScraperRunsTable } from './utils.js'

// A mix of search pages + known Atlanta Meetup categories
const MEETUP_URLS = [
  'https://www.meetup.com/find/?location=Atlanta%2C+GA&source=EVENTS&distance=twentyFiveMiles&categoryId=546',
  'https://www.meetup.com/find/?location=Atlanta%2C+GA&source=EVENTS&distance=twentyFiveMiles&categoryId=1',
  'https://www.meetup.com/find/?location=Atlanta%2C+GA&source=EVENTS&distance=twentyFiveMiles&categoryId=4',
  'https://www.meetup.com/find/?location=Atlanta%2C+GA&source=EVENTS&distance=twentyFiveMiles&categoryId=9',
  'https://www.meetup.com/find/?location=Atlanta%2C+GA&source=EVENTS&distance=twentyFiveMiles',
  'https://www.meetup.com/find/?location=Atlanta%2C+GA&source=EVENTS&distance=twentyFiveMiles&categoryId=15',
  'https://www.meetup.com/find/?location=Atlanta%2C+GA&source=EVENTS&distance=twentyFiveMiles&categoryId=2',
]

async function scrapeMeetupPage(url) {
  console.log(`  Fetching Meetup: ${url.slice(0, 80)}...`)

  const res = await fetchWithRetry(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
    }
  })

  if (!res.ok) {
    console.warn(`  Returned ${res.status}`)
    return []
  }

  const html = await res.text()
  return extractEventsFromHtml(html)
}

function extractEventsFromHtml(html) {
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

function meetupToDbEvent(rawEvent) {
  const title = rawEvent.name?.trim() || ''
  const description = rawEvent.description || ''
  const url = rawEvent.url || ''
  const image = rawEvent.image || null

  // Extract event ID from URL
  const idMatch = url.match(/events\/(\d+)/)
  const scrapedId = `meetup-${idMatch ? idMatch[1] : url.split('/').filter(Boolean).pop()}`

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
  const locationAddress = addr.streetAddress
    ? [addr.streetAddress, addr.addressLocality, addr.addressRegion].filter(Boolean).join(', ')
    : (addr.addressLocality ? `${addr.addressLocality}, ${addr.addressRegion}` : 'Atlanta, GA')

  // Price
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
    description: description.slice(0, 2000), // limit description length
    source_url: url,
    source_platform: 'meetup',
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

export async function runMeetupScraper() {
  const db = getDb()
  ensureScraperRunsTable(db)

  console.log('\n👥 Meetup Scraper Starting...')
  const errors = []
  let inserted = 0
  let updated = 0
  const seen = new Set()

  for (const url of MEETUP_URLS) {
    try {
      const rawEvents = await scrapeMeetupPage(url)
      console.log(`  Found ${rawEvents.length} events`)

      for (const raw of rawEvents) {
        if (!raw?.name) continue
        const id = raw.url || raw.name
        if (seen.has(id)) continue
        seen.add(id)

        try {
          const event = meetupToDbEvent(raw)
          if (!event.start_at) continue

          const result = upsertEvent(db, event)
          if (result.status === 'inserted') inserted++
          else if (result.status === 'updated') updated++
        } catch (e) {
          errors.push({ event: raw.name, error: e.message })
        }
      }

      await sleep(1500)
    } catch (e) {
      console.error(`  URL error:`, e.message)
      errors.push({ url, error: e.message })
    }
  }

  logScraperRun(db, 'meetup', inserted + updated, errors)
  console.log(`\n✅ Meetup done: ${inserted} new, ${updated} updated, ${errors.length} errors`)
  return { platform: 'meetup', inserted, updated, errors }
}

if (process.argv[1].endsWith('meetup.js')) {
  runMeetupScraper().then(r => {
    console.log('Result:', JSON.stringify(r, null, 2))
    process.exit(0)
  }).catch(e => {
    console.error('Fatal:', e)
    process.exit(1)
  })
}
