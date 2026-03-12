import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { EventCard, Event } from '@/components/EventCard'
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
      {/* === HERO: Full-width dark section === */}
      <section className="relative min-h-[85vh] flex flex-col justify-end bg-[#1C1C1E] overflow-hidden">
        {/* Background image from featured event or fallback */}
        {featuredEvent && (
          <>
            <img
              src={featuredEvent.image_url || `https://picsum.photos/seed/${featuredEvent.id}/1400/800`}
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1E] via-[#1C1C1E]/60 to-transparent" />
          </>
        )}

        {/* Hero content */}
        <div className="relative max-w-6xl mx-auto px-6 pb-16 pt-32 w-full">
          {/* Tag */}
          <div className="flex items-center gap-2 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C2582A] animate-pulse" />
            <span className="text-xs font-medium tracking-[0.2em] uppercase text-white/50">
              Atlanta's event guide
            </span>
          </div>

          {/* Big headline */}
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-black text-white leading-none mb-6 max-w-3xl">
            Your city.<br />
            <em className="not-italic text-[#C2582A]">This weekend.</em>
          </h1>

          <p className="text-white/50 text-lg max-w-lg mb-8 leading-relaxed font-sans">
            Concerts, markets, art shows, block parties — everything happening in Atlanta, 
            curated by people who actually go out.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/browse"
              className="inline-flex items-center gap-2 bg-[#C2582A] text-white px-6 py-3 text-sm font-semibold hover:bg-[#A8461F] transition-colors"
            >
              Browse Events
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </Link>
            <Link
              to="/sign-up"
              className="inline-flex items-center gap-2 bg-transparent border border-white/20 text-white/70 px-6 py-3 text-sm font-medium hover:border-white/40 hover:text-white transition-colors"
            >
              Create Account
            </Link>
          </div>
        </div>

        {/* Category strip at bottom of hero */}
        <div className="relative border-t border-white/10">
          <div className="max-w-6xl mx-auto px-6 py-4 flex gap-6 overflow-x-auto scrollbar-none">
            {FEATURED_CATEGORIES.map(cat => {
              const Icon = CATEGORY_ICONS[cat.slug]
              const color = CATEGORY_COLORS[cat.slug]
              return (
                <Link
                  key={cat.slug}
                  to={`/browse?category=${cat.slug}`}
                  className="flex items-center gap-2 text-white/40 hover:text-white transition-colors flex-shrink-0 group"
                >
                  {Icon && <Icon size={14} color={color} className="opacity-60 group-hover:opacity-100 transition-opacity" />}
                  <span className="text-xs font-medium tracking-wide whitespace-nowrap">{cat.label}</span>
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
              className="hidden md:flex items-center gap-2 text-sm font-medium text-[#C2582A] hover:text-[#A8461F] transition-colors"
            >
              See everything
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-52 bg-[#DDD5C8] mb-3" />
                  <div className="h-4 bg-[#DDD5C8] rounded mb-2 w-3/4" />
                  <div className="h-3 bg-[#DDD5C8] rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Editorial grid: featured large + smaller */}
              {weekendEvents.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
                  {/* Large featured */}
                  {weekendEvents[0] && (
                    <div className="md:col-span-7">
                      <EventCard event={weekendEvents[0]} featured className="h-full" />
                    </div>
                  )}
                  {/* Right column — 2 smaller */}
                  <div className="md:col-span-5 flex flex-col gap-6">
                    {weekendEvents.slice(1, 3).map(ev => (
                      <EventCard key={ev.id} event={ev} compact />
                    ))}
                  </div>
                </div>
              )}

              {/* Second row — 3 equal */}
              {weekendEvents.length > 3 && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                  {weekendEvents.slice(3, 6).map(ev => (
                    <EventCard key={ev.id} event={ev} />
                  ))}
                </div>
              )}
            </>
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

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-px bg-white/10">
            {FEATURED_CATEGORIES.map(cat => {
              const Icon = CATEGORY_ICONS[cat.slug]
              const color = CATEGORY_COLORS[cat.slug]
              return (
                <Link
                  key={cat.slug}
                  to={`/browse?category=${cat.slug}`}
                  className="group bg-[#1C1C1E] p-6 flex flex-col gap-4 hover:bg-white/5 transition-colors"
                >
                  {Icon && (
                    <Icon size={24} color={color} />
                  )}
                  <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors leading-tight">
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
                className="text-sm font-medium text-[#C2582A] hover:text-[#A8461F] transition-colors"
              >
                Browse all →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {moreEvents.map(ev => (
                <EventCard key={ev.id} event={ev} compact />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* === CTA BANNER === */}
      <section className="bg-[#C2582A] py-16">
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
            className="flex-shrink-0 bg-white text-[#C2582A] px-8 py-4 text-sm font-bold hover:bg-[#F5F0E8] transition-colors"
          >
            Post an Event
          </Link>
        </div>
      </section>
    </Layout>
  )
}
