import React from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps {
  label: string
  color?: string
  icon?: string
  className?: string
  onClick?: () => void
}

export function Badge({ label, color = '#5B5BD6', icon, className, onClick }: BadgeProps) {
  const bg = color + '18' // ~10% opacity
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-[6px] transition-colors cursor-default',
        onClick && 'cursor-pointer hover:opacity-80',
        className
      )}
      style={{ backgroundColor: bg, color }}
      onClick={onClick}
    >
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
      {label}
    </span>
  )
}
