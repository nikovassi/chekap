import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import type { LightColor, LightGroup, WarningLight } from '../data/types'
import { useData } from '../data/load'
import { URGENCY } from '../lib/meta'
import { breadcrumbLd, faqLd, useHead } from '../lib/head'
import { LightIcon, lampColor } from '../components/LightIcon'
import { Icon } from '../components/Icon'
import {
  Block, BulletList, Crumbs, Disclaimer, DoNow, EmptyState, PageHeader, QuickAnswers, Related, Sources, TellMechanic,
  UrgencyBadge, UrgencyBanner, UrgencyContextList,
} from '../components/ui'
import { Chip, FilterRow } from './Topics'
import NotFound from './NotFound'

const COLOR_LABEL: Record<LightColor, string> = { red: 'Червена', amber: 'Жълта / оранжева', green: 'Зелена', blue: 'Синя', white: 'Бяла' }
const GROUP_LABEL: Record<LightGroup, string> = {
  critical: 'Критични', engine: 'Двигател и емисии', brakes: 'Спирачки и шаси', safety: 'Безопасност', assist: 'Асистенти', lights: 'Светлини', ev: 'Хибрид и EV', info: 'Информация',
}
const GROUP_ORDER: LightGroup[] = ['critical', 'engine', 'brakes', 'safety', 'assist', 'lights', 'ev', 'info']

export function LightsIndex() {
  const lights = useData('lights')
  const [color, setColor] = useState<LightColor | 'all'>('all')
  const [q, setQ] = useState('')
  useHead({
    title: 'Лампи на таблото – значение на всички предупредителни символи',
    description: 'Визуален каталог на предупредителните и информационните лампи на таблото: check engine, масло, акумулатор, температура, ABS, ESP, airbag, TPMS, DPF, AdBlue и още. Какво означават и мога ли да карам.',
    path: '/dashboard',
    jsonLd: [breadcrumbLd([{ name: 'Начало', path: '/' }, { name: 'Лампи на таблото', path: '/dashboard' }])],
  })
  const ql = q.trim().toLowerCase()
  const filtered = lights.filter(
    (l) => (color === 'all' || l.colors.includes(color)) && (!ql || [l.name, l.nameEn, ...l.keywords].some((k) => k.toLowerCase().includes(ql))),
  )
  return (
    <div>
      <Crumbs items={[{ name: 'Лампи на таблото' }]} />
      <PageHeader
        eyebrow="Каталог на символите"
        title="Лампи на таблото"
        intro="Цветът подсказва спешността – червено: действай веднага, жълто/оранжево: провери скоро, зелено/синьо/бяло: информация. Но символите и цветовете се различават между производителите – винаги провери ръководството на автомобила."
      />
      <div className="mb-5 grid gap-3 sm:grid-cols-4">
        {(['red', 'amber', 'green', 'blue'] as LightColor[]).map((c) => (
          <div key={c} className="card flex items-center gap-3 p-3">
            <span className="h-3 w-3 rounded-full" style={{ background: lampColor(c), boxShadow: `0 0 12px ${lampColor(c)}` }} />
            <span className="text-sm">
              <b>{COLOR_LABEL[c]}</b>
              <span className="block text-xs text-muted">{c === 'red' ? 'Спри безопасно и провери' : c === 'amber' ? 'Провери възможно най-скоро' : 'Функцията е активна'}</span>
            </span>
          </div>
        ))}
      </div>
      <div className="mb-5 space-y-3">
        <div className="relative">
          <Icon name="Search" size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Търси лампа: масльонка, ABS, спиралка, костенурка…" className="input !pl-10" aria-label="Търси лампа" />
        </div>
        <FilterRow label="Цвят">
          <Chip on={color === 'all'} onClick={() => setColor('all')}>Всички</Chip>
          {(Object.keys(COLOR_LABEL) as LightColor[]).map((c) => (
            <Chip key={c} on={color === c} onClick={() => setColor(c)}>
              <span className="h-2 w-2 rounded-full" style={{ background: lampColor(c) }} /> {COLOR_LABEL[c]}
            </Chip>
          ))}
        </FilterRow>
      </div>

      {filtered.length === 0 && <EmptyState title="Няма такава лампа" text="Опитай с друго описание – напр. „кола с вълнички“, „ключ“, „термометър“." />}
      <div className="space-y-8">
        {GROUP_ORDER.map((g) => {
          const items = filtered.filter((l) => l.group === g)
          if (!items.length) return null
          return (
            <section key={g}>
              <h2 className="mb-3 text-lg font-bold">{GROUP_LABEL[g]}</h2>
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
                {items.map((l) => (
                  <LightTile key={l.slug} l={l} />
                ))}
              </div>
            </section>
          )
        })}
      </div>
      <div className="mt-8">
        <Disclaimer />
      </div>
    </div>
  )
}

