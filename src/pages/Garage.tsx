import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useHead } from '../lib/head'
import { useGarage } from '../lib/useGarage'
import { REMINDER_LABELS, reminderStatus, type Reminder, type ReminderType, type ServiceRecord, type Vehicle } from '../lib/storage'
import type { Fuel, Transmission } from '../data/types'
import { Icon } from '../components/Icon'
import { Crumbs, EmptyState, PageHeader } from '../components/ui'
import { FUELS, TRANS, Field } from './Checklist'

type RecordKey = keyof Vehicle['records']
const RECORDS: { k: RecordKey; l: string; hint?: string }[] = [
  { k: 'oil', l: 'Последна смяна на масло' },
  { k: 'filters', l: 'Последна смяна на филтри' },
  { k: 'service', l: 'Последно обслужване' },
  { k: 'tires', l: 'Гуми (последна смяна)' },
  { k: 'battery', l: 'Акумулатор (монтиран / проверен)' },
  { k: 'brakes', l: 'Спирачки (накладки / дискове)' },
  { k: 'timing', l: 'Ремък / верига' },
  { k: 'inspection', l: 'Технически преглед (ГТП) – валиден до', hint: 'дата на изтичане' },
  { k: 'insurance', l: 'Гражданска отговорност – валидна до', hint: 'дата на изтичане' },
  { k: 'nextService', l: 'Следващо обслужване', hint: 'планирано' },
]

const STATUS_STYLE = {
  overdue: { l: 'Просрочено', c: 'var(--color-stop)' },
  soon: { l: 'Скоро', c: 'var(--color-soon)' },
  ok: { l: 'Наред', c: 'var(--color-ok)' },
  done: { l: 'Изпълнено', c: 'var(--color-muted)' },
}

interface VForm {
  make: string; model: string; year: string; engine: string; fuel: Fuel; transmission: Transmission; km: string
  records: Vehicle['records']
}
const emptyForm = (): VForm => ({ make: '', model: '', year: '', engine: '', fuel: 'diesel', transmission: 'manual', km: '', records: {} })

