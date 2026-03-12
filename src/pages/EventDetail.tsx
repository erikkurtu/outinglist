import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { Badge } from '@/components/Badge'
import { Button } from '@/components/Button'
import { fetchEvent, getLikes, toggleLike } from '@/lib/api'
import { formatDate, formatPrice } from '@/lib/utils'
import { useAuth } from '@/lib/auth'
import { AddToListModal } from '@/components/AddToListModal'
import { useToast } from '@/components/Toast'
import type { Event } from '@/components/EventCard'

// Gradient palette per category color
function getGradient(color?: string): string {
  const hex = color || '#FF6B35'
  return `linear-gradient(135deg, ${hex}cc 0%, ${hex}55 50%, #1A1A2E 100%)`
}

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
        <div className="h-72 bg-[#E8E8E4] rounded-2xl animate-pulse mb-6" />
        <div className="space-y-3">
          <div className="h-8 bg-[#E8E8E4] rounded w-3/4 animate-pulse" />
          <div className="h-4 bg-[#E8E8E4] rounded w-1/2 animate-pulse" />
        </div>
      </div>
    </Layout>
  )

  if (error || !event) return (
    <Layout>
      <div className="text-center py-20">
        <div className="text-5xl mb-4">😕</div>
        <h2 className="font-display text-xl font-bold mb-2">Event not found</h2>
        <Link to="/browse" className="text-[#FF6B35] hover:underline">← Back to browse</Link>
      </div>
    </Layout>
  )

  const primaryCat = event.categories?.[0]

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <Link to="/browse" className="inline-flex items-center gap-1 text-sm text-[#94A3B8] hover:text-[#1A1A1A] mb-6 transition-colors">
          ← Back to events
        </Link>

        {/* Hero image/gradient */}
        <div
          className="rounded-2xl overflow-hidden mb-6 h-72 flex items-end p-6 relative"
          style={{ background: event.image_url ? undefined : getGradient(primaryCat?.color) }}
        >
          {event.image_url ? (
            <img
              src={event.image_url}
              alt={event.title}
              className="absolute inset-0 w-full h-full object-cover"
              onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
          ) : (
            <div className="absolute top-6 right-6 text-7xl opacity-60 select-none">
              {primaryCat?.icon || '🎉'}
            </div>
          )}

          {/* Overlay bottom gradient for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl" />

          {/* Hero bottom: FREE badge + price */}
          <div className="relative z-10 flex items-center gap-2">
            {event.is_free === 1 && (
              <span className="bg-[#00D4AA] text-white text-sm font-bold px-3 py-1 rounded-full">FREE</span>
            )}
            {event.is_free !== 1 && event.price_min !== null && event.price_min !== undefined && (
              <span className="bg-white/90 text-[#1A1A1A] text-sm font-bold px-3 py-1 rounded-full">
                {formatPrice(event.price_min, event.price_max)}
              </span>
            )}
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-4">
          {event.categories?.map(cat => (
            <Link key={cat.id} to={`/browse?category=${cat.slug}`}>
              <Badge label={cat.name} icon={cat.icon} color={cat.color} />
            </Link>
          ))}
        </div>

        {/* Title */}
        <h1 className="font-display text-3xl font-bold text-[#1A1A1A] mb-5 leading-tight">{event.title}</h1>

        {/* Info grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="bg-white rounded-xl p-4 border border-[#E8E8E4] flex items-start gap-3">
            <span className="text-xl mt-0.5">📅</span>
            <div>
              <div className="text-xs text-[#94A3B8] font-medium mb-0.5">DATE & TIME</div>
              <div className="font-semibold text-[#1A1A1A] text-sm">{formatDate(event.start_at)}</div>
              {event.end_at && (
                <div className="text-xs text-[#94A3B8] mt-0.5">Until {formatDate(event.end_at)}</div>
              )}
            </div>
          </div>

          {event.location_name && (
            <div className="bg-white rounded-xl p-4 border border-[#E8E8E4] flex items-start gap-3">
              <span className="text-xl mt-0.5">📍</span>
              <div>
                <div className="text-xs text-[#94A3B8] font-medium mb-0.5">LOCATION</div>
                <div className="font-semibold text-[#1A1A1A] text-sm">{event.location_name}</div>
                {event.location_address && (
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(event.location_address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[#FF6B35] hover:underline mt-0.5 block"
                  >
                    {event.location_address}
                  </a>
                )}
              </div>
            </div>
          )}

          {event.is_free !== 1 && event.price_min !== null && event.price_min !== undefined && (
            <div className="bg-white rounded-xl p-4 border border-[#E8E8E4] flex items-start gap-3">
              <span className="text-xl mt-0.5">💰</span>
              <div>
                <div className="text-xs text-[#94A3B8] font-medium mb-0.5">PRICE</div>
                <div className="font-semibold text-[#FF6B35] text-sm">{formatPrice(event.price_min, event.price_max)}</div>
              </div>
            </div>
          )}

          {event.source_type === 'external' && event.source_platform && (
            <div className="bg-white rounded-xl p-4 border border-[#E8E8E4] flex items-start gap-3">
              <span className="text-xl mt-0.5">🔗</span>
              <div>
                <div className="text-xs text-[#94A3B8] font-medium mb-0.5">SOURCE</div>
                <div className="font-semibold text-[#1A1A1A] text-sm capitalize">{event.source_platform}</div>
              </div>
            </div>
          )}
        </div>

        {/* Description */}
        {event.description && (
          <div className="mb-8">
            <h2 className="font-display text-lg font-semibold mb-3 text-[#1A1A1A]">About this event</h2>
            <p className="text-[#1A1A1A]/80 leading-relaxed whitespace-pre-wrap text-sm">{event.description}</p>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-[#E8E8E4]">
          {event.source_url && (
            <a href={event.source_url} target="_blank" rel="noopener noreferrer" className="flex-1 sm:flex-none">
              <Button variant="primary" size="lg" className="w-full sm:w-auto">
                🎟️ Get Tickets / RSVP
              </Button>
            </a>
          )}

          {/* Like button */}
          <button
            onClick={handleLike}
            disabled={!user || likeLoading}
            title={user ? (liked ? 'Unlike' : 'Like this event') : 'Sign in to like'}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all border ${
              liked
                ? 'bg-red-50 text-red-500 border-red-200 hover:bg-red-100'
                : 'bg-white text-[#94A3B8] border-[#E8E8E4] hover:border-red-200 hover:text-red-400'
            } disabled:opacity-50`}
          >
            <span className="text-base">{liked ? '❤️' : '🤍'}</span>
            <span>{likeCount > 0 ? likeCount : ''} {liked ? 'Liked' : 'Like'}</span>
          </button>

          {/* Share button */}
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all border bg-white text-[#64748B] border-[#E8E8E4] hover:border-[#94A3B8]"
          >
            <span>{copied ? '✅' : '🔗'}</span>
            <span>{copied ? 'Link copied!' : 'Share'}</span>
          </button>

          {/* Add to List button */}
          <button
            onClick={() => setShowAddToList(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all border bg-white text-[#64748B] border-[#E8E8E4] hover:border-[#FF6B35] hover:text-[#FF6B35]"
          >
            <span>📋</span>
            <span>Add to List</span>
          </button>

          {!user && (
            <Link to="/sign-in" className="text-sm text-[#94A3B8] hover:text-[#FF6B35] transition-colors">
              Sign in to like events
            </Link>
          )}
        </div>
      </div>

      {/* Add to List Modal */}
      {showAddToList && id && (
        <AddToListModal eventId={id} onClose={() => setShowAddToList(false)} />
      )}
    </Layout>
  )
}
