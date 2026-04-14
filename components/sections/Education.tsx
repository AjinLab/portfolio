'use client'

import { useState } from 'react'
import { timeline } from '@/data/timeline'
import { AccordionCard } from '@/components/ui/AccordionCard'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { RevealOnScroll } from '@/components/ui/RevealOnScroll'

export function Education() {
  const [openId, setOpenId] = useState<string>(timeline[0]?.id ?? '')

  return (
    <section id="education" className="py-14 border-t border-border-subtle">
      <RevealOnScroll>
        <SectionLabel>Timeline</SectionLabel>
        <h2 className="text-2xl font-semibold text-text-primary mt-2">
          Education & Learning
        </h2>
        <p className="text-sm text-text-muted mt-1 mb-7">
          Where I&apos;m enrolled and what I&apos;m actually building skills from.
        </p>
      </RevealOnScroll>

      <div className="space-y-3">
        {timeline.map((item, index) => (
          <RevealOnScroll key={item.id} delay={index * 0.1}>
            <AccordionCard
              item={item}
              isOpen={openId === item.id}
              onToggle={() => setOpenId(openId === item.id ? '' : item.id)}
            />
          </RevealOnScroll>
        ))}
      </div>
    </section>
  )
}
