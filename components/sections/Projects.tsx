'use client'

import { projects } from '@/data/projects'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { RevealOnScroll } from '@/components/ui/RevealOnScroll'
import { ExternalLink } from 'lucide-react'
import { memo, useMemo } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

type PhaseStatus = 'complete' | 'active' | 'upcoming'

interface Phase {
  name: string
  range: [number, number]
  months: string
}

// ─── Constants ────────────────────────────────────────────────────────────────

/**
 * Overall journey progress (0–100).
 * Month 1–2 of 24 ≈ 2% complete.
 * Clamp enforced at runtime via getPhaseBarFill.
 */
const TOTAL_PROGRESS: number = Math.min(100, Math.max(0, 2))

const phases: Phase[] = [
  { name: 'Foundation', range: [0, 25], months: 'Months 1–6' },
  { name: 'Building', range: [25, 50], months: 'Months 7–12' },
  { name: 'Leveling Up', range: [50, 75], months: 'Months 13–18' },
  { name: 'Mastery', range: [75, 100], months: 'Months 19–24' },
]

const statusConfig: Record<string, { label: string; classes: string }> = {
  Live: { label: 'Live', classes: 'bg-green-status/15 text-green-status' },
  Building: { label: 'Building', classes: 'bg-amber-400/15   text-amber-400' },
  Done: { label: 'Done', classes: 'bg-blue-400/15    text-blue-400' },
  Upcoming: { label: 'Upcoming', classes: 'bg-purple-400/15  text-purple-400' },
}

// ─── Pure helpers ─────────────────────────────────────────────────────────────

/**
 * Returns how filled a phase's bar should be (0–100), scoped to its slice.
 *
 * TOTAL_PROGRESS = 2  → Phase 1 fill = (2-0)/25*100 = 8%
 * TOTAL_PROGRESS = 33 → Phase 1 fill = 100%, Phase 2 fill = 32%
 */
function getPhaseBarFill(overallProgress: number, range: [number, number]): number {
  const [start, end] = range

  // Guard: malformed range
  if (end <= start) return 0

  if (overallProgress <= start) return 0
  if (overallProgress >= end) return 100

  return ((overallProgress - start) / (end - start)) * 100
}

function getPhaseStatus(overallProgress: number, range: [number, number]): PhaseStatus {
  const [start, end] = range
  if (overallProgress >= end) return 'complete'
  if (overallProgress > start) return 'active'
  return 'upcoming'
}

// ─── Journey Card ─────────────────────────────────────────────────────────────

