import { Link, useParams } from 'react-router-dom'
import type { MaintenanceGroup } from '../data/types'
import { useData } from '../data/load'
import { breadcrumbLd, useHead } from '../lib/head'
import { Icon } from '../components/Icon'
import { Block, Crumbs, Disclaimer, PageHeader, Sources } from '../components/ui'
import NotFound from './NotFound'

export function MaintenanceIndex() {
  const { groups } = useData('maintenance')
  useHead({
    title: 'Поддръжка на автомобила – ежедневни, сезонни и годишни проверки',
    description: 'Какво да проверяваш ежедневно, седмично и месечно, как да подготвиш колата за зима, лято и дълъг път, смяна на масло и обслужване според километри и възраст.',
    path: '/maintenance',
    jsonLd: [breadcrumbLd([{ name: 'Начало', path: '/' }, { name: 'Поддръжка', path: '/maintenance' }])],
  })
  return (
    <div>
      <Crumbs items={[{ name: 'Поддръжка' }]} />
      <PageHeader eyebrow="Поддръжка на автомобила" title="Поддръжка" intro="Редовните проверки предотвратяват повечето аварии на пътя. Интервалите за обслужване са различни за всеки автомобил – следвай интервала в ръководството на конкретния автомобил." />
      <div className="mb-6 grid gap-2.5 sm:grid-cols-2">
        <Link to="/checklist" className="card card-hover flex items-center gap-4 border-accent/40 p-4">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-accent text-accent-ink"><Icon name="ClipboardCheck" size={22} /></span>
          <span className="flex-1"><b className="block">Service checklist</b><span className="text-sm text-muted">Избери кола и километри – виж какво да провериш.</span></span>
          <Icon name="ChevronRight" className="text-muted" />
        </Link>
        <Link to="/garage" className="card card-hover flex items-center gap-4 p-4">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-surface-3 text-accent"><Icon name="Bell" size={22} /></span>
          <span className="flex-1"><b className="block">Моят гараж и напомняния</b><span className="text-sm text-muted">Масло, ГТП, застраховка, гуми…</span></span>
          <Icon name="ChevronRight" className="text-muted" />
        </Link>
      </div>
      <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((g) => (
          <Link key={g.slug} to={`/maintenance/${g.slug}`} className="card card-hover group flex gap-3 p-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent"><Icon name={g.icon} size={21} /></span>
            <span>
              <span className="block font-bold group-hover:text-accent">{g.title}</span>
              <span className="mt-0.5 line-clamp-2 block text-sm text-muted">{g.summary}</span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}

export function MaintenancePage() {
  const { slug } = useParams()
  const { groups } = useData('maintenance')
  const g = groups.find((x) => x.slug === slug)
  if (!g) return <NotFound />
  return <MaintenanceView g={g} others={groups.filter((x) => x.slug !== g.slug)} />
}

function MaintenanceView({ g, others }: { g: MaintenanceGroup; others: MaintenanceGroup[] }) {
  const path = `/maintenance/${g.slug}`
  useHead({
    title: `${g.title} – поддръжка на автомобила`,
    description: `${g.summary} Списък с проверки за шофьора и обща информация за поддръжката.`.slice(0, 300),
    path,
    jsonLd: [breadcrumbLd([{ name: 'Начало', path: '/' }, { name: 'Поддръжка', path: '/maintenance' }, { name: g.title, path }])],
  })
  return (
    <article className="mx-auto max-w-3xl">
      <Crumbs items={[{ name: 'Поддръжка', path: '/maintenance' }, { name: g.title }]} />
      <PageHeader eyebrow="Поддръжка" title={g.title} intro={g.summary} />
      <div className="space-y-4">
        <Block title="Какво да провериш" icon="ClipboardCheck">
          <ol className="space-y-3">
            {g.items.map((it, i) => (
              <li key={i} className="flex gap-3 rounded-xl border border-line bg-surface-2/60 p-3">
                <span className="font-display grid h-7 w-7 shrink-0 place-items-center rounded-full border border-accent/50 text-xs font-bold text-accent">{i + 1}</span>
                <span>
                  <span className="block font-semibold text-ink">{it.name}</span>
                  <span className="mt-0.5 block text-[0.93rem] text-ink-2">{it.detail}</span>
                </span>
              </li>
            ))}
          </ol>
        </Block>
        <p className="flex gap-2 rounded-xl border border-info/30 bg-info/[0.07] p-3.5 text-sm text-ink-2">
          <Icon name="Info" size={18} className="mt-0.5 shrink-0 text-info" />
          <span>{g.note ?? 'Следвай интервала в ръководството на конкретния автомобил. Посочените ориентири са обща информация.'}</span>
        </p>
        <Sources ids={g.sources} />
        <section>
          <h2 className="mb-3 text-lg font-bold">Още за поддръжката</h2>
          <div className="flex flex-wrap gap-2">
            {others.map((o) => (
              <Link key={o.slug} to={`/maintenance/${o.slug}`} className="chip">{o.title}</Link>
            ))}
          </div>
        </section>
        <Disclaimer />
      </div>
    </article>
  )
}
