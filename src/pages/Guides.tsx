import { Link, useParams } from 'react-router-dom'
import type { CategoryId, Guide, GuideSection } from '../data/types'
import { useData } from '../data/load'
import { CATEGORIES, URGENCY } from '../lib/meta'
import { CATALOG } from '../lib/catalog'
import { breadcrumbLd, useHead } from '../lib/head'
import { Icon } from '../components/Icon'
import { Block, BulletList, Crumbs, Disclaimer, DoNow, EntryCard, PageHeader, Related, Sources } from '../components/ui'
import { CodeLookup, CodeTriad } from './Obd'
import NotFound from './NotFound'

function SectionView({ s }: { s: GuideSection }) {
  const toneColor = s.callout ? (s.callout.tone === 'tip' ? 'var(--color-accent)' : URGENCY[s.callout.tone].color) : ''
  return (
    <section className="card p-4 sm:p-6">
      <h2 className="mb-3 text-lg font-bold sm:text-xl">{s.heading}</h2>
      <div className="prose-c space-y-3 text-[0.98rem] leading-relaxed text-ink-2">
        {s.body?.map((p, i) => <p key={i}>{p}</p>)}
      </div>
      {s.bullets && (
        <div className="mt-3">
          <BulletList items={s.bullets} />
        </div>
      )}
      {s.table && (
        <div className="mt-4 overflow-x-auto rounded-xl border border-line">
          <table className="w-full min-w-[420px] text-left text-sm">
            <thead className="bg-surface-3 text-ink">
              <tr>{s.table.head.map((h) => <th key={h} scope="col" className="px-3 py-2.5 font-bold">{h}</th>)}</tr>
            </thead>
            <tbody>
              {s.table.rows.map((r, i) => (
                <tr key={i} className="border-t border-line align-top">
                  {r.map((c, j) => <td key={j} className={`px-3 py-2.5 ${j === 0 ? 'font-semibold text-ink' : 'text-ink-2'}`}>{c}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {s.callout && (
        <p className="mt-4 rounded-xl p-3 text-sm font-semibold" style={{ color: toneColor, background: `color-mix(in srgb, ${toneColor} 10%, transparent)`, border: `1px solid color-mix(in srgb, ${toneColor} 35%, transparent)` }}>
          {s.callout.text}
        </p>
      )}
    </section>
  )
}

export function GuideView({ g, path }: { g: Guide; path: string }) {
  useHead({
    title: g.seoTitle ?? g.title,
    description: g.summary.slice(0, 300),
    path,
    jsonLd: [
      breadcrumbLd([{ name: 'Начало', path: '/' }, { name: 'Системи', path: '/systems' }, { name: g.title, path }]),
      { '@context': 'https://schema.org', '@type': 'Article', headline: g.title, inLanguage: 'bg', description: g.summary },
    ],
  })
  const isCel = g.slug === 'check-engine'
  return (
    <article className="mx-auto max-w-3xl">
      <Crumbs items={[{ name: 'Системи', path: '/systems' }, { name: g.title }]} />
      <PageHeader eyebrow={`Наръчник · ${CATEGORIES[g.category]?.label ?? ''}`} title={g.title} intro={g.summary} />
      <nav aria-label="Съдържание" className="mb-5 card p-4">
        <p className="eyebrow mb-2">Съдържание</p>
        <ol className="grid gap-1 text-sm sm:grid-cols-2">
          {g.sections.map((s, i) => (
            <li key={i}>
              <a href={`#s${i}`} className="text-ink-2 hover:text-accent">
                {i + 1}. {s.heading}
              </a>
            </li>
          ))}
        </ol>
      </nav>
      <div className="space-y-4">
        {g.doNow && <DoNow steps={g.doNow} />}
        {isCel && (
          <>
            <CodeLookup />
            <CodeTriad />
          </>
        )}
        {g.sections.map((s, i) => (
          <div key={i} id={`s${i}`} className="scroll-mt-24">
            <SectionView s={s} />
          </div>
        ))}
        <Related refs={g.related} title="Свързани теми" />
        <Sources ids={g.sources} />
        <Disclaimer />
      </div>
    </article>
  )
}

export function GuidePage() {
  const { slug } = useParams()
  const guides = useData('guides')
  const g = guides.find((x) => x.slug === slug)
  if (!g) return <NotFound />
  return <GuideView g={g} path={slug === 'check-engine' ? '/check-engine' : `/guides/${slug}`} />
}

export function CheckEnginePage() {
  const guides = useData('guides')
  const g = guides.find((x) => x.slug === 'check-engine')
  if (!g) return <NotFound />
  return <GuideView g={g} path="/check-engine" />
}

const ORDER: CategoryId[] = ['engine', 'cooling', 'oil', 'fuel', 'electrical', 'brakes', 'tires', 'suspension', 'transmission', 'climate', 'lights', 'exhaust', 'safety', 'ev']

export function SystemsIndex() {
  useHead({
    title: 'Автомобилни системи – двигател, охлаждане, масло, спирачки, гуми',
    description: 'Наръчници по системи: двигателно масло, охлаждане и прегряване, акумулатор и електрика, спирачки, гуми, окачване, скоростна кутия, климатик, осветление, DPF/EGR/AdBlue, газова уредба.',
    path: '/systems',
  })
  return (
    <div>
      <Crumbs items={[{ name: 'Системи' }]} />
      <PageHeader eyebrow="Наръчници" title="Автомобилни системи" intro="Как работи всяка система, какви са честите проблеми и как да ги разпознаеш." />
      <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {ORDER.map((c) => {
          const n = CATALOG.filter((e) => e.category === c && e.section !== 'guides').length
          return (
            <Link key={c} to={`/systems/${c}`} className="card card-hover group flex gap-3 p-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent">
                <Icon name={CATEGORIES[c].icon} size={21} />
              </span>
              <span>
                <span className="block font-bold group-hover:text-accent">{CATEGORIES[c].label}</span>
                <span className="mt-0.5 block text-sm text-muted">{CATEGORIES[c].blurb}</span>
                <span className="mt-1.5 block text-xs text-ink-2/70">{n} теми</span>
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export function SystemPage() {
  const { category } = useParams()
  const c = CATEGORIES[category as CategoryId]
  const path = `/systems/${category}`
  useHead({ title: `${c?.label ?? 'Система'} – проблеми, симптоми и наръчник`, description: `${c?.label}: ${c?.blurb} Симптоми, шумове, лампи и какво да направиш.`, path })
  if (!c) return <NotFound />
  const guide = c.guide ? CATALOG.find((e) => e.id === `guides/${c.guide}`) : undefined
  const items = CATALOG.filter((e) => e.category === category && e.section !== 'guides')
  const groups = ['symptoms', 'noises', 'smoke', 'smells', 'leaks'] as const
  const LABELS = { symptoms: 'Симптоми', noises: 'Шумове', smoke: 'Пушек', smells: 'Миризми', leaks: 'Течове' }
  return (
    <div>
      <Crumbs items={[{ name: 'Системи', path: '/systems' }, { name: c.label }]} />
      <PageHeader eyebrow="Система" title={c.label} intro={c.blurb} />
      {guide && (
        <Link to={guide.path} className="card card-hover mb-6 flex items-center gap-4 border-accent/40 p-4 sm:p-5">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-accent text-accent-ink">
            <Icon name="BookOpen" size={22} />
          </span>
          <span className="flex-1">
            <span className="eyebrow !text-accent">Пълен наръчник</span>
            <span className="block font-bold">{guide.title}</span>
            <span className="block text-sm text-muted">{guide.summary}</span>
          </span>
          <Icon name="ChevronRight" className="text-muted" />
        </Link>
      )}
      <div className="space-y-8">
        {groups.map((g) => {
          const list = items.filter((i) => i.section === g)
          if (!list.length) return null
          return (
            <section key={g}>
              <h2 className="mb-3 text-lg font-bold">{LABELS[g]}</h2>
              <div className="grid gap-2.5 sm:grid-cols-2">
                {list.map((e) => <EntryCard key={e.id} e={e} />)}
              </div>
            </section>
          )
        })}
        {items.length === 0 && (
          <Block title="Свързани лампи" icon="Gauge">
            <p className="text-ink-2">
              Виж <Link to="/dashboard" className="text-accent underline">лампите на таблото</Link> за предупреждения от тази система.
            </p>
          </Block>
        )}
      </div>
      <div className="mt-8">
        <Disclaimer />
      </div>
    </div>
  )
}
