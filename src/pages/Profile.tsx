import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { Button } from '@/components/Button'
import { EventCard } from '@/components/EventCard'
import { useAuth } from '@/lib/auth'
import { fetchUserProfile, updateUserProfile, type UserProfile, type List } from '@/lib/api'
import { useToast } from '@/components/Toast'
import { formatDate } from '@/lib/utils'
import type { Event } from '@/components/EventCard'

type Tab = 'events' | 'lists' | 'likes'

function ListMiniCard({ list }: { list: List & { event_count?: number } }) {
  return (
    <Link
      to={`/lists/${list.id}`}
      className="block bg-white rounded-xl border border-[#E8E8E4] overflow-hidden hover:border-[#7C3AED] transition-all group"
    >
      <div className="h-24 bg-gradient-to-br from-[#7C3AED] to-[#6D28D9] relative overflow-hidden">
        {list.cover_image_url && (
          <img src={list.cover_image_url} alt={list.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
        )}
        <div className="absolute top-2 right-2">
          <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${list.is_public ? 'bg-[#00D4AA] text-white' : 'bg-black/40 text-white'}`}>
            {list.is_public ? 'Public' : 'Private'}
          </span>
        </div>
      </div>
      <div className="p-3">
        <h4 className="font-semibold text-sm text-[#1A1A1A] line-clamp-1 group-hover:text-[#7C3AED] transition-colors">{list.title}</h4>
        <p className="text-xs text-[#94A3B8] mt-0.5">{list.event_count ?? 0} events</p>
      </div>
    </Link>
  )
}

export function Profile() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<Tab>('events')
  const [editing, setEditing] = useState(false)
  const [displayName, setDisplayName] = useState('')
  const [bio, setBio] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!user) { setLoading(false); return }
    fetchUserProfile(user.id)
      .then(p => {
        setProfile(p)
        setDisplayName(p.display_name || user.name || '')
        setBio(p.bio || '')
      })
      .catch(() => {
        // Use basic user data if profile fetch fails
        setDisplayName(user.name || '')
      })
      .finally(() => setLoading(false))
  }, [user])

  async function handleSaveProfile() {
    if (!user) return
    setSaving(true)
    try {
      const updated = await updateUserProfile(user.id, { display_name: displayName, bio })
      setProfile(prev => prev ? { ...prev, ...updated } : updated)
      setEditing(false)
      toast('Profile updated!', 'success')
    } catch {
      toast('Failed to update profile', 'error')
    } finally {
      setSaving(false)
    }
  }

  function handleSignOut() {
    signOut()
    navigate('/')
  }

  if (!user) {
    return (
      <Layout>
        <div className="text-center py-20">
          <div className="text-6xl mb-4">👤</div>
          <h2 className="font-display text-2xl font-bold mb-2">Sign in to view your profile</h2>
          <p className="text-[#94A3B8] mb-6">Create an account to save events, make lists, and more.</p>
          <Link to="/sign-in"><Button variant="primary">Sign In</Button></Link>
        </div>
      </Layout>
    )
  }

  const name = profile?.display_name || user.name || user.email
  const isCurator = profile?.is_curator === 1
  const stats = profile?.stats || { event_count: 0, list_count: 0, like_count: 0 }

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: 'events', label: 'My Events', count: stats.event_count },
    { id: 'lists', label: 'My Lists', count: stats.list_count },
    { id: 'likes', label: 'My Likes', count: stats.like_count },
  ]

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl border border-[#E8E8E4] p-6 mb-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#6D28D9] flex items-center justify-center text-2xl font-bold text-white flex-shrink-0">
                {name[0].toUpperCase()}
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="font-display text-2xl font-bold text-[#1A1A1A]">{name}</h1>
                  {isCurator && (
                    <span className="inline-flex items-center gap-1 bg-[#F5F0FF] text-[#7C3AED] text-xs font-bold px-2.5 py-1 rounded-full border border-[#DDD6FE]">
                      ✓ Curator
                    </span>
                  )}
                </div>
                <p className="text-sm text-[#94A3B8]">{user.email}</p>
                {profile?.bio && !editing && (
                  <p className="text-sm text-[#64748B] mt-2 max-w-md">{profile.bio}</p>
                )}
              </div>
            </div>

            <div className="flex gap-2 flex-shrink-0">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setEditing(!editing)}
              >
                {editing ? 'Cancel' : '✏️ Edit Profile'}
              </Button>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                Sign Out
              </Button>
            </div>
          </div>

          {/* Edit form */}
          {editing && (
            <div className="mt-4 pt-4 border-t border-[#E8E8E4] space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-1">Display Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E8E4] text-[#1A1A1A] text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-1">Bio</label>
                <textarea
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  placeholder="Tell people about your taste in Atlanta events…"
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E8E4] text-[#1A1A1A] text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED] resize-none"
                />
              </div>
              <Button variant="primary" size="sm" loading={saving} onClick={handleSaveProfile}>
                Save Changes
              </Button>
            </div>
          )}

          {/* Stats */}
          <div className="flex gap-6 mt-4 pt-4 border-t border-[#E8E8E4]">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`text-center transition-colors ${activeTab === tab.id ? 'text-[#7C3AED]' : 'text-[#94A3B8] hover:text-[#1A1A1A]'}`}
              >
                <div className="text-xl font-bold">{tab.count}</div>
                <div className="text-xs font-medium">{tab.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-[#F8F8F6] p-1 rounded-xl mb-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-[#1A1A1A] shadow-sm'
                  : 'text-[#94A3B8] hover:text-[#1A1A1A]'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-[#7C3AED] text-white' : 'bg-[#E8E8E4] text-[#64748B]'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin w-6 h-6 border-2 border-[#7C3AED] border-t-transparent rounded-full" />
          </div>
        ) : activeTab === 'events' ? (
          <div>
            {(profile?.my_events?.length ?? 0) === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-[#E8E8E4]">
                <div className="w-10 h-10 mx-auto mb-3 text-[#C4BEB4]"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="16" y1="2" x2="16" y2="6"/></svg></div>
                <h3 className="font-display text-lg font-semibold mb-2">No events yet</h3>
                <p className="text-[#94A3B8] mb-4">Create your first Atlanta event listing.</p>
                <Link to="/events/new"><Button variant="primary">Create an Event</Button></Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {profile?.my_events?.map(event => <EventCard key={event.id} event={event} />)}
              </div>
            )}
          </div>
        ) : activeTab === 'lists' ? (
          <div>
            {(profile?.public_lists?.length ?? 0) === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-[#E8E8E4]">
                <div className="w-10 h-10 mx-auto mb-3 text-[#C4BEB4]"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg></div>
                <h3 className="font-display text-lg font-semibold mb-2">No public lists yet</h3>
                <p className="text-[#94A3B8] mb-4">Create and share your curated event collections.</p>
                <Link to="/lists/new"><Button variant="primary">Create a List</Button></Link>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <p className="text-sm text-[#94A3B8]">Public lists visible to everyone</p>
                  <Link to="/lists" className="text-sm text-[#7C3AED] font-medium hover:underline">View all lists →</Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {profile?.public_lists?.map(list => <ListMiniCard key={list.id} list={list} />)}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            {(profile?.liked_events?.length ?? 0) === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-[#E8E8E4]">
                <div className="text-5xl mb-3">🤍</div>
                <h3 className="font-display text-lg font-semibold mb-2">No liked events yet</h3>
                <p className="text-[#94A3B8] mb-4">Heart events you're interested in to save them here.</p>
                <Link to="/browse"><Button variant="primary">Browse Events</Button></Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {profile?.liked_events?.map(event => <EventCard key={event.id} event={event} liked />)}
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  )
}
