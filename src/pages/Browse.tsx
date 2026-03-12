import React, { useEffect, useState, useCallback, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { EventCard } from '@/components/EventCard'
import { fetchEvents, fetchCategories, type Category, type EventFilters, type TimeOfDay } from '@/lib/api'
import type { Event } from '@/components/EventCard'

const PAGE_SIZE = 12

const TIME_OPTIONS: { value: TimeOfDay | ''; label: string; emoji: string }[] = [
  { value: '', label: 'Any time', emoji: '🕐' },
  { value: 'morning', label: 'Morning', emoji: '🌅' },
  { value: 'afternoon', label: 'Afternoon', emoji: '☀️' },
  { value: 'evening', label: 'Evening', emoji: '🌆' },
  { value: 'night', label: 'Night', emoji: '🌙' },
]

export function Browse() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [events, setEvents] = useState<Event[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)

  // Filters state
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [debouncedSearch, setDebouncedSearch] = useState(search)
  const [activeCategories, setActiveCategories] = useState<string[]>(
    searchParams.get('category') ? searchParams.get('category')!.split(',') : []
  )
  const [freeOnly, setFreeOnly] = useState(searchParams.get('free') === '1')
  const [dateFrom, setDateFrom] = useState(searchParams.get('date_from') || '')
  const [dateTo, setDateTo] = useState(searchParams.get('date_to') || '')
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay | ''>((searchParams.get('time_of_day') as TimeOfDay) || '')

  // Debounce search
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
      const filters: EventFilters = {
        limit: PAGE_SIZE,
        offset: page * PAGE_SIZE,
      }
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

  useEffect(() => {
    loadEvents()
  }, [loadEvents])

  // Sync to URL
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
    setSearch('')
    setDebouncedSearch('')
    setActiveCategories([])
    setFreeOnly(false)
    setDateFrom('')
    setDateTo('')
    setTimeOfDay('')
    setPage(0)
  }

  const hasActiveFilters = activeCategories.length > 0 || freeOnly || dateFrom || dateTo || timeOfDay || debouncedSearch

  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <Layout>
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold text-[#1A1A1A] mb-1">
          What's happening in Atlanta
        </h1>
        <p className="text-[#94A3B8] text-sm">
          {loading ? 'Loading...' : `${total} event${total !== 1 ? 's' : ''} ${hasActiveFilters ? 'match your filters' : 'coming up'}`}
        </p>
      </div>

      {/* Search bar */}
      <div className="mb-4">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            value={search}
            onChange={e => handleSearchChange(e.target.value)}
            placeholder="Search events, venues, descriptions..."
            className="w-full pl-9 pr-4 py-3 rounded-xl border border-[#E8E8E4] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent shadow-sm"
          />
          {search && (
            <button onClick={() => { setSearch(''); setDebouncedSearch(''); setPage(0) }} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#1A1A1A]">
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Filter bar */}
      <div className="mb-5 p-4 bg-white rounded-2xl border border-[#E8E8E4] shadow-sm space-y-3">
        {/* Row 1: Free toggle + Date range + Time of day */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Free only toggle */}
          <button
            onClick={() => { setFreeOnly(!freeOnly); setPage(0) }}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${
              freeOnly
                ? 'bg-[#00D4AA] text-white border-[#00D4AA]'
                : 'bg-[#F8F8F6] text-[#64748B] border-[#E8E8E4] hover:border-[#94A3B8]'
            }`}
          >
            🎟️ Free only
          </button>

          <div className="w-px h-5 bg-[#E8E8E4]" />

          {/* Date range */}
          <div className="flex items-center gap-2">
            <label className="text-xs text-[#94A3B8] font-medium whitespace-nowrap">From</label>
            <input
              type="date"
              value={dateFrom}
              onChange={e => { setDateFrom(e.target.value); setPage(0) }}
              className="px-2 py-1.5 text-sm border border-[#E8E8E4] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#FF6B35] bg-[#F8F8F6]"
            />
            <label className="text-xs text-[#94A3B8] font-medium">To</label>
            <input
              type="date"
              value={dateTo}
              min={dateFrom}
              onChange={e => { setDateTo(e.target.value); setPage(0) }}
              className="px-2 py-1.5 text-sm border border-[#E8E8E4] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#FF6B35] bg-[#F8F8F6]"
            />
          </div>

          <div className="w-px h-5 bg-[#E8E8E4]" />

          {/* Time of day */}
          <div className="flex gap-1">
            {TIME_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => { setTimeOfDay(opt.value); setPage(0) }}
                title={opt.label}
                className={`px-2.5 py-1.5 rounded-lg text-sm transition-all border ${
                  timeOfDay === opt.value
                    ? 'bg-[#FF6B35] text-white border-[#FF6B35]'
                    : 'bg-[#F8F8F6] text-[#64748B] border-[#E8E8E4] hover:border-[#94A3B8]'
                }`}
              >
                {opt.emoji} <span className="hidden sm:inline text-xs">{opt.label}</span>
              </button>
            ))}
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearAll}
              className="ml-auto text-xs text-[#94A3B8] hover:text-[#FF6B35] transition-colors underline"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Row 2: Category pills */}
        <div>
          <div className="flex flex-wrap gap-1.5">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => toggleCategory(cat.slug)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all border ${
                  activeCategories.includes(cat.slug)
                    ? 'text-white border-transparent'
                    : 'bg-[#F8F8F6] border-[#E8E8E4] text-[#64748B] hover:border-[#94A3B8]'
                }`}
                style={activeCategories.includes(cat.slug) ? { backgroundColor: cat.color || '#FF6B35', borderColor: cat.color || '#FF6B35' } : {}}
              >
                {cat.icon && <span className="mr-1">{cat.icon}</span>}
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Active filter chips */}
      {activeCategories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {activeCategories.map(slug => {
            const cat = categories.find(c => c.slug === slug)
            return cat ? (
              <span
                key={slug}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium text-white"
                style={{ backgroundColor: cat.color || '#FF6B35' }}
              >
                {cat.icon} {cat.name}
                <button onClick={() => toggleCategory(slug)} className="ml-1 hover:opacity-70">✕</button>
              </span>
            ) : null
          })}
        </div>
      )}

      {/* Event grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: PAGE_SIZE }).map((_, i) => (
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
          <p className="text-[#94A3B8] mb-6 text-sm">
            Try different filters or{' '}
            <button onClick={clearAll} className="text-[#FF6B35] font-medium hover:underline">
              clear all filters
            </button>
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {events.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-4 py-2 rounded-xl border border-[#E8E8E4] text-sm font-medium disabled:opacity-40 hover:border-[#FF6B35] hover:text-[#FF6B35] transition-colors"
              >
                ← Prev
              </button>

              {Array.from({ length: Math.min(totalPages, 7) }).map((_, i) => {
                // Show pages around current
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
                    className={`w-9 h-9 rounded-xl text-sm font-medium transition-all ${
                      page === pageNum
                        ? 'bg-[#FF6B35] text-white'
                        : 'border border-[#E8E8E4] hover:border-[#FF6B35] hover:text-[#FF6B35]'
                    }`}
                  >
                    {pageNum + 1}
                  </button>
                )
              })}

              <button
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="px-4 py-2 rounded-xl border border-[#E8E8E4] text-sm font-medium disabled:opacity-40 hover:border-[#FF6B35] hover:text-[#FF6B35] transition-colors"
              >
                Next →
              </button>
            </div>
          )}

          <p className="text-center text-xs text-[#94A3B8] mt-3">
            Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, total)} of {total} events
          </p>
        </>
      )}
    </Layout>
  )
}
