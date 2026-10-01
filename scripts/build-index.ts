/**
 * Generates lightweight indexes from the typed content modules:
 *  - src/generated/catalog.json  – id/title/urgency/summary for every page (bundled, used for cards & links)
 *  - src/generated/search.json   – keyword index (lazy-loaded by the smart search)
 *  - src/generated/routes.json   – every prerenderable route (used by the prerender + sitemap)
 * Run automatically by `npm run dev` / `npm run build`.
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { LIGHTS } from '../src/data/lights.ts'
import { OBD_CODES } from '../src/data/obd.ts'
import { ENGINE_SYMPTOMS } from '../src/data/symptoms-engine.ts'
import { CHASSIS_SYMPTOMS } from '../src/data/symptoms-chassis.ts'
import { NOISES } from '../src/data/noises.ts'
import { SMOKE } from '../src/data/smoke.ts'
import { SMELLS } from '../src/data/smells.ts'
import { LEAKS } from '../src/data/leaks.ts'
import { GUIDES } from '../src/data/guides.ts'
import { MAINTENANCE } from '../src/data/maintenance.ts'
import { FLOWS } from '../src/data/flows.ts'
import type { Topic } from '../src/data/types.ts'

interface CatalogEntry {
  id: string
  path: string
  title: string
  section: string
  urgency?: string
  category?: string
  summary: string
  icon?: string
  colors?: string[]
}
interface SearchEntry {
  id: string
  /** high-weight phrases (title + keywords) */
  k: string[]
  /** low-weight text (causes, summary) */
  x: string
  /** first 3 cause names for suggestions */
  c: string[]
}

const short = (s: string, n = 150) => (s.length > n ? s.slice(0, s.lastIndexOf(' ', n)) + '…' : s)

const catalog: CatalogEntry[] = []
const search: SearchEntry[] = []

for (const l of LIGHTS) {
  const id = `dashboard/${l.slug}`
  catalog.push({ id, path: `/dashboard/${l.slug}`, title: l.name, section: 'dashboard', urgency: l.urgency, summary: short(l.meaning), icon: l.icon, colors: l.colors })
  search.push({ id, k: [l.name, l.nameEn, ...l.keywords], x: [l.meaning, ...l.causes].join(' '), c: l.causes.slice(0, 3) })
}
for (const o of OBD_CODES) {
  const id = `obd/${o.code.toLowerCase()}`
  catalog.push({ id, path: `/obd/${o.code.toLowerCase()}`, title: `${o.code} – ${o.titleBg}`, section: 'obd', urgency: o.urgency, summary: short(o.summary) })
  search.push({ id, k: [o.code, o.titleBg, o.titleEn, ...(o.keywords ?? [])], x: [o.system, o.summary, ...o.causes].join(' '), c: o.causes.slice(0, 3) })
}
const topics: Topic[] = [...ENGINE_SYMPTOMS, ...CHASSIS_SYMPTOMS, ...NOISES, ...SMOKE, ...SMELLS, ...LEAKS]
for (const t of topics) {
  const id = `${t.section}/${t.slug}`
  catalog.push({ id, path: `/${id}`, title: t.title, section: t.section, urgency: t.urgency, category: t.category, summary: short(t.summary), colors: t.swatch ? [t.swatch] : undefined })
  search.push({ id, k: [t.title, ...t.keywords], x: [t.summary, ...t.causes.map((c) => c.name)].join(' '), c: t.causes.slice(0, 3).map((c) => c.name) })
}
for (const g of GUIDES) {
  const id = `guides/${g.slug}`
  const path = g.slug === 'check-engine' ? '/check-engine' : `/guides/${g.slug}`
  catalog.push({ id, path, title: g.title, section: 'guides', category: g.category, summary: short(g.summary), icon: g.icon })
  search.push({ id, k: [g.title, ...g.keywords], x: [g.summary, ...g.sections.map((s) => s.heading)].join(' '), c: [] })
}
for (const m of MAINTENANCE) {
  const id = `maintenance/${m.slug}`
  catalog.push({ id, path: `/maintenance/${m.slug}`, title: m.title, section: 'maintenance', summary: short(m.summary), icon: m.icon })
  search.push({ id, k: [m.title], x: [m.summary, ...m.items.map((i) => i.name)].join(' '), c: [] })
}
for (const f of FLOWS) {
  const id = `flow/${f.slug}`
  catalog.push({ id, path: `/diagnose/${f.slug}`, title: `Диагностика: ${f.title}`, section: 'flow', summary: short(f.intro), icon: f.icon })
  search.push({ id, k: [f.title, ...f.keywords], x: f.intro, c: [] })
}

const CATEGORIES = ['engine', 'cooling', 'oil', 'fuel', 'electrical', 'brakes', 'tires', 'suspension', 'transmission', 'climate', 'lights', 'exhaust', 'safety', 'ev']

const routes = [
  '/', '/search', '/dashboard', '/check-engine', '/obd', '/symptoms', '/noises', '/smoke', '/smells', '/leaks',
  '/systems', '/no-start', '/diagnose', '/maintenance', '/checklist', '/garage', '/sources',
  ...CATEGORIES.map((c) => `/systems/${c}`),
  ...catalog.map((c) => c.path),
]

mkdirSync('src/generated', { recursive: true })
writeFileSync('src/generated/catalog.json', JSON.stringify(catalog))
writeFileSync('src/generated/search.json', JSON.stringify(search))
writeFileSync('src/generated/routes.json', JSON.stringify([...new Set(routes)]))
console.log(`index: ${catalog.length} pages, ${new Set(routes).size} routes`)
