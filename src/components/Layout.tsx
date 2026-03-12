import React from 'react'
import { Nav } from './Nav'
import { cn } from '@/lib/utils'

interface LayoutProps {
  children: React.ReactNode
  className?: string
  fullWidth?: boolean
  noPad?: boolean
}

export function Layout({ children, className, fullWidth = false, noPad = false }: LayoutProps) {
  return (
    <div className="min-h-screen bg-[#F7F7F5] flex flex-col">
      <Nav />
      <main className={cn(
        'flex-1',
        !fullWidth && !noPad && 'max-w-6xl mx-auto w-full px-6 py-8',
        'pb-20 md:pb-0', // mobile nav clearance
        className
      )}>
        {children}
      </main>
      <footer className="hidden md:block bg-[#1A1A1F] border-t border-white/10 py-10">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="font-display font-bold text-white text-lg">
            OutingList
            <span className="ml-1.5 text-[10px] font-sans font-semibold tracking-widest text-[#5B5BD6] uppercase align-middle">ATL</span>
          </div>
          <p className="text-xs text-white/30">
            Your friend who always knows what's happening in Atlanta.
          </p>
          <div className="text-xs text-white/30">
            © 2026 OutingList
          </div>
        </div>
      </footer>
    </div>
  )
}
