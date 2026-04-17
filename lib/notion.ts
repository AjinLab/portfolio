// lib/notion.ts
// Fetches project data and site status from two Notion databases.
// Used server-side only — never imported by 'use client' components.
//
// Gracefully falls back to static data when Notion credentials are
// missing or invalid (e.g., during local dev without .env.local set up).

import { Client } from '@notionhq/client'
import type { StatusType } from '@/lib/site-status'
import { SITE_STATUS } from '@/lib/site-status'
import type { Project } from '@/data/projects'
import { projects as staticProjects } from '@/data/projects'

// ─── Client ───────────────────────────────────────────────────────────────────

/**
 * Returns true only when all three Notion env vars are set to real values
 * (not the placeholder strings that ship in .env.local).
 */
function isNotionConfigured(): boolean {
  const key = process.env.NOTION_API_KEY ?? ''
  const dbId = process.env.NOTION_PROJECTS_DB_ID ?? ''
  const statusId = process.env.NOTION_STATUS_PAGE_ID ?? ''
  const isPlaceholder = (v: string) =>
    !v || v.startsWith('your-') || v === 'api-key-here'
  return !isPlaceholder(key) && !isPlaceholder(dbId) && !isPlaceholder(statusId)
}

function getNotionClient() {
  return new Client({ auth: process.env.NOTION_API_KEY })
}

// ─── Helper: extract plain text from Notion rich-text array ───────────────────

function richTextToPlain(
  richText: { plain_text: string }[] | undefined
): string {
  if (!richText) return ''
  return richText.map((t) => t.plain_text).join('')
}

// ─── getProjects() ────────────────────────────────────────────────────────────

/**
 * Queries the "Projects" Notion database (data source in SDK v5).
 * - Filters to rows where `visible` checkbox is checked
 * - Sorts by `date` descending (newest first)
 * - Maps each Notion row into the existing `Project` type
 */
export async function getProjects(): Promise<Project[]> {
  // Skip API call entirely when Notion isn't configured
  if (!isNotionConfigured()) {
    console.info('[Notion] Not configured — using static project data.')
    return staticProjects
  }

  const notion = getNotionClient()
  const dbId = process.env.NOTION_PROJECTS_DB_ID ?? ''

  try {
    const response = await notion.dataSources.query({
      data_source_id: dbId,
      filter: {
        property: 'visible',
        checkbox: { equals: true },
      },
      sorts: [{ property: 'date', direction: 'descending' }],
    })

    return response.results.map((page) => {
      // Type assertion — Notion SDK types are very broad
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const props = (page as any).properties

      const title: string = richTextToPlain(props.title?.title)
      const description: string = richTextToPlain(props.description?.rich_text)
      const tags: string[] =
        props.tags?.multi_select?.map((t: { name: string }) => t.name) ?? []
      const status: Project['status'] = props.status?.select?.name ?? 'Upcoming'
      const date: string = props.date?.date?.start ?? ''
      const year: string = date ? new Date(date).getFullYear().toString() : ''
      const githubUrl: string | null = props.github_url?.url ?? null
      const isJourney: boolean = props.journey?.checkbox ?? false

      return {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        id: (page as any).id,
        name: title,
        description,
        tags,
        year,
        url: githubUrl,
        githubUrl,
        isJourney,
        status,
      }
    })
  } catch (error: any) {
    console.error('[Notion] Failed to fetch projects:', error)
    return [
      {
        id: 'error',
        name: 'Notion Database Error',
        description: `API Error: ${error.message || String(error)}. Make sure you are using the Data Source ID (not Database ID from URL), that the integration is added to the database via 'Connect to', and that columns like 'visible' exactly match.`,
        tags: ['Error'],
        year: new Date().getFullYear().toString(),
        url: null,
        githubUrl: null,
        isJourney: false,
        status: 'Upcoming'
      }
    ]
  }
}

// ─── getSiteStatus() ──────────────────────────────────────────────────────────

/**
 * Reads the "Site Status" Notion database (single-row table).
 * Extracts the `status` select property and maps it to StatusType.
 *
 * Notion values  →  StatusType
 * "Available"    →  'available'
 * "At Work"      →  'in-work'
 * "Under Construction" → 'under-construction'
 * "Unavailable"  →  'unavailable'
 * (fallback)     →  'available'
 */
const STATUS_MAP: Record<string, StatusType> = {
  'Available': 'available',
  'At Work': 'in-work',
  'Under Construction': 'under-construction',
  'Unavailable': 'unavailable',
}

export async function getSiteStatus(): Promise<StatusType> {
  // Skip API call entirely when Notion isn't configured
  if (!isNotionConfigured()) {
    console.info('[Notion] Not configured — using static site status.')
    return SITE_STATUS
  }

  const notion = getNotionClient()
  const statusId = process.env.NOTION_STATUS_PAGE_ID ?? ''

  try {
    const response = await notion.dataSources.query({
      data_source_id: statusId,
      page_size: 1,
    })

    const firstRow = response.results[0]
    if (!firstRow) return SITE_STATUS

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const props = (firstRow as any).properties
    const notionValue: string = props.status?.select?.name ?? ''

    return STATUS_MAP[notionValue] ?? SITE_STATUS
  } catch (error: any) {
    console.error('[Notion] Failed to fetch site status. API Error:', error.message || String(error))
    return SITE_STATUS // Graceful fallback to hardcoded status
  }
}
