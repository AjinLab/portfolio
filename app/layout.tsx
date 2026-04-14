import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Inter, Fira_Code } from 'next/font/google'
import { NavbarWrapper } from '@/components/layout/NavbarWrapper'
import { FloatingNav } from '@/components/layout/FloatingNav'
import { Footer } from '@/components/layout/Footer'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const firaCode = Fira_Code({
  subsets: ['latin'],
  variable: '--font-fira-code',
  weight: ['400', '500'],
})

export const metadata: Metadata = {
  title: 'Ajin — AI & Data Science',
  description:
    'AI & DS student building toward ML Engineer. Projects, roadmap, and contact.',
  openGraph: {
    title: 'Ajin — AI & Data Science',
    description: 'Building toward ML Engineering, one project at a time.',
    url: 'https://ajinlab.vercel.app',
    siteName: 'Ajin Portfolio',
    locale: 'en_US',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${firaCode.variable}`}>
      <body className="bg-bg-primary text-text-primary font-sans antialiased">
        <NavbarWrapper />
        <main>{children}</main>
        <FloatingNav />
        <Footer />
        <Analytics />
      </body>
    </html>
  )
}
