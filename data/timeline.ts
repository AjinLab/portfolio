export interface TimelineItem {
  id: string
  icon: string
  iconBg: 'blue' | 'purple' | 'green' | 'amber'
  role: string
  badge: string | null
  org: string
  dateRange: string
  location: string
  tools: string[]
  points: string[]
}

export const timeline: TimelineItem[] = [
  {
    id: 'college',
    icon: '🎓',
    iconBg: 'blue',
    role: 'B.Tech. AI & Data Science',
    badge: 'Current',
    org: 'Mar Ephraem College of Engineering and Technology · Semester 4',
    dateRange: '2024 — 2028',
    location: 'India',
    tools: ['Python', 'Statistics', 'ML Fundamentals', 'Data Structures', 'Databases'],
    points: [
      'Studying AI & DS core curriculum — statistics, algorithms, and ML theory.',
      'Supplementing with self-directed learning far beyond the curriculum.',
    ],
  },
  {
    id: 'roadmap',
    icon: '🗺️',
    iconBg: 'purple',
    role: 'Self-Directed AI/ML Learning',
    badge: 'Active',
    org: 'AI-Journey-2026 · Phase 1: Foundation',
    dateRange: 'Mar 2026 — Mar 2028',
    location: 'Home',
    tools: ['Python'],
    points: [
      '60% build / 40% learn — shipping projects to build a public track record.',
      'Four phases: Foundation → Building → Leveling Up → Mastery.',
      'Targeting ML Engineer / MLOps Engineer / AI Engineer roles by 2028.',
      'All progress tracked publicly on GitHub with weekly logs.',
    ],
  },
]
