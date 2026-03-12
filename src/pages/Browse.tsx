import React, { useEffect, useState, useCallback, useRef } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { fetchEvents, fetchCategories, type Category, type EventFilters, type TimeOfDay } from '@/lib/api'
import type { Event } from '@/components/EventCard'
import { CATEGORY_ICONS, CATEGORY_COLORS } from '@/components/icons/CategoryIcons'

const PAGE_SIZE = 25

function formatEventDate(dateStr: string) {
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return { day: '', date: '', time: '' }
    const day = d.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'America/New_York' }).toUpperCase()
    const month = d.toLocaleDateString('en-US', { month: 'short', timeZone: 'America/New_York' })
    const date = d.getDate()
    const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'America/New_York' })
    return { day, date: `${month} ${date}`, time }
  } catch {
    return { day: '', date: '', time: '' }
  }
}

function formatPrice(ev: Event) {
  if (ev.is_free === 1) return 'Free'
  if (ev.price_min !== undefined && ev.price_max !== undefined && ev.price_min !== ev.price_max) return `$${ev.price_min}–$${ev.price_max}`
  if (ev.price_min !== undefined && ev.price_min > 0) return `$${ev.price_min}`
  if (ev.price_max !== undefined && ev.price_max > 0) return `$${ev.price_max}`
  return ''
}

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
  const [viewMode, setViewMode] = useState<'list' | 'compact'>('list')

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

  // Group events by date for the list view
  const eventsByDate = events.reduce<Record<string, Event[]>>((acc, ev) => {
    const { date } = formatEventDate(ev.start_at)
    const key = date || 'TBD'
    if (!acc[key]) acc[key] = []
    acc[key].push(ev)
    return acc
  }, {})

  return (
    <Layout>
      {/* Page header */}
      <div className="mb-6">
        <p className="text-xs font-medium tracking-[0.2em] uppercase text-[#8A8480] mb-1">Atlanta events</p>
        <h1 className="font-display text-4xl md:text-5xl font-black text-[#1C1C1E]">
          What's on.
        </h1>
      </div>

      {/* Search + Filter bar */}
      <div className="mb-6 flex gap-3 items-start">
        <div className="relative flex-1">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A8480]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            value={search}
            onChange={e => handleSearchChange(e.target.value)}
            placeholder="Search events, artists, venues..."
            className="w-full pl-11 pr-4 py-3 bg-white border border-[#E2DDD6] rounded-[6px] text-sm text-[#1C1C1E] placeholder:text-[#8A8480] focus:outline-none focus:border-[#7C3AED] transition-colors font-sans"
          />
          {search && (
            <button onClick={() => { setSearch(''); setDebouncedSearch(''); setPage(0) }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8A8480] hover:text-[#1C1C1E] text-xs">✕</button>
          )}
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-3 border rounded-[6px] text-sm font-medium transition-colors font-sans ${
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

        {/* View toggle */}
        <div className="flex border border-[#E2DDD6] rounded-[6px] overflow-hidden">
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-3 transition-colors ${viewMode === 'list' ? 'bg-[#1C1C1E] text-white' : 'bg-white text-[#8A8480] hover:text-[#1C1C1E]'}`}
            title="List view"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
          <button
            onClick={() => setViewMode('compact')}
            className={`px-3 py-3 transition-colors ${viewMode === 'compact' ? 'bg-[#1C1C1E] text-white' : 'bg-white text-[#8A8480] hover:text-[#1C1C1E]'}`}
            title="Compact view"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Expanded filters */}
      {showFilters && (
        <div className="mb-6 bg-white border border-[#E2DDD6] rounded-[6px] p-6 space-y-5">
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
                    className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium border rounded-[4px] transition-all font-sans ${
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

          {/* Time + Date + Free */}
          <div className="flex flex-wrap gap-6 items-end">
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-[#8A8480] mb-2">Time of Day</p>
              <div className="flex gap-1.5">
                {(['', 'morning', 'afternoon', 'evening', 'night'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => { setTimeOfDay(t); setPage(0) }}
                    className={`px-3 py-1.5 text-xs font-medium border rounded-[4px] transition-all font-sans ${
                      timeOfDay === t
                        ? 'bg-[#1C1C1E] text-white border-[#1C1C1E]'
                        : 'bg-transparent border-[#E2DDD6] text-[#1C1C1E] hover:border-[#1C1C1E]'
                    }`}
                  >
                    {t === '' ? 'Any' : t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-[#8A8480] mb-2">Date Range</p>
              <div className="flex items-center gap-2">
                <input type="date" value={dateFrom} onChange={e => { setDateFrom(e.target.value); setPage(0) }}
                  className="px-3 py-1.5 text-xs border border-[#E2DDD6] rounded-[4px] text-[#1C1C1E] focus:outline-none focus:border-[#7C3AED] font-sans" />
                <span className="text-[#8A8480] text-xs">to</span>
                <input type="date" value={dateTo} min={dateFrom} onChange={e => { setDateTo(e.target.value); setPage(0) }}
                  className="px-3 py-1.5 text-xs border border-[#E2DDD6] rounded-[4px] text-[#1C1C1E] focus:outline-none focus:border-[#7C3AED] font-sans" />
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <div
                onClick={() => { setFreeOnly(!freeOnly); setPage(0) }}
                className={`w-8 h-4 rounded-full transition-all relative cursor-pointer ${freeOnly ? 'bg-[#7C3AED]' : 'bg-[#DDD5C8]'}`}
              >
                <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow transition-all ${freeOnly ? 'left-4' : 'left-0.5'}`} />
              </div>
              <span className="text-xs font-medium text-[#1C1C1E] font-sans">Free only</span>
            </label>

            {hasActiveFilters && (
              <button onClick={clearAll} className="text-xs text-[#8A8480] hover:text-[#7C3AED] underline transition-colors font-sans ml-auto">
                Clear all
              </button>
            )}
          </div>
        </div>
      )}

      {/* Result count */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-[#8A8480] font-sans">
          {loading ? '...' : `${total} event${total !== 1 ? 's' : ''}`}
          {hasActiveFilters && ' matching'}
        </p>
      </div>

      {/* EVENT LIST */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="animate-pulse flex gap-4 py-3 border-b border-[#E2DDD6]">
              <div className="w-16 h-4 bg-[#DDD5C8] rounded" />
              <div className="flex-1 h-4 bg-[#DDD5C8] rounded" />
              <div className="w-24 h-4 bg-[#DDD5C8] rounded" />
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
      ) : viewMode === 'list' ? (
        /* ===== LIST VIEW — grouped by date ===== */
        <div className="space-y-0">
          {Object.entries(eventsByDate).map(([dateLabel, dateEvents]) => (
            <div key={dateLabel}>
              {/* Date header */}
              <div className="sticky top-14 z-10 bg-[#F5F0E8] pt-4 pb-2 border-b-2 border-[#1C1C1E]">
                <span className="text-xs font-bold tracking-[0.15em] uppercase text-[#1C1C1E]">
                  {dateLabel}
                </span>
              </div>

              {/* Events for this date */}
              {dateEvents.map(event => {
                const { time } = formatEventDate(event.start_at)
                const price = formatPrice(event)
                const primaryCat = event.categories?.[0]
                const catColor = primaryCat?.slug ? CATEGORY_COLORS[primaryCat.slug] : '#7C3AED'

                return (
                  <Link
                    key={event.id}
                    to={`/events/${event.id}`}
                    className="group flex items-baseline gap-4 py-3 border-b border-[#E2DDD6] hover:bg-white/50 transition-colors px-2 -mx-2"
                  >
                    {/* Time */}
                    <span className="text-xs font-medium text-[#8A8480] w-16 flex-shrink-0 tabular-nums">
                      {time}
                    </span>

                    {/* Category dot */}
                    <span className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5" style={{ backgroundColor: catColor }} />

                    {/* Title + venue */}
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-semibold text-[#1C1C1E] group-hover:text-[#7C3AED] transition-colors">
                        {event.title}
                      </span>
                      {event.location_name && (
                        <span className="text-xs text-[#8A8480] ml-3">
                          {event.location_name}
                        </span>
                      )}
                    </div>

                    {/* Category label */}
                    {primaryCat && (
                      <span className="text-[10px] font-medium tracking-wide uppercase flex-shrink-0 hidden sm:inline" style={{ color: catColor }}>
                        {primaryCat.name}
                      </span>
                    )}

                    {/* Price */}
                    <span className={`text-xs font-medium flex-shrink-0 w-16 text-right ${event.is_free === 1 ? 'text-[#2A7A4A]' : 'text-[#1C1C1E]'}`}>
                      {price}
                    </span>

                    {/* Arrow */}
                    <svg className="w-3 h-3 text-[#C4BEB4] group-hover:text-[#7C3AED] transition-colors flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </Link>
                )
              })}
            </div>
          ))}
        </div>
      ) : (
        /* ===== COMPACT GRID VIEW — no images, just text ===== */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-1">
          {events.map(event => {
            const { day, date, time } = formatEventDate(event.start_at)
            const price = formatPrice(event)
            const primaryCat = event.categories?.[0]
            const catColor = primaryCat?.slug ? CATEGORY_COLORS[primaryCat.slug] : '#7C3AED'

            return (
              <Link
                key={event.id}
                to={`/events/${event.id}`}
                className="group block py-4 border-b border-[#E2DDD6] hover:bg-white/30 transition-colors"
              >
                {/* Date row */}
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-bold tracking-wider uppercase text-[#8A8480]">
                    {day} {date}
                  </span>
                  {time && (
                    <>
                      <span className="text-[#D0C8BF]">·</span>
                      <span className="text-[10px] text-[#8A8480]">{time}</span>
                    </>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-sm font-bold text-[#1C1C1E] leading-snug mb-1 group-hover:text-[#7C3AED] transition-colors">
                  {event.title}
                </h3>

                {/* Meta row */}
                <div className="flex items-center gap-2 text-xs text-[#8A8480]">
                  {primaryCat && (
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: catColor }} />
                      <span style={{ color: catColor }} className="font-medium">{primaryCat.name}</span>
                    </div>
                  )}
                  {event.location_name && (
                    <>
                      <span className="text-[#D0C8BF]">·</span>
                      <span className="truncate">{event.location_name}</span>
                    </>
                  )}
                  {price && (
                    <>
                      <span className="text-[#D0C8BF]">·</span>
                      <span className={event.is_free === 1 ? 'text-[#2A7A4A] font-medium' : ''}>{price}</span>
                    </>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-12 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-4 py-2 border border-[#E2DDD6] rounded-[6px] text-sm font-medium text-[#1C1C1E] disabled:opacity-30 hover:border-[#1C1C1E] transition-colors font-sans"
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
                className={`w-9 h-9 text-sm font-medium border rounded-[6px] transition-all font-sans ${
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
            className="px-4 py-2 border border-[#E2DDD6] rounded-[6px] text-sm font-medium text-[#1C1C1E] disabled:opacity-30 hover:border-[#1C1C1E] transition-colors font-sans"
          >
            Next →
          </button>
        </div>
      )}

      <p className="text-center text-xs text-[#8A8480] mt-4 mb-8 font-sans">
        Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, total)} of {total} events
      </p>
    </Layout>
  )
}
