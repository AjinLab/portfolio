// components/layout/NavbarWrapper.tsx
// Async server component that fetches site status from Notion
// and passes it to the client-side Navbar component.
// This exists because layout.tsx cannot receive props from page.tsx.

import { Navbar } from '@/components/layout/Navbar'
import { getSiteStatus } from '@/lib/notion'

export async function NavbarWrapper() {
  const siteStatus = await getSiteStatus()
  return <Navbar siteStatus={siteStatus} />
}
