'use client'

import { skills } from '@/data/skills'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { RevealOnScroll } from '@/components/ui/RevealOnScroll'

const colorMap: Record<string, string> = {
  teal: 'text-teal',
  blue: 'text-blue-400',
  purple: 'text-purple-400',
  amber: 'text-amber-400',
}

export function Skills() {
  return (
    <section id="skills" className="py-14 border-t border-border-subtle">
      <RevealOnScroll>
        <SectionLabel>Stack</SectionLabel>
        <h2 className="text-2xl font-semibold text-text-primary mt-2">
          Skills
        </h2>
        <p className="text-sm text-text-muted mt-1 mb-7">
          Tools and concepts I work with actively.
        </p>
      </RevealOnScroll>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {skills.map((group, index) => (
          <RevealOnScroll key={group.category} delay={index * 0.1}>
            <div className="bg-bg-card border border-border-subtle rounded-xl p-4 h-full">
              <span
                className={`font-mono text-[11px] tracking-[0.12em] uppercase block mb-3 ${colorMap[group.color] || 'text-teal'
                  }`}
              >
                {group.category}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="text-[12px] px-2.5 py-1 rounded-md bg-white/[0.04] border border-border-subtle text-text-muted hover:border-border-hover hover:text-text-primary transition-all cursor-default"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </RevealOnScroll>
        ))}
      </div>
    </section>
  )
}
