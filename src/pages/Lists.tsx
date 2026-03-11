import React from 'react'
import { Layout } from '@/components/Layout'
import { Button } from '@/components/Button'
import { useAuth } from '@/lib/auth'
import { Link } from 'react-router-dom'

export function Lists() {
  const { user } = useAuth()

  if (!user) {
    return (
      <Layout>
        <div className="text-center py-20">
          <div className="text-5xl mb-4">📋</div>
          <h2 className="font-display text-xl font-bold mb-2">Your Lists</h2>
          <p className="text-[#94A3B8] mb-6">Sign in to create and manage your event lists.</p>
          <Link to="/sign-in">
            <Button variant="primary">Sign In</Button>
          </Link>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-[#1A1A1A]">My Lists</h1>
          <p className="text-[#94A3B8] mt-1">Curate your favorite Atlanta experiences</p>
        </div>
        <Button variant="primary" icon={<span>+</span>}>
          New List
        </Button>
      </div>

      <div className="text-center py-16 bg-white rounded-2xl border border-[#E8E8E4] border-dashed">
        <div className="text-5xl mb-4">✨</div>
        <h3 className="font-display text-lg font-semibold text-[#1A1A1A] mb-2">
          No lists yet — be the first to add one!
        </h3>
        <p className="text-[#94A3B8] mb-6 max-w-sm mx-auto">
          Create lists of your favorite events — date night spots, family-friendly outings, weekend adventures.
        </p>
        <Button variant="primary">Create your first list</Button>
      </div>
    </Layout>
  )
}
