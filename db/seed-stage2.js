// Stage 2 Seed: 30 more Atlanta events
import Database from 'better-sqlite3'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const db = new Database(join(__dirname, 'outinglist.db'))
db.pragma('foreign_keys = ON')

const events = [
  // Music & Concerts
  {
    id: 'evt-21', title: 'The Fox Theatre: Wicked National Tour',
    description: 'The worldwide phenomenon returns. Experience the untold story of the Witches of Oz live at the iconic Fox Theatre. One of the longest-running shows in Broadway history, now in Atlanta for a limited engagement.',
    source_type: 'external', source_url: 'https://foxtheatre.org',
    start_at: '2026-03-15T19:30:00-05:00', end_at: '2026-03-15T22:00:00-05:00',
    location_name: 'Fox Theatre', location_address: '660 Peachtree St NE, Atlanta, GA 30308',
    price_min: 55, price_max: 185, is_free: 0, categories: ['cat-01', 'cat-12']
  },
  {
    id: 'evt-22', title: 'EDM Night at Believe Music Hall',
    description: 'Atlanta\'s premier electronic music venue hosts a massive EDM night featuring international DJs. Floor-to-ceiling LED displays, world-class sound system, and an energy that doesn\'t quit until 3am. 21+ only.',
    source_type: 'internal', source_url: null,
    start_at: '2026-03-28T22:00:00-05:00', end_at: '2026-03-29T03:00:00-05:00',
    location_name: 'Believe Music Hall', location_address: '200 Legends Pl SW, Atlanta, GA 30313',
    price_min: 30, price_max: 60, is_free: 0, categories: ['cat-01', 'cat-05']
  },
  {
    id: 'evt-23', title: 'Free Concert: Atlanta Symphony at Woodruff Park',
    description: 'The Atlanta Symphony Orchestra brings classical music to the streets. Free outdoor performance featuring Beethoven and local composers. Bring a blanket and enjoy Downtown Atlanta\'s beautiful Woodruff Park.',
    source_type: 'internal', source_url: null,
    start_at: '2026-04-04T17:00:00-05:00', end_at: '2026-04-04T19:30:00-05:00',
    location_name: 'Woodruff Park', location_address: '91 Peachtree St NW, Atlanta, GA 30303',
    price_min: 0, price_max: 0, is_free: 1, categories: ['cat-01', 'cat-03']
  },
  {
    id: 'evt-24', title: 'Indie Rock Showcase: The Earl',
    description: 'East Atlanta\'s beloved dive bar hosts its monthly indie showcase. Five local bands, cheap beer, and the kind of authentic Atlanta music scene you can\'t find anywhere else. 18+ welcome.',
    source_type: 'internal', source_url: 'https://badearl.com',
    start_at: '2026-04-10T20:00:00-05:00', end_at: '2026-04-11T00:00:00-05:00',
    location_name: 'The Earl', location_address: '488 Flat Shoals Ave SE, Atlanta, GA 30316',
    price_min: 10, price_max: 15, is_free: 0, categories: ['cat-01']
  },

  // Food & Drink
  {
    id: 'evt-25', title: 'Atlanta Food & Wine Festival Kickoff',
    description: 'The unofficial start of Atlanta\'s premier food festival. Tastings from 40+ restaurants, live cooking demos, and conversations with James Beard-nominated chefs. Sample everything from low-country classics to modern Southern fusion.',
    source_type: 'external', source_url: 'https://atlfoodandwinefestival.com',
    start_at: '2026-05-14T11:00:00-05:00', end_at: '2026-05-14T18:00:00-05:00',
    location_name: 'Atlantic Station', location_address: '1380 Atlantic Dr NW, Atlanta, GA 30363',
    price_min: 75, price_max: 150, is_free: 0, categories: ['cat-02']
  },
  {
    id: 'evt-26', title: 'Sweet Auburn Curb Market: Saturday Market',
    description: 'Atlanta\'s historic market since 1918 comes alive every Saturday. Local produce, fresh fish, soul food vendors, and the famous market atmosphere. Free to browse — bring cash for the incredible vendors.',
    source_type: 'internal', source_url: null,
    start_at: '2026-03-21T08:00:00-05:00', end_at: '2026-03-21T14:00:00-05:00',
    location_name: 'Sweet Auburn Curb Market', location_address: '209 Edgewood Ave SE, Atlanta, GA 30303',
    price_min: 0, price_max: 0, is_free: 1, categories: ['cat-02', 'cat-11']
  },
  {
    id: 'evt-27', title: 'Craft Beer & Food Truck Rally at Ladybird Grove',
    description: 'Ladybird Grove & Mess Hall hosts 20 Atlanta food trucks and 10 local craft breweries in one legendary afternoon. Grab a pint, try something new from the rotating truck lineup, and enjoy views of Piedmont Park.',
    source_type: 'internal', source_url: null,
    start_at: '2026-04-18T13:00:00-05:00', end_at: '2026-04-18T21:00:00-05:00',
    location_name: 'Ladybird Grove & Mess Hall', location_address: '684 John Wesley Dobbs Ave NE, Atlanta, GA 30312',
    price_min: 5, price_max: 5, is_free: 0, categories: ['cat-02']
  },

  // Arts & Culture
  {
    id: 'evt-28', title: 'High Museum: Late Night Art Party',
    description: 'The High Museum transforms after dark. DJs, cash bar, themed installations, and full access to all current exhibitions including the blockbuster "Basquiat: King Pleasure" traveling show. Dress to impress.',
    source_type: 'external', source_url: 'https://high.org',
    start_at: '2026-03-27T19:00:00-05:00', end_at: '2026-03-27T23:00:00-05:00',
    location_name: 'High Museum of Art', location_address: '1280 Peachtree St NE, Atlanta, GA 30309',
    price_min: 20, price_max: 20, is_free: 0, categories: ['cat-03']
  },
  {
    id: 'evt-29', title: 'Alliance Theatre: A Strange Loop (Atlanta Premiere)',
    description: 'Winner of the 2022 Pulitzer Prize for Drama and the Tony Award for Best Musical. This bold, hilarious, heartbreaking show makes its Atlanta premiere at the Alliance Theatre. One of the most significant new musicals in decades.',
    source_type: 'external', source_url: 'https://alliancetheatre.org',
    start_at: '2026-04-03T19:30:00-05:00', end_at: '2026-04-03T22:00:00-05:00',
    location_name: 'Alliance Theatre', location_address: '1280 Peachtree St NE, Atlanta, GA 30309',
    price_min: 35, price_max: 95, is_free: 0, categories: ['cat-12', 'cat-03']
  },
  {
    id: 'evt-30', title: 'MOCA GA: Artist Talk & Opening Reception',
    description: 'Museum of Contemporary Art of Georgia opens its spring exhibition with an artist talk and reception. Meet the artists, hear about their process, and be among the first to experience this new body of work. Free with RSVP.',
    source_type: 'internal', source_url: null,
    start_at: '2026-03-19T18:00:00-05:00', end_at: '2026-03-19T21:00:00-05:00',
    location_name: 'MOCA GA', location_address: '75 Bennett St NW, Atlanta, GA 30309',
    price_min: 0, price_max: 0, is_free: 1, categories: ['cat-03']
  },

  // Sports & Fitness
  {
    id: 'evt-31', title: 'Atlanta United vs. Charlotte FC',
    description: 'Mercedes-Benz Stadium roars as Atlanta United FC hosts Charlotte FC in a crucial Eastern Conference matchup. Five Stripes faithful — the fans who make MLS history — will be in full voice. Get there early for pre-match festivities.',
    source_type: 'external', source_url: 'https://atlutd.com',
    start_at: '2026-04-11T19:30:00-05:00', end_at: '2026-04-11T21:30:00-05:00',
    location_name: 'Mercedes-Benz Stadium', location_address: '1 AMB Dr NW, Atlanta, GA 30313',
    price_min: 25, price_max: 150, is_free: 0, categories: ['cat-04']
  },
  {
    id: 'evt-32', title: 'BeltLine 5K Run: Spring Edition',
    description: 'The Atlanta BeltLine Partnership hosts its popular 5K run through the Eastside Trail. All paces welcome — this is a community run, not a race. Finish at Ladybird for a post-run celebration with local sponsors.',
    source_type: 'internal', source_url: null,
    start_at: '2026-04-25T08:00:00-05:00', end_at: '2026-04-25T11:00:00-05:00',
    location_name: 'Atlanta BeltLine Eastside Trail', location_address: '100 Hurt St NE, Atlanta, GA 30307',
    price_min: 35, price_max: 35, is_free: 0, categories: ['cat-04', 'cat-07']
  },
  {
    id: 'evt-33', title: 'Free Outdoor Yoga: Freedom Park',
    description: 'Start your Sunday morning right with free community yoga in Freedom Park. Led by certified instructors from local studios. All levels welcome. Bring your mat and water. Donation-based — pay what you can.',
    source_type: 'internal', source_url: null,
    start_at: '2026-03-22T09:00:00-05:00', end_at: '2026-03-22T10:30:00-05:00',
    location_name: 'Freedom Park', location_address: 'Freedom Pkwy NE, Atlanta, GA 30307',
    price_min: 0, price_max: 0, is_free: 1, categories: ['cat-04', 'cat-15']
  },

  // Family & Kids
  {
    id: 'evt-34', title: 'Children\'s Museum of Atlanta: Spring Break Camp',
    description: 'Spring Break is here! The Children\'s Museum offers a week of immersive educational programming for kids 2-8. Science experiments, art projects, storytelling, and more. Drop-off available.',
    source_type: 'external', source_url: 'https://childrensmuseumatlanta.org',
    start_at: '2026-03-23T09:00:00-05:00', end_at: '2026-03-23T17:00:00-05:00',
    location_name: 'Children\'s Museum of Atlanta', location_address: '275 Centennial Olympic Park Dr NW, Atlanta, GA 30313',
    price_min: 18, price_max: 18, is_free: 0, categories: ['cat-06']
  },
  {
    id: 'evt-35', title: 'Storytime at Decatur Library',
    description: 'Free weekly storytime for toddlers and young children at the Decatur Library. Songs, stories, and crafts with the children\'s librarian. A beloved community tradition for 20+ years.',
    source_type: 'internal', source_url: null,
    start_at: '2026-03-18T10:30:00-05:00', end_at: '2026-03-18T11:15:00-05:00',
    location_name: 'Decatur Library', location_address: '215 Sycamore St, Decatur, GA 30030',
    price_min: 0, price_max: 0, is_free: 1, categories: ['cat-06']
  },

  // Outdoor & Nature
  {
    id: 'evt-36', title: 'Guided Hike: Stone Mountain Park',
    description: 'Certified nature guide leads a 3-mile loop around Stone Mountain, with stops at key geological features and native plant identification. Moderate difficulty. Meet at the park\'s main entrance.',
    source_type: 'internal', source_url: null,
    start_at: '2026-03-29T09:00:00-05:00', end_at: '2026-03-29T12:00:00-05:00',
    location_name: 'Stone Mountain Park', location_address: '1000 Robert E Lee Blvd, Stone Mountain, GA 30083',
    price_min: 20, price_max: 20, is_free: 0, categories: ['cat-07']
  },
  {
    id: 'evt-37', title: 'Atlanta Botanical Garden: Orchid Daze',
    description: 'The award-winning Orchid Daze returns with thousands of orchids in spectacular arrangements throughout the conservatory and gardens. The most popular event at the Atlanta Botanical Garden every year.',
    source_type: 'external', source_url: 'https://atlantabg.org',
    start_at: '2026-03-14T09:00:00-05:00', end_at: '2026-03-14T17:00:00-05:00',
    location_name: 'Atlanta Botanical Garden', location_address: '1345 Piedmont Ave NE, Atlanta, GA 30309',
    price_min: 22, price_max: 22, is_free: 0, categories: ['cat-07', 'cat-03']
  },

  // Tech & Innovation
  {
    id: 'evt-38', title: 'Atlanta Tech Village: Demo Day',
    description: 'Eight Atlanta startups present to investors, mentors, and the tech community at the end of their cohort. Open to the public. Network with founders, VCs, and the broader Atlanta startup ecosystem. Free to attend.',
    source_type: 'internal', source_url: null,
    start_at: '2026-04-16T17:00:00-05:00', end_at: '2026-04-16T20:00:00-05:00',
    location_name: 'Atlanta Tech Village', location_address: '3423 Piedmont Rd NE, Atlanta, GA 30305',
    price_min: 0, price_max: 0, is_free: 1, categories: ['cat-08', 'cat-14']
  },
  {
    id: 'evt-39', title: 'AI & Machine Learning Meetup ATL',
    description: 'Atlanta\'s largest ML meetup gathers monthly for talks, demos, and networking. This month: "Building with LLMs in Production" from senior engineers at Georgia Tech and local AI startups. Light refreshments provided.',
    source_type: 'external', source_url: 'https://meetup.com',
    start_at: '2026-03-25T18:30:00-05:00', end_at: '2026-03-25T21:00:00-05:00',
    location_name: 'Coda Building', location_address: '756 W Peachtree St NW, Atlanta, GA 30308',
    price_min: 0, price_max: 0, is_free: 1, categories: ['cat-08', 'cat-14']
  },

  // Community & Civic
  {
    id: 'evt-40', title: 'Neighborhood Planning Unit Meeting: NPU-E',
    description: 'Monthly NPU-E meeting covering zoning, development, and community concerns in Inman Park, Poncey-Highland, and Little Five Points. Open to all residents. Your chance to shape your neighborhood.',
    source_type: 'internal', source_url: null,
    start_at: '2026-03-16T19:00:00-05:00', end_at: '2026-03-16T21:00:00-05:00',
    location_name: 'Inman Park United Methodist Church', location_address: '1015 Edgewood Ave NE, Atlanta, GA 30307',
    price_min: 0, price_max: 0, is_free: 1, categories: ['cat-09']
  },
  {
    id: 'evt-41', title: 'Westside Community Clean-Up Day',
    description: 'Join neighbors, businesses, and city partners for a massive spring clean-up of the Westside neighborhoods. Supplies provided. Breakfast tacos at 8am. This is real community building — show up.',
    source_type: 'internal', source_url: null,
    start_at: '2026-04-05T08:00:00-05:00', end_at: '2026-04-05T13:00:00-05:00',
    location_name: 'English Avenue Community Center', location_address: '1000 Joseph E Boone Blvd NW, Atlanta, GA 30314',
    price_min: 0, price_max: 0, is_free: 1, categories: ['cat-09']
  },

  // Workshops & Classes
  {
    id: 'evt-42', title: 'Pottery Wheel Workshop: EAV Clay Studio',
    description: 'Learn to center clay and throw your first bowl on the pottery wheel. This beginner-friendly 3-hour workshop includes materials, tools, and firing of your piece. East Atlanta Village\'s best-kept secret.',
    source_type: 'internal', source_url: null,
    start_at: '2026-03-28T13:00:00-05:00', end_at: '2026-03-28T16:00:00-05:00',
    location_name: 'EAV Clay Studio', location_address: '499 Flat Shoals Ave SE, Atlanta, GA 30316',
    price_min: 65, price_max: 65, is_free: 0, categories: ['cat-10', 'cat-03']
  },
  {
    id: 'evt-43', title: 'Python for Beginners: Bootcamp Weekend',
    description: 'Learn Python programming from scratch in a single weekend. Taught by working developers, this intensive bootcamp covers variables, loops, functions, and a final project. Laptops required.',
    source_type: 'external', source_url: null,
    start_at: '2026-04-19T09:00:00-05:00', end_at: '2026-04-19T17:00:00-05:00',
    location_name: 'Georgia Tech Research Institute', location_address: '250 14th St NW, Atlanta, GA 30318',
    price_min: 149, price_max: 149, is_free: 0, categories: ['cat-10', 'cat-08']
  },
  {
    id: 'evt-44', title: 'Free Grant Writing Workshop: Nonprofit Leaders',
    description: 'The Community Foundation for Greater Atlanta offers a free grant writing workshop for nonprofit executive directors and development staff. Learn the fundamentals of compelling grant narratives.',
    source_type: 'internal', source_url: null,
    start_at: '2026-03-31T09:00:00-05:00', end_at: '2026-03-31T13:00:00-05:00',
    location_name: 'Community Foundation for Greater Atlanta', location_address: '191 Peachtree St NE Ste 1000, Atlanta, GA 30303',
    price_min: 0, price_max: 0, is_free: 1, categories: ['cat-10', 'cat-09']
  },

  // Markets & Pop-ups
  {
    id: 'evt-45', title: 'Krog Street Market: Spring Pop-up Fair',
    description: 'Krog Street Market\'s outdoor plaza fills with 50+ independent vendors for a spring pop-up fair. Vintage clothing, handmade jewelry, local art prints, ceramics, and more. Free entry — just bring your wallet.',
    source_type: 'internal', source_url: null,
    start_at: '2026-04-12T10:00:00-05:00', end_at: '2026-04-12T18:00:00-05:00',
    location_name: 'Krog Street Market', location_address: '99 Krog St NE, Atlanta, GA 30307',
    price_min: 0, price_max: 0, is_free: 1, categories: ['cat-11']
  },
  {
    id: 'evt-46', title: 'Black-Owned Business Market: Old Fourth Ward',
    description: 'Celebrating Atlanta\'s vibrant Black entrepreneurship scene. Shop 30+ Black-owned businesses: fashion, beauty, food, home goods, art. Live music from local artists. Supporting community is the whole point.',
    source_type: 'internal', source_url: null,
    start_at: '2026-04-26T11:00:00-05:00', end_at: '2026-04-26T19:00:00-05:00',
    location_name: 'Old Fourth Ward Park', location_address: '680 Dallas St NE, Atlanta, GA 30312',
    price_min: 0, price_max: 0, is_free: 1, categories: ['cat-11', 'cat-09']
  },

  // Comedy & Theater
  {
    id: 'evt-47', title: 'Dad\'s Garage: Improv Night',
    description: 'Atlanta\'s premier improv comedy troupe performs their Saturday late-night improv show. No scripts, no nets — just pure, hilarious improvisation from the cast that\'s been making Atlanta laugh for 30 years.',
    source_type: 'external', source_url: 'https://dadsgarage.com',
    start_at: '2026-03-21T22:00:00-05:00', end_at: '2026-03-22T00:00:00-05:00',
    location_name: 'Dad\'s Garage Theatre', location_address: '569 Ezzard St SE, Atlanta, GA 30312',
    price_min: 20, price_max: 25, is_free: 0, categories: ['cat-12']
  },
  {
    id: 'evt-48', title: 'Laughing Skull Lounge: Stand-Up Showcase',
    description: 'Midtown Atlanta\'s only dedicated comedy club presents a rotating showcase of Atlanta\'s best stand-up comedians. Two-drink minimum. Showtime is sharp at 8pm — don\'t be late.',
    source_type: 'internal', source_url: null,
    start_at: '2026-04-17T20:00:00-05:00', end_at: '2026-04-17T22:00:00-05:00',
    location_name: 'Laughing Skull Lounge', location_address: '878 Peachtree St NE, Atlanta, GA 30309',
    price_min: 15, price_max: 20, is_free: 0, categories: ['cat-12']
  },

  // Festivals
  {
    id: 'evt-49', title: 'Sweetwater 420 Fest',
    description: 'The legendary Sweetwater 420 Fest returns to Centennial Olympic Park. Three days of live music, over 100 bands, Sweetwater beer, food vendors, and the spirit of Atlanta spring. One of the city\'s most beloved annual events.',
    source_type: 'external', source_url: 'https://420fest.com',
    start_at: '2026-04-17T12:00:00-05:00', end_at: '2026-04-17T23:00:00-05:00',
    location_name: 'Centennial Olympic Park', location_address: '265 Park Ave W NW, Atlanta, GA 30313',
    price_min: 40, price_max: 120, is_free: 0, categories: ['cat-13', 'cat-01']
  },
  {
    id: 'evt-50', title: 'Inman Park Festival',
    description: 'Atlanta\'s oldest neighborhood festival celebrates its 50th anniversary with an arts & crafts fair, home tour, parade, and live music. The best free weekend in Atlanta every spring. Bring the whole family.',
    source_type: 'external', source_url: 'https://inmanparkfestival.org',
    start_at: '2026-04-24T10:00:00-05:00', end_at: '2026-04-24T21:00:00-05:00',
    location_name: 'Inman Park', location_address: 'Euclid Ave NE & Edgewood Ave, Atlanta, GA 30307',
    price_min: 0, price_max: 0, is_free: 1, categories: ['cat-13', 'cat-03', 'cat-11']
  },

  // Networking & Professional
  {
    id: 'evt-51', title: 'Atlanta Women in Tech: Leadership Luncheon',
    description: 'Monthly luncheon bringing together women in technology across Atlanta. Guest speaker: CTO of a leading Atlanta healthtech company. Mentorship connections, job opportunities, and genuine community.',
    source_type: 'internal', source_url: null,
    start_at: '2026-03-17T12:00:00-05:00', end_at: '2026-03-17T14:00:00-05:00',
    location_name: 'Spaces Midtown', location_address: '1230 Peachtree St NE, Atlanta, GA 30309',
    price_min: 25, price_max: 25, is_free: 0, categories: ['cat-14', 'cat-08']
  },

  // Wellness & Spirituality
  {
    id: 'evt-52', title: 'Meditation & Sound Bath: Grant Park',
    description: 'Certified sound therapist guides a 90-minute outdoor sound bath meditation in Grant Park using crystal singing bowls, gongs, and chimes. Bring a mat and an open mind. All experience levels welcome.',
    source_type: 'internal', source_url: null,
    start_at: '2026-03-29T16:00:00-05:00', end_at: '2026-03-29T17:30:00-05:00',
    location_name: 'Grant Park', location_address: '625 Park Ave SE, Atlanta, GA 30315',
    price_min: 20, price_max: 20, is_free: 0, categories: ['cat-15']
  },
  {
    id: 'evt-53', title: 'Morning Yin Yoga + Journaling Retreat',
    description: 'A gentle half-day retreat at a Midtown studio. Slow yin yoga to open the body, guided journaling to clear the mind, and community tea ceremony to close. Limited to 20 participants.',
    source_type: 'internal', source_url: null,
    start_at: '2026-04-05T08:00:00-05:00', end_at: '2026-04-05T12:00:00-05:00',
    location_name: 'Sacred Space Atlanta', location_address: '1087 Juniper St NE, Atlanta, GA 30309',
    price_min: 75, price_max: 75, is_free: 0, categories: ['cat-15', 'cat-10']
  },

  // Nightlife
  {
    id: 'evt-54', title: 'Clermont Lounge: Friday Night',
    description: 'Atlanta\'s most iconic dive bar and strip club does its thing every Friday. The Clermont Lounge is an Atlanta institution — raw, real, and unlike anything else. Cash only. No photos.',
    source_type: 'internal', source_url: null,
    start_at: '2026-04-03T21:00:00-05:00', end_at: '2026-04-04T02:00:00-05:00',
    location_name: 'Clermont Lounge', location_address: '789 Ponce de Leon Ave NE, Atlanta, GA 30306',
    price_min: 10, price_max: 10, is_free: 0, categories: ['cat-05']
  },
  {
    id: 'evt-55', title: 'SweetWater Brewing: Trivia Night',
    description: 'Test your knowledge at SweetWater\'s weekly trivia night. Teams up to 6 people compete for brewery prizes, gift cards, and eternal glory. Show up early to claim your table — it fills up fast.',
    source_type: 'internal', source_url: null,
    start_at: '2026-03-18T19:00:00-05:00', end_at: '2026-03-18T21:30:00-05:00',
    location_name: 'SweetWater Brewing Company', location_address: '1800 NE Expy Ste 100, Atlanta, GA 30329',
    price_min: 0, price_max: 0, is_free: 1, categories: ['cat-02', 'cat-05']
  },
]

const insertEvent = db.prepare(`
  INSERT OR IGNORE INTO events (
    id, title, description, source_type, source_url, image_url,
    start_at, end_at, location_name, location_address,
    price_min, price_max, is_free, metro, status
  ) VALUES (
    @id, @title, @description, @source_type, @source_url, @image_url,
    @start_at, @end_at, @location_name, @location_address,
    @price_min, @price_max, @is_free, 'atlanta', 'active'
  )
`)

const insertCat = db.prepare(`
  INSERT OR IGNORE INTO event_categories (event_id, category_id) VALUES (?, ?)
`)

let inserted = 0
const transaction = db.transaction(() => {
  for (const evt of events) {
    const { categories, ...data } = evt
    data.image_url = null
    insertEvent.run(data)
    for (const catId of categories) {
      insertCat.run(evt.id, catId)
    }
    inserted++
  }
})

transaction()
console.log(`✅ Seeded ${inserted} additional events. Total:`, db.prepare('SELECT COUNT(*) as n FROM events').get().n)
