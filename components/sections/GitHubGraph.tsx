'use client'

import { SectionLabel } from '@/components/ui/SectionLabel'
import { RevealOnScroll } from '@/components/ui/RevealOnScroll'
import dynamic from 'next/dynamic'
import { Component, useState } from 'react'
import type { ComponentProps, ReactNode, ErrorInfo } from 'react'
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

// ─── Error Boundary ───────────────────────────────────────────────────────────
/**
 * React Error Boundaries are the ONLY way to catch errors thrown during
 * rendering. The GitHubCalendar component uses `throwOnError`, which means
 * a failed API call throws during render — without this boundary, the
 * entire page would crash to a blank screen.
 */
interface ErrorBoundaryProps {
  children: ReactNode
  fallback: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

class CalendarErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('GitHub Calendar error:', error, info)
  }

  render() {
    if (this.state.hasError) return this.props.fallback
    return this.props.children
  }
}

// ─── Dynamic Import ───────────────────────────────────────────────────────────
type CalendarProps = ComponentProps<typeof GitHubCalendarType>

const GitHubCalendar = dynamic<CalendarProps>(
  () => import('react-github-calendar').then((mod) => mod.GitHubCalendar),
  {
    ssr: false,
    loading: () => <CalendarSkeleton />,
  }
)

// ─── Calendar Wrapper with Error Handling ─────────────────────────────────────
function CalendarWrapper() {
  const [retryKey, setRetryKey] = useState(0)

  return (
    <CalendarErrorBoundary
      key={retryKey}
      fallback={
        <CalendarError onRetry={() => setRetryKey((k) => k + 1)} />
      }
    >
      <div className="min-w-[600px]">
        <GitHubCalendar
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
    </CalendarErrorBoundary>
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