'use client'

import { SectionLabel } from '@/components/ui/SectionLabel'
import { RevealOnScroll } from '@/components/ui/RevealOnScroll'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import type { ComponentProps } from 'react'
import type { GitHubCalendar as GitHubCalendarType } from 'react-github-calendar'

// ─── Constants ────────────────────────────────────────────────────────────────
const GITHUB_USERNAME = 'ajinlab'

const CALENDAR_THEME = {
  dark: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function CalendarSkeleton() {
  return (
    <div className="min-w-[600px] space-y-2" aria-label="Loading GitHub calendar">
      <div className="h-4 w-48 animate-pulse rounded bg-white/5" />
      <div className="h-32 animate-pulse rounded-lg bg-white/5" />
    </div>
  )
}

// ─── Error State ──────────────────────────────────────────────────────────────
function CalendarError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex h-32 flex-col items-center justify-center gap-3 rounded-lg border border-border-subtle bg-white/5">
      <p className="text-sm text-text-muted">Failed to load contribution data.</p>
      <button
        onClick={onRetry}
        className="rounded-md border border-border-subtle px-3 py-1 text-xs text-text-primary transition-colors hover:bg-white/5"
      >
        Retry
      </button>
    </div>
  )
}

// ─── Dynamic Import ───────────────────────────────────────────────────────────
// Import using the named export directly — no .default access needed.
// Cast through ComponentProps to preserve the real prop types for TypeScript.
type CalendarProps = ComponentProps<typeof GitHubCalendarType>

const GitHubCalendar = dynamic<CalendarProps>(
  () => import('react-github-calendar').then((mod) => mod.GitHubCalendar),
  {
    ssr: false,
    loading: CalendarSkeleton,
  }
)

// ─── Calendar Wrapper with Error Handling ─────────────────────────────────────
function CalendarWrapper() {
  const [hasError, setHasError] = useState(false)
  const [retryKey, setRetryKey] = useState(0)

  const handleRetry = () => {
    setHasError(false)
    setRetryKey((prev) => prev + 1)
  }

  if (hasError) {
    return <CalendarError onRetry={handleRetry} />
  }

  return (
    /*
     * min-w wrapper ensures the calendar scrolls horizontally on small
     * screens rather than being squished — the outer card has overflow-x-auto.
     */
    <div className="min-w-[600px]">
      <GitHubCalendar
        key={retryKey}
        username={GITHUB_USERNAME}
        colorScheme="dark"
        theme={CALENDAR_THEME}
        fontSize={11}
        blockSize={9}
        blockMargin={2}
        blockRadius={2}
        throwOnError
      />
    </div>
  )
}

// ─── Section ──────────────────────────────────────────────────────────────────
export function GitHubGraph() {
  return (
    <section
      id="github"
      aria-labelledby="github-heading"
      className="border-t border-border-subtle py-14"
    >
      <RevealOnScroll>
        <SectionLabel>Open Source</SectionLabel>

        <h2
          id="github-heading"
          className="mt-2 text-2xl font-semibold text-text-primary"
        >
          GitHub
        </h2>

        <p className="mb-7 mt-1 text-sm text-text-muted">
          Contribution rhythm — code shipped in public, consistently.
        </p>
      </RevealOnScroll>

      <RevealOnScroll delay={0.15}>
        <div className="overflow-x-auto rounded-xl border border-border-subtle bg-bg-card p-5">
          {/* ── Header ── */}
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm text-text-primary">
              Contributions in the last year
            </span>

            <a
              href={`https://github.com/${GITHUB_USERNAME}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${GITHUB_USERNAME} on GitHub (opens in new tab)`}
              className="font-mono text-[12px] text-teal transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
            >
              @{GITHUB_USERNAME}
            </a>
          </div>

          {/* ── Calendar ── */}
          <CalendarWrapper />
        </div>
      </RevealOnScroll>
    </section>
  )
}