export default function GaragePage() {
  const g = useGarage()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState<VForm>(emptyForm())

  useHead({
    title: 'Моят гараж – профил на автомобила и напомняния за обслужване',
    description: 'Създай профил на колата си – смяна на масло, филтри, гуми, акумулатор, ГТП, застраховка – и получавай напомняния. Данните се пазят само на твоето устройство.',
    path: '/garage',
  })

  const v = g.active
  useEffect(() => {
    if (g.loaded && !v) setEditing(true)
  }, [g.loaded, v])

  const startEdit = (veh?: Vehicle) => {
    setForm(
      veh
        ? { make: veh.make, model: veh.model, year: veh.year ? String(veh.year) : '', engine: veh.engine ?? '', fuel: veh.fuel, transmission: veh.transmission, km: veh.km ? String(veh.km) : '', records: veh.records ?? {} }
        : emptyForm(),
    )
    setEditing(true)
  }

  const save = (e: React.FormEvent) => {
    e.preventDefault()
    g.saveVehicle({
      id: editingId,
      make: form.make.trim() || 'Моята кола',
      model: form.model.trim(),
      year: form.year ? Number(form.year) : undefined,
      engine: form.engine.trim() || undefined,
      fuel: form.fuel,
      transmission: form.transmission,
      km: form.km ? Number(form.km) : undefined,
      records: form.records,
      checklist: v?.checklist,
    })
    setEditing(false)
  }
  const [editingId, setEditingId] = useState<string | undefined>()

  const reminders = useMemo(() => (v ? g.state.reminders.filter((r) => r.vehicleId === v.id) : []), [g.state.reminders, v])

  if (!g.loaded)
    return (
      <div className="mx-auto max-w-4xl">
        <Crumbs items={[{ name: 'Моят гараж' }]} />
        <PageHeader eyebrow="Car profile · Service reminders" title="Моят гараж" intro="Пази историята на обслужването и получавай напомняния. Данните се съхраняват само в този браузър (local storage) – не се изпращат никъде." />
        <div className="py-16 text-center text-muted">Зареждане на гаража…</div>
      </div>
    )

  return (
    <div className="mx-auto max-w-4xl">
      <Crumbs items={[{ name: 'Моят гараж' }]} />
      <PageHeader eyebrow="Car profile · Service reminders" title="Моят гараж" intro="Пази историята на обслужването и получавай напомняния. Данните се съхраняват само в този браузър (local storage) – не се изпращат никъде." />

      {g.state.vehicles.length > 1 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {g.state.vehicles.map((x) => (
            <button key={x.id} type="button" aria-pressed={x.id === v?.id} onClick={() => g.setActive(x.id)} className="chip">
              <Icon name="Car" size={14} /> {x.make} {x.model}
            </button>
          ))}
        </div>
      )}

      {editing ? (
        <form onSubmit={save} className="card space-y-5 p-4 sm:p-6">
          <h2 className="text-lg font-bold">{editingId ? 'Редактирай автомобила' : 'Добави автомобил'}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Марка *"><input required className="input" value={form.make} onChange={(e) => setForm({ ...form, make: e.target.value })} placeholder="BMW" /></Field>
            <Field label="Модел"><input className="input" value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} placeholder="320d" /></Field>
            <Field label="Година"><input className="input" inputMode="numeric" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value.replace(/\D/g, '').slice(0, 4) })} placeholder="2018" /></Field>
            <Field label="Двигател"><input className="input" value={form.engine} onChange={(e) => setForm({ ...form, engine: e.target.value })} placeholder="2.0 Diesel" /></Field>
            <Field label="Гориво">
              <select className="input" value={form.fuel} onChange={(e) => setForm({ ...form, fuel: e.target.value as Fuel })}>{FUELS.map((x) => <option key={x.v} value={x.v}>{x.l}</option>)}</select>
            </Field>
            <Field label="Трансмисия">
              <select className="input" value={form.transmission} onChange={(e) => setForm({ ...form, transmission: e.target.value as Transmission })}>{TRANS.map((x) => <option key={x.v} value={x.v}>{x.l}</option>)}</select>
            </Field>
            <Field label="Текущи километри"><input className="input" inputMode="numeric" value={form.km} onChange={(e) => setForm({ ...form, km: e.target.value.replace(/\D/g, '').slice(0, 7) })} placeholder="180000" /></Field>
          </div>
          <div>
            <h3 className="mb-2 font-bold">История на обслужването</h3>
            <div className="space-y-2">
              {RECORDS.map((r) => (
                <RecordRow key={r.k} label={r.l} hint={r.hint} value={form.records[r.k]} onChange={(val) => setForm({ ...form, records: { ...form.records, [r.k]: val } })} />
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="btn btn-primary">Запази</button>
            {v && <button type="button" onClick={() => setEditing(false)} className="btn btn-ghost">Откажи</button>}
          </div>
        </form>
      ) : v ? (
        <div className="space-y-6">
          <VehicleCard v={v} onEdit={() => { setEditingId(v.id); startEdit(v) }} onNew={() => { setEditingId(undefined); startEdit() }} onRemove={() => { if (window.confirm('Да изтрия ли автомобила и напомнянията му?')) g.removeVehicle(v.id) }} onKm={(km) => g.patchVehicle(v.id, { km })} />
          <Reminders v={v} reminders={reminders} onAdd={g.addReminder} onToggle={g.toggleReminder} onRemove={g.removeReminder} />
          <div className="grid gap-2.5 sm:grid-cols-2">
            <Link to="/checklist" className="card card-hover flex items-center gap-3 p-4"><Icon name="ClipboardCheck" className="text-accent" /> <span className="flex-1 font-bold">Service checklist за тази кола</span><Icon name="ChevronRight" className="text-muted" /></Link>
            <Link to="/maintenance/oil-change" className="card card-hover flex items-center gap-3 p-4"><Icon name="Droplet" className="text-accent" /> <span className="flex-1 font-bold">Смяна на масло – какво да знам</span><Icon name="ChevronRight" className="text-muted" /></Link>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function RecordRow({ label, hint, value, onChange }: { label: string; hint?: string; value?: ServiceRecord; onChange: (v: ServiceRecord) => void }) {
  return (
    <div className="grid items-end gap-2 rounded-xl border border-line bg-surface-2/50 p-3 sm:grid-cols-[1fr_9rem_8rem]">
      <span className="text-sm font-semibold text-ink-2">{label}{hint && <span className="block text-xs font-normal text-muted">{hint}</span>}</span>
      <input type="date" aria-label={`${label} – дата`} className="input !min-h-10 !py-1.5 text-sm" value={value?.date ?? ''} onChange={(e) => onChange({ ...value, date: e.target.value || undefined })} />
      <input inputMode="numeric" aria-label={`${label} – км`} placeholder="км" className="input !min-h-10 !py-1.5 text-sm" value={value?.km ?? ''} onChange={(e) => { const n = e.target.value.replace(/\D/g, ''); onChange({ ...value, km: n ? Number(n) : undefined }) }} />
    </div>
  )
}

function VehicleCard({ v, onEdit, onNew, onRemove, onKm }: { v: Vehicle; onEdit: () => void; onNew: () => void; onRemove: () => void; onKm: (km: number) => void }) {
  const [km, setKm] = useState(v.km ? String(v.km) : '')
  useEffect(() => setKm(v.km ? String(v.km) : ''), [v.km])
  const fuel = FUELS.find((f) => f.v === v.fuel)?.l
  const tr = TRANS.find((t) => t.v === v.transmission)?.l
  return (
    <section className="card overflow-hidden">
      <div className="flex flex-wrap items-start justify-between gap-3 bg-gradient-to-br from-accent/10 to-transparent p-4 sm:p-6">
        <div className="flex items-center gap-3">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-surface-3 text-accent"><Icon name="Car" size={28} /></span>
          <div>
            <h2 className="text-xl font-bold">{v.make} {v.model}</h2>
            <p className="text-sm text-muted">{[v.year, v.engine, fuel, tr].filter(Boolean).join(' · ')}</p>
          </div>
        </div>
        <div className="flex gap-1.5">
          <button type="button" onClick={onEdit} className="btn btn-ghost !min-h-10 !px-3 text-sm">Редактирай</button>
          <button type="button" onClick={onNew} className="btn btn-ghost !min-h-10 !px-3 text-sm" aria-label="Добави друг автомобил"><Icon name="Plus" size={16} /></button>
          <button type="button" onClick={onRemove} className="btn btn-ghost !min-h-10 !px-3 text-sm text-stop" aria-label="Изтрий автомобила"><Icon name="Trash2" size={16} /></button>
        </div>
      </div>
      <div className="grid gap-4 p-4 sm:grid-cols-[14rem_1fr] sm:p-6">
        <form onSubmit={(e) => { e.preventDefault(); if (km) onKm(Number(km)) }}>
          <label className="label" htmlFor="km-now">Текущи километри</label>
          <div className="flex gap-2">
            <input id="km-now" className="input" inputMode="numeric" value={km} onChange={(e) => setKm(e.target.value.replace(/\D/g, '').slice(0, 7))} />
            <button className="btn btn-primary !px-3" aria-label="Запази километрите"><Icon name="Check" size={18} /></button>
          </div>
        </form>
        <dl className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {RECORDS.map((r) => {
            const rec = v.records?.[r.k]
            return (
              <div key={r.k} className="rounded-xl border border-line bg-surface-2/50 p-2.5">
                <dt className="text-[0.68rem] font-bold uppercase tracking-wide text-muted">{r.l.replace(/ – валид.*$/, '')}</dt>
                <dd className="mt-0.5 text-sm font-semibold">{rec?.date || rec?.km ? [rec.date && new Date(rec.date).toLocaleDateString('bg-BG'), rec.km && `${rec.km.toLocaleString('bg-BG')} км`].filter(Boolean).join(' · ') : <span className="text-muted">—</span>}</dd>
              </div>
            )
          })}
        </dl>
      </div>
    </section>
  )
}

function Reminders({ v, reminders, onAdd, onToggle, onRemove }: { v: Vehicle; reminders: Reminder[]; onAdd: (r: Omit<Reminder, 'id' | 'createdAt'>) => void; onToggle: (id: string) => void; onRemove: (id: string) => void }) {
  const [type, setType] = useState<ReminderType>('oil')
  const [date, setDate] = useState('')
  const [dueKm, setDueKm] = useState('')
  const [err, setErr] = useState('')

  const add = (e: React.FormEvent) => {
    e.preventDefault()
    if (!date && !dueKm) return setErr('Въведи дата или километри.')
    setErr('')
    onAdd({ vehicleId: v.id, type, title: REMINDER_LABELS[type], dueDate: date || undefined, dueKm: dueKm ? Number(dueKm) : undefined })
    setDate('')
    setDueKm('')
  }

  const rows = reminders
    .map((r) => ({ r, s: reminderStatus(r, v.km) }))
    .sort((a, b) => (a.s.status === 'done' ? 1 : 0) - (b.s.status === 'done' ? 1 : 0) || (a.s.daysLeft ?? 9999) - (b.s.daysLeft ?? 9999))
  const chart = rows.filter((x) => x.s.daysLeft != null && x.s.status !== 'done').map((x) => ({ name: x.r.title, days: x.s.daysLeft!, status: x.s.status }))

  const suggest = () => {
    const today = new Date()
    const y = today.getFullYear()
    const iso = (d: Date) => d.toISOString().slice(0, 10)
    const next = (month: number, day: number) => {
      const d = new Date(y, month, day, 12)
      if (d < today) d.setFullYear(y + 1)
      return iso(d)
    }
    const add = (t: ReminderType, dueDate?: string, km?: number) => {
      if (!reminders.some((r) => r.type === t && !r.done)) onAdd({ vehicleId: v.id, type: t, title: REMINDER_LABELS[t], dueDate, dueKm: km })
    }
    if (v.records.inspection?.date) add('inspection', v.records.inspection.date)
    if (v.records.insurance?.date) add('insurance', v.records.insurance.date)
    if (v.records.nextService?.date || v.records.nextService?.km) add('oil', v.records.nextService.date, v.records.nextService.km)
    // Bulgaria: winter-tyre period 15 Nov – 1 Mar → remind on 1 Nov and 15 Mar
    const toWinter = next(10, 1)
    const toSummer = next(2, 15)
    add('tires', toWinter < toSummer ? toWinter : toSummer)
    add('battery', next(9, 15)) // check before winter
  }

  return (
    <section className="card p-4 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 text-lg font-bold"><Icon name="Bell" size={18} className="text-accent" /> Напомняния</h2>
        <button type="button" onClick={suggest} className="btn btn-ghost !min-h-10 text-sm">Предложи от профила</button>
      </div>

      <form onSubmit={add} className="mb-5 grid gap-2 rounded-xl border border-line bg-surface-2/50 p-3 sm:grid-cols-[1fr_10rem_8rem_auto]">
        <select aria-label="Вид напомняне" className="input !min-h-11" value={type} onChange={(e) => setType(e.target.value as ReminderType)}>
          {(Object.keys(REMINDER_LABELS) as ReminderType[]).map((t) => <option key={t} value={t}>{REMINDER_LABELS[t]}</option>)}
        </select>
        <input aria-label="Дата" type="date" className="input !min-h-11" value={date} onChange={(e) => setDate(e.target.value)} />
        <input aria-label="При километри" inputMode="numeric" placeholder="при км" className="input !min-h-11" value={dueKm} onChange={(e) => setDueKm(e.target.value.replace(/\D/g, '').slice(0, 7))} />
        <button className="btn btn-primary !min-h-11"><Icon name="Plus" size={16} /> Добави</button>
        {err && <p className="text-sm text-soon sm:col-span-4" role="alert">{err}</p>}
      </form>

      {rows.length === 0 ? (
        <EmptyState title="Няма напомняния" text="Добави смяна на масло, ГТП, застраховка или смяна на гуми – или натисни „Предложи от профила“." />
      ) : (
        <>
          {chart.length > 0 && (
            <div className="mb-5 h-48 w-full" aria-label="Оставащи дни до напомнянията" role="img">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chart} layout="vertical" margin={{ left: 8, right: 16 }}>
                  <XAxis type="number" stroke="#8a95a6" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis type="category" dataKey="name" width={130} stroke="#c3cbd6" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{ fill: '#ffffff08' }} contentStyle={{ background: '#11151b', border: '1px solid #252d39', borderRadius: 12, color: '#eef2f6' }} formatter={(val) => [`${val} дни`, 'Остават']} />
                  <Bar dataKey="days" radius={[0, 6, 6, 0]}>
                    {chart.map((c, i) => <Cell key={i} fill={STATUS_STYLE[c.status as keyof typeof STATUS_STYLE].c} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
          <ul className="space-y-2">
            {rows.map(({ r, s }) => (
              <li key={r.id} className="flex items-center gap-3 rounded-xl border border-line bg-surface-2/50 p-3">
                <input type="checkbox" checked={!!r.done} onChange={() => onToggle(r.id)} className="h-5 w-5 shrink-0 accent-[#3df5c8]" aria-label={`Изпълнено: ${r.title}`} />
                <span className="min-w-0 flex-1">
                  <span className={`block font-semibold ${r.done ? 'text-muted line-through' : ''}`}>{r.title}</span>
                  <span className="text-xs text-muted">
                    {[r.dueDate && new Date(r.dueDate).toLocaleDateString('bg-BG'), r.dueKm && `при ${r.dueKm.toLocaleString('bg-BG')} км`].filter(Boolean).join(' · ')}
                    {s.daysLeft != null && !r.done && ` · ${s.daysLeft < 0 ? `преди ${-s.daysLeft} дни` : `след ${s.daysLeft} дни`}`}
                    {s.kmLeft != null && !r.done && ` · ${s.kmLeft < 0 ? `${-s.kmLeft} км просрочени` : `остават ${s.kmLeft} км`}`}
                  </span>
                </span>
                <span className="shrink-0 rounded-full px-2 py-0.5 text-[0.68rem] font-bold" style={{ color: STATUS_STYLE[s.status].c, background: `color-mix(in srgb, ${STATUS_STYLE[s.status].c} 14%, transparent)` }}>{STATUS_STYLE[s.status].l}</span>
                <button type="button" onClick={() => onRemove(r.id)} className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-muted hover:text-stop" aria-label={`Изтрий ${r.title}`}><Icon name="Trash2" size={16} /></button>
              </li>
            ))}
          </ul>
        </>
      )}
      <p className="mt-4 text-xs text-muted">Напомнянията се показват при отваряне на страницата. Push известия ще бъдат добавени в следваща версия.</p>
    </section>
  )
}
