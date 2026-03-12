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
  category?: string
  search?: string
  free?: boolean
  date_from?: string
  date_to?: string
  time_of_day?: TimeOfDay
  limit?: number
  offset?: number
}

export interface List {
  id: string
  title: string
  description?: string
  user_id: string
  is_public: number
  cover_image_url?: string
  metro: string
  created_at: string
  updated_at: string
  event_count?: number
  like_count?: number
  preview_events?: Partial<Event>[]
}

export interface ListDetail extends List {
  events: Event[]
  liked: boolean
  profile: UserProfile | null
}

export interface UserProfile {
  user_id: string
  display_name?: string
  bio?: string
  is_curator: number
  metro: string
  stats?: { event_count: number; list_count: number; like_count: number }
  public_lists?: List[]
  liked_events?: Event[]
  my_events?: Event[]
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

// Lists
export async function fetchLists(userId: string): Promise<List[]> {
  const res = await fetch(`${BASE}/lists?user_id=${userId}`)
  if (!res.ok) throw new Error('Failed to fetch lists')
  return res.json()
}

export async function fetchList(id: string, userId?: string): Promise<ListDetail> {
  const params = userId ? `?user_id=${userId}` : ''
  const res = await fetch(`${BASE}/lists/${id}${params}`)
  if (!res.ok) throw new Error('List not found')
  return res.json()
}

export async function createList(data: { user_id: string; title: string; description?: string; is_public?: boolean; cover_image_url?: string }): Promise<List> {
  const res = await fetch(`${BASE}/lists`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to create list')
  return res.json()
}

export async function addEventToList(listId: string, eventId: string, userId: string): Promise<void> {
  const res = await fetch(`${BASE}/lists/${listId}/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event_id: eventId, user_id: userId }),
  })
  if (!res.ok) throw new Error('Failed to add event to list')
}

export async function removeEventFromList(listId: string, eventId: string, userId: string): Promise<void> {
  const res = await fetch(`${BASE}/lists/${listId}/events/${eventId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId }),
  })
  if (!res.ok) throw new Error('Failed to remove event from list')
}

export async function fetchUserProfile(userId: string): Promise<UserProfile> {
  const res = await fetch(`${BASE}/users/${userId}/profile`)
  if (!res.ok) throw new Error('Failed to fetch profile')
  return res.json()
}

export async function updateUserProfile(userId: string, data: { display_name?: string; bio?: string }): Promise<UserProfile> {
  const res = await fetch(`${BASE}/users/${userId}/profile`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to update profile')
  return res.json()
}
