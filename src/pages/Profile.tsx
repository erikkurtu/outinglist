import React from 'react'
import { Layout } from '@/components/Layout'
import { Button } from '@/components/Button'
import { useAuth } from '@/lib/auth'
import { Link } from 'react-router-dom'

export function Profile() {
  const { user, signOut } = useAuth()

  if (!user) {
    return (
      <Layout>
        <div className="text-center py-20">
          <div className="text-5xl mb-4">👤</div>
          <h2 className="font-display text-xl font-bold mb-2">Your Profile</h2>
          <p className="text-[#94A3B8] mb-6">Sign in to view your profile.</p>
          <Link to="/sign-in"><Button variant="primary">Sign In</Button></Link>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl border border-[#E8E8E4] p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#FF6B35] flex items-center justify-center text-white text-2xl font-bold font-display">
              {user.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <h1 className="font-display text-xl font-bold text-[#1A1A1A]">{user.name}</h1>
              <p className="text-[#94A3B8] text-sm">{user.email}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Events', count: 0 },
            { label: 'Lists', count: 0 },
            { label: 'Likes', count: 0 },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-xl border border-[#E8E8E4] p-4 text-center">
              <div className="font-display text-2xl font-bold text-[#1A1A1A]">{stat.count}</div>
              <div className="text-xs text-[#94A3B8] mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        <Button variant="secondary" onClick={signOut} className="w-full">
          Sign Out
        </Button>
      </div>
    </Layout>
  )
}
