import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import type { Event } from '@/components/EventCard'
import { CATEGORY_ICONS, CATEGORY_COLORS } from '@/components/icons/CategoryIcons'
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

export function Home() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEvents({ limit: 12 }).then(res => {
      setEvents(res.events)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const featuredEvent = events[0]
  const weekendEvents = events.slice(1, 7)
  const moreEvents = events.slice(7, 12)

  return (
    <Layout fullWidth noPad>
      {/* === HERO: Bold typographic section === */}
      <section className="relative min-h-[70vh] flex flex-col justify-end bg-[#1C1C1E] overflow-hidden">
        {/* Subtle gradient accent */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#7C3AED]/8 to-transparent" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-gradient-to-tr from-[#7C3AED]/5 to-transparent" />

        {/* Hero content */}
        <div className="relative max-w-6xl mx-auto px-6 pb-16 pt-32 w-full">
          {/* Tag */}
          <div className="flex items-center gap-2 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] animate-pulse" />
            <span className="text-xs font-medium tracking-[0.2em] uppercase text-white/50">
              Atlanta's event guide
            </span>
          </div>

          {/* Big headline */}
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-black text-white leading-none mb-6 max-w-3xl">
            Your city.<br />
            <em className="not-italic text-[#7C3AED]">This weekend.</em>
          </h1>

          <p className="text-white/50 text-lg max-w-lg mb-8 leading-relaxed font-sans">
            Concerts, markets, art shows, block parties — everything happening in Atlanta, 
            curated by people who actually go out.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/browse"
              className="inline-flex items-center gap-2 bg-[#7C3AED] text-white px-6 py-3 rounded-[6px] text-sm font-semibold hover:bg-[#6D28D9] transition-colors"
            >
              Browse Events
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </Link>
            <Link
              to="/sign-up"
              className="inline-flex items-center gap-2 bg-transparent border border-white/20 text-white/70 px-6 py-3 rounded-[6px] text-sm font-medium hover:border-white/40 hover:text-white transition-colors"
            >
              Create Account
            </Link>
          </div>
        </div>

        {/* Category strip at bottom of hero — icons + labels */}
        <div className="relative border-t border-white/10">
          <div className="max-w-6xl mx-auto px-6 py-4 flex gap-5 overflow-x-auto scrollbar-none">
            {FEATURED_CATEGORIES.map(cat => {
              const Icon = CATEGORY_ICONS[cat.slug]
              const color = CATEGORY_COLORS[cat.slug]
              return (
                <Link
                  key={cat.slug}
                  to={`/browse?category=${cat.slug}`}
                  className="flex items-center gap-2 text-white/50 hover:text-white transition-colors flex-shrink-0 group"
                >
                  {Icon && <Icon size={16} color={color} className="opacity-70 group-hover:opacity-100 transition-opacity" />}
                  <span className="text-xs font-semibold tracking-wide whitespace-nowrap">{cat.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* === THIS WEEKEND IN ATLANTA === */}
      <section className="bg-[#F5F0E8] py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-medium tracking-[0.2em] uppercase text-[#8A8480] mb-2">Don't miss</p>
              <h2 className="font-display text-4xl md:text-5xl font-black text-[#1C1C1E]">
                This weekend<br />
                <em>in Atlanta.</em>
              </h2>
            </div>
            <Link
              to="/browse"
              className="hidden md:flex items-center gap-2 text-sm font-medium text-[#7C3AED] hover:text-[#6D28D9] transition-colors"
            >
              See everything
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse flex gap-4 py-3 border-b border-[#E2DDD6]">
                  <div className="w-16 h-4 bg-[#DDD5C8] rounded" />
                  <div className="flex-1 h-4 bg-[#DDD5C8] rounded" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-0">
              {weekendEvents.map(ev => {
                const d = new Date(ev.start_at)
                const day = d.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'America/New_York' }).toUpperCase()
                const month = d.toLocaleDateString('en-US', { month: 'short', timeZone: 'America/New_York' })
                const date = d.getDate()
                const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'America/New_York' })
                const primaryCat = ev.categories?.[0]
                const catColor = primaryCat?.slug ? CATEGORY_COLORS[primaryCat.slug] : '#7C3AED'
                const isFree = ev.is_free === 1

                return (
                  <Link
                    key={ev.id}
                    to={`/events/${ev.id}`}
                    className="group flex items-baseline gap-4 py-3.5 border-b border-[#E2DDD6] hover:bg-white/30 transition-colors px-2 -mx-2"
                  >
                    {/* Date */}
                    <span className="text-xs font-bold tracking-wider text-[#8A8480] w-20 flex-shrink-0">
                      {day} {month} {date}
                    </span>

                    {/* Time */}
                    <span className="text-xs text-[#8A8480] w-14 flex-shrink-0 tabular-nums">
                      {time}
                    </span>

                    {/* Category dot */}
                    <span className="w-2 h-2 rounded-full flex-shrink-0 mt-1" style={{ backgroundColor: catColor }} />

                    {/* Title */}
                    <span className="flex-1 text-sm font-semibold text-[#1C1C1E] group-hover:text-[#7C3AED] transition-colors truncate">
                      {ev.title}
                    </span>

                    {/* Venue */}
                    {ev.location_name && (
                      <span className="text-xs text-[#8A8480] flex-shrink-0 hidden md:inline truncate max-w-[180px]">
                        {ev.location_name}
                      </span>
                    )}

                    {/* Price */}
                    <span className={`text-xs font-medium flex-shrink-0 ${isFree ? 'text-[#2A7A4A]' : 'text-[#1C1C1E]'}`}>
                      {isFree ? 'Free' : ev.price_min ? `$${ev.price_min}` : ''}
                    </span>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* === BROWSE BY INTEREST === */}
      <section className="bg-[#1C1C1E] py-16">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-xs font-medium tracking-[0.2em] uppercase text-white/30 mb-3">Browse by interest</p>
          <h2 className="font-display text-3xl md:text-4xl font-black text-white mb-10">
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
                  {Icon && (
                    <Icon size={32} color={color} />
                  )}
                  <span className="text-sm font-semibold text-white/80 group-hover:text-white transition-colors text-center">
                    {cat.label}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* === MORE EVENTS === */}
      {moreEvents.length > 0 && (
        <section className="bg-[#F5F0E8] py-16">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex items-end justify-between mb-10">
              <h2 className="font-display text-3xl font-black text-[#1C1C1E]">
                More in Atlanta
              </h2>
              <Link
                to="/browse"
                className="text-sm font-medium text-[#7C3AED] hover:text-[#6D28D9] transition-colors"
              >
                Browse all →
              </Link>
            </div>
            <div className="space-y-0">
              {moreEvents.map(ev => {
                const d = new Date(ev.start_at)
                const day = d.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'America/New_York' }).toUpperCase()
                const month = d.toLocaleDateString('en-US', { month: 'short', timeZone: 'America/New_York' })
                const date = d.getDate()
                const primaryCat = ev.categories?.[0]
                const catColor = primaryCat?.slug ? CATEGORY_COLORS[primaryCat.slug] : '#7C3AED'

                return (
                  <Link
                    key={ev.id}
                    to={`/events/${ev.id}`}
                    className="group flex items-baseline gap-4 py-3 border-b border-[#E2DDD6] hover:bg-white/30 transition-colors px-2 -mx-2"
                  >
                    <span className="text-xs font-bold tracking-wider text-[#8A8480] w-20 flex-shrink-0">
                      {day} {month} {date}
                    </span>
                    <span className="w-2 h-2 rounded-full flex-shrink-0 mt-1" style={{ backgroundColor: catColor }} />
                    <span className="flex-1 text-sm font-semibold text-[#1C1C1E] group-hover:text-[#7C3AED] transition-colors truncate">
                      {ev.title}
                    </span>
                    {ev.location_name && (
                      <span className="text-xs text-[#8A8480] flex-shrink-0 hidden sm:inline">{ev.location_name}</span>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* === CTA BANNER === */}
      <section className="bg-[#7C3AED] py-16">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-black text-white mb-2">
              Know something happening?
            </h2>
            <p className="text-white/70 text-lg">
              Add your event. Share it with Atlanta.
            </p>
          </div>
          <Link
            to="/events/new"
            className="flex-shrink-0 bg-white text-[#7C3AED] px-8 py-4 rounded-[6px] text-sm font-bold hover:bg-[#F5F0E8] transition-colors"
          >
            Post an Event
          </Link>
        </div>
      </section>
    </Layout>
  )
}
