import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/lib/auth'
import { fetchLists, addEventToList, type List } from '@/lib/api'
import { useToast } from '@/components/Toast'

interface AddToListModalProps {
  eventId: string
  onClose: () => void
}

export function AddToListModal({ eventId, onClose }: AddToListModalProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const ref = useRef<HTMLDivElement>(null)

  const [lists, setLists] = useState<List[]>([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState<string | null>(null)
  const [added, setAdded] = useState<Set<string>>(new Set())

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [onClose])

  useEffect(() => {
    if (!user) return
    fetchLists(user.id)
      .then(setLists)
      .catch(() => toast('Failed to load lists', 'error'))
      .finally(() => setLoading(false))
  }, [user])

  async function handleAdd(listId: string) {
    if (!user || adding) return
    setAdding(listId)
    try {
      await addEventToList(listId, eventId, user.id)
      setAdded(prev => new Set([...prev, listId]))
      toast('Event added to list!', 'success')
    } catch {
      toast('Failed to add event to list', 'error')
    } finally {
      setAdding(null)
    }
  }

  if (!user) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div ref={ref} className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl text-center">
          <div className="text-4xl mb-3">🔒</div>
          <h3 className="font-display text-lg font-bold mb-2">Sign in to save to lists</h3>
          <p className="text-[#94A3B8] text-sm mb-4">Create lists and save events to revisit later.</p>
          <button
            onClick={() => navigate('/sign-in')}
            className="w-full bg-[#5B5BD6] text-white font-semibold py-2.5 rounded-xl hover:bg-[#4F46E5] transition"
          >
            Sign In
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div ref={ref} className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-lg font-bold text-[#1A1A1A]">Add to List</h3>
          <button onClick={onClose} className="text-[#94A3B8] hover:text-[#1A1A1A] text-xl leading-none">×</button>
        </div>

        {loading ? (
          <div className="flex justify-center py-6">
            <div className="animate-spin w-5 h-5 border-2 border-[#5B5BD6] border-t-transparent rounded-full" />
          </div>
        ) : lists.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-[#94A3B8] text-sm mb-4">You don't have any lists yet.</p>
            <button
              onClick={() => { onClose(); navigate('/lists/new') }}
              className="bg-[#5B5BD6] text-white font-semibold py-2 px-4 rounded-xl text-sm hover:bg-[#4F46E5] transition"
            >
              Create a List
            </button>
          </div>
        ) : (
          <div className="space-y-2 max-h-72 overflow-y-auto">
            {lists.map(list => {
              const isAdded = added.has(list.id)
              const isAdding = adding === list.id
              return (
                <button
                  key={list.id}
                  onClick={() => !isAdded && handleAdd(list.id)}
                  disabled={isAdded || isAdding}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                    isAdded
                      ? 'bg-[#E6FAF7] border-[#00D4AA] text-[#00D4AA]'
                      : 'bg-white border-[#E8E8E4] hover:border-[#5B5BD6] hover:bg-[#F5F0FF]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{list.is_public ? '🌐' : '🔒'}</span>
                    <div>
                      <p className="text-sm font-semibold text-[#1A1A1A] line-clamp-1">{list.title}</p>
                      <p className="text-xs text-[#94A3B8]">{list.event_count ?? 0} events</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold flex-shrink-0">
                    {isAdding ? '…' : isAdded ? '✓ Added' : '+ Add'}
                  </span>
                </button>
              )
            })}
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-[#E8E8E4]">
          <button
            onClick={() => { onClose(); navigate('/lists/new') }}
            className="w-full text-[#5B5BD6] font-semibold text-sm py-2 rounded-xl border border-[#5B5BD6] hover:bg-[#F5F0FF] transition"
          >
            + Create New List
          </button>
        </div>
      </div>
    </div>
  )
}
