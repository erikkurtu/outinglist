import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { AddToListModal } from './AddToListModal'
import { CATEGORY_ICONS, CATEGORY_COLORS } from './icons/CategoryIcons'

export interface Event {
  id: string
  title: string
  description?: string
  start_at: string
  end_at?: string
  location_name?: string
  location_address?: string
  price_min?: number
  price_max?: number
  is_free?: number
  image_url?: string
  source_type: string
  source_url?: string
  categories?: Array<{ id: string; name: string; slug: string; icon?: string; color?: string }>
}

interface EventCardProps {
  event: Event
  onLike?: (id: string) => void
  liked?: boolean
  compact?: boolean
  featured?: boolean
  className?: string
}

function formatEventDate(dateStr: string) {
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return ''
    const day = d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()
    const month = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
    const date = d.getDate()
    return `${day} ${month} ${date}`
  } catch {
    return ''
  }
}

function formatPrice(min?: number, max?: number) {
  if (min === undefined && max === undefined) return null
  if (min === 0 && (max === undefined || max === 0)) return 'Free'
  if (min !== undefined && max !== undefined && min !== max) return `$${min}–$${max}`
  if (min !== undefined) return `$${min}`
  if (max !== undefined) return `$${max}`
  return null
}

// Dark color bands per category for gradient fallbacks
const CATEGORY_BG_DARK: Record<string, string> = {
  'music-concerts': '#1A0F3A',
  'food-drink': '#2A1A08',
  'arts-culture': '#2A0F1A',
  'sports-fitness': '#0A2A1A',
  'nightlife-parties': '#0F0F2A',
  'family-kids': '#2A150A',
  'outdoor-nature': '#0A1F0A',
  'tech-innovation': '#0A1527',
  'community-civic': '#0A1F1A',
  'wellness-spirituality': '#1A0A2A',
}

function getCategoryBg(slug?: string) {
  if (slug && CATEGORY_BG_DARK[slug]) return CATEGORY_BG_DARK[slug]
  return '#1C1C1E'
}

