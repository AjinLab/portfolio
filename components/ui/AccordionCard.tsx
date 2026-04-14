'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import type { TimelineItem } from '@/data/timeline'

interface AccordionCardProps {
  item: TimelineItem
  isOpen: boolean
  onToggle: () => void
}

const iconBgMap: Record<string, string> = {
  blue: 'bg-blue-500/15 text-blue-400',
  purple: 'bg-purple-500/15 text-purple-400',
  green: 'bg-green-500/15 text-green-400',
  amber: 'bg-amber-500/15 text-amber-400',
}

export function AccordionCard({ item, isOpen, onToggle }: AccordionCardProps) {
  return (
    <div
      className={`bg-bg-card border rounded-xl overflow-hidden transition-all duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-teal/50 focus-visible:outline-none ${
        isOpen ? 'border-border-hover' : 'border-border-subtle hover:border-border-hover'
      }`}
      onClick={onToggle}
      tabIndex={0}
      role="button"
      aria-expanded={isOpen}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onToggle()
        }
      }}
    >
      {/* Header */}
      <div className="flex items-start gap-3 p-4">
        {/* Icon Box */}
        <div
          className={`w-[38px] h-[38px] rounded-lg flex items-center justify-center text-lg shrink-0 ${
            iconBgMap[item.iconBg] || iconBgMap.blue
          }`}
        >
          {item.icon}
        </div>

        {/* Main info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-text-primary">{item.role}</span>
            {item.badge && (
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-green-status/15 text-green-status">
                {item.badge}
              </span>
            )}
          </div>
          <p className="text-[13px] text-text-muted mt-0.5">{item.org}</p>
        </div>

        {/* Right side */}
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span className="text-[12px] text-text-muted hidden sm:block">{item.dateRange}</span>
          <span className="text-[11px] text-text-faint hidden sm:block">{item.location}</span>
        </div>

        {/* Chevron */}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0 mt-1"
        >
          <ChevronDown className="w-4 h-4 text-text-faint" />
        </motion.div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-0">
              {/* Mobile date/location */}
              <div className="flex gap-2 text-[12px] text-text-muted mb-3 sm:hidden">
                <span>{item.dateRange}</span>
                <span>·</span>
                <span>{item.location}</span>
              </div>

              {/* Tool tags */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {item.tools.map((tool) => (
                  <span
                    key={tool}
                    className="text-[12px] px-2.5 py-0.5 rounded-full bg-white/5 border border-border-subtle text-text-muted"
                  >
                    {tool}
                  </span>
                ))}
              </div>

              {/* Bullet points */}
              <ul className="space-y-1.5">
                {item.points.map((point, i) => (
                  <li
                    key={i}
                    className="text-sm leading-relaxed text-text-muted flex gap-2"
                  >
                    <span className="text-text-faint mt-1 shrink-0">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
