import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import type { CategoryId, Topic, TopicSection, Urgency } from '../data/types'
import { useData } from '../data/load'
import { CATEGORIES, SECTIONS, URGENCY, URGENCY_ORDER } from '../lib/meta'
import { breadcrumbLd, faqLd, useHead } from '../lib/head'
import { Icon } from '../components/Icon'
import {
  Block, BulletList, Causes, Crumbs, Disclaimer, DoNow, PageHeader, QuickAnswers, Related, Sources, TellMechanic,
  UrgencyBadge, UrgencyBanner, UrgencyContextList, EmptyState,
} from '../components/ui'
import NotFound from './NotFound'

const INTROS: Record<TopicSection, { title: string; intro: string; seo: string }> = {
  symptoms: {
    title: 'Симптоми',
    intro: 'Опиши какво прави колата – тресе, не пали, губи мощност, дърпа на една страна – и виж възможните причини, спешността и какво да направиш сега.',
    seo: 'Симптоми при автомобила – тресе, не пали, губи мощност, прегрява | Чекап',
  },
  noises: {
    title: 'Шумове от автомобила',
    intro: 'Чукане, тракане, свистене, бучене, щракане при завиване… Разпознай шума по това как звучи, кога се появява и откъде идва.',
    seo: 'Шумове от колата – чукане, тракане, свистене, бучене | Чекап',
  },
  smoke: {
    title: 'Какво означава цветът на пушека?',
    intro: 'Бял, син, черен или сив пушек от ауспуха – кога е нормален конденз и кога е признак на проблем. И кога трябва да спреш.',
    seo: 'Пушек от ауспуха – бял, син, черен, сив: какво означава | Чекап',
  },
  smells: {
    title: 'Миризми в и около колата',
    intro: 'Бензин, газ, изгоряло, сладка миризма на антифриз, развалени яйца… Някои миризми изискват незабавно спиране.',
    seo: 'Миризма в колата – бензин, газ, изгоряло, антифриз | Чекап',
  },
  leaks: {
    title: 'Течове под колата',
    intro: 'Разпознай течността по цвят, миризма и място. Спирачната течност и горивото са критични – не карай.',
    seo: 'Теч под колата – масло, антифриз, спирачна течност, гориво | Чекап',
  },
}

const TAGS: Record<string, string> = {
  'cold-start': 'Студен старт', warm: 'Загрял двигател', acceleration: 'При ускорение', braking: 'При спиране', turning: 'При завиване',
  bumps: 'На неравности', idle: 'На празен ход', speed: 'При скорост', deceleration: 'При отпускане/спускане', 'after-standing': 'След престой',
}

export function TopicIndex({ section }: { section: TopicSection }) {
  const items = useData(section)
  const meta = INTROS[section]
  const [cat, setCat] = useState<CategoryId | 'all'>('all')
  const [tag, setTag] = useState<string>('all')
  const [urg, setUrg] = useState<Urgency | 'all'>('all')

  useHead({ title: meta.seo, description: meta.intro, path: SECTIONS[section].path, jsonLd: [breadcrumbLd([{ name: 'Начало', path: '/' }, { name: meta.title, path: SECTIONS[section].path }])] })

  const cats = useMemo(() => [...new Set(items.map((i) => i.category))], [items])
  const tags = useMemo(() => [...new Set(items.flatMap((i) => i.tags ?? []))], [items])
  const filtered = items.filter((i) => (cat === 'all' || i.category === cat) && (tag === 'all' || i.tags?.includes(tag)) && (urg === 'all' || i.urgency === urg))

  return (
    <div>
      <Crumbs items={[{ name: meta.title }]} />
      <PageHeader eyebrow={SECTIONS[section].plural} title={meta.title} intro={meta.intro} />

      <div className="mb-5 space-y-2.5">
        {cats.length > 1 && (
          <FilterRow label="Система">
            <Chip on={cat === 'all'} onClick={() => setCat('all')}>Всички</Chip>
            {cats.map((c) => (
              <Chip key={c} on={cat === c} onClick={() => setCat(c)}>{CATEGORIES[c]?.label ?? c}</Chip>
            ))}
          </FilterRow>
        )}
        {tags.length > 1 && (
          <FilterRow label="Кога">
            <Chip on={tag === 'all'} onClick={() => setTag('all')}>Винаги</Chip>
            {tags.map((t) => (
              <Chip key={t} on={tag === t} onClick={() => setTag(t)}>{TAGS[t] ?? t}</Chip>
            ))}
          </FilterRow>
        )}
        <FilterRow label="Спешност">
          <Chip on={urg === 'all'} onClick={() => setUrg('all')}>Всички</Chip>
          {URGENCY_ORDER.filter((u) => items.some((i) => i.urgency === u)).map((u) => (
            <Chip key={u} on={urg === u} onClick={() => setUrg(u)}>{URGENCY[u].short}</Chip>
          ))}
        </FilterRow>
      </div>

      <p className="mb-3 text-sm text-muted" aria-live="polite">{filtered.length} резултата</p>
      {filtered.length === 0 ? (
        <EmptyState title="Няма резултати с тези филтри" text="Махни някой от филтрите или използвай търсенето.">
          <button type="button" className="btn btn-ghost" onClick={() => { setCat('all'); setTag('all'); setUrg('all') }}>Изчисти филтрите</button>
        </EmptyState>
      ) : (
        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t) => (
            <TopicCard key={t.slug} t={t} />
          ))}
        </div>
      )}
    </div>
  )
}

