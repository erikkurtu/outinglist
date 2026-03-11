import React, { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { EventCard, type Event } from '@/components/EventCard'
import { Badge } from '@/components/Badge'
import { fetchEvents, fetchCategories, type Category, type EventFilters } from '@/lib/api'

export function Browse() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [events, setEvents] = useState<Event[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || '')
  const [freeOnly, setFreeOnly] = useState(searchParams.get('free') === '1')

  const loadEvents = useCallback(async () => {
    setLoading(true)
    try {
      const filters: EventFilters = {}
      if (activeCategory) filters.category = activeCategory
      if (search) filters.search = search
      if (freeOnly) filters.free = true
      const data = await fetchEvents(filters)
      setEvents(data.events)
      setTotal(data.total)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [activeCategory, search, freeOnly])

  useEffect(() => {
    fetchCategories().then(setCategories).catch(console.error)
  }, [])

  useEffect(() => {
    loadEvents()
  }, [loadEvents])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (activeCategory) params.set('category', activeCategory)
    if (freeOnly) params.set('free', '1')
    setSearchParams(params)
    loadEvents()
  }

  function selectCategory(slug: string) {
    setActiveCategory(prev => prev === slug ? '' : slug)
  }

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-[#1A1A1A] mb-1">
          What's happening in Atlanta
        </h1>
        <p className="text-[#94A3B8]">
          {total > 0 ? `${total} events found` : loading ? 'Loading...' : 'No events found'}
        </p>
      </div>

      {/* Search + Filters */}
      <div className="mb-6 space-y-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="flex-1 relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search events, venues..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#E8E8E4] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 bg-[#FF6B35] text-white text-sm font-medium rounded-xl hover:bg-[#E55A28] transition-colors"
          >
            Search
          </button>
        </form>

        {/* Filters row */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setFreeOnly(!freeOnly)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
              freeOnly
                ? 'bg-[#00D4AA] text-white border-[#00D4AA]'
                : 'bg-white text-[#94A3B8] border-[#E8E8E4] hover:border-[#94A3B8]'
            }`}
          >
            Free only
          </button>

          <div className="w-px h-4 bg-[#E8E8E4] mx-1" />

          {/* Category pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => selectCategory(cat.slug)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${
                  activeCategory === cat.slug
                    ? 'border-transparent text-white'
                    : 'bg-white border-[#E8E8E4] text-[#94A3B8] hover:border-[#94A3B8]'
                }`}
                style={activeCategory === cat.slug ? { backgroundColor: cat.color || '#FF6B35', borderColor: cat.color || '#FF6B35' } : {}}
              >
                {cat.icon && <span className="mr-1">{cat.icon}</span>}
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Event grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-[16px] border border-[#E8E8E4] overflow-hidden animate-pulse">
              <div className="h-48 bg-[#E8E8E4]" />
              <div className="p-4 space-y-2">
                <div className="h-3 bg-[#E8E8E4] rounded w-1/3" />
                <div className="h-4 bg-[#E8E8E4] rounded w-4/5" />
                <div className="h-3 bg-[#E8E8E4] rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="font-display text-xl font-bold text-[#1A1A1A] mb-2">
            No events found
          </h3>
          <p className="text-[#94A3B8] mb-6">
            Try different filters or{' '}
            <button
              onClick={() => { setSearch(''); setActiveCategory(''); setFreeOnly(false) }}
              className="text-[#FF6B35] font-medium hover:underline"
            >
              clear all filters
            </button>
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {events.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </Layout>
  )
}
