import React from 'react'
import { Link } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { Button } from '@/components/Button'

export function Home() {
  return (
    <Layout fullWidth>
      {/* Hero */}
      <section className="bg-[#1A1A2E] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-[#FF6B35] rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-10 w-80 h-80 bg-[#00D4AA] rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 py-20 md:py-28">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 text-[#00D4AA] text-sm font-medium px-3 py-1 rounded-full mb-6">
              <span className="w-1.5 h-1.5 bg-[#00D4AA] rounded-full animate-pulse" />
              Atlanta's event guide
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight mb-6">
              Your friend who always knows{' '}
              <span className="text-[#FF6B35]">what's happening.</span>
            </h1>
            <p className="text-white/70 text-lg md:text-xl mb-8 leading-relaxed">
              Discover concerts, food events, art shows, community gatherings, and more
              — all happening in Atlanta, curated for people who actually go out.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="primary"
                size="lg"
                onClick={() => window.location.href = '/browse'}
              >
                Explore Events
              </Button>
              <Button
                variant="secondary"
                size="lg"
                className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                onClick={() => window.location.href = '/sign-up'}
              >
                Create an Account
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories strip */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl font-bold text-[#1A1A1A]">Browse by Vibe</h2>
          <Link to="/browse" className="text-[#FF6B35] text-sm font-medium hover:underline">
            See all →
          </Link>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
          {[
            { icon: '🎵', label: 'Music', slug: 'music-concerts', color: '#8B5CF6' },
            { icon: '🍕', label: 'Food & Drink', slug: 'food-drink', color: '#F59E0B' },
            { icon: '🎨', label: 'Arts', slug: 'arts-culture', color: '#EC4899' },
            { icon: '🏃', label: 'Sports', slug: 'sports-fitness', color: '#10B981' },
            { icon: '🌙', label: 'Nightlife', slug: 'nightlife-parties', color: '#6366F1' },
            { icon: '👨‍👩‍👧', label: 'Family', slug: 'family-kids', color: '#F97316' },
            { icon: '🌿', label: 'Outdoor', slug: 'outdoor-nature', color: '#22C55E' },
            { icon: '💻', label: 'Tech', slug: 'tech-innovation', color: '#3B82F6' },
            { icon: '🤝', label: 'Community', slug: 'community-civic', color: '#14B8A6' },
            { icon: '✨', label: 'Wellness', slug: 'wellness-spirituality', color: '#A855F7' },
          ].map(cat => (
            <Link
              key={cat.slug}
              to={`/browse?category=${cat.slug}`}
              className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white border border-[#E8E8E4] hover:border-transparent hover:shadow-md transition-all hover:-translate-y-0.5 text-center"
            >
              <span className="text-2xl">{cat.icon}</span>
              <span className="text-xs font-medium text-[#1A1A1A] leading-tight">{cat.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="bg-[#FF6B35] rounded-2xl p-8 md:p-12 text-white text-center">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-3">
            Know something happening?
          </h2>
          <p className="text-white/80 mb-6">
            Add your event and share it with Atlanta.
          </p>
          <Button
            variant="secondary"
            size="lg"
            className="bg-white text-[#FF6B35] hover:bg-white/90 border-transparent"
            onClick={() => window.location.href = '/events/new'}
          >
            Post an Event
          </Button>
        </div>
      </section>
    </Layout>
  )
}