export function TopicCard({ t }: { t: Topic }) {
  return (
    <Link to={`/${t.section}/${t.slug}`} className="card card-hover group flex min-w-0 flex-col p-4">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="eyebrow !text-[0.62rem]">{CATEGORIES[t.category]?.label}</span>
        <UrgencyBadge level={t.urgency} />
      </div>
      <div className="flex items-start gap-3">
        {t.swatch && <span className="mt-0.5 h-9 w-9 shrink-0 rounded-lg ring-1 ring-line" style={{ background: `radial-gradient(circle at 35% 35%, ${t.swatch}, color-mix(in srgb, ${t.swatch} 55%, #000))` }} />}
        <h3 className="font-sans text-[1.02rem] font-bold leading-snug group-hover:text-accent">{t.title}</h3>
      </div>
      <p className="mt-1.5 line-clamp-2 text-sm text-muted">{t.summary}</p>
      {t.causes.length > 0 && <p className="mt-2 truncate text-xs text-ink-2/80">Възможни причини: {t.causes.slice(0, 3).map((c) => c.name).join(', ')}</p>}
    </Link>
  )
}

export function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="eyebrow w-16 shrink-0 !text-[0.6rem]">{label}</span>
      <div className="flex min-w-0 flex-1 gap-1.5 overflow-x-auto scrollbar-none">{children}</div>
    </div>
  )
}

export function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" aria-pressed={on} onClick={onClick} className="chip !py-1.5 !text-xs">
      {children}
    </button>
  )
}

export function TopicPage({ section }: { section: TopicSection }) {
  const { slug } = useParams()
  const items = useData(section)
  const t = items.find((i) => i.slug === slug)
  if (!t) return <NotFound />
  return <TopicView t={t} />
}