function LightTile({ l }: { l: WarningLight }) {
  return (
    <Link to={`/dashboard/${l.slug}`} className="card card-hover group flex flex-col p-3.5">
      <div className="flex items-start justify-between">
        <span className="grid h-16 w-16 place-items-center rounded-2xl bg-[#07090c] ring-1 ring-line">
          <LightIcon name={l.icon} color={l.colors[0]} size={42} />
        </span>
        <span className="flex gap-1">
          {l.colors.map((c) => (
            <span key={c} title={COLOR_LABEL[c]} className="h-2.5 w-2.5 rounded-full" style={{ background: lampColor(c) }} />
          ))}
        </span>
      </div>
      <span className="mt-3 font-bold leading-snug group-hover:text-accent">{l.name}</span>
      <span className="mt-0.5 text-xs text-muted">{l.nameEn}</span>
      <span className="mt-2">
        <UrgencyBadge level={l.urgency} />
      </span>
    </Link>
  )
}

export function LightPage() {
  const { slug } = useParams()
  const lights = useData('lights')
  const l = lights.find((x) => x.slug === slug)
  if (!l) return <NotFound />
  return <LightView l={l} />
}

function LightView({ l }: { l: WarningLight }) {
  const [shown, setShown] = useState(l.colors[0])
  const path = `/dashboard/${l.slug}`
  useHead({
    title: `Свети ${l.name.split(' (')[0]} (${l.nameEn}) – какво означава и мога ли да карам`,
    description: `${l.meaning} ${l.canDrive}`.slice(0, 300),
    path,
    jsonLd: [
      breadcrumbLd([{ name: 'Начало', path: '/' }, { name: 'Лампи на таблото', path: '/dashboard' }, { name: l.name, path }]),
      faqLd([
        { q: `Какво означава лампата ${l.name}?`, a: l.meaning },
        { q: 'Мога ли да продължа да карам?', a: l.canDrive },
        { q: 'Какво да направя сега?', a: l.doNow.join(' ') },
        { q: 'Кога да отида в сервиз?', a: l.garageWhen },
      ]),
    ],
  })
  const diag = l.needsDiagnostics === 'yes' ? 'Да – прочитане на кодовете' : l.needsDiagnostics === 'sometimes' ? 'Понякога – ако не изчезне' : 'Обикновено не'
  return (
    <article className="mx-auto max-w-3xl">
      <Crumbs items={[{ name: 'Лампи на таблото', path: '/dashboard' }, { name: l.name }]} />
      <div className="mb-6 flex animate-fade-up items-center gap-4 sm:gap-5">
        <div className="relative grid h-24 w-24 shrink-0 place-items-center rounded-[1.6rem] bg-[#05070a] ring-1 ring-line-strong sm:h-32 sm:w-32 sm:rounded-[2rem]">
          <div className="absolute inset-3 rounded-[1.5rem] bg-[radial-gradient(circle,#ffffff08,transparent_70%)]" />
          <LightIcon name={l.icon} color={shown} size={64} className="sm:h-[84px] sm:w-[84px]" />
        </div>
        <div className="min-w-0">
          <p className="eyebrow mb-1 !text-accent">Лампа на таблото · {l.nameEn}</p>
          <h1 className="text-[1.3rem] font-bold [hyphens:auto] [overflow-wrap:anywhere] sm:text-4xl">{l.name}</h1>
          {l.colors.length > 1 && (
            <div className="mt-3 flex flex-wrap gap-1.5" role="group" aria-label="Цвят на лампата">
              {l.colors.map((c) => (
                <button key={c} type="button" aria-pressed={shown === c} onClick={() => setShown(c)} className="chip !py-1 !text-xs">
                  <span className="h-2 w-2 rounded-full" style={{ background: lampColor(c) }} /> {COLOR_LABEL[c]}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <UrgencyBanner level={l.urgency} />
        <DoNow steps={l.doNow} />
        <QuickAnswers
          items={[
            { q: 'Мога ли да карам?', a: l.canDrive, tone: l.urgency === 'info' ? 'ok' : l.urgency },
            { q: 'Кога в сервиз?', a: l.garageWhen },
            { q: 'Нужна ли е диагностика?', a: diag },
          ]}
        />
        <Block title="Какво означава" icon="Info">
          <p className="text-[1.02rem] leading-relaxed text-ink-2">{l.meaning}</p>
        </Block>
        <UrgencyContextList items={l.urgencyContext} />
        <div className="grid gap-4 md:grid-cols-2">
          <Block title="Какво може да я е причинило" icon="Stethoscope">
            <BulletList items={l.causes} />
          </Block>
          <Block title="Какво да провериш" icon="Search">
            <BulletList items={l.driverChecks} />
          </Block>
        </div>
        {l.stopIf.length > 0 && (
          <Block title="Кога да спреш веднага" icon="AlertTriangle" tone="stop">
            <BulletList items={l.stopIf} icon="stop" />
          </Block>
        )}
        <Block title="Различия между производителите" icon="Car">
          <p className="text-[0.95rem] text-ink-2">{l.variation}</p>
          <p className="mt-2 text-xs text-muted">Символът на тази страница е представителен. Точният вид, цвят и значение са в ръководството на твоя автомобил.</p>
        </Block>
        {l.tellMechanic && <TellMechanic items={l.tellMechanic} />}
        <Related refs={l.related} />
        <Sources ids={l.sources} />
        <Disclaimer />
        <p className="text-center text-sm">
          <Link to="/dashboard" className="inline-flex items-center gap-1 text-accent hover:underline">
            <Icon name="ArrowLeft" size={14} /> Всички лампи на таблото
          </Link>
        </p>
      </div>
      <span className="sr-only">{URGENCY[l.urgency].label}</span>
    </article>
  )
}
