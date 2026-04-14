interface SectionLabelProps {
  children: React.ReactNode
}

export function SectionLabel({ children }: SectionLabelProps) {
  return (
    <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-teal">
      {children}
    </span>
  )
}
