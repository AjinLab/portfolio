'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Home, GraduationCap, FolderOpen, Zap, Mail } from 'lucide-react'
import { useState, useCallback } from 'react'

interface NavLink {
  icon: React.ComponentType<{ className?: string }>
  href: string
  label: string
}

const navLinks: NavLink[] = [
  { icon: Home, href: '#hero', label: 'Home' },
  { icon: GraduationCap, href: '#education', label: 'Education' },
  { icon: FolderOpen, href: '#projects', label: 'Projects' },
  { icon: Zap, href: '#skills', label: 'Skills' },
  { icon: Mail, href: '#contact', label: 'Contact' },
]

export function FloatingNav() {
  const [hovered, setHovered] = useState<string | null>(null)

  const handleMouseEnter = useCallback((label: string) => {
    setHovered(label)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setHovered(null)
  }, [])

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] px-4 pointer-events-none">
      <motion.nav
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          type: 'spring',
          stiffness: 260,
          damping: 20,
          delay: 0.5
        }}
        className="flex items-center gap-1 bg-bg-card/70 backdrop-blur-xl border border-border-subtle rounded-full px-2 py-2 shadow-2xl shadow-black/40 pointer-events-auto"
        role="navigation"
        aria-label="Main navigation"
      >
        {navLinks.map((item) => {
          const Icon = item.icon
          const isHovered = hovered === item.label

          return (
            <Link
              key={item.label}
              href={item.href}
              onMouseEnter={() => handleMouseEnter(item.label)}
              onMouseLeave={handleMouseLeave}
              className="relative p-3 rounded-full text-text-muted hover:text-text-primary transition-colors group focus:outline-none focus-visible:ring-2 focus-visible:ring-text-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-card"
              aria-label={item.label}
            >
              <Icon className="w-5 h-5 relative z-10" />

              {/* Hover Background */}
              <AnimatePresence>
                {isHovered && (
                  <motion.span
                    layoutId="nav-hover"
                    className="absolute inset-0 bg-white/10 rounded-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    aria-hidden="true"
                  />
                )}
              </AnimatePresence>

              {/* Tooltip */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: -45, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-1/2 -translate-x-1/2 px-2.5 py-1 bg-bg-card border border-border-subtle rounded-md text-[11px] font-medium text-text-primary whitespace-nowrap pointer-events-none shadow-lg"
                    role="tooltip"
                    aria-hidden="true"
                  >
                    {item.label}
                    {/* Tooltip Arrow */}
                    <div className="absolute -bottom-[5px] left-1/2 -translate-x-1/2 w-2 h-2 bg-bg-card border-r border-b border-border-subtle rotate-45" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Link>
          )
        })}
      </motion.nav>
    </div>
  )
}