function TopicView({ t }: { t: Topic }) {
  const sec = SECTIONS[t.section]
  const path = `/${t.section}/${t.slug}`
  const canDrive = t.urgency === 'stop' ? 'Не – спри и провери' : t.urgency === 'soon' ? 'Внимателно, до проверка' : t.urgency === 'monitor' ? 'Обикновено да, но наблюдавай' : 'Да'
  useHead({
    title: t.seoTitle ?? `${t.title} – причини и какво да направиш`,
    description: `${t.summary} Възможни причини, спешност и какво да направиш сега.`.slice(0, 300),
    path,
    jsonLd: [
      breadcrumbLd([{ name: 'Начало', path: '/' }, { name: sec.plural, path: sec.path }, { name: t.title, path }]),
      faqLd([
        { q: `Какво означава: ${t.title.toLowerCase()}?`, a: t.summary },
        { q: 'Какви са възможните причини?', a: t.causes.map((c) => c.name).join(', ') + '.' },
        { q: 'Какво да направя сега?', a: t.doNow.join(' ') },
        ...(t.stopIf.length ? [{ q: 'Кога трябва да спра автомобила?', a: t.stopIf.join(' ') }] : []),
      ]),
    ],
  })

  return (
    <article className="mx-auto max-w-3xl">
      <Crumbs items={[{ name: sec.plural, path: sec.path }, { name: t.title }]} />
      <PageHeader eyebrow={`${sec.label} · ${CATEGORIES[t.category]?.label ?? ''}`} title={t.title} />

      <div className="space-y-4">
        <UrgencyBanner level={t.urgency} />
        <DoNow steps={t.doNow} />
        <QuickAnswers
          items={[
            { q: 'Мога ли да карам?', a: canDrive, tone: t.urgency === 'info' ? 'ok' : t.urgency },
            { q: 'Колко сериозно е?', a: URGENCY[t.urgency].label.toLowerCase().replace(/^./, (c) => c.toUpperCase()), tone: t.urgency },
            { q: 'Нужна ли е диагностика?', a: t.urgency === 'info' ? 'Обикновено не' : 'Да, за да се установи причината' },
          ]}
        />

        <Block title="Какво означава" icon="Info">
          <p className="text-[1.02rem] leading-relaxed text-ink-2">{t.summary}</p>
          {(t.sound || t.location || t.whenOccurs?.length || t.color || t.smell || t.normalWhen) && (
            <dl className="mt-4 grid gap-3 sm:grid-cols-2">
              {t.sound && <Fact k="Как звучи" v={t.sound} />}
              {t.color && <Fact k="Цвят" v={t.color} swatch={t.swatch} />}
              {t.smell && <Fact k="Миризма" v={t.smell} />}
              {t.location && <Fact k={t.section === 'leaks' ? 'Къде обикновено се намира' : 'Откъде може да идва'} v={t.location} />}
              {t.whenOccurs && t.whenOccurs.length > 0 && <Fact k="Кога се появява" v={t.whenOccurs.join(' · ')} />}
              {t.normalWhen && <Fact k="Кога е нормално" v={t.normalWhen} tone="ok" />}
            </dl>
          )}
        </Block>

        <UrgencyContextList items={t.urgencyContext} />
        <Causes causes={t.causes} />

        <div className="grid gap-4 md:grid-cols-2">
          <Block title="Какво можеш да провериш" icon="Search">
            <BulletList items={t.driverChecks} />
          </Block>
          <Block title="Какво ще провери механикът" icon="Wrench">
            <BulletList items={t.mechanicChecks} />
          </Block>
        </div>

        {t.watchFor.length > 0 && (
          <Block title="Какво да наблюдаваш" icon="Activity">
            <BulletList items={t.watchFor} />
          </Block>
        )}
        {t.stopIf.length > 0 && (
          <Block title="Кога да спреш автомобила" icon="AlertTriangle" tone="stop">
            <BulletList items={t.stopIf} icon="stop" />
          </Block>
        )}
        <TellMechanic items={t.tellMechanic} />
        <Related refs={t.related} />
        <Sources ids={t.sources} />
        <Disclaimer />
        <p className="text-center text-sm">
          <Link to={sec.path} className="inline-flex items-center gap-1 text-accent hover:underline">
            <Icon name="ArrowLeft" size={14} /> Всички: {sec.plural.toLowerCase()}
          </Link>
        </p>
      </div>
    </article>
  )
}

function Fact({ k, v, swatch, tone }: { k: string; v: string; swatch?: string; tone?: 'ok' }) {
  return (
    <div className={`rounded-xl border p-3 ${tone === 'ok' ? 'border-ok/30 bg-ok/[0.06]' : 'border-line bg-surface-2/60'}`}>
      <dt className="eyebrow !text-[0.6rem]">{k}</dt>
      <dd className="mt-1 flex items-start gap-2 text-[0.93rem] text-ink-2">
        {swatch && <span className="mt-0.5 h-5 w-5 shrink-0 rounded-md ring-1 ring-line-strong" style={{ background: swatch }} />}
        {v}
      </dd>
    </div>
  )
}

