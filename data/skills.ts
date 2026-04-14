export interface SkillGroup {
  category: string
  color: 'teal' | 'blue' | 'purple' | 'amber'
  items: string[]
}

export const skills: SkillGroup[] = [
  {
    category: 'Languages',
    color: 'teal',
    items: ['Python', 'SQL', 'Bash'],
  },
  {
    category: 'Tools & Infra',
    color: 'purple',
    items: ['Linux', 'Git', 'VS Code', 'Notion'],
  },
]
