import React, { useEffect, useState, useCallback, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { EventCard } from '@/components/EventCard'
import { fetchEvents, fetchCategories, type Category, type EventFilters, type TimeOfDay } from '@/lib/api'
import type { Event } from '@/components/EventCard'
import { CATEGORY_ICONS, CATEGORY_COLORS } from '@/components/icons/CategoryIcons'

const PAGE_SIZE = 12

export function Browse() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [events, setEvents] = useState<Event[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)

  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [debouncedSearch, setDebouncedSearch] = useState(search)
  const [activeCategories, setActiveCategories] = useState<string[]>(
    searchParams.get('category') ? searchParams.get('category')!.split(',') : []
  )
  const [freeOnly, setFreeOnly] = useState(searchParams.get('free') === '1')
  const [dateFrom, setDateFrom] = useState(searchParams.get('date_from') || '')
  const [dateTo, setDateTo] = useState(searchParams.get('date_to') || '')
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay | ''>((searchParams.get('time_of_day') as TimeOfDay) || '')
  const [showFilters, setShowFilters] = useState(false)

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  function handleSearchChange(val: string) {
    setSearch(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(val)
      setPage(0)
    }, 400)
  }

  const loadEvents = useCallback(async () => {
    setLoading(true)
    try {
      const filters: EventFilters = { limit: PAGE_SIZE, offset: page * PAGE_SIZE }
      if (activeCategories.length > 0) filters.category = activeCategories.join(',')
      if (debouncedSearch) filters.search = debouncedSearch
      if (freeOnly) filters.free = true
      if (dateFrom) filters.date_from = dateFrom
      if (dateTo) filters.date_to = dateTo
      if (timeOfDay) filters.time_of_day = timeOfDay
      const data = await fetchEvents(filters)
      setEvents(data.events)
      setTotal(data.total)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [activeCategories, debouncedSearch, freeOnly, dateFrom, dateTo, timeOfDay, page])

  useEffect(() => {
    fetchCategories().then(setCategories).catch(console.error)
  }, [])

  useEffect(() => { loadEvents() }, [loadEvents])

  useEffect(() => {
    const params = new URLSearchParams()
    if (debouncedSearch) params.set('search', debouncedSearch)
    if (activeCategories.length > 0) params.set('category', activeCategories.join(','))
    if (freeOnly) params.set('free', '1')
    if (dateFrom) params.set('date_from', dateFrom)
    if (dateTo) params.set('date_to', dateTo)
    if (timeOfDay) params.set('time_of_day', timeOfDay)
    setSearchParams(params, { replace: true })
  }, [debouncedSearch, activeCategories, freeOnly, dateFrom, dateTo, timeOfDay])

  function toggleCategory(slug: string) {
    setPage(0)
    setActiveCategories(prev =>
      prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
    )
  }

  function clearAll() {
    setSearch(''); setDebouncedSearch(''); setActiveCategories([])
    setFreeOnly(false); setDateFrom(''); setDateTo(''); setTimeOfDay(''); setPage(0)
  }

  const hasActiveFilters = activeCategories.length > 0 || freeOnly || dateFrom || dateTo || timeOfDay || debouncedSearch
  const totalPages = Math.ceil(total / PAGE_SIZE)

  const featuredEvent = events[0]
  const restEvents = events.slice(1)

  return (
    <Layout>
      {/* Page header */}
      <div className="mb-8">
        <p className="text-xs font-medium tracking-[0.2em] uppercase text-[#8A8480] mb-1">Atlanta events</p>
        <h1 className="font-display text-4xl md:text-5xl font-black text-[#1C1C1E] mb-2">
          What's on.
        </h1>
      </div>

      {/* Search + Filter bar */}
      <div className="mb-8 flex gap-3 items-start">
        {/* Search */}
        <div className="relative flex-1">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A8480]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            value={search}
            onChange={e => handleSearchChange(e.target.value)}
            placeholder="Search events, artists, venues..."
            className="w-full pl-11 pr-4 py-3 bg-white border border-[#E2DDD6] text-sm text-[#1C1C1E] placeholder:text-[#8A8480] focus:outline-none focus:border-[#7C3AED] transition-colors font-sans"
          />
          {search && (
            <button onClick={() => { setSearch(''); setDebouncedSearch(''); setPage(0) }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8A8480] hover:text-[#1C1C1E] text-xs">✕</button>
          )}
        </div>

        {/* Filter toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-3 border text-sm font-medium transition-colors font-sans ${
            showFilters || hasActiveFilters
              ? 'bg-[#1C1C1E] text-white border-[#1C1C1E]'
              : 'bg-white border-[#E2DDD6] text-[#1C1C1E] hover:border-[#1C1C1E]'
          }`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/>
            <line x1="11" y1="18" x2="13" y2="18"/>
          </svg>
          Filters
          {hasActiveFilters && (
            <span className="w-4 h-4 rounded-full bg-[#7C3AED] text-white text-[10px] flex items-center justify-center">
              {(activeCategories.length > 0 ? 1 : 0) + (freeOnly ? 1 : 0) + (dateFrom || dateTo ? 1 : 0) + (timeOfDay ? 1 : 0)}
            </span>
          )}
        </button>
      </div>

      {/* Expanded filters */}
      {showFilters && (
        <div className="mb-8 bg-white border border-[#E2DDD6] p-6 space-y-6">
          {/* Categories */}
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-[#8A8480] mb-3">Category</p>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => {
                const Icon = CATEGORY_ICONS[cat.slug]
                const color = CATEGORY_COLORS[cat.slug] || cat.color || '#7C3AED'
                const isActive = activeCategories.includes(cat.slug)
                return (
                  <button
                    key={cat.id}
                    onClick={() => toggleCategory(cat.slug)}
                    className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium border transition-all font-sans ${
                      isActive
                        ? 'text-white border-transparent'
                        : 'bg-transparent border-[#E2DDD6] text-[#1C1C1E] hover:border-[#1C1C1E]'
                    }`}
                    style={isActive ? { backgroundColor: color, borderColor: color } : {}}
                  >
                    {Icon && <Icon size={12} color={isActive ? 'white' : color} />}
                    {cat.name}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Time of day */}
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-[#8A8480] mb-3">Time of Day</p>
            <div className="flex gap-2">
              {(['', 'morning', 'afternoon', 'evening', 'night'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => { setTimeOfDay(t); setPage(0) }}
                  className={`px-4 py-2 text-xs font-medium border transition-all font-sans ${
                    timeOfDay === t
                      ? 'bg-[#1C1C1E] text-white border-[#1C1C1E]'
                      : 'bg-transparent border-[#E2DDD6] text-[#1C1C1E] hover:border-[#1C1C1E]'
                  }`}
                >
                  {t === '' ? 'Any time' : t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Date + Free */}
          <div className="flex flex-wrap gap-6 items-end">
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-[#8A8480] mb-2">Date Range</p>
              <div className="flex items-center gap-2">
                <input type="date" value={dateFrom} onChange={e => { setDateFrom(e.target.value); setPage(0) }}
                  className="px-3 py-2 text-sm border border-[#E2DDD6] text-[#1C1C1E] focus:outline-none focus:border-[#7C3AED] font-sans" />
                <span className="text-[#8A8480] text-sm">—</span>
                <input type="date" value={dateTo} min={dateFrom} onChange={e => { setDateTo(e.target.value); setPage(0) }}
                  className="px-3 py-2 text-sm border border-[#E2DDD6] text-[#1C1C1E] focus:outline-none focus:border-[#7C3AED] font-sans" />
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <div
                onClick={() => { setFreeOnly(!freeOnly); setPage(0) }}
                className={`w-10 h-5 rounded-full transition-all relative ${freeOnly ? 'bg-[#7C3AED]' : 'bg-[#DDD5C8]'}`}
              >
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${freeOnly ? 'left-5' : 'left-0.5'}`} />
              </div>
              <span className="text-sm font-medium text-[#1C1C1E] font-sans">Free events only</span>
            </label>

            {hasActiveFilters && (
              <button onClick={clearAll} className="text-xs text-[#8A8480] hover:text-[#7C3AED] underline transition-colors font-sans ml-auto">
                Clear all filters
              </button>
            )}
          </div>
        </div>
      )}

      {/* Result count */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-[#8A8480] font-sans">
          {loading ? '...' : `${total} event${total !== 1 ? 's' : ''}`}
          {hasActiveFilters && ' matching filters'}
        </p>
      </div>

      {/* Event grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-52 bg-[#DDD5C8] mb-3" />
              <div className="h-3 bg-[#DDD5C8] rounded mb-2 w-1/3" />
              <div className="h-4 bg-[#DDD5C8] rounded mb-2 w-4/5" />
              <div className="h-3 bg-[#DDD5C8] rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-24">
          <p className="font-display text-2xl font-bold text-[#1C1C1E] mb-2">Nothing found.</p>
          <p className="text-[#8A8480] text-sm mb-6">
            Try different filters or{' '}
            <button onClick={clearAll} className="text-[#7C3AED] font-medium hover:underline">clear all</button>
          </p>
        </div>
      ) : (
        <>
          {/* Featured first card — large */}
          {featuredEvent && page === 0 && (
            <div className="mb-10">
              <EventCard event={featuredEvent} featured />
            </div>
          )}

          {/* Rest in 3-col grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {(page === 0 ? restEvents : events).map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-16 flex items-center justify-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-5 py-2.5 border border-[#E2DDD6] text-sm font-medium text-[#1C1C1E] disabled:opacity-30 hover:border-[#1C1C1E] transition-colors font-sans"
              >
                ← Prev
              </button>

              {Array.from({ length: Math.min(totalPages, 7) }).map((_, i) => {
                let pageNum = i
                if (totalPages > 7) {
                  if (page < 4) pageNum = i
                  else if (page > totalPages - 4) pageNum = totalPages - 7 + i
                  else pageNum = page - 3 + i
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`w-10 h-10 text-sm font-medium border transition-all font-sans ${
                      page === pageNum
                        ? 'bg-[#1C1C1E] text-white border-[#1C1C1E]'
                        : 'border-[#E2DDD6] text-[#1C1C1E] hover:border-[#1C1C1E]'
                    }`}
                  >
                    {pageNum + 1}
                  </button>
                )
              })}

              <button
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="px-5 py-2.5 border border-[#E2DDD6] text-sm font-medium text-[#1C1C1E] disabled:opacity-30 hover:border-[#1C1C1E] transition-colors font-sans"
              >
                Next →
              </button>
            </div>
          )}

          <p className="text-center text-xs text-[#8A8480] mt-4 font-sans">
            Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, total)} of {total} events
          </p>
        </>
      )}
    </Layout>
  )
}
