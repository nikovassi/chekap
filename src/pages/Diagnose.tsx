import { Link, useParams } from 'react-router-dom'
import { useData } from '../data/load'
import { breadcrumbLd, useHead } from '../lib/head'
import { byIds } from '../lib/catalog'
import { Icon } from '../components/Icon'
import { FlowRunner } from '../components/FlowRunner'
import { Crumbs, Disclaimer, EntryCard, PageHeader } from '../components/ui'
import NotFound from './NotFound'

export function DiagnoseIndex() {
  const flows = useData('flows')
  useHead({
    title: 'Диагностика стъпка по стъпка – стесни възможните причини',
    description: 'Интерактивни диагностични въпроси: колата не пали, тресе, прегрява, лампа на таблото, шум, пушек, миризма, теч, електрика, гуми, спирачки.',
    path: '/diagnose',
  })
  return (
    <div>
      <Crumbs items={[{ name: 'Диагностика' }]} />
      <PageHeader eyebrow="Интерактивно" title="Диагностика стъпка по стъпка" intro="Отговори на няколко кратки въпроса и ще стесним възможните направления за проверка. Не поставяме окончателна диагноза – но ще знаеш какво да кажеш на механика." />
      <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {flows.map((f) => (
          <Link key={f.slug} to={`/diagnose/${f.slug}`} className="card card-hover group flex gap-3 p-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent">
              <Icon name={f.icon} size={21} />
            </span>
            <span>
              <span className="block font-bold group-hover:text-accent">{f.title}</span>
              <span className="mt-0.5 line-clamp-2 block text-sm text-muted">{f.intro}</span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}

export function DiagnosePage({ slugOverride }: { slugOverride?: string }) {
  const params = useParams()
  const slug = slugOverride ?? params.slug
  const flows = useData('flows')
  const f = flows.find((x) => x.slug === slug)
  const path = `/diagnose/${slug}`
  useHead({
    title: `${f?.title ?? 'Диагностика'} – диагностика стъпка по стъпка`,
    description: f?.intro ?? '',
    path,
    jsonLd: [breadcrumbLd([{ name: 'Начало', path: '/' }, { name: 'Диагностика', path: '/diagnose' }, { name: f?.title ?? '', path }])],
  })
  if (!f) return <NotFound />
  return (
    <div className="mx-auto max-w-3xl">
      <Crumbs items={[{ name: 'Диагностика', path: '/diagnose' }, { name: f.title }]} />
      <PageHeader eyebrow="Диагностика стъпка по стъпка" title={f.title} intro={f.intro} />
      <FlowRunner flow={f} />
      <div className="mt-8">
        <Disclaimer />
      </div>
    </div>
  )
}

/** SEO landing: "Колата не пали" */
export function NoStartPage() {
  const flows = useData('flows')
  const f = flows.find((x) => x.slug === 'no-start')
  useHead({
    title: 'Колата не пали – какво да проверя? Диагностика стъпка по стъпка',
    description: 'Колата не пали: стартерът не върти, само щрака или върти, но не хваща? Отговори на няколко въпроса и виж възможните причини – акумулатор, клеми, стартер, имобилайзер, гориво, подгревни свещи.',
    path: '/no-start',
    jsonLd: [breadcrumbLd([{ name: 'Начало', path: '/' }, { name: 'Колата не пали', path: '/no-start' }])],
  })
  if (!f) return <NotFound />
  return (
    <div className="mx-auto max-w-3xl">
      <Crumbs items={[{ name: 'Колата не пали' }]} />
      <PageHeader eyebrow="Диагностика" title="Колата не пали" intro="Най-важният въпрос е дали стартерът върти двигателя. Започни оттук – стъпка по стъпка ще стесним възможностите." />
      <FlowRunner flow={f} />
      <section className="mt-10">
        <h2 className="mb-3 text-lg font-bold">Подробни статии</h2>
        <div className="grid gap-2.5 sm:grid-cols-2">
          {byIds(['symptoms/no-start-no-crank', 'symptoms/no-start-cranks', 'symptoms/hard-start-cold', 'symptoms/starts-then-dies', 'symptoms/slow-crank', 'symptoms/battery-drains', 'noises/starter-clicking', 'dashboard/immobilizer']).map((e) => (
            <EntryCard key={e.id} e={e} compact />
          ))}
        </div>
      </section>
      <div className="mt-8">
        <Disclaimer />
      </div>
    </div>
  )
}
