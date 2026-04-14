import { Hero } from '@/components/sections/Hero'
import { Education } from '@/components/sections/Education'
import { Projects } from '@/components/sections/Projects'
import { Skills } from '@/components/sections/Skills'
import { GitHubGraph } from '@/components/sections/GitHubGraph'
import { Contact } from '@/components/sections/Contact'

export default function Home() {
  return (
    <div className="max-w-[680px] mx-auto px-6 pt-16">
      <Hero />
      <Education />
      <Projects />
      <Skills />
      <GitHubGraph />
      <Contact />
    </div>
  )
}
