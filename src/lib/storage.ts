/**
 * Vehicle profile + reminders persistence.
 *
 * The UI only talks to the `GarageRepository` interface. v1 ships a localStorage adapter;
 * a backend (REST/Supabase/Firebase…) can implement the same interface later without UI changes.
 */
import type { Fuel, Transmission } from '../data/types'

export interface ServiceRecord {
  date?: string // ISO yyyy-mm-dd
  km?: number
  note?: string
}

export interface Vehicle {
  id: string
  make: string
  model: string
  year?: number
  engine?: string
  fuel: Fuel
  transmission: Transmission
  km?: number
  vin?: string
  records: {
    oil?: ServiceRecord
    filters?: ServiceRecord
    service?: ServiceRecord
    tires?: ServiceRecord & { season?: 'summer' | 'winter' | 'all' }
    battery?: ServiceRecord
    brakes?: ServiceRecord
    timing?: ServiceRecord & { kind?: 'belt' | 'chain' }
    inspection?: ServiceRecord // ГТП
    insurance?: ServiceRecord // Гражданска отговорност
    nextService?: ServiceRecord
  }
  /** checklist ticks: item id → ISO date when checked */
  checklist?: Record<string, string>
  createdAt: string
  updatedAt: string
}

export type ReminderType =
  | 'oil' | 'filters' | 'brakes' | 'tires' | 'inspection' | 'insurance' | 'battery' | 'coolant' | 'brake-fluid' | 'transmission' | 'vignette' | 'custom'

export interface Reminder {
  id: string
  vehicleId: string
  type: ReminderType
  title: string
  dueDate?: string
  dueKm?: number
  note?: string
  done?: boolean
  createdAt: string
}

export interface GarageState {
  version: 1
  activeVehicleId?: string
  vehicles: Vehicle[]
  reminders: Reminder[]
}

export interface GarageRepository {
  load(): GarageState
  save(state: GarageState): void
}

const KEY = 'chekap.garage.v1'
const EMPTY: GarageState = { version: 1, vehicles: [], reminders: [] }

export const localGarage: GarageRepository = {
  load() {
    if (typeof window === 'undefined') return EMPTY
    try {
      const raw = window.localStorage.getItem(KEY)
      if (!raw) return EMPTY
      const parsed = JSON.parse(raw) as GarageState
      if (parsed?.version !== 1 || !Array.isArray(parsed.vehicles)) return EMPTY
      return { ...EMPTY, ...parsed, reminders: parsed.reminders ?? [] }
    } catch {
      return EMPTY
    }
  },
  save(state) {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(state))
    } catch {
      /* storage full or blocked (private mode) – keep working in memory */
    }
  },
}

export const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4)

export const REMINDER_LABELS: Record<ReminderType, string> = {
  oil: 'Смяна на масло',
  filters: 'Смяна на филтри',
  brakes: 'Проверка на спирачки',
  tires: 'Смяна на гуми',
  inspection: 'Технически преглед (ГТП)',
  insurance: 'Гражданска отговорност',
  battery: 'Проверка на акумулатора',
  coolant: 'Охладителна течност',
  'brake-fluid': 'Спирачна течност',
  transmission: 'Обслужване на скоростната кутия',
  vignette: 'Винетка',
  custom: 'Друго',
}

export type ReminderStatus = 'overdue' | 'soon' | 'ok' | 'done'

export function reminderStatus(r: Reminder, currentKm?: number, today = new Date()): { status: ReminderStatus; daysLeft?: number; kmLeft?: number } {
  if (r.done) return { status: 'done' }
  let daysLeft: number | undefined
  let kmLeft: number | undefined
  if (r.dueDate) daysLeft = Math.ceil((new Date(r.dueDate + 'T00:00:00').getTime() - today.getTime()) / 86400000)
  if (r.dueKm != null && currentKm != null) kmLeft = r.dueKm - currentKm
  const overdue = (daysLeft != null && daysLeft < 0) || (kmLeft != null && kmLeft < 0)
  const soon = (daysLeft != null && daysLeft <= 30) || (kmLeft != null && kmLeft <= 1000)
  return { status: overdue ? 'overdue' : soon ? 'soon' : 'ok', daysLeft, kmLeft }
}
