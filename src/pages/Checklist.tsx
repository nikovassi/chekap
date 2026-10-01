import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { ChecklistItem, Fuel, Transmission } from '../data/types'
import { useData } from '../data/load'
import { useHead } from '../lib/head'
import { useGarage } from '../lib/useGarage'
import { Icon } from '../components/Icon'
import { Crumbs, Disclaimer, PageHeader } from '../components/ui'

export const FUELS: { v: Fuel; l: string }[] = [
  { v: 'petrol', l: 'Бензин' }, { v: 'diesel', l: 'Дизел' }, { v: 'lpg', l: 'Бензин + газ (LPG)' }, { v: 'hybrid', l: 'Хибрид' }, { v: 'ev', l: 'Електрически' },
]
export const TRANS: { v: Transmission; l: string }[] = [
  { v: 'manual', l: 'Ръчна' }, { v: 'automatic', l: 'Автоматична' }, { v: 'dct', l: 'DSG / DCT' }, { v: 'cvt', l: 'CVT' },
]

const GROUPS: { title: string; ids: string[] }[] = [
  { title: 'Двигател и филтри', ids: ['engine-oil', 'oil-filter', 'air-filter', 'cabin-filter', 'fuel-filter', 'spark-plugs', 'glow-plugs', 'lpg-system', 'adblue-dpf'] },
  { title: 'Течности', ids: ['coolant', 'brake-fluid', 'transmission-fluid', 'differential-fluid'] },
  { title: 'Ангренаж и ремъци', ids: ['timing-belt', 'timing-chain', 'auxiliary-belt'] },
  { title: 'Шаси и безопасност', ids: ['brakes', 'tires', 'suspension', 'battery', 'lights', 'wipers', 'air-conditioning'] },
]

interface Form {
  make: string
  model: string
  year: string
  engine: string
  fuel: Fuel
  transmission: Transmission
  km: string
}

