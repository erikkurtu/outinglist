import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { Button } from '@/components/Button'
import { fetchEvent, getLikes, toggleLike } from '@/lib/api'
import { formatDate, formatPrice } from '@/lib/utils'
import { useAuth } from '@/lib/auth'
import { AddToListModal } from '@/components/AddToListModal'
import { useToast } from '@/components/Toast'
import type { Event } from '@/components/EventCard'
import { CATEGORY_COLORS } from '@/components/icons/CategoryIcons'

export function EventDetail() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [likeCount, setLikeCount] = useState(0)
  const [liked, setLiked] = useState(false)
  const [likeLoading, setLikeLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showAddToList, setShowAddToList] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (!id) return
    fetchEvent(id)
      .then(evt => {
        setEvent(evt)
        return getLikes('event', id, user?.id)
      })
      .then(data => {
        setLikeCount(data.count)
        setLiked(data.liked)
      })
      .catch(() => setError('Event not found'))
      .finally(() => setLoading(false))
  }, [id, user?.id])

  async function handleLike() {
    if (!user || !id) return
    setLikeLoading(true)
    try {
      const res = await toggleLike(user.id, 'event', id)
      setLiked(res.liked)
      setLikeCount(prev => res.liked ? prev + 1 : prev - 1)
    } catch (err) {
      console.error(err)
    } finally {
      setLikeLoading(false)
    }
  }

  async function handleShare() {
    const shareUrl = `${window.location.origin}/share/events/${id}`
    try {
      await navigator.clipboard.writeText(shareUrl)
      toast('Link copied to clipboard!', 'success')
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast('Failed to copy link', 'error')
    }
  }

  if (loading) return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="space-y-3 pt-8">
          <div className="h-3 bg-[#D1D5DB] rounded w-24 animate-pulse" />
          <div className="h-8 bg-[#D1D5DB] rounded w-3/4 animate-pulse" />
          <div className="h-4 bg-[#D1D5DB] rounded w-1/2 animate-pulse" />
        </div>
      </div>
    </Layout>
  )

  if (error || !event) return (
    <Layout>
      <div className="text-center py-20">
        <h2 className="font-display text-xl font-bold mb-2 text-[#1A1A1F]">Event not found</h2>
        <Link to="/browse" className="text-[#6366F1] hover:underline text-sm">← Back to browse</Link>
      </div>
    </Layout>
  )

  const primaryCat = event.categories?.[0]
  const catColor = primaryCat?.slug ? CATEGORY_COLORS[primaryCat.slug] : '#6366F1'
  const isFree = event.is_free === 1
  const priceLabel = isFree ? 'Free' : formatPrice(event.price_min, event.price_max)

  // Decode HTML entities from scraped data
  function decodeEntities(str: string) {
    const txt = document.createElement('textarea')
    txt.innerHTML = str
    return txt.value
  }

  const title = decodeEntities(event.title)
  const description = event.description ? decodeEntities(event.description) : null

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <Link to="/browse" className="inline-flex items-center gap-1.5 text-sm text-[#9CA3AF] hover:text-[#1A1A1F] mb-8 transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Back to events
        </Link>

        {/* Category + date header */}
        <div className="flex items-center gap-3 mb-4">
          {primaryCat && (
            <Link to={`/browse?category=${primaryCat.slug}`} className="flex items-center gap-1.5 hover:opacity-80 transition-opacity">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: catColor }} />
              <span className="text-xs font-semibold tracking-wider uppercase" style={{ color: catColor }}>
                {primaryCat.name}
              </span>
            </Link>
          )}
          {event.categories && event.categories.length > 1 && (
            event.categories.slice(1).map(cat => (
              <Link key={cat.id} to={`/browse?category=${cat.slug}`} className="flex items-center gap-1.5 hover:opacity-80 transition-opacity">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[cat.slug] || '#9CA3AF' }} />
                <span className="text-[10px] font-medium tracking-wider uppercase text-[#9CA3AF]">
                  {cat.name}
                </span>
              </Link>
            ))
          )}
        </div>

        {/* Title */}
        <h1 className="font-display text-3xl md:text-4xl font-black text-[#1A1A1F] mb-6 leading-tight">
          {title}
        </h1>

        {/* Key info row */}
        <div className="flex flex-wrap gap-6 mb-8 pb-8 border-b border-[#E5E7EB]">
          {/* Date & Time */}
          <div>
            <p className="text-[10px] font-semibold tracking-widest uppercase text-[#9CA3AF] mb-1">When</p>
            <p className="text-sm font-semibold text-[#1A1A1F]">{formatDate(event.start_at)}</p>
            {event.end_at && (
              <p className="text-xs text-[#9CA3AF] mt-0.5">Until {formatDate(event.end_at)}</p>
            )}
          </div>

          {/* Location */}
          {event.location_name && (
            <div>
              <p className="text-[10px] font-semibold tracking-widest uppercase text-[#9CA3AF] mb-1">Where</p>
              <p className="text-sm font-semibold text-[#1A1A1F]">{event.location_name}</p>
              {event.location_address && (
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(event.location_address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#6366F1] hover:underline mt-0.5 block"
                >
                  View on map
                </a>
              )}
            </div>
          )}

          {/* Price */}
          {priceLabel && (
            <div>
              <p className="text-[10px] font-semibold tracking-widest uppercase text-[#9CA3AF] mb-1">Price</p>
              <p className={`text-sm font-semibold ${isFree ? 'text-[#2A7A4A]' : 'text-[#1A1A1F]'}`}>
                {priceLabel}
              </p>
            </div>
          )}

          {/* Source */}
          {(event.source_type === 'external' || event.source_type === 'scraped') && event.source_platform && (
            <div>
              <p className="text-[10px] font-semibold tracking-widest uppercase text-[#9CA3AF] mb-1">Source</p>
              <p className="text-sm font-medium text-[#9CA3AF] capitalize">{event.source_platform}</p>
            </div>
          )}
        </div>

        {/* Image — only if event has one */}
        {event.image_url && (
          <div className="mb-8 overflow-hidden rounded-[6px]">
            <img
              src={event.image_url}
              alt={title}
              className="w-full h-auto max-h-96 object-cover"
              onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
          </div>
        )}

        {/* Description */}
        {description && (
          <div className="mb-8">
            <h2 className="text-xs font-semibold tracking-widest uppercase text-[#9CA3AF] mb-3">About</h2>
            <p className="text-sm text-[#1A1A1F]/80 leading-relaxed whitespace-pre-wrap">{description}</p>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-[#E5E7EB]">
          {event.source_url && (
            <a href={event.source_url} target="_blank" rel="noopener noreferrer">
              <Button variant="primary" size="lg">
                Get Tickets / RSVP
              </Button>
            </a>
          )}

          <button
            onClick={handleLike}
            disabled={!user || likeLoading}
            title={user ? (liked ? 'Unlike' : 'Like this event') : 'Sign in to like'}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-[6px] text-sm font-medium transition-all border ${
              liked
                ? 'bg-[#6366F1]/10 text-[#6366F1] border-[#6366F1]/30'
                : 'bg-white text-[#9CA3AF] border-[#E5E7EB] hover:border-[#6366F1] hover:text-[#6366F1]'
            } disabled:opacity-50`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            {likeCount > 0 ? likeCount : ''} {liked ? 'Liked' : 'Like'}
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2.5 rounded-[6px] text-sm font-medium transition-all border bg-white text-[#9CA3AF] border-[#E5E7EB] hover:border-[#1A1A1F] hover:text-[#1A1A1F]"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/>
            </svg>
            {copied ? 'Copied!' : 'Share'}
          </button>

          <button
            onClick={() => setShowAddToList(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-[6px] text-sm font-medium transition-all border bg-white text-[#9CA3AF] border-[#E5E7EB] hover:border-[#6366F1] hover:text-[#6366F1]"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add to List
          </button>

          {!user && (
            <Link to="/sign-in" className="text-xs text-[#9CA3AF] hover:text-[#6366F1] transition-colors">
              Sign in to like events
            </Link>
          )}
        </div>
      </div>

      {showAddToList && id && (
        <AddToListModal eventId={id} onClose={() => setShowAddToList(false)} />
      )}
    </Layout>
  )
}
