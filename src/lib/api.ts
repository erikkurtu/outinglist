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
  limit: number
  offset: number
}

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night'

export interface EventFilters {
  category?: string     // comma-separated slugs
  search?: string
  free?: boolean
  date_from?: string   // YYYY-MM-DD
  date_to?: string     // YYYY-MM-DD
  time_of_day?: TimeOfDay
  limit?: number
  offset?: number
}

export async function fetchEvents(filters: EventFilters = {}): Promise<EventsResponse> {
  const params = new URLSearchParams()
  if (filters.category) params.set('category', filters.category)
  if (filters.search) params.set('search', filters.search)
  if (filters.free) params.set('free', '1')
  if (filters.date_from) params.set('date_from', filters.date_from)
  if (filters.date_to) params.set('date_to', filters.date_to)
  if (filters.time_of_day) params.set('time_of_day', filters.time_of_day)
  if (filters.limit) params.set('limit', String(filters.limit))
  if (filters.offset !== undefined) params.set('offset', String(filters.offset))

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

export async function createEvent(data: Partial<Event> & { category_ids?: string[] }): Promise<Event> {
  const res = await fetch(`${BASE}/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to create event')
  return res.json()
}

export async function toggleLike(userId: string, targetType: 'event' | 'list', targetId: string): Promise<{ liked: boolean }> {
  const res = await fetch(`${BASE}/likes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, target_type: targetType, target_id: targetId }),
  })
  if (!res.ok) throw new Error('Failed to toggle like')
  return res.json()
}

export async function getLikes(targetType: 'event' | 'list', targetId: string, userId?: string): Promise<{ count: number; liked: boolean }> {
  const params = new URLSearchParams()
  if (userId) params.set('user_id', userId)
  const res = await fetch(`${BASE}/likes/${targetType}/${targetId}?${params}`)
  if (!res.ok) throw new Error('Failed to fetch likes')
  return res.json()
}
