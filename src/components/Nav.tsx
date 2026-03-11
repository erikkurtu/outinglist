import React, { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Button } from './Button'
import { useAuth } from '@/lib/auth'

export function Nav() {
  const { user, signOut } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  const navItems = [
    { to: '/browse', label: 'Browse' },
    { to: '/lists', label: 'Lists' },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#E8E8E4]">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-display font-bold text-xl">
          <span className="w-8 h-8 bg-[#FF6B35] rounded-lg flex items-center justify-center text-white text-sm font-bold">
            OL
          </span>
          <span className="text-[#1A1A1A]">OutingList</span>
          <span className="text-xs bg-[#FF6B35]/10 text-[#FF6B35] px-1.5 py-0.5 rounded font-medium">ATL</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${
                  isActive ? 'text-[#FF6B35]' : 'text-[#94A3B8] hover:text-[#1A1A1A]'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Right: Auth */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/events/new')}
                icon={<span>+</span>}
              >
                Add Event
              </Button>
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="w-8 h-8 rounded-full bg-[#FF6B35] flex items-center justify-center text-white text-sm font-bold"
                >
                  {user.name?.[0]?.toUpperCase() || 'U'}
                </button>
                {menuOpen && (
                  <div className="absolute right-0 top-10 bg-white border border-[#E8E8E4] rounded-xl shadow-xl p-1 min-w-36 z-50">
                    <Link
                      to="/profile"
                      className="block px-3 py-2 text-sm text-[#1A1A1A] hover:bg-[#F5F5F2] rounded-lg"
                      onClick={() => setMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      to="/lists"
                      className="block px-3 py-2 text-sm text-[#1A1A1A] hover:bg-[#F5F5F2] rounded-lg"
                      onClick={() => setMenuOpen(false)}
                    >
                      My Lists
                    </Link>
                    <button
                      onClick={() => { signOut(); setMenuOpen(false) }}
                      className="w-full text-left px-3 py-2 text-sm text-[#EF4444] hover:bg-[#FEF2F2] rounded-lg"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => navigate('/sign-in')}>
                Sign In
              </Button>
              <Button variant="primary" size="sm" onClick={() => navigate('/sign-up')}>
                Sign Up
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#E8E8E4] flex z-50">
        {[
          { to: '/', icon: '🏠', label: 'Home' },
          { to: '/browse', icon: '🔍', label: 'Browse' },
          { to: '/lists', icon: '📋', label: 'Lists' },
          { to: '/profile', icon: '👤', label: 'Profile' },
        ].map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center py-2 text-xs transition-colors ${
                isActive ? 'text-[#FF6B35]' : 'text-[#94A3B8]'
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </header>
  )
}
