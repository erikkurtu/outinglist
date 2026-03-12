import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { Button } from '@/components/Button'
import { useAuth } from '@/lib/auth'

export function SignUp() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await signIn(email, password)
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="max-w-md mx-auto pt-8">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-[#7C3AED] rounded-2xl flex items-center justify-center text-white font-bold text-lg mx-auto mb-4 font-display">
            OL
          </div>
          <h1 className="font-display text-2xl font-bold text-[#1A1A1A]">Join OutingList</h1>
          <p className="text-[#94A3B8] mt-1">Discover what's happening in Atlanta</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E8E8E4] p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your name"
                required
                className="w-full px-3 py-2.5 rounded-xl border border-[#E8E8E4] text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-3 py-2.5 rounded-xl border border-[#E8E8E4] text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-3 py-2.5 rounded-xl border border-[#E8E8E4] text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent"
              />
            </div>
            <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
              Create Account
            </Button>
          </form>
        </div>

        <p className="text-center mt-4 text-sm text-[#94A3B8]">
          Already have an account?{' '}
          <Link to="/sign-in" className="text-[#7C3AED] font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </Layout>
  )
}
