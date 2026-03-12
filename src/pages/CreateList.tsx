import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { Button } from '@/components/Button'
import { useAuth } from '@/lib/auth'
import { createList } from '@/lib/api'
import { useToast } from '@/components/Toast'

export function CreateList() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const [coverImageUrl, setCoverImageUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  if (!user) {
    return (
      <Layout>
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="font-display text-2xl font-bold mb-2">Sign in to create lists</h2>
          <p className="text-[#94A3B8] mb-6">You need an account to create and manage lists.</p>
          <Link to="/sign-in"><Button variant="primary">Sign In</Button></Link>
        </div>
      </Layout>
    )
  }

  function validate() {
    const errs: Record<string, string> = {}
    if (!title.trim()) errs.title = 'List name is required'
    return errs
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setLoading(true)
    try {
      const list = await createList({
        user_id: user.id,
        title: title.trim(),
        description: description.trim() || undefined,
        is_public: isPublic,
        cover_image_url: coverImageUrl.trim() || undefined,
      })
      toast('List created!', 'success')
      navigate(`/lists/${list.id}`)
    } catch (err) {
      toast('Failed to create list. Try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="max-w-xl mx-auto">
        {/* Back */}
        <Link to="/lists" className="inline-flex items-center gap-1.5 text-[#94A3B8] hover:text-[#1A1A1A] text-sm mb-6 transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Back to My Lists
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-[#1A1A1A]">Create a New List</h1>
          <p className="text-[#94A3B8] mt-1">Curate your favorite Atlanta events into a sharable collection.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-[#1A1A1A] mb-1.5">
              List Name <span className="text-[#FF6B35]">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={e => { setTitle(e.target.value); setErrors(prev => ({ ...prev, title: '' })) }}
              placeholder="e.g. Best Date Night Spots, Family Weekend Picks…"
              className={`w-full px-4 py-3 rounded-[12px] border text-[#1A1A1A] placeholder:text-[#CBD5E1] focus:outline-none focus:ring-2 focus:ring-[#FF6B35] transition ${errors.title ? 'border-red-400' : 'border-[#E8E8E4]'}`}
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-[#1A1A1A] mb-1.5">Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="What's this list about? Give people a reason to follow it."
              rows={3}
              className="w-full px-4 py-3 rounded-[12px] border border-[#E8E8E4] text-[#1A1A1A] placeholder:text-[#CBD5E1] focus:outline-none focus:ring-2 focus:ring-[#FF6B35] transition resize-none"
            />
          </div>

          {/* Cover Image URL */}
          <div>
            <label className="block text-sm font-semibold text-[#1A1A1A] mb-1.5">Cover Image URL</label>
            <input
              type="url"
              value={coverImageUrl}
              onChange={e => setCoverImageUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-4 py-3 rounded-[12px] border border-[#E8E8E4] text-[#1A1A1A] placeholder:text-[#CBD5E1] focus:outline-none focus:ring-2 focus:ring-[#FF6B35] transition"
            />
            {coverImageUrl && (
              <div className="mt-3 rounded-[12px] overflow-hidden h-40 bg-[#F8F8F6]">
                <img
                  src={coverImageUrl}
                  alt="Cover preview"
                  className="w-full h-full object-cover"
                  onError={e => { (e.target as HTMLImageElement).style.opacity = '0.2' }}
                />
              </div>
            )}
          </div>

          {/* Visibility Toggle */}
          <div className="flex items-start gap-4 p-4 bg-[#F8F8F6] rounded-[12px]">
            <button
              type="button"
              onClick={() => setIsPublic(!isPublic)}
              className={`relative flex-shrink-0 w-12 h-6 rounded-full transition-all duration-200 ${isPublic ? 'bg-[#FF6B35]' : 'bg-[#CBD5E1]'}`}
            >
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${isPublic ? 'left-7' : 'left-1'}`} />
            </button>
            <div>
              <p className="font-semibold text-[#1A1A1A] text-sm">{isPublic ? '🌐 Public List' : '🔒 Private List'}</p>
              <p className="text-[#94A3B8] text-sm mt-0.5">
                {isPublic
                  ? 'Anyone can discover and share your list.'
                  : 'Only you can see this list. You can make it public anytime.'}
              </p>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-2">
            <Button type="submit" variant="primary" loading={loading} className="flex-1">
              Create List
            </Button>
            <Link to="/lists">
              <Button type="button" variant="secondary">Cancel</Button>
            </Link>
          </div>
        </form>
      </div>
    </Layout>
  )
}
