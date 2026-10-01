import { useCallback, useEffect, useState } from 'react'
import { localGarage, type GarageRepository, type GarageState, type Reminder, type Vehicle, uid } from './storage'

/** React hook around the garage repository. State loads after mount (never during SSR). */
export function useGarage(repo: GarageRepository = localGarage) {
  const [state, setState] = useState<GarageState>({ version: 1, vehicles: [], reminders: [] })
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setState(repo.load())
    setLoaded(true)
    const onStorage = (e: StorageEvent) => e.key?.startsWith('chekap.') && setState(repo.load())
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [repo])

  const update = useCallback(
    (fn: (s: GarageState) => GarageState) =>
      setState((prev) => {
        const next = fn(prev)
        repo.save(next)
        return next
      }),
    [repo],
  )

  const active = state.vehicles.find((v) => v.id === state.activeVehicleId) ?? state.vehicles[0]

  return {
    state,
    loaded,
    active,
    saveVehicle(v: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) {
      const now = new Date().toISOString()
      const id = v.id ?? uid()
      update((s) => {
        if (s.vehicles.some((x) => x.id === id)) {
          return { ...s, vehicles: s.vehicles.map((x) => (x.id === id ? { ...x, ...v, id: x.id, updatedAt: now } : x)) }
        }
        return { ...s, activeVehicleId: id, vehicles: [...s.vehicles, { ...v, id, createdAt: now, updatedAt: now } as Vehicle] }
      })
      return id
    },
    removeVehicle(id: string) {
      update((s) => ({
        ...s,
        vehicles: s.vehicles.filter((v) => v.id !== id),
        reminders: s.reminders.filter((r) => r.vehicleId !== id),
        activeVehicleId: s.activeVehicleId === id ? s.vehicles.find((v) => v.id !== id)?.id : s.activeVehicleId,
      }))
    },
    setActive(id: string) {
      update((s) => ({ ...s, activeVehicleId: id }))
    },
    patchVehicle(id: string, patch: Partial<Vehicle>) {
      update((s) => ({ ...s, vehicles: s.vehicles.map((v) => (v.id === id ? { ...v, ...patch, updatedAt: new Date().toISOString() } : v)) }))
    },
    addReminder(r: Omit<Reminder, 'id' | 'createdAt'>) {
      update((s) => ({ ...s, reminders: [...s.reminders, { ...r, id: uid(), createdAt: new Date().toISOString() }] }))
    },
    toggleReminder(id: string) {
      update((s) => ({ ...s, reminders: s.reminders.map((r) => (r.id === id ? { ...r, done: !r.done } : r)) }))
    },
    removeReminder(id: string) {
      update((s) => ({ ...s, reminders: s.reminders.filter((r) => r.id !== id) }))
    },
  }
}
