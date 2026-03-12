import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(isoString: string): string {
  const date = new Date(isoString)
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'America/New_York',
  })
}

export function formatDateShort(isoString: string): string {
  const date = new Date(isoString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'America/New_York',
  })
}

export function formatTime(isoString: string): string {
  const date = new Date(isoString)
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'America/New_York',
  })
}

export function formatPrice(min?: number, max?: number): string {
  if (min === undefined && max === undefined) return ''
  if (min === 0 || (min === undefined && max === 0)) return 'Free'
  if (min !== undefined && max !== undefined && min === max) return `$${min}`
  if (min !== undefined && max !== undefined) return `$${min}–$${max}`
  if (min !== undefined) return `From $${min}`
  if (max !== undefined) return `Up to $${max}`
  return ''
}

export function decodeEntities(str: string): string {
  if (typeof document !== 'undefined') {
    const txt = document.createElement('textarea')
    txt.innerHTML = str
    return txt.value
  }
  // Fallback for non-browser
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#39;/g, "'")
}

export function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}
