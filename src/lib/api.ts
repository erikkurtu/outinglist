import type { Event } from '@/components/EventCard'

const BASE = '/api'

export interface Category {
  id: string
  name: string
  slug: string
  icon?: string
  color?: string
  sort_order: number
}

export interface EventsResponse {
  events: Event[]
  total: number
}

export interface EventFilters {
  category?: string
  search?: string
  free?: boolean
  from?: string
  to?: string
  limit?: number
  offset?: number
}

export async function fetchEvents(filters: EventFilters = {}): Promise<EventsResponse> {
  const params = new URLSearchParams()
  if (filters.category) params.set('category', filters.category)
  if (filters.search) params.set('search', filters.search)
  if (filters.free) params.set('free', '1')
  if (filters.from) params.set('from', filters.from)
  if (filters.to) params.set('to', filters.to)
  if (filters.limit) params.set('limit', String(filters.limit))
  if (filters.offset) params.set('offset', String(filters.offset))

  const res = await fetch(`${BASE}/events?${params}`)
  if (!res.ok) throw new Error('Failed to fetch events')
  return res.json()
}

export async function fetchEvent(id: string): Promise<Event> {
  const res = await fetch(`${BASE}/events/${id}`)
  if (!res.ok) throw new Error('Event not found')
  return res.json()
}

export async function fetchCategories(): Promise<Category[]> {
  const res = await fetch(`${BASE}/categories`)
  if (!res.ok) throw new Error('Failed to fetch categories')
  return res.json()
}

export async function createEvent(data: Partial<Event>): Promise<Event> {
  const res = await fetch(`${BASE}/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to create event')
  return res.json()
}