export default function ChecklistPage() {
  const { checklist } = useData('maintenance')
  const garage = useGarage()
  const [f, setF] = useState<Form>({ make: '', model: '', year: '', engine: '', fuel: 'petrol', transmission: 'manual', km: '' })
  const [shown, setShown] = useState(false)
  const [ticks, setTicks] = useState<Record<string, string>>({})

  useHead({
    title: 'Service checklist – какво да проверя по колата според километрите',
    description: 'Интерактивен списък за обслужване: избери марка, модел, година, двигател, гориво, трансмисия и километри и виж какво да бъде проверено – масло, филтри, ремък, спирачна течност, гуми и др.',
    path: '/checklist',
  })

  // prefill from the active garage vehicle
  useEffect(() => {
    const v = garage.active
    if (v) {
      setF({ make: v.make, model: v.model, year: v.year ? String(v.year) : '', engine: v.engine ?? '', fuel: v.fuel, transmission: v.transmission, km: v.km ? String(v.km) : '' })
      setTicks(v.checklist ?? {})
    }
  }, [garage.active?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setF((p) => ({ ...p, [k]: v }))
  const km = Number(f.km) || 0
  const age = f.year ? new Date().getFullYear() - Number(f.year) : 0

  const items = useMemo(
    () =>
      checklist.filter((i) => (!i.fuels || i.fuels.includes(f.fuel)) && (!i.transmissions || i.transmissions.includes(f.transmission))),
    [checklist, f.fuel, f.transmission],
  )
  const attention = (i: ChecklistItem) => (i.attentionKm && km >= i.attentionKm) || (i.attentionYears && age >= i.attentionYears)

  const toggle = (id: string) => {
    const next = { ...ticks }
    if (next[id]) delete next[id]
    else next[id] = new Date().toISOString().slice(0, 10)
    setTicks(next)
    if (garage.active) garage.patchVehicle(garage.active.id, { checklist: next })
  }

  const saveToGarage = () => {
    garage.saveVehicle({
      id: garage.active?.id,
      make: f.make.trim() || 'Моята кола',
      model: f.model.trim(),
      year: f.year ? Number(f.year) : undefined,
      engine: f.engine.trim() || undefined,
      fuel: f.fuel,
      transmission: f.transmission,
      km: km || undefined,
      records: garage.active?.records ?? {},
      checklist: ticks,
    })
  }

  const done = items.filter((i) => ticks[i.id]).length

  return (
    <div className="mx-auto max-w-3xl">
      <Crumbs items={[{ name: 'Поддръжка', path: '/maintenance' }, { name: 'Service checklist' }]} />
      <PageHeader eyebrow="Интерактивно" title="Service checklist" intro="Въведи данните за колата и ще видиш какво да бъде проверено. Не измисляме интервали за конкретен модел – ориентирите са обща информация, а точните интервали са в сервизната книжка." />

      <form
        className="card grid gap-3 p-4 sm:grid-cols-2 sm:p-6"
        onSubmit={(e) => {
          e.preventDefault()
          setShown(true)
          setTimeout(() => document.getElementById('cl-res')?.scrollIntoView({ behavior: 'smooth' }), 50)
        }}
      >
        <Field label="Марка"><input className="input" value={f.make} onChange={(e) => set('make', e.target.value)} placeholder="напр. BMW" autoComplete="off" /></Field>
        <Field label="Модел"><input className="input" value={f.model} onChange={(e) => set('model', e.target.value)} placeholder="напр. 320d" autoComplete="off" /></Field>
        <Field label="Година"><input className="input" inputMode="numeric" value={f.year} onChange={(e) => set('year', e.target.value.replace(/\D/g, '').slice(0, 4))} placeholder="2018" /></Field>
        <Field label="Двигател"><input className="input" value={f.engine} onChange={(e) => set('engine', e.target.value)} placeholder="напр. 2.0 дизел (B47)" /></Field>
        <Field label="Гориво">
          <select className="input" value={f.fuel} onChange={(e) => set('fuel', e.target.value as Fuel)}>
            {FUELS.map((x) => <option key={x.v} value={x.v}>{x.l}</option>)}
          </select>
        </Field>
        <Field label="Трансмисия">
          <select className="input" value={f.transmission} onChange={(e) => set('transmission', e.target.value as Transmission)}>
            {TRANS.map((x) => <option key={x.v} value={x.v}>{x.l}</option>)}
          </select>
        </Field>
        <Field label="Километри"><input className="input" inputMode="numeric" value={f.km} onChange={(e) => set('km', e.target.value.replace(/\D/g, '').slice(0, 7))} placeholder="180000" /></Field>
        <div className="flex items-end gap-2">
          <button className="btn btn-primary flex-1">Покажи какво да проверя</button>
        </div>
      </form>

      {shown && (
        <section id="cl-res" className="mt-6 scroll-mt-24 space-y-5 animate-fade-up">
          <div className="card flex flex-wrap items-center justify-between gap-3 p-4">
            <div>
              <p className="eyebrow">Чеклист за</p>
              <p className="font-bold">{[f.make, f.model, f.year, f.engine].filter(Boolean).join(' · ') || 'твоята кола'}{km ? ` · ${km.toLocaleString('bg-BG')} км` : ''}</p>
              <p className="text-sm text-muted">Проверено: {done} от {items.length}</p>
            </div>
            <button type="button" onClick={saveToGarage} className="btn btn-ghost text-sm">
              <Icon name="Car" size={16} /> {garage.active ? 'Обнови в гаража' : 'Запази в моя гараж'}
            </button>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-surface-3" aria-hidden="true">
            <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${items.length ? (done / items.length) * 100 : 0}%` }} />
          </div>
          {GROUPS.map((g) => {
            const list = items.filter((i) => g.ids.includes(i.id))
            if (!list.length) return null
            return (
              <div key={g.title}>
                <h2 className="mb-2 text-lg font-bold">{g.title}</h2>
                <ul className="space-y-2">
                  {list.map((i) => {
                    const att = attention(i)
                    const on = !!ticks[i.id]
                    return (
                      <li key={i.id} className={`card p-3.5 ${on ? 'opacity-70' : ''}`}>
                        <label className="flex cursor-pointer gap-3">
                          <input type="checkbox" checked={on} onChange={() => toggle(i.id)} className="mt-1 h-5 w-5 shrink-0 accent-[#3df5c8]" />
                          <span className="flex-1">
                            <span className="flex flex-wrap items-center gap-2">
                              <span className={`font-bold ${on ? 'line-through' : ''}`}>{i.name}</span>
                              <span className="text-xs text-muted">{i.nameEn}</span>
                              {att && !on && <span className="rounded-full bg-soon/15 px-2 py-0.5 text-[0.68rem] font-bold text-soon">ОБЪРНИ ВНИМАНИЕ</span>}
                              {on && <span className="text-[0.68rem] font-bold text-ok">Проверено {ticks[i.id]}</span>}
                            </span>
                            <span className="mt-1 block text-[0.92rem] text-ink-2">{i.detail}</span>
                            <span className="mt-1.5 block text-xs text-muted">{i.generalGuide}</span>
                          </span>
                        </label>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )
          })}
          <p className="flex gap-2 rounded-xl border border-info/30 bg-info/[0.07] p-3.5 text-sm text-ink-2">
            <Icon name="Info" size={18} className="mt-0.5 shrink-0 text-info" />
            „Обърни внимание“ се показва по общи ориентири за километри/възраст, а не по данни за твоя модел. Точните интервали са в ръководството и сервизната книжка на автомобила.
          </p>
          <p className="text-sm">
            Искаш напомняния? <Link to="/garage" className="text-accent underline">Отвори Моят гараж</Link>.
          </p>
        </section>
      )}
      <div className="mt-8"><Disclaimer /></div>
    </div>
  )
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      {children}
    </label>
  )
}
