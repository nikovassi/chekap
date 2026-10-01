/**
 * Lazy data access. Each content module is its own chunk so the phone only downloads
 * what the current page needs. Components read data with `useData(key)` inside <Suspense>.
 * Swap these loaders for API calls when a backend is added – the UI does not change.
 */
import { use } from 'react'
import type { Flow, Guide, MaintenanceGroup, ChecklistItem, ObdCode, Topic, WarningLight } from './types'

export interface DataMap {
  lights: WarningLight[]
  obd: ObdCode[]
  symptoms: Topic[]
  noises: Topic[]
  smoke: Topic[]
  smells: Topic[]
  leaks: Topic[]
  guides: Guide[]
  maintenance: { groups: MaintenanceGroup[]; checklist: ChecklistItem[] }
  flows: Flow[]
}

const loaders: { [K in keyof DataMap]: () => Promise<DataMap[K]> } = {
  lights: () => import('./lights').then((m) => m.LIGHTS),
  obd: () => import('./obd').then((m) => m.OBD_CODES),
  symptoms: () => Promise.all([import('./symptoms-engine'), import('./symptoms-chassis')]).then(([a, b]) => [...a.ENGINE_SYMPTOMS, ...b.CHASSIS_SYMPTOMS]),
  noises: () => import('./noises').then((m) => m.NOISES),
  smoke: () => import('./smoke').then((m) => m.SMOKE),
  smells: () => import('./smells').then((m) => m.SMELLS),
  leaks: () => import('./leaks').then((m) => m.LEAKS),
  guides: () => import('./guides').then((m) => m.GUIDES),
  maintenance: () => import('./maintenance').then((m) => ({ groups: m.MAINTENANCE, checklist: m.CHECKLIST_ITEMS })),
  flows: () => import('./flows').then((m) => m.FLOWS),
}

const cache = new Map<string, Promise<unknown>>()

export function loadData<K extends keyof DataMap>(key: K): Promise<DataMap[K]> {
  let p = cache.get(key)
  if (!p) {
    const promise = loaders[key]() as Promise<unknown> & { status?: string; value?: unknown }
    // React's `use()` reads these fields: a settled promise renders synchronously (no suspense flash)
    promise.status = 'pending'
    promise.then((v) => {
      promise.status = 'fulfilled'
      promise.value = v
    })
    p = promise
    cache.set(key, p)
  }
  return p as Promise<DataMap[K]>
}

export function useData<K extends keyof DataMap>(key: K): DataMap[K] {
  return use(loadData(key))
}

/** Warm a chunk in the background (e.g. on hover / idle) */
export const prefetchData = (key: keyof DataMap) => void loadData(key)

/** Which data a URL needs – preloaded before hydration / prerender so pages render synchronously. */
export function dataForPath(path: string): (keyof DataMap)[] {
  const seg = path.split('/')[1] ?? ''
  switch (seg) {
    case 'dashboard': return ['lights']
    case 'obd': return ['obd']
    case 'check-engine': return ['guides', 'obd']
    case 'guides': return ['guides', 'obd']
    case 'symptoms': case 'noises': case 'smoke': case 'smells': case 'leaks': return [seg]
    case 'maintenance': case 'checklist': return ['maintenance']
    case 'diagnose': case 'no-start': return ['flows']
    default: return []
  }
}

export const preloadAll = () => Promise.all((Object.keys(loaders) as (keyof DataMap)[]).map(loadData))
