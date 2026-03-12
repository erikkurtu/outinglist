import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { Button } from '@/components/Button'
import { useAuth } from '@/lib/auth'
import { createEvent, fetchCategories, type Category } from '@/lib/api'

type SourceType = 'internal' | 'external'

export function CreateEvent() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [error, setError] = useState<string | null>(null)
  const [sourceType, setSourceType] = useState<SourceType>('internal')

  const [form, setForm] = useState({
    title: '',
    description: '',
    start_at: '',
    end_at: '',
    location_name: '',
    location_address: '',
    price_min: '',
    price_max: '',
    is_free: false,
    source_url: '',
    image_url: '',
    category_ids: [] as string[],
  })

  useEffect(() => {
    fetchCategories().then(setCategories).catch(console.error)
  }, [])

  if (!user) {
    return (
      <Layout>
        <div className="max-w-md mx-auto text-center py-20">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="font-display text-2xl font-bold mb-3">Sign in to post events</h2>
          <p className="text-[#94A3B8] mb-6">You need an account to post events to OutingList.</p>
          <Link to="/sign-in">
            <Button variant="primary" size="lg">Sign In</Button>
          </Link>
        </div>
      </Layout>
    )
  }

  function update(key: string, value: string | boolean | string[]) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  function toggleCategory(catId: string) {
    setForm(prev => ({
      ...prev,
      category_ids: prev.category_ids.includes(catId)
        ? prev.category_ids.filter(id => id !== catId)
        : [...prev.category_ids, catId],
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!form.title.trim()) { setError('Event title is required'); return }
    if (!form.start_at) { setError('Start date and time is required'); return }

    setLoading(true)
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim() || undefined,
        source_type: sourceType,
        source_url: form.source_url || undefined,
        source_platform: sourceType === 'external' ? 'manual' : undefined,
        image_url: form.image_url || undefined,
        start_at: new Date(form.start_at).toISOString(),
        end_at: form.end_at ? new Date(form.end_at).toISOString() : undefined,
        location_name: form.location_name || undefined,
        location_address: form.location_address || undefined,
        price_min: form.is_free ? 0 : (form.price_min ? Number(form.price_min) : undefined),
        price_max: form.is_free ? 0 : (form.price_max ? Number(form.price_max) : undefined),
        is_free: form.is_free ? 1 : 0,
        created_by: user.id,
        category_ids: form.category_ids,
      }

      const event = await createEvent(payload)
      navigate(`/events/${event.id}`)
    } catch (err) {
      setError('Failed to create event. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full px-3 py-2.5 rounded-xl border border-[#E8E8E4] text-sm focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent bg-white"

  return (
    <Layout>
      <div className="max-w-xl mx-auto">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-[#1A1A1A] mb-2">Post an Event</h1>
          <p className="text-[#94A3B8]">Share something happening in Atlanta</p>
        </div>

        {/* Source type toggle */}
        <div className="mb-6 flex gap-2 p-1 bg-[#F8F8F6] rounded-xl border border-[#E8E8E4]">
          <button
            type="button"
            onClick={() => setSourceType('internal')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              sourceType === 'internal' ? 'bg-white shadow-sm text-[#1A1A1A]' : 'text-[#94A3B8]'
            }`}
          >
            🎉 My Event
          </button>
          <button
            type="button"
            onClick={() => setSourceType('external')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              sourceType === 'external' ? 'bg-white shadow-sm text-[#1A1A1A]' : 'text-[#94A3B8]'
            }`}
          >
            🔗 External Event
          </button>
        </div>

        {sourceType === 'external' && (
          <div className="mb-5 p-4 bg-blue-50 rounded-xl border border-blue-200 text-sm text-blue-700">
            <strong>Posting an external event?</strong> Paste the original event URL and fill in the details below so people can find it here.
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#E8E8E4] p-6 space-y-4 shadow-sm">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Event title *</label>
            <input type="text" value={form.title} onChange={e => update('title', e.target.value)} required placeholder="What's happening?" className={inputClass} />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Description</label>
            <textarea value={form.description} onChange={e => update('description', e.target.value)} placeholder="Tell people what to expect..." rows={4} className={inputClass + ' resize-none'} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Start *</label>
              <input type="datetime-local" value={form.start_at} onChange={e => update('start_at', e.target.value)} required className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">End</label>
              <input type="datetime-local" value={form.end_at} min={form.start_at} onChange={e => update('end_at', e.target.value)} className={inputClass} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Venue name</label>
            <input type="text" value={form.location_name} onChange={e => update('location_name', e.target.value)} placeholder="The Tabernacle, Piedmont Park..." className={inputClass} />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Address</label>
            <input type="text" value={form.location_address} onChange={e => update('location_address', e.target.value)} placeholder="152 Luckie St NW, Atlanta, GA" className={inputClass} />
          </div>

          {/* Categories */}
          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Categories</label>
            <div className="flex flex-wrap gap-1.5">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => toggleCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                    form.category_ids.includes(cat.id)
                      ? 'text-white border-transparent'
                      : 'bg-[#F8F8F6] border-[#E8E8E4] text-[#64748B] hover:border-[#94A3B8]'
                  }`}
                  style={form.category_ids.includes(cat.id) ? { backgroundColor: cat.color || '#6366F1' } : {}}
                >
                  {cat.icon} {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Pricing */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <input type="checkbox" id="is_free" checked={form.is_free} onChange={e => update('is_free', e.target.checked)} className="w-4 h-4 accent-[#6366F1]" />
              <label htmlFor="is_free" className="text-sm font-medium text-[#1A1A1A]">This event is free</label>
            </div>
            {!form.is_free && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-[#94A3B8] mb-1">Min price ($)</label>
                  <input type="number" value={form.price_min} onChange={e => update('price_min', e.target.value)} placeholder="0" min="0" className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs text-[#94A3B8] mb-1">Max price ($)</label>
                  <input type="number" value={form.price_max} onChange={e => update('price_max', e.target.value)} placeholder="optional" min="0" className={inputClass} />
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
              {sourceType === 'external' ? 'Original event URL *' : 'Ticket / RSVP link'}
            </label>
            <input type="url" value={form.source_url} onChange={e => update('source_url', e.target.value)} required={sourceType === 'external'} placeholder="https://..." className={inputClass} />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Event image URL</label>
            <input type="url" value={form.image_url} onChange={e => update('image_url', e.target.value)} placeholder="https://... (optional)" className={inputClass} />
            {form.image_url && (
              <div className="mt-2 rounded-xl overflow-hidden h-24 bg-[#F8F8F6]">
                <img src={form.image_url} alt="Preview" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
              </div>
            )}
          </div>

          <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
            {sourceType === 'external' ? '🔗 Post External Event' : '🎉 Post Event'}
          </Button>
        </form>
      </div>
    </Layout>
  )
}
