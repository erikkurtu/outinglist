import React from 'react'
import { Nav } from './Nav'
import { cn } from '@/lib/utils'

interface LayoutProps {
  children: React.ReactNode
  className?: string
  fullWidth?: boolean
}

export function Layout({ children, className, fullWidth = false }: LayoutProps) {
  return (
    <div className="min-h-screen bg-[#FAFAF8] flex flex-col">
      <Nav />
      <main className={cn(
        'flex-1',
        !fullWidth && 'max-w-6xl mx-auto w-full px-4 py-6',
        'pb-20 md:pb-6', // mobile nav clearance
        className
      )}>
        {children}
      </main>
      <footer className="hidden md:block border-t border-[#E8E8E4] py-8">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2 font-display font-bold text-[#1A1A1A]">
            <span className="w-6 h-6 bg-[#FF6B35] rounded flex items-center justify-center text-white text-xs font-bold">
              OL
            </span>
            OutingList
          </div>
          <p className="text-xs text-[#94A3B8]">
            Your friend who always knows what's happening in Atlanta.
          </p>
          <div className="text-xs text-[#94A3B8]">
            © 2026 OutingList
          </div>
        </div>
      </footer>
    </div>
  )
}
