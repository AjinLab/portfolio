// components/Hero.tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail } from 'lucide-react'
import { HireModal } from '@/components/ui/HireModal'
import { StatusBlockedModal } from '@/components/ui/StatusBlockedModal'
import { SITE_STATUS, statusConfig } from '@/lib/site-status'

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: 'easeOut' as const },
})

const stackItems = ['Python', 'Linux']

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  )
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function KaggleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.825 23.859c-.022.092-.117.141-.281.141h-3.139c-.187 0-.351-.082-.492-.248l-5.178-6.589-1.448 1.374v5.111c0 .235-.117.352-.351.352H5.505c-.236 0-.354-.117-.354-.352V.353c0-.233.118-.353.354-.353h2.431c.234 0 .351.12.351.353v14.343l6.203-6.272c.165-.165.33-.246.495-.246h3.239c.144 0 .236.06.281.18.046.149.034.255-.036.315l-6.555 6.344 6.836 8.507c.095.104.117.208.075.358" />
    </svg>
  )
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  )
}

const socials = [
  { Icon: GitHubIcon, href: 'https://github.com/ajinlab', label: 'GitHub' },
  { Icon: LinkedInIcon, href: 'https://linkedin.com/in/ajinlab', label: 'LinkedIn' },
  { Icon: KaggleIcon, href: 'https://kaggle.com/ajinlab', label: 'Kaggle' },
  { Icon: InstagramIcon, href: 'https://instagram.com/ephoreee', label: 'Instagram' },
]

export function Hero() {
  const [hireOpen, setHireOpen] = useState(false)
  const [blockedOpen, setBlockedOpen] = useState(false)

  const current = statusConfig[SITE_STATUS]
  const isBlocked = current.hireBlocked

  function handleHireClick() {
    if (isBlocked) {
      setBlockedOpen(true)
    } else {
      setHireOpen(true)
    }
  }

  return (
    <>
      <section id="hero" className="pt-16 pb-14">
        {/* Label */}
        <motion.div {...fadeUp(0.1)}>
          <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-teal">
            AI & Data Science Student
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          {...fadeUp(0.2)}
          className="text-2xl sm:text-3xl font-semibold leading-tight mt-4"
        >
          <span className="text-text-primary">Ajin</span>
          <span className="text-text-muted">
            {' — '}learning by building
            <br />
            AI, data & real projects.
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          {...fadeUp(0.3)}
          className="text-sm leading-relaxed text-text-muted mt-4 max-w-lg"
        >
          AI & DS student learning deeply, building consistently, and exploring where I fit best.
        </motion.p>

        {/* Stack tags */}
        <motion.div {...fadeUp(0.4)} className="flex flex-wrap items-center gap-1.5 mt-5">
          {stackItems.map((item, i) => (
            <span key={item} className="font-mono text-[12px] text-text-muted">
              {item}
              {i < stackItems.length - 1 && (
                <span className="text-text-faint ml-1.5">·</span>
              )}
            </span>
          ))}
        </motion.div>

        {/* Buttons */}
        <motion.div {...fadeUp(0.5)} className="flex flex-wrap gap-3 mt-6">
          <a
            href="https://github.com/ajinlab/AI-Journey-2026"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-teal text-bg-primary font-semibold text-sm px-5 py-2.5 rounded-lg hover:opacity-85 transition-opacity"
          >
            AI Journey Repo
            <GitHubIcon className="w-4 h-4" />
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 border border-border-subtle text-text-primary text-sm px-5 py-2.5 rounded-lg hover:border-border-hover hover:bg-white/[0.03] transition-all"
          >
            Get in touch
            <Mail className="w-4 h-4" />
          </a>
        </motion.div>

        {/* Social Icons */}
        <motion.div {...fadeUp(0.6)} className="flex items-center gap-4 mt-6">
          {socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-muted hover:text-text-primary transition-colors"
              aria-label={social.label}
            >
              <social.Icon className="w-5 h-5" />
            </a>
          ))}
        </motion.div>

        {/* Availability Card */}
        <motion.div
          {...fadeUp(0.7)}
          className="mt-8 bg-bg-card border border-border-subtle rounded-xl p-4 sm:p-5"
        >
          <div className="flex items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              {/* Status dot — color synced with SITE_STATUS */}
              <span className="relative flex items-center justify-center w-3 h-3 mt-[18px] shrink-0">
                <span
                  className={`absolute inline-flex h-full w-full rounded-full ${current.pingColor} opacity-40 animate-ping`}
                />
                <span
                  className={`relative inline-flex w-2 h-2 rounded-full ${current.dotColor}`}
                />
              </span>

              <div>
                <span className="font-mono text-[10px] tracking-[0.12em] uppercase text-teal block">
                  Availability
                </span>
                <p className="text-[13px] font-semibold text-text-primary mt-1">
                  {current.availabilityTitle}
                </p>
                <p className="text-[12px] text-text-muted mt-0.5">
                  {current.availabilitySubtitle}
                </p>
              </div>
            </div>

            {/* Hire me button — blocked or active based on status */}
            <button
              onClick={handleHireClick}
              className={`shrink-0 text-[13px] px-4 py-1.5 rounded-lg border transition-all cursor-pointer ${isBlocked
                ? 'border-border-subtle text-text-faint opacity-60 hover:opacity-80 hover:border-border-hover'
                : 'border-border-subtle text-text-muted hover:border-border-hover hover:text-text-primary hover:bg-white/[0.03]'
                }`}
            >
              {isBlocked ? 'Not Available' : 'Hire me'}
            </button>
          </div>
        </motion.div>
      </section>

      {/* Normal hire modal — only when available/in-work */}
      <HireModal isOpen={hireOpen} onClose={() => setHireOpen(false)} />

      {/* Blocked modal — only when unavailable/under-construction */}
      <StatusBlockedModal isOpen={blockedOpen} onClose={() => setBlockedOpen(false)} />
    </>
  )
}