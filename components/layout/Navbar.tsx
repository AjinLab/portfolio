'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { statusConfig } from '@/lib/site-status'
import type { StatusType } from '@/lib/site-status'

const navLinks = [
  { label: 'Timeline', href: '#education' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
]

export function Navbar({ siteStatus }: { siteStatus: StatusType }) {
  const current = statusConfig[siteStatus]

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 bg-bg-primary/60 backdrop-blur-xl"
    >
      {/* Subtle top sheen */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />

      <div className="relative flex items-center px-8 py-4">
        {/* Left — Name */}
        <Link
          href="#hero"
          className="text-sm font-medium text-text-muted hover:text-text-primary transition-colors duration-200"
        >
          Ajin
        </Link>

        {/* Center — Nav links */}
        <nav className="hidden sm:flex items-center gap-7 absolute left-1/2 -translate-x-1/2">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm text-text-muted hover:text-text-primary transition-colors duration-200 py-1"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right — Status */}
        <div className="ml-auto flex items-center">
          <div className="relative group cursor-default">
            <div className="flex items-center gap-2">
              <span className="relative flex items-center justify-center w-3 h-3">
                <span
                  className={`absolute inline-flex h-full w-full rounded-full ${current.pingColor} opacity-40 animate-ping`}
                />
                <span
                  className={`relative inline-flex w-2 h-2 rounded-full ${current.dotColor}`}
                />
              </span>
              <span className={`text-[12px] font-medium ${current.textColor}`}>
                {current.label}
              </span>
            </div>

            {/* Tooltip */}
            <div className="absolute right-0 top-full mt-3 px-2.5 py-1.5 bg-bg-card border border-border-subtle rounded-lg text-[11px] text-text-muted whitespace-nowrap opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-200 pointer-events-none shadow-lg">
              {current.tooltip}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom border — white/bright center fading to transparent on sides */}
      <div className="relative flex justify-center">
        <div className="w-[320px] h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>
    </motion.header>
  )
}