export function EventCard({ event, onLike, liked = false, compact = false, featured = false, className }: EventCardProps) {
  const [isLiked, setIsLiked] = useState(liked)
  const [showAddToList, setShowAddToList] = useState(false)
  const primaryCat = event.categories?.[0]
  const IconComponent = primaryCat?.slug ? CATEGORY_ICONS[primaryCat.slug] : null
  const catColor = primaryCat?.slug ? CATEGORY_COLORS[primaryCat.slug] : '#7C3AED'
  const catBg = getCategoryBg(primaryCat?.slug)
  const imageUrl = event.image_url || null  // No placeholder — only show image if one exists
  const dateLabel = formatEventDate(event.start_at)
  const priceLabel = event.is_free === 1 ? 'Free' : formatPrice(event.price_min, event.price_max)

  function handleLike(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    setIsLiked(!isLiked)
    onLike?.(event.id)
  }

  function handleAddToList(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    setShowAddToList(true)
  }

  if (featured) {
    // Large featured card — full-width hero style
    return (
      <>
        <Link
          to={`/events/${event.id}`}
          className={cn('group relative block overflow-hidden', className)}
          style={{ minHeight: 460, backgroundColor: catBg }}
        >
          {/* Background image — only if exists */}
          {imageUrl && (
            <img
              src={imageUrl}
              alt={event.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none'
              }}
            />
          )}
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-8">
            {/* Category + date row */}
            <div className="flex items-center gap-3 mb-4">
              {primaryCat && (
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: catColor }} />
                  <span className="text-white/70 text-xs font-medium tracking-widest uppercase">
                    {primaryCat.name}
                  </span>
                </div>
              )}
              {dateLabel && (
                <span className="text-white/50 text-xs tracking-widest uppercase">{dateLabel}</span>
              )}
            </div>

            <h2 className="font-display text-3xl md:text-4xl font-bold text-white leading-tight mb-3 group-hover:text-[#F5E8D4] transition-colors">
              {event.title}
            </h2>

            <div className="flex items-center gap-4">
              {event.location_name && (
                <span className="text-white/60 text-sm">{event.location_name}</span>
              )}
              {priceLabel && (
                <span
                  className="text-xs font-semibold px-2 py-1 rounded"
                  style={{ backgroundColor: catColor, color: 'white' }}
                >
                  {priceLabel}
                </span>
              )}
            </div>
          </div>

          {/* Like button */}
          <button
            onClick={handleLike}
            className={cn(
              'absolute top-5 right-5 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-150',
              'backdrop-blur-sm',
              isLiked ? 'bg-[#7C3AED] text-white' : 'bg-black/40 text-white/70 hover:text-white'
            )}
            aria-label="Like event"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </Link>

        {showAddToList && (
          <AddToListModal eventId={event.id} onClose={() => setShowAddToList(false)} />
        )}
      </>
    )
  }

  // Standard card — image-dominant, NO border, NO rounded container
  return (
    <>
      <Link
        to={`/events/${event.id}`}
        className={cn('group block', className)}
      >
        {/* Image block — only shown if event has an image */}
        {imageUrl ? (
          <div className={cn('relative overflow-hidden', compact ? 'h-40' : 'h-52')}
            style={{ backgroundColor: catBg }}>
            <img
              src={imageUrl}
              alt={event.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
              style={{ transform: 'scale(1)', transition: 'transform 500ms ease' }}
              onMouseOver={e => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.04)' }}
              onMouseOut={e => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)' }}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none'
              }}
            />

            {/* Free badge */}
            {event.is_free === 1 && (
              <div className="absolute top-3 left-3">
                <span className="bg-[#1C1C1E] text-white text-xs font-semibold tracking-wide px-2 py-1 rounded-[3px]">
                  FREE
                </span>
              </div>
            )}

            {/* Like button */}
            <button
              onClick={handleLike}
              className={cn(
                'absolute top-3 right-3 w-8 h-8 flex items-center justify-center transition-all duration-150 rounded-[6px]',
                'backdrop-blur-sm',
                isLiked ? 'bg-[#7C3AED] text-white' : 'bg-black/30 text-white/70 hover:text-white opacity-0 group-hover:opacity-100'
              )}
              aria-label="Like event"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>

            {/* Add to list */}
            <button
              onClick={handleAddToList}
              className="absolute bottom-3 right-3 w-7 h-7 flex items-center justify-center bg-black/30 text-white/70 hover:text-white backdrop-blur-sm transition-all duration-150 opacity-0 group-hover:opacity-100 rounded-[6px]"
              aria-label="Add to list"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
          </div>
        ) : (
          /* No image — clean text-only card with subtle top border accent */
          <div className="relative pt-1">
            <div className="h-0.5 w-12" style={{ backgroundColor: catColor }} />
            <div className="flex items-center justify-between pt-2">
              {event.is_free === 1 && (
                <span className="text-xs font-semibold tracking-wide text-[#1C1C1E] bg-[#E8E2D8] px-2 py-0.5 rounded-[3px]">
                  FREE
                </span>
              )}
              <div className="flex gap-1 ml-auto">
                <button
                  onClick={handleLike}
                  className={cn(
                    'w-7 h-7 flex items-center justify-center transition-all duration-150 rounded-[6px]',
                    isLiked ? 'text-[#7C3AED]' : 'text-[#C4BEB4] hover:text-[#7C3AED] opacity-0 group-hover:opacity-100'
                  )}
                  aria-label="Like event"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Text content — NO card border, clean typography */}
        <div className="pt-3 pb-4">
          {/* Category dot + name */}
          {primaryCat && (
            <div className="flex items-center gap-1.5 mb-2">
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: catColor }} />
              <span className="text-xs font-medium tracking-wide uppercase" style={{ color: catColor }}>
                {primaryCat.name}
              </span>
            </div>
          )}

          {/* Title */}
          <h3 className="font-display font-bold text-[#1C1C1E] leading-tight mb-2 transition-colors group-hover:text-[#7C3AED]"
            style={{ fontSize: compact ? '1rem' : '1.1rem', lineHeight: 1.25 }}>
            {event.title}
          </h3>

          {/* Date and location */}
          <div className="flex items-center gap-3 text-xs text-[#8A8480]">
            {dateLabel && <span className="font-medium tracking-wider">{dateLabel}</span>}
            {dateLabel && event.location_name && <span className="text-[#D0C8BF]">·</span>}
            {event.location_name && (
              <span className="truncate">{event.location_name}</span>
            )}
          </div>

          {/* Price */}
          {event.is_free !== 1 && priceLabel && (
            <div className="mt-1.5 text-xs font-semibold text-[#7C3AED]">
              {priceLabel}
            </div>
          )}
        </div>
      </Link>

      {showAddToList && (
        <AddToListModal eventId={event.id} onClose={() => setShowAddToList(false)} />
      )}
    </>
  )
}
