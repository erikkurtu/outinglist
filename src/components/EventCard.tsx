import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Badge } from './Badge'
import { cn } from '@/lib/utils'
import { formatDate, formatPrice } from '@/lib/utils'
import { AddToListModal } from './AddToListModal'

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
  className?: string
}

const CATEGORY_GRADIENTS = [
  'from-orange-400 to-pink-500',
  'from-purple-500 to-indigo-600',
  'from-teal-400 to-cyan-500',
  'from-yellow-400 to-orange-500',
  'from-green-400 to-emerald-500',
  'from-pink-400 to-rose-500',
]

function getGradient(id: string) {
  const idx = id.charCodeAt(0) % CATEGORY_GRADIENTS.length
  return CATEGORY_GRADIENTS[idx]
}

export function EventCard({ event, onLike, liked = false, compact = false, className }: EventCardProps) {
  const [isLiked, setIsLiked] = useState(liked)
  const [showAddToList, setShowAddToList] = useState(false)
  const gradient = getGradient(event.id)
  const primaryCat = event.categories?.[0]

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

  return (
    <>
    <Link
      to={`/events/${event.id}`}
      className={cn(
        'group block bg-white rounded-[16px] overflow-hidden transition-all duration-200',
        'border border-[#E8E8E4] hover:border-transparent',
        'shadow-[0_2px_12px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)]',
        'hover:-translate-y-0.5',
        className
      )}
    >
      {/* Image / Gradient hero */}
      <div className={cn('relative overflow-hidden', compact ? 'h-36' : 'h-48')}>
        {event.image_url ? (
          <img
            src={event.image_url}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
        ) : (
          <div className={cn('w-full h-full bg-gradient-to-br flex items-center justify-center text-5xl', gradient)}>
            {primaryCat?.icon || '🎉'}
          </div>
        )}

        {/* Like button */}
        <button
          onClick={handleLike}
          className={cn(
            'absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-150',
            'backdrop-blur-sm shadow-sm',
            isLiked
              ? 'bg-[#FF6B35] text-white'
              : 'bg-white/80 text-[#94A3B8] hover:text-[#FF6B35]'
          )}
          aria-label="Like event"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        {/* Add to list button */}
        <button
          onClick={handleAddToList}
          className="absolute top-3 left-3 w-8 h-8 rounded-full flex items-center justify-center bg-white/80 text-[#94A3B8] hover:text-[#FF6B35] backdrop-blur-sm shadow-sm transition-all duration-150 opacity-0 group-hover:opacity-100"
          aria-label="Add to list"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>

        {/* Free badge */}
        {event.is_free === 1 && (
          <div className="absolute top-3 left-3">
            <span className="bg-[#00D4AA] text-white text-xs font-semibold px-2 py-0.5 rounded-[6px]">
              FREE
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Categories */}
        {event.categories && event.categories.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {event.categories.slice(0, 2).map(cat => (
              <Badge
                key={cat.id}
                label={cat.name}
                icon={cat.icon}
                color={cat.color || '#FF6B35'}
              />
            ))}
          </div>
        )}

        {/* Title */}
        <h3 className="font-display font-semibold text-[#1A1A1A] leading-snug mb-2 group-hover:text-[#FF6B35] transition-colors line-clamp-2">
          {event.title}
        </h3>

        {/* Date & Location */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-[#94A3B8]">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <span>{formatDate(event.start_at)}</span>
          </div>
          {event.location_name && (
            <div className="flex items-center gap-1.5 text-xs text-[#94A3B8]">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <span className="truncate">{event.location_name}</span>
            </div>
          )}
        </div>

        {/* Price */}
        {event.is_free !== 1 && (event.price_min !== undefined || event.price_max !== undefined) && (
          <div className="mt-2 text-sm font-semibold text-[#FF6B35]">
            {formatPrice(event.price_min, event.price_max)}
          </div>
        )}
      </div>
    </Link>

    {/* Add to List Modal (outside Link to avoid navigation) */}
    {showAddToList && (
      <AddToListModal eventId={event.id} onClose={() => setShowAddToList(false)} />
    )}
    </>
  )
}
