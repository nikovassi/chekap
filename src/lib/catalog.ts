import catalogJson from '../generated/catalog.json' with { type: 'json' }
import type { Urgency } from '../data/types'

export interface CatalogEntry {
  id: string
  path: string
  title: string
  section: string
  urgency?: Urgency
  category?: string
  summary: string
  icon?: string
  colors?: string[]
}

export const CATALOG = catalogJson as CatalogEntry[]
export const CATALOG_MAP: Record<string, CatalogEntry> = Object.fromEntries(CATALOG.map((c) => [c.id, c]))

export const getRef = (id: string): CatalogEntry | undefined => CATALOG_MAP[id]
export const bySection = (section: string) => CATALOG.filter((c) => c.section === section)
export const byIds = (ids: string[]) => ids.map((i) => CATALOG_MAP[i]).filter(Boolean) as CatalogEntry[]
