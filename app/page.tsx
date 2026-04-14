import { Hero } from '@/components/sections/Hero'
import { Education } from '@/components/sections/Education'
import { Projects } from '@/components/sections/Projects'
import { Skills } from '@/components/sections/Skills'
import { GitHubGraph } from '@/components/sections/GitHubGraph'
import { Contact } from '@/components/sections/Contact'
import { getProjects, getSiteStatus } from '@/lib/notion'

// ISR: regenerate this page at most once every 60 seconds
export const revalidate = 60

export default async function Home() {
  const [projects, siteStatus] = await Promise.all([
    getProjects(),
    getSiteStatus(),
  ])

  return (
    <div className="max-w-[680px] mx-auto px-6 pt-16">
      <Hero siteStatus={siteStatus} />
      <Education />
      <Projects projects={projects} />
      <Skills />
      <GitHubGraph />
      <Contact />
    </div>
  )
}
