import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { Button } from '@/components/Button'
import { useAuth } from '@/lib/auth'
import { createEvent } from '@/lib/api'

export function CreateEvent() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: '',
    description: '',
    start_at: '',
    end_at: '',
    location_name: '',
    location_address: '',
    price_min: '',
    is_free: false,
    source_url: '',
  })

  if (!user) {
    navigate('/sign-in')
    return null
  }

  function update(key: string, value: string | boolean) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const event = await createEvent({
        ...form,
        price_min: form.price_min ? Number(form.price_min) : undefined,
        is_free: form.is_free ? 1 : 0,
        source_type: 'internal',
        created_by: user.id,
      })
      navigate(`/events/${event.id}`)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full px-3 py-2.5 rounded-xl border border-[#E8E8E4] text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"

  return (
    <Layout>
      <div className="max-w-xl mx-auto">
        <h1 className="font-display text-3xl font-bold text-[#1A1A1A] mb-2">Post an Event</h1>
        <p className="text-[#94A3B8] mb-8">Share something happening in Atlanta</p>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#E8E8E4] p-6 space-y-4">
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
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Start date & time *</label>
              <input type="datetime-local" value={form.start_at} onChange={e => update('start_at', e.target.value)} required className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">End date & time</label>
              <input type="datetime-local" value={form.end_at} onChange={e => update('end_at', e.target.value)} className={inputClass} />
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
          <div className="flex items-center gap-3">
            <input type="checkbox" id="is_free" checked={form.is_free} onChange={e => update('is_free', e.target.checked)} className="w-4 h-4 accent-[#FF6B35]" />
            <label htmlFor="is_free" className="text-sm font-medium text-[#1A1A1A]">This event is free</label>
          </div>
          {!form.is_free && (
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Price ($)</label>
              <input type="number" value={form.price_min} onChange={e => update('price_min', e.target.value)} placeholder="0" min="0" className={inputClass} />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Ticket / RSVP link</label>
            <input type="url" value={form.source_url} onChange={e => update('source_url', e.target.value)} placeholder="https://..." className={inputClass} />
          </div>
          <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
            Post Event
          </Button>
        </form>
      </div>
    </Layout>
  )
}
