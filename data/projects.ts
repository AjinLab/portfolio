export interface Project {
  id: string
  name: string
  description: string
  tags: string[]
  year: string
  url: string | null
  githubUrl: string | null
  isJourney: boolean
  status: 'Live' | 'Building' | 'Done' | 'Upcoming'
}

export const projects: Project[] = [
  {
    id: 'journey',
    name: 'AI Journey 2026',
    description:
      'My 24-month public roadmap to ML Engineer. Phase logs, weekly commits, resource lists, and project documentation — all built in the open.',
    tags: ['Python', 'Notion', 'GitHub'],
    year: '2026',
    url: 'https://github.com/ajinlab/AI-Journey-2026',
    githubUrl: 'https://github.com/ajinlab/AI-Journey-2026',
    isJourney: true,
    status: 'Live',
  },
  {
    id: 'Project-1',
    name: 'Python CLI Data Toolki',
    description:
      'Built a small CLI tool that takes a CSV, cleans it up, and spits out summary stats + a couple of saved plots. Nothing fancy — just a solid first end-to-end data project.',
    tags: ['Python', 'Pandas', 'Matplotlib', 'CSV'],
    year: '2026',
    url: null,
    githubUrl: null,
    isJourney: false,
    status: 'Upcoming',
  },
  {
    id: 'Project-2',
    name: 'SQL Mini Analytics',
    description:
      'Created 3 related tables and wrote 15+ queries to pull out real insights — joins, aggregations, the works. Basically learned SQL by actually using it on something.',
    tags: ['SQL', 'SQLite', 'Data Analysis'],
    year: '2026',
    url: null,
    githubUrl: null,
    isJourney: false,
    status: 'Upcoming',
  },
]
