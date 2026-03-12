import React from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'accent' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: React.ReactNode
  children?: React.ReactNode
  className?: string
}

const variants = {
  primary: 'bg-[#5B5BD6] text-white hover:bg-[#4F46E5] border border-transparent',
  secondary: 'bg-[#1A1A1F] text-white hover:bg-[#2D2D2D] border border-transparent',
  ghost: 'bg-transparent text-[#1A1A1F] hover:bg-[#EDE7DC] border border-transparent',
  danger: 'bg-red-600 text-white hover:bg-red-700 border border-transparent',
  accent: 'bg-[#F7F7F5] text-[#5B5BD6] hover:bg-[#EDE7DC] border border-transparent',
  outline: 'bg-transparent text-[#1A1A1F] border border-[#1A1A1F] hover:bg-[#1A1A1F] hover:text-white',
}

const sizes = {
  sm: 'text-xs px-3 py-1.5 h-8',
  md: 'text-sm px-4 py-2 h-9',
  lg: 'text-sm px-6 py-3 h-11',
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-semibold font-sans transition-colors',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {loading ? (
        <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeDashoffset="20" />
        </svg>
      ) : icon}
      {children}
    </button>
  )
}
