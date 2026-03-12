import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { Button } from '@/components/Button'
import { useAuth } from '@/lib/auth'
import { fetchLists, type List } from '@/lib/api'
import { formatDate } from '@/lib/utils'

function ListCard({ list }: { list: List }) {
  const isPublic = list.is_public === 1

  return (
    <Link
      to={`/lists/${list.id}`}
      className="group block bg-white rounded-[16px] overflow-hidden border border-[#E8E8E4] hover:border-transparent shadow-[0_2px_12px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-200 hover:-translate-y-0.5"
    >
      {/* Cover / Preview Grid */}
      <div className="relative h-40 bg-gradient-to-br from-[#7C3AED] to-[#6D28D9] overflow-hidden">
        {list.cover_image_url ? (
          <img src={list.cover_image_url} alt={list.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : list.preview_events && list.preview_events.length > 0 ? (
          <div className={`grid h-full ${list.preview_events.length >= 4 ? 'grid-cols-2 grid-rows-2' : list.preview_events.length >= 2 ? 'grid-cols-2' : 'grid-cols-1'} gap-0.5`}>
            {list.preview_events.slice(0, 4).map((e, i) => (
              <div key={i} className="relative overflow-hidden bg-gradient-to-br from-violet-400 to-purple-500">
                {e.image_url && (
                  <img src={e.image_url} alt="" className="w-full h-full object-cover opacity-80" />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg></div>
        )}

        {/* Visibility badge */}
        <div className="absolute top-3 right-3">
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${isPublic ? 'bg-[#00D4AA] text-white' : 'bg-black/50 text-white'}`}>
            {isPublic ? 'Public' : 'Private'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-display font-semibold text-[#1A1A1A] mb-1 group-hover:text-[#7C3AED] transition-colors line-clamp-1">
          {list.title}
        </h3>
        {list.description && (
          <p className="text-sm text-[#94A3B8] line-clamp-2 mb-3">{list.description}</p>
        )}
        <div className="flex items-center gap-4 text-xs text-[#94A3B8]">
          <span className="flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="3" y1="10" x2="21" y2="10" />
              <line x1="8" y1="2" x2="8" y2="6" /><line x1="16" y1="2" x2="16" y2="6" />
            </svg>
            {list.event_count ?? 0} event{list.event_count !== 1 ? 's' : ''}
          </span>
          {(list.like_count ?? 0) > 0 && (
            <span className="flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="#7C3AED" stroke="#7C3AED" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {list.like_count}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}

export function Lists() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [lists, setLists] = useState<List[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { setLoading(false); return }
    fetchLists(user.id)
      .then(setLists)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [user])

  if (!user) {
    return (
      <Layout>
        <div className="text-center py-20">
          <div className="w-12 h-12 mx-auto mb-4 text-[#C4BEB4]"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg></div>
          <h2 className="font-display text-2xl font-bold text-[#1A1A1A] mb-2">Your Lists</h2>
          <p className="text-[#94A3B8] mb-6">Sign in to create and manage your event lists.</p>
          <Link to="/sign-in">
            <Button variant="primary">Sign In</Button>
          </Link>
        </div>
      </Layout>
    )
  }

  const publicLists = lists.filter(l => l.is_public === 1)
  const privateLists = lists.filter(l => l.is_public === 0)

  return (
    <Layout>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-[#1A1A1A]">My Lists</h1>
          <p className="text-[#94A3B8] mt-1">
            {lists.length === 0 ? 'Curate your favorite Atlanta experiences' : `${lists.length} list${lists.length !== 1 ? 's' : ''} · ${publicLists.length} public`}
          </p>
        </div>
        <Button variant="primary" onClick={() => navigate('/lists/new')}>
          + New List
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin w-6 h-6 border-2 border-[#7C3AED] border-t-transparent rounded-full" />
        </div>
      ) : lists.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-[#E8E8E4] border-dashed">
          <div className="text-6xl mb-4">✨</div>
          <h3 className="font-display text-xl font-semibold text-[#1A1A1A] mb-2">
            No lists yet — be the first to add one!
          </h3>
          <p className="text-[#94A3B8] mb-6 max-w-sm mx-auto">
            Create lists of your favorite events — date night spots, family-friendly outings, weekend adventures.
          </p>
          <Button variant="primary" onClick={() => navigate('/lists/new')}>Create your first list</Button>
        </div>
      ) : (
        <div className="space-y-8">
          {publicLists.length > 0 && (
            <section>
              <h2 className="font-display text-lg font-semibold text-[#1A1A1A] mb-4 flex items-center gap-2">
                Public Lists
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {publicLists.map(list => <ListCard key={list.id} list={list} />)}
              </div>
            </section>
          )}
          {privateLists.length > 0 && (
            <section>
              <h2 className="font-display text-lg font-semibold text-[#1A1A1A] mb-4 flex items-center gap-2">
                Private Lists
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {privateLists.map(list => <ListCard key={list.id} list={list} />)}
              </div>
            </section>
          )}
        </div>
      )}
    </Layout>
  )
}
