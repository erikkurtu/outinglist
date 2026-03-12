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

export function Home() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEvents({ limit: 18 }).then(res => {
      setEvents(res.events)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const weekendEvents = events.slice(0, 10)
  const moreEvents = events.slice(10, 18)

  return (
    <Layout fullWidth noPad>
      {/* === MAIN HEADER — integrated, no dark hero === */}
      <section className="bg-[#F7F7F5] pt-10 pb-16">
        <div className="max-w-6xl mx-auto px-6">
          {/* Intro */}
          <div className="mb-3">
            <span className="text-xs font-medium tracking-[0.2em] uppercase text-[#9CA3AF] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6366F1]" />
              Atlanta's event guide
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-4">
            <div>
              <h1 className="font-display text-4xl md:text-5xl font-black text-[#1A1A1F] leading-tight mb-3">
                This week<br />
                <em>in Atlanta.</em>
              </h1>
              <p className="text-[#9CA3AF] text-sm max-w-lg leading-relaxed font-sans">
                Community talks, markets, art shows, block parties — everything happening in Atlanta, curated by people who love going out.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 flex-shrink-0">
              <Link
                to="/browse"
                className="inline-flex items-center gap-2 bg-[#6366F1] text-white px-5 py-2.5 rounded-[6px] text-sm font-semibold hover:bg-[#4F46E5] transition-colors"
              >
                Browse Events
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </Link>
              <Link
                to="/sign-up"
                className="inline-flex items-center gap-2 border border-[#1A1A1F] text-[#1A1A1F] px-5 py-2.5 rounded-[6px] text-sm font-medium hover:bg-[#1A1A1F] hover:text-white transition-colors"
              >
                Create Account
              </Link>
            </div>
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
                {weekendEvents.map(ev => {
                  const d = new Date(ev.start_at)
                  const day = d.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'America/New_York' }).toUpperCase()
                  const month = d.toLocaleDateString('en-US', { month: 'short', timeZone: 'America/New_York' })
                  const date = d.getDate()
                  const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'America/New_York' })
                  const primaryCat = ev.categories?.[0]
                  const catColor = primaryCat?.slug ? CATEGORY_COLORS[primaryCat.slug] : '#6366F1'
                  const isFree = ev.is_free === 1

                  return (
                    <Link
                      key={ev.id}
                      to={`/events/${ev.id}`}
                      className="group flex items-baseline gap-4 py-3.5 border-b border-[#E5E7EB] hover:bg-white/30 transition-colors px-2 -mx-2"
                    >
                      <span className="text-xs font-bold tracking-wider text-[#9CA3AF] w-20 flex-shrink-0">
                        {day} {month} {date}
                      </span>
                      <span className="text-xs text-[#9CA3AF] w-14 flex-shrink-0 tabular-nums">
                        {time}
                      </span>
                      <span className="w-2 h-2 rounded-full flex-shrink-0 mt-1" style={{ backgroundColor: catColor }} />
                      <span className="flex-1 text-sm font-semibold text-[#1A1A1F] group-hover:text-[#6366F1] transition-colors truncate">
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
                  className="inline-flex items-center gap-2 text-sm font-medium text-[#6366F1] hover:text-[#4F46E5] transition-colors"
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

      {/* === BROWSE BY INTEREST === */}
      <section className="bg-[#1A1A1F] py-14">
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
      <section className="bg-[#6366F1] py-14">
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
            className="flex-shrink-0 bg-white text-[#6366F1] px-8 py-4 rounded-[6px] text-sm font-bold hover:bg-[#F7F7F5] transition-colors"
          >
            Post an Event
          </Link>
        </div>
      </section>
    </Layout>
  )
}
