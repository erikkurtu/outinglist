import React from 'react'

interface IconProps {
  size?: number
  color?: string
  className?: string
}

export function MusicIcon({ size = 24, color = 'currentColor', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  )
}

export function FoodIcon({ size = 24, color = 'currentColor', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M8 2v4a4 4 0 0 0 8 0V2" />
      <path d="M12 12v10" />
      <path d="M8 22h8" />
      <path d="M3 2c0 6 3 8 5 9" />
      <path d="M21 2c0 6-3 8-5 9" />
    </svg>
  )
}

export function ArtsIcon({ size = 24, color = 'currentColor', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="13.5" cy="6.5" r="2.5" />
      <circle cx="17.5" cy="10.5" r="2.5" />
      <circle cx="8.5" cy="7.5" r="2.5" />
      <circle cx="6.5" cy="12.5" r="2.5" />
      <path d="M12 22a10 10 0 1 1 0-20" />
      <path d="M14 14a6 6 0 0 0-8 8" />
    </svg>
  )
}

export function SportsIcon({ size = 24, color = 'currentColor', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" />
      <path d="M4.93 4.93 10 10" />
      <path d="M14 10h6.93" />
      <path d="M19.07 19.07 14 14" />
      <path d="M4 14H.93" />
      <path d="M4.93 19.07 10 14" />
      <path d="M19.07 4.93 14 10" />
    </svg>
  )
}

export function NightlifeIcon({ size = 24, color = 'currentColor', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M8 2h8l-4 7h4l-6 13 2-9H8l4-7H8z" />
    </svg>
  )
}

export function FamilyIcon({ size = 24, color = 'currentColor', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

export function OutdoorIcon({ size = 24, color = 'currentColor', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 17L9 5l6 12" />
      <path d="M13 17l4.5-9 4.5 9" />
      <path d="M3 17h18" />
    </svg>
  )
}

export function TechIcon({ size = 24, color = 'currentColor', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8" />
      <path d="M12 17v4" />
      <path d="m9 10 2 2 4-4" />
    </svg>
  )
}

export function CommunityIcon({ size = 24, color = 'currentColor', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0z" />
      <path d="M12 8v8" />
      <path d="M8 12h8" />
    </svg>
  )
}

export function WellnessIcon({ size = 24, color = 'currentColor', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 22c-4.2 0-8-2.8-8-7 0-2.8 2-5.8 5-8l3 2.5L15 7c3 2.2 5 5.2 5 8 0 4.2-3.8 7-8 7z" />
      <path d="M9 17c0-2 1.3-3.5 3-3.5s3 1.5 3 3.5" />
    </svg>
  )
}

export function WorkshopIcon({ size = 24, color = 'currentColor', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  )
}

export function FilmIcon({ size = 24, color = 'currentColor', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="2" y="2" width="20" height="20" rx="2.18" />
      <path d="M7 2v20" />
      <path d="M17 2v20" />
      <path d="M2 12h20" />
      <path d="M2 7h5" />
      <path d="M2 17h5" />
      <path d="M17 17h5" />
      <path d="M17 7h5" />
    </svg>
  )
}

export function MarketIcon({ size = 24, color = 'currentColor', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  )
}

export function CharityIcon({ size = 24, color = 'currentColor', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  )
}

export function EducationIcon({ size = 24, color = 'currentColor', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  )
}

// Map slug to icon component
export const CATEGORY_ICONS: Record<string, React.FC<IconProps>> = {
  'music-concerts': MusicIcon,
  'food-drink': FoodIcon,
  'arts-culture': ArtsIcon,
  'sports-fitness': SportsIcon,
  'nightlife-parties': NightlifeIcon,
  'family-kids': FamilyIcon,
  'outdoor-nature': OutdoorIcon,
  'tech-innovation': TechIcon,
  'community-civic': CommunityIcon,
  'wellness-spirituality': WellnessIcon,
  'workshops-classes': WorkshopIcon,
  'film-media': FilmIcon,
  'markets-shopping': MarketIcon,
  'charity-causes': CharityIcon,
  'education-lectures': EducationIcon,
}

export const CATEGORY_COLORS: Record<string, string> = {
  'music-concerts': '#5B35C8',
  'food-drink': '#C28A2A',
  'arts-culture': '#B83E6A',
  'sports-fitness': '#2A7A4A',
  'nightlife-parties': '#3D3A8C',
  'family-kids': '#C2582A',
  'outdoor-nature': '#3A7A3A',
  'tech-innovation': '#1A5FAD',
  'community-civic': '#1A8A7A',
  'wellness-spirituality': '#7A35A8',
  'workshops-classes': '#8C4A2A',
  'film-media': '#2A5A8C',
  'markets-shopping': '#C28A2A',
  'charity-causes': '#B83E6A',
  'education-lectures': '#3D3A8C',
}