const JourneyCard = memo(function JourneyCard() {
  const journey = useMemo(() => projects.find((p) => p.isJourney), [])
  if (!journey) return null

  // Use githubUrl from data — fallback to empty string (link hidden if missing)
  const githubHref = journey.githubUrl ?? ''

  return (
    <RevealOnScroll>
      {/*
        FIX: Removed conflicting `border border-teal-border`.
        We only want the subtle teal left accent + a consistent card border.
        Use `border border-border-subtle` for all sides, then override left.
      */}
      <div
        className="
          bg-bg-card rounded-xl p-5 mb-4
          border border-border-subtle
          border-l-2 border-l-teal
        "
      >
        <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-teal">
          Journey
        </span>

        <h3 className="text-lg font-semibold text-text-primary mt-2">
          {journey.name}
        </h3>

        <p className="text-sm text-text-muted mt-1.5 leading-relaxed">
          {journey.description}
        </p>

        {/* ── Phase Progress ── */}
        <div className="mt-4">

          {/* Overall % label */}
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] text-text-faint font-mono">
              Overall Progress
            </span>
            <span className="text-[10px] text-teal font-mono font-medium">
              {TOTAL_PROGRESS}%
            </span>
          </div>

          {/* Phase bars */}
          <div className="flex gap-1.5 mb-3">
            {phases.map((phase) => {
              const fill = getPhaseBarFill(TOTAL_PROGRESS, phase.range)
              const status = getPhaseStatus(TOTAL_PROGRESS, phase.range)

              return (
                <div
                  key={phase.name}
                  className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden"
                  title={`${phase.name} (${phase.months}): ${Math.round(fill)}% complete`}
                  role="progressbar"
                  aria-valuenow={Math.round(fill)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={phase.name}
                >
                  <div
                    className={`
                      h-full rounded-full transition-all duration-700 ease-out
                      ${status === 'complete' ? 'bg-teal opacity-60' : ''}
                      ${status === 'active' ? 'bg-teal' : ''}
                    `}
                    style={{ width: `${fill}%` }}
                  />
                </div>
              )
            })}
          </div>

          {/*
            FIX: Phase labels — on narrow screens 4 labels in a row collide.
            Use a grid so each label is pinned to its bar, not floating between bars.
            `truncate` prevents overflow; `title` still shows full text on hover.
          */}
          <div className="grid grid-cols-4 gap-1.5">
            {phases.map((phase) => {
              const status = getPhaseStatus(TOTAL_PROGRESS, phase.range)

              return (
                <div key={phase.name} className="flex flex-col gap-0.5">
                  <span
                    title={`${phase.name} · ${phase.months}`}
                    className={`
                      text-[10px] truncate
                      ${status === 'active' ? 'text-teal font-medium' : ''}
                      ${status === 'complete' ? 'text-teal/50' : ''}
                      ${status === 'upcoming' ? 'text-text-faint' : ''}
                    `}
                  >
                    {phase.name}
                  </span>
                  <span className="text-[9px] text-text-faint/60 font-mono truncate">
                    {phase.months}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* GitHub link — only rendered if URL exists in data */}
        {githubHref && (
          <a
            href={githubHref}
            target="_blank"
            rel="noopener noreferrer"
            className="
              inline-flex items-center gap-1.5 mt-4
              text-sm text-teal hover:text-teal/80
              transition-colors focus-visible:outline-none
              focus-visible:ring-2 focus-visible:ring-teal/50 rounded
            "
          >
            View on GitHub
            <ExternalLink size={13} aria-hidden="true" />
          </a>
        )}
      </div>
    </RevealOnScroll>
  )
})

// ─── Project Row ──────────────────────────────────────────────────────────────

/**
 * FIX: Extract row into its own memoized component so the list doesn't
 * re-render every row when unrelated state changes in the parent.
 *
 * FIX: Wrapper typing — instead of spreading into a polymorphic element,
 * we branch explicitly, which TypeScript can fully narrow.
 */
const ProjectRow = memo(function ProjectRow({
  project,
  index,
}: {
  project: (typeof projects)[number]
  index: number
}) {
  const status = statusConfig[project.status]
  const href = (project.url ?? project.githubUrl ?? '').replace(/^#$/, '')
  const isLinked = Boolean(href)

  const inner = (
    <>
      {/* Top row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <span
            className={`
              text-sm font-medium text-text-primary truncate
              ${isLinked ? 'group-hover:text-teal' : ''}
              transition-colors
            `}
          >
            {project.name}
          </span>

          {status && (
            <span
              className={`
                shrink-0 text-[10px] font-medium
                px-2 py-0.5 rounded-full
                ${status.classes}
              `}
            >
              {status.label}
            </span>
          )}

          {isLinked && (
            <ExternalLink
              className="shrink-0 w-3.5 h-3.5 text-text-faint group-hover:text-teal transition-colors"
              aria-hidden="true"
            />
          )}
        </div>

        <span className="shrink-0 text-[12px] text-text-faint font-mono ml-3">
          {project.year}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-text-muted mt-1.5 leading-relaxed">
        {project.description}
      </p>

      {/* Tags */}
      {project.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2.5">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="
                text-[12px] px-2.5 py-0.5 rounded-full
                bg-white/5 border border-border-subtle text-text-muted
              "
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </>
  )

  return (
    <RevealOnScroll delay={index * 0.08}>
      <div className="py-4 border-t border-border-subtle group">
        {isLinked ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal/50 rounded"
          >
            {inner}
          </a>
        ) : (
          <div>{inner}</div>
        )}
      </div>
    </RevealOnScroll>
  )
})

// ─── Section ──────────────────────────────────────────────────────────────────

export function Projects() {
  const nonJourneyProjects = useMemo(
    () => projects.filter((p) => !p.isJourney),
    []
  )

  return (
    <section id="projects" className="py-14 border-t border-border-subtle">
      <RevealOnScroll>
        <SectionLabel>Selected Work</SectionLabel>
        <h2 className="text-2xl font-semibold text-text-primary mt-2">
          Projects
        </h2>
        <p className="text-sm text-text-muted mt-1 mb-7">
          Things I&apos;ve built or am building.
        </p>
      </RevealOnScroll>

      {/* Featured Journey Card */}
      <JourneyCard />

      {/* Project List */}
      <div>
        {nonJourneyProjects.map((project, index) => (
          <ProjectRow
            key={project.id}
            project={project}
            index={index}
          />
        ))}
      </div>
    </section>
  )
}