import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import type { ObdCode } from '../data/types'
import { useData } from '../data/load'
import { breadcrumbLd, faqLd, useHead } from '../lib/head'
import { detectObd } from '../lib/search'
import { Icon } from '../components/Icon'
import { Block, BulletList, Crumbs, Disclaimer, EmptyState, PageHeader, Related, Sources, UrgencyBadge, UrgencyBanner, UrgencyContextList } from '../components/ui'
import NotFound from './NotFound'

export function CodeTriad() {
  return (
    <div className="grid gap-2.5 sm:grid-cols-3">
      {[
        ['Код (fault code)', 'Кой самотест на компютъра е неуспешен. Пример: P0301 – открито пропускане в цилиндър 1.', 'Cpu'],
        ['Симптом', 'Какво усещаш ти: тресене, загуба на мощност, мигаща лампа.', 'Activity'],
        ['Първопричина (root cause)', 'Реалната повреда – напр. износена свещ, пукната бобина, вакуумен теч. Установява се с тестове.', 'Stethoscope'],
      ].map(([t, d, i]) => (
        <div key={t} className="card p-4">
          <Icon name={i} size={20} className="text-accent" />
          <p className="mt-2 font-bold">{t}</p>
          <p className="mt-1 text-sm text-muted">{d}</p>
        </div>
      ))}
    </div>
  )
}

export function CodeLookup({ autoFocus = false }: { autoFocus?: boolean }) {
  const [v, setV] = useState('')
  const [err, setErr] = useState('')
  const nav = useNavigate()
  const codes = useData('obd')
  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const c = detectObd(v)
    if (!c) return setErr('Въведи код във формат P0300, P0420, U0100…')
    if (!codes.some((x) => x.code.toLowerCase() === c)) return setErr(`Кодът ${c.toUpperCase()} все още не е в базата. Кодовете от P1xxx са специфични за производителя.`)
    setErr('')
    nav(`/obd/${c}`)
  }
  return (
    <form onSubmit={submit} className="card p-4 sm:p-5" role="search">
      <label htmlFor="obd-in" className="label">Търси по OBD2 код</label>
      <div className="flex gap-2">
        <input id="obd-in" value={v} autoFocus={autoFocus} onChange={(e) => { setV(e.target.value); setErr('') }} placeholder="напр. P0300" className="input font-display uppercase tracking-wider" autoComplete="off" autoCapitalize="characters" />
        <button className="btn btn-primary shrink-0">Покажи</button>
      </div>
      {err && <p className="mt-2 text-sm text-soon" role="alert">{err}</p>}
    </form>
  )
}

