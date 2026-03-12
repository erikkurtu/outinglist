import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { Button } from '@/components/Button'
import { EventCard } from '@/components/EventCard'
import { useAuth } from '@/lib/auth'
import { fetchList, toggleLike, removeEventFromList, type ListDetail as ListDetailType } from '@/lib/api'
import { useToast } from '@/components/Toast'

export function ListDetail() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  const [list, setList] = useState<ListDetailType | null>(null)
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [liking, setLiking] = useState(false)
  const [removingEventId, setRemovingEventId] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    fetchList(id, user?.id)
      .then(data => {
        setList(data)
        setLiked(data.liked)
        setLikeCount(data.like_count ?? 0)
      })
      .catch(() => toast('Failed to load list', 'error'))
      .finally(() => setLoading(false))
  }, [id, user?.id])

  async function handleLike() {
    if (!user) { navigate('/sign-in'); return }
    if (liking) return

    // Optimistic update
    const wasLiked = liked
    setLiked(!wasLiked)
    setLikeCount(prev => wasLiked ? prev - 1 : prev + 1)
    setLiking(true)

    try {
      const result = await toggleLike(user.id, 'list', id!)
      setLiked(result.liked)
    } catch {
      // Revert
      setLiked(wasLiked)
      setLikeCount(prev => wasLiked ? prev + 1 : prev - 1)
      toast('Failed to update like', 'error')
    } finally {
      setLiking(false)
    }
  }

  async function handleShare() {
    const url = `${window.location.origin}/share/lists/${id}`
    try {
      await navigator.clipboard.writeText(url)
      toast('Link copied to clipboard!', 'success')
    } catch {
      toast('Failed to copy link', 'error')
    }
  }

  async function handleRemoveEvent(eventId: string) {
    if (!user || !list || list.user_id !== user.id) return
    setRemovingEventId(eventId)
    try {
      await removeEventFromList(id!, eventId, user.id)
      setList(prev => prev ? { ...prev, events: prev.events.filter(e => e.id !== eventId) } : prev)
      toast('Event removed from list', 'success')
    } catch {
      toast('Failed to remove event', 'error')
    } finally {
      setRemovingEventId(null)
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center py-20">
          <div className="animate-spin w-6 h-6 border-2 border-[#5B5BD6] border-t-transparent rounded-full" />
        </div>
      </Layout>
    )
  }

  if (!list) {
    return (
      <Layout>
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="font-display text-2xl font-bold mb-2">List not found</h2>
          <p className="text-[#94A3B8] mb-6">This list might be private or doesn't exist.</p>
          <Link to="/lists"><Button variant="primary">My Lists</Button></Link>
        </div>
      </Layout>
    )
  }

  const isOwner = user?.id === list.user_id
  const curatorName = list.profile?.display_name || 'Curator'
  const isCurator = list.profile?.is_curator === 1

  return (
    <Layout>
      {/* Back */}
      <Link to="/lists" className="inline-flex items-center gap-1.5 text-[#94A3B8] hover:text-[#1A1A1A] text-sm mb-6 transition-colors">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 5l-7 7 7 7" />
        </svg>
        {isOwner ? 'My Lists' : 'Back'}
      </Link>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-[#E8E8E4] overflow-hidden mb-8">
        {/* Cover Image */}
        {list.cover_image_url ? (
          <div className="h-56 overflow-hidden">
            <img src={list.cover_image_url} alt={list.title} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="h-40 bg-gradient-to-br from-[#5B5BD6] to-[#4F46E5] flex items-center justify-center">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
          </div>
        )}

        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              {/* Visibility */}
              <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full mb-3 ${list.is_public ? 'bg-[#E6FAF7] text-[#00D4AA]' : 'bg-[#F1F5F9] text-[#64748B]'}`}>
                {list.is_public ? 'Public' : 'Private'}
              </span>

              <h1 className="font-display text-3xl font-bold text-[#1A1A1A] mb-2">{list.title}</h1>

              {list.description && (
                <p className="text-[#64748B] text-base mb-4">{list.description}</p>
              )}

              {/* Curator info */}
              <div className="flex items-center gap-2 text-sm text-[#94A3B8]">
                <div className="w-6 h-6 rounded-full bg-[#5B5BD6] flex items-center justify-center text-white text-xs font-bold">
                  {curatorName[0].toUpperCase()}
                </div>
                <span>by <span className="text-[#1A1A1A] font-medium">{curatorName}</span></span>
                {isCurator && (
                  <span className="inline-flex items-center gap-1 bg-[#F5F0FF] text-[#5B5BD6] text-xs font-semibold px-2 py-0.5 rounded-full">
                    ✓ Curator
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Like */}
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold transition-all ${
                  liked
                    ? 'bg-[#5B5BD6] border-[#5B5BD6] text-white'
                    : 'bg-white border-[#E8E8E4] text-[#64748B] hover:border-[#5B5BD6] hover:text-[#5B5BD6]'
                }`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                {likeCount > 0 && <span>{likeCount}</span>}
                <span className="hidden sm:inline">{liked ? 'Liked' : 'Like'}</span>
              </button>

              {/* Share */}
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#E8E8E4] text-[#64748B] text-sm font-semibold hover:border-[#1A1A1A] hover:text-[#1A1A1A] transition-all bg-white"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
                <span className="hidden sm:inline">Share</span>
              </button>

              {/* Edit (owner only) */}
              {isOwner && (
                <Link to={`/lists/${list.id}/edit`}>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#E8E8E4] text-[#64748B] text-sm font-semibold hover:border-[#1A1A1A] hover:text-[#1A1A1A] transition-all bg-white">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    <span className="hidden sm:inline">Edit</span>
                  </button>
                </Link>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-[#E8E8E4] text-sm text-[#94A3B8]">
            <span>{list.events.length} event{list.events.length !== 1 ? 's' : ''}</span>
            {likeCount > 0 && <span>·</span>}
            {likeCount > 0 && <span>{likeCount} like{likeCount !== 1 ? 's' : ''}</span>}
          </div>
        </div>
      </div>

      {/* Events Grid */}
      {list.events.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-[#E8E8E4] border-dashed">
          <div className="text-5xl mb-4">🎉</div>
          <h3 className="font-display text-lg font-semibold text-[#1A1A1A] mb-2">No events yet</h3>
          <p className="text-[#94A3B8] mb-6">
            {isOwner ? 'Browse events and add them to this list.' : 'This list is empty.'}
          </p>
          {isOwner && (
            <Link to="/browse">
              <Button variant="primary">Browse Events</Button>
            </Link>
          )}
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-semibold text-[#1A1A1A]">Events in this list</h2>
            {isOwner && (
              <Link to="/browse" className="text-sm text-[#5B5BD6] font-medium hover:underline">
                + Add more events
              </Link>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {list.events.map(event => (
              <div key={event.id} className="relative group/card">
                <EventCard event={event} />
                {isOwner && (
                  <button
                    onClick={() => handleRemoveEvent(event.id)}
                    disabled={removingEventId === event.id}
                    className="absolute top-2 left-2 w-7 h-7 rounded-full bg-black/60 text-white text-xs flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity hover:bg-red-500 z-10"
                    title="Remove from list"
                  >
                    {removingEventId === event.id ? '…' : '×'}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </Layout>
  )
}
