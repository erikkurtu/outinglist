import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { Button } from '@/components/Button'
import { useAuth } from '@/lib/auth'

export function SignIn() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await signIn(email, password)
      navigate('/')
    } catch (err) {
      setError('Invalid credentials. Try anything for now — this is mock auth!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="max-w-md mx-auto pt-8">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-[#FF6B35] rounded-2xl flex items-center justify-center text-white font-bold text-lg mx-auto mb-4 font-display">
            OL
          </div>
          <h1 className="font-display text-2xl font-bold text-[#1A1A1A]">Welcome back</h1>
          <p className="text-[#94A3B8] mt-1">Sign in to your OutingList account</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E8E8E4] p-6 shadow-sm">
          {error && (
            <div className="mb-4 p-3 bg-[#FEF2F2] border border-[#FECACA] rounded-xl text-sm text-[#EF4444]">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-3 py-2.5 rounded-xl border border-[#E8E8E4] text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
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
                className="w-full px-3 py-2.5 rounded-xl border border-[#E8E8E4] text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
              />
            </div>
            <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
              Sign In
            </Button>
          </form>
        </div>

        <p className="text-center mt-4 text-sm text-[#94A3B8]">
          Don't have an account?{' '}
          <Link to="/sign-up" className="text-[#FF6B35] font-medium hover:underline">Sign up</Link>
        </p>
      </div>
    </Layout>
  )
}
