import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import type { Event } from '@/components/EventCard'
import { CATEGORY_ICONS, CATEGORY_COLORS } from '@/components/icons/CategoryIcons'
import { decodeEntities } from '@/lib/utils'
import { fetchEvents } from '@/lib/api'

const FEATURED_CATEGORIES = [
  { slug: 'music-concerts', label: 'Music' },
  { slug: 'food-drink', label: 'Food & Drink' },
  { slug: 'arts-culture', label: 'Arts' },
  { slug: 'outdoor-nature', label: 'Outdoor' },
  { slug: 'nightlife-parties', label: 'Nightlife' },
  { slug: 'community-civic', label: 'Community' },
  { slug: 'wellness-spirituality', label: 'Wellness' },
  { slug: 'tech-innovation', label: 'Tech' },
  { slug: 'family-kids', label: 'Family' },
  { slug: 'workshops-classes', label: 'Workshops' },
]

// Sample curated lists for homepage
const FEATURED_LISTS = [
  { id: 'date-night', title: 'Date Night in Atlanta', desc: 'Romantic outings for two', count: 12 },
  { id: 'free-things', title: 'Free Things to Do', desc: 'No cover, no tickets, no excuses', count: 24 },
  { id: 'live-music', title: 'Live Music This Week', desc: 'Every stage, every genre', count: 18 },
]

