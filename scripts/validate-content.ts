/**
 * Content validator: checks that every `related` ref resolves to a real page,
 * every source id exists and slugs are unique.  Run: npm run validate
 */
import { LIGHTS } from '../src/data/lights.ts'
import { OBD_CODES } from '../src/data/obd.ts'
import { ENGINE_SYMPTOMS } from '../src/data/symptoms-engine.ts'
import { CHASSIS_SYMPTOMS } from '../src/data/symptoms-chassis.ts'
import { NOISES } from '../src/data/noises.ts'
import { SMOKE } from '../src/data/smoke.ts'
import { SMELLS } from '../src/data/smells.ts'
import { LEAKS } from '../src/data/leaks.ts'
import { GUIDES } from '../src/data/guides.ts'
import { MAINTENANCE, CHECKLIST_ITEMS } from '../src/data/maintenance.ts'
import { FLOWS } from '../src/data/flows.ts'
import { SOURCE_MAP } from '../src/data/sources.ts'

const pages = new Set<string>()
const add = (p: string) => {
  if (pages.has(p)) errors.push(`duplicate page ${p}`)
  pages.add(p)
}
const errors: string[] = []

LIGHTS.forEach((l) => add(`dashboard/${l.slug}`))
OBD_CODES.forEach((c) => add(`obd/${c.code.toLowerCase()}`))
;[...ENGINE_SYMPTOMS, ...CHASSIS_SYMPTOMS, ...NOISES, ...SMOKE, ...SMELLS, ...LEAKS].forEach((t) => add(`${t.section}/${t.slug}`))
GUIDES.forEach((g) => add(`guides/${g.slug}`))
MAINTENANCE.forEach((m) => add(`maintenance/${m.slug}`))
FLOWS.forEach((f) => add(`flow/${f.slug}`))

const check = (owner: string, related: string[] = [], sources: string[] = []) => {
  for (const r of related) if (!pages.has(r)) errors.push(`${owner}: broken ref ${r}`)
  for (const s of sources) if (!SOURCE_MAP[s]) errors.push(`${owner}: unknown source ${s}`)
}

LIGHTS.forEach((l) => check(`dashboard/${l.slug}`, l.related, l.sources))
OBD_CODES.forEach((c) => check(`obd/${c.code}`, c.related, c.sources))
;[...ENGINE_SYMPTOMS, ...CHASSIS_SYMPTOMS, ...NOISES, ...SMOKE, ...SMELLS, ...LEAKS].forEach((t) =>
  check(`${t.section}/${t.slug}`, t.related, t.sources),
)
GUIDES.forEach((g) => check(`guides/${g.slug}`, g.related, g.sources))
MAINTENANCE.forEach((m) => check(`maintenance/${m.slug}`, [], m.sources))
CHECKLIST_ITEMS.forEach((c) => check(`checklist/${c.id}`, [], c.sources))
FLOWS.forEach((f) => {
  if (!f.nodes[f.start]) errors.push(`flow/${f.slug}: missing start`)
  for (const n of Object.values(f.nodes)) {
    n.options?.forEach((o) => !f.nodes[o.next] && errors.push(`flow/${f.slug}: ${n.id} -> missing ${o.next}`))
    if (!n.options && !n.result) errors.push(`flow/${f.slug}: dead end ${n.id}`)
    if (n.result) check(`flow/${f.slug}#${n.id}`, n.result.related)
  }
})

console.log(`pages: ${pages.size}`)
if (errors.length) {
  console.error(errors.join('\n'))
  console.error(`\n${errors.length} problem(s)`)
  process.exit(1)
}
console.log('content OK')