export function ObdIndex() {
  const codes = useData('obd')
  const [sys, setSys] = useState('all')
  useHead({
    title: 'OBD2 кодове – база с описание, причини и диагностика',
    description: 'Търси OBD2/EOBD код за грешка (P0300, P0171, P0420, P0401…): описание, система, възможни причини, симптоми, как се диагностицира и спешност. Кодът не е диагноза.',
    path: '/obd',
    jsonLd: [breadcrumbLd([{ name: 'Начало', path: '/' }, { name: 'OBD2 кодове', path: '/obd' }])],
  })
  const systems = [...new Set(codes.map((c) => c.system))]
  const list = codes.filter((c) => sys === 'all' || c.system === sys).sort((a, b) => a.code.localeCompare(b.code))
  return (
    <div>
      <Crumbs items={[{ name: 'OBD2 кодове' }]} />
      <PageHeader eyebrow="OBD2 Diagnostic Codes" title="OBD2 кодове за грешки" intro="Кодът показва кой самотест на компютъра е неуспешен – не коя част да смениш. Използвай го като отправна точка за диагностика." />
      <div className="space-y-4">
        <CodeLookup />
        <CodeTriad />
        <p className="text-sm text-muted">
          Ново в OBD? Прочети <Link className="text-accent underline" to="/guides/obd-basics">как работи OBD-II</Link> и <Link className="text-accent underline" to="/check-engine">какво значи Check Engine</Link>.
        </p>
        <div className="-mx-4 flex gap-1.5 overflow-x-auto px-4 scrollbar-none">
          <button type="button" aria-pressed={sys === 'all'} onClick={() => setSys('all')} className="chip !py-1.5 !text-xs">Всички ({codes.length})</button>
          {systems.map((s) => (
            <button key={s} type="button" aria-pressed={sys === s} onClick={() => setSys(s)} className="chip !py-1.5 !text-xs">{s}</button>
          ))}
        </div>
        {list.length === 0 && <EmptyState title="Няма кодове в тази система" />}
        <div className="grid gap-2 sm:grid-cols-2">
          {list.map((c) => (
            <Link key={c.code} to={`/obd/${c.code.toLowerCase()}`} className="card card-hover group flex items-start gap-3 p-3.5">
              <span className="font-display min-w-[4.6rem] rounded-lg bg-surface-3 px-2 py-1.5 text-center text-sm font-bold tracking-wider text-accent">{c.code}</span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold leading-snug group-hover:text-accent">{c.titleBg}</span>
                <span className="mt-1 flex items-center gap-2 text-xs text-muted">
                  {c.system} <UrgencyBadge level={c.urgency} />
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export function ObdPage() {
  const { code } = useParams()
  const codes = useData('obd')
  const c = codes.find((x) => x.code.toLowerCase() === code?.toLowerCase())
  if (!c) return <NotFound />
  return <ObdView c={c} />
}

function ObdView({ c }: { c: ObdCode }) {
  const path = `/obd/${c.code.toLowerCase()}`
  useHead({
    title: `${c.code} – ${c.titleBg}: причини и диагностика`,
    description: `${c.code} (${c.titleEn}). ${c.summary}`.slice(0, 300),
    path,
    jsonLd: [
      breadcrumbLd([{ name: 'Начало', path: '/' }, { name: 'OBD2 кодове', path: '/obd' }, { name: c.code, path }]),
      faqLd([
        { q: `Какво означава код ${c.code}?`, a: `${c.titleBg}. ${c.summary}` },
        { q: `Какви са възможните причини за ${c.code}?`, a: c.causes.join('; ') + '.' },
        { q: `Как се диагностицира ${c.code}?`, a: c.diagnosis.join(' ') },
      ]),
    ],
  })
  return (
    <article className="mx-auto max-w-3xl">
      <Crumbs items={[{ name: 'OBD2 кодове', path: '/obd' }, { name: c.code }]} />
      <header className="mb-6 animate-fade-up">
        <p className="eyebrow mb-2 !text-accent">OBD2 код · {c.system}</p>
        <h1 className="font-display text-4xl font-bold tracking-wider sm:text-5xl">{c.code}</h1>
        <p className="mt-2 text-xl font-semibold text-ink sm:text-2xl">{c.titleBg}</p>
        <p className="mt-1 text-sm text-muted">{c.titleEn}</p>
      </header>
      <div className="space-y-4">
        <UrgencyBanner level={c.urgency} />
        <Block title="Описание" icon="Info">
          <p className="text-[1.02rem] leading-relaxed text-ink-2">{c.summary}</p>
          <p className="mt-3 rounded-lg border border-info/25 bg-info/[0.07] p-3 text-sm text-ink-2">
            <b className="text-info">Важно:</b> кодът не доказва, че конкретна част е повредена. Той показва неуспешен тест. Причината се потвърждава с проверка.
          </p>
        </Block>
        {c.urgencyContext && <UrgencyContextList items={c.urgencyContext} />}
        <div className="grid gap-4 md:grid-cols-2">
          <Block title="Възможни причини" icon="Stethoscope">
            <BulletList items={c.causes} />
          </Block>
          <Block title="Типични симптоми" icon="Activity">
            <BulletList items={c.symptoms} />
          </Block>
        </div>
        <Block title="Как се диагностицира" icon="Wrench">
          <BulletList items={c.diagnosis} icon="check" />
        </Block>
        <Block title="Какво да НЕ правиш" icon="AlertTriangle" tone="stop">
          <BulletList items={c.dontDo} icon="stop" />
        </Block>
        <Related refs={c.related} title="Свързани кодове и проблеми" />
        <Sources ids={c.sources} />
        <Disclaimer />
      </div>
    </article>
  )
}
