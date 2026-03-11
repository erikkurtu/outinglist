import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { Badge } from '@/components/Badge'
import { Button } from '@/components/Button'
import { fetchEvent } from '@/lib/api'
import { formatDate, formatPrice } from '@/lib/utils'
import type { Event } from '@/components/EventCard'

export function EventDetail() {
  const { id } = useParams<{ id: string }>()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    fetchEvent(id)
      .then(setEvent)
      .catch(() => setError('Event not found'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <Layout>
      <div className="flex justify-center py-20">
        <div className="animate-spin w-8 h-8 border-2 border-[#FF6B35] border-t-transparent rounded-full" />
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

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <Link to="/browse" className="inline-flex items-center gap-1 text-sm text-[#94A3B8] hover:text-[#1A1A1A] mb-6 transition-colors">
          ← Back to events
        </Link>

        {/* Image */}
        <div className="rounded-2xl overflow-hidden mb-6 bg-gradient-to-br from-orange-400 to-pink-500 h-64 flex items-center justify-center text-8xl">
          {event.categories?.[0]?.icon || '🎉'}
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-4">
          {event.categories?.map(cat => (
            <Badge key={cat.id} label={cat.name} icon={cat.icon} color={cat.color} />
          ))}
          {event.is_free === 1 && (
            <span className="bg-[#00D4AA] text-white text-xs font-semibold px-2 py-0.5 rounded-[6px]">FREE</span>
          )}
        </div>

        <h1 className="font-display text-3xl font-bold text-[#1A1A1A] mb-4">{event.title}</h1>

        {/* Meta grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-[#E8E8E4]">
            <div className="text-xs text-[#94A3B8] font-medium mb-1">DATE & TIME</div>
            <div className="font-medium text-[#1A1A1A]">{formatDate(event.start_at)}</div>
          </div>
          {event.location_name && (
            <div className="bg-white rounded-xl p-4 border border-[#E8E8E4]">
              <div className="text-xs text-[#94A3B8] font-medium mb-1">LOCATION</div>
              <div className="font-medium text-[#1A1A1A]">{event.location_name}</div>
              {event.location_address && (
                <div className="text-sm text-[#94A3B8] mt-0.5">{event.location_address}</div>
              )}
            </div>
          )}
          {event.is_free !== 1 && (event.price_min !== undefined) && (
            <div className="bg-white rounded-xl p-4 border border-[#E8E8E4]">
              <div className="text-xs text-[#94A3B8] font-medium mb-1">PRICE</div>
              <div className="font-medium text-[#FF6B35]">{formatPrice(event.price_min, event.price_max)}</div>
            </div>
          )}
        </div>

        {event.description && (
          <div className="mb-6">
            <h2 className="font-display text-lg font-semibold mb-3">About this event</h2>
            <p className="text-[#1A1A1A]/80 leading-relaxed whitespace-pre-wrap">{event.description}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          {event.source_url && (
            <a href={event.source_url} target="_blank" rel="noopener noreferrer">
              <Button variant="primary" size="lg">
                Get Tickets / RSVP
              </Button>
            </a>
          )}
          <Button
            variant="secondary"
            size="lg"
            onClick={() => { navigator.clipboard.writeText(window.location.href) }}
          >
            Share Event
          </Button>
        </div>
      </div>
    </Layout>
  )
}