export function Home() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEvents({ limit: 10 }).then(res => {
      setEvents(res.events)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  return (
    <Layout fullWidth noPad>
      {/* === MAIN HEADER === */}
      <section className="bg-[#F7F7F5] pt-10 pb-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-3">
            <span className="text-xs font-medium tracking-[0.2em] uppercase text-[#9CA3AF] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5B5BD6]" />
              Atlanta's event guide
            </span>
          </div>

          <h1 className="font-display text-4xl md:text-5xl font-black text-[#1A1A1F] leading-tight mb-3">
            Coming up <em>in Atlanta.</em>
          </h1>
          <p className="text-[#6B7280] text-sm max-w-lg leading-relaxed font-sans mb-5">
            Community talks, markets, art shows, block parties — everything happening in Atlanta, curated by people who love going out.
          </p>
          <div className="flex flex-wrap gap-3 mb-4">
            <Link
              to="/browse"
              className="inline-flex items-center gap-2 bg-[#5B5BD6] px-4 py-2 rounded-[6px] text-sm font-semibold hover:bg-[#4F46E5] transition-colors"
              style={{ color: '#fff' }}
            >
              Browse Events
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </Link>
            <Link
              to="/sign-up"
              className="inline-flex items-center gap-2 border border-[#D1D5DB] text-[#6B7280] px-4 py-2 rounded-[6px] text-sm font-medium hover:border-[#1A1A1F] hover:text-[#1A1A1F] transition-colors"
            >
              Create Account
            </Link>
          </div>

          {/* Divider */}
          <div className="border-b-2 border-[#1A1A1F] mb-8" />

          {/* Event list */}
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="animate-pulse flex gap-4 py-3 border-b border-[#E5E7EB]">
                  <div className="w-16 h-4 bg-[#D1D5DB] rounded" />
                  <div className="flex-1 h-4 bg-[#D1D5DB] rounded" />
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="space-y-0">
                {events.map(ev => {
                  const d = new Date(ev.start_at)
                  const day = d.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'America/New_York' }).toUpperCase()
                  const month = d.toLocaleDateString('en-US', { month: 'short', timeZone: 'America/New_York' })
                  const date = d.getDate()
                  const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'America/New_York' })
                  const primaryCat = ev.categories?.[0]
                  const catColor = primaryCat?.slug ? CATEGORY_COLORS[primaryCat.slug] : '#5B5BD6'
                  const isFree = ev.is_free === 1

                  return (
                    <Link
                      key={ev.id}
                      to={`/events/${ev.id}`}
                      className="group flex items-baseline gap-4 py-3.5 border-b border-[#E5E7EB] hover:bg-white/50 transition-colors px-2 -mx-2"
                    >
                      <span className="text-xs font-bold tracking-wider text-[#9CA3AF] w-20 flex-shrink-0">
                        {day} {month} {date}
                      </span>
                      <span className="text-xs text-[#9CA3AF] w-14 flex-shrink-0 tabular-nums">
                        {time}
                      </span>
                      <span className="w-2 h-2 rounded-full flex-shrink-0 mt-1" style={{ backgroundColor: catColor }} />
                      <span className="flex-1 text-sm font-semibold text-[#1A1A1F] group-hover:text-[#5B5BD6] transition-colors truncate">
                        {decodeEntities(ev.title)}
                      </span>
                      {ev.location_name && (
                        <span className="text-xs text-[#9CA3AF] flex-shrink-0 hidden md:inline truncate max-w-[180px]">
                          {ev.location_name}
                        </span>
                      )}
                      <span className={`text-xs font-medium flex-shrink-0 ${isFree ? 'text-[#2A7A4A]' : 'text-[#1A1A1F]'}`}>
                        {isFree ? 'Free' : ev.price_min ? `$${ev.price_min}` : ''}
                      </span>
                    </Link>
                  )
                })}
              </div>

              <div className="mt-6 text-center">
                <Link
                  to="/browse"
                  className="inline-flex items-center gap-2 text-sm font-medium text-[#5B5BD6] hover:text-[#4F46E5] transition-colors"
                >
                  See all events
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                  </svg>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* === CURATED LISTS === */}
      <section className="bg-white py-14 border-t border-[#E5E7EB]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-medium tracking-[0.2em] uppercase text-[#9CA3AF] mb-2">Curated by locals</p>
              <h2 className="font-display text-3xl font-black text-[#1A1A1F]">
                Lists we love.
              </h2>
            </div>
            <Link
              to="/lists"
              className="text-sm font-medium text-[#5B5BD6] hover:text-[#4F46E5] transition-colors"
            >
              Browse all lists →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {FEATURED_LISTS.map(list => (
              <Link
                key={list.id}
                to={`/lists`}
                className="group block p-5 border border-[#E5E7EB] rounded-[6px] hover:border-[#5B5BD6] transition-colors"
              >
                <h3 className="text-sm font-bold text-[#1A1A1F] group-hover:text-[#5B5BD6] transition-colors mb-1">
                  {list.title}
                </h3>
                <p className="text-xs text-[#9CA3AF] mb-3">{list.desc}</p>
                <span className="text-[10px] font-semibold tracking-wider uppercase text-[#9CA3AF]">
                  {list.count} events
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* === BROWSE BY INTEREST === */}
      <section className="bg-[#2D2D35] py-14">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-xs font-medium tracking-[0.2em] uppercase text-white/30 mb-3">Browse by interest</p>
          <h2 className="font-display text-3xl font-black text-white mb-8">
            Find your thing.
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {FEATURED_CATEGORIES.map(cat => {
              const Icon = CATEGORY_ICONS[cat.slug]
              const color = CATEGORY_COLORS[cat.slug]
              return (
                <Link
                  key={cat.slug}
                  to={`/browse?category=${cat.slug}`}
                  className="group bg-white/5 hover:bg-white/10 rounded-[6px] p-5 flex flex-col items-center gap-3 transition-colors"
                >
                  {Icon && <Icon size={32} color={color} />}
                  <span className="text-sm font-semibold text-white/80 group-hover:text-white transition-colors text-center">
                    {cat.label}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* === CTA BANNER === */}
      <section className="bg-[#5B5BD6] py-14">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-black text-white mb-2">
              Know something happening?
            </h2>
            <p className="text-white/70 text-base">
              Add your event. Share it with Atlanta.
            </p>
          </div>
          <Link
            to="/events/new"
            className="flex-shrink-0 bg-white text-[#5B5BD6] px-8 py-4 rounded-[6px] text-sm font-bold hover:bg-[#F7F7F5] transition-colors"
          >
            Post an Event
          </Link>
        </div>
      </section>
    </Layout>
  )
}
