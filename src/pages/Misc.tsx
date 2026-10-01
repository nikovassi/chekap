import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { search, type SearchHit } from '../lib/search'
import { useHead } from '../lib/head'
import { SOURCES } from '../data/sources'
import { SearchBox, SearchExamples } from '../components/SearchBox'
import { Icon } from '../components/Icon'
import { Crumbs, EmptyState, EntryCard, Loader, PageHeader } from '../components/ui'

export function SearchPage() {
  const loc = useLocation()
  // query is read after hydration (the page is prerendered without it)
  const [q, setQ] = useState<string | null>(null)
  const [hits, setHits] = useState<SearchHit[] | null>(null)
  useHead({ title: 'Търсене', description: 'Опиши проблема с колата с твои думи и намери възможните причини.', path: '/search', noindex: true })

  useEffect(() => {
    setQ(new URLSearchParams(loc.search).get('q') ?? '')
  }, [loc.search])

  useEffect(() => {
    if (q == null) return
    if (!q.trim()) return setHits([])
    setHits(null)
    search(q, 30).then(setHits)
  }, [q])

  return (
    <div className="mx-auto max-w-3xl">
      <Crumbs items={[{ name: 'Търсене' }]} />
      <PageHeader title={q ? `Резултати за „${q}“` : 'Какво се случва с колата?'} />
      <div className="mb-6">
        <SearchBox key={q ?? ''} size="md" initial={q ?? ''} />
        <div className="mt-3">
          <SearchExamples />
        </div>
      </div>
      {q == null || (q && hits == null) ? (
        <Loader />
      ) : !q ? (
        <EmptyState title="Опиши проблема с твои думи" text="Напр. „свети масльонката“, „тресе на празен ход“, „мирише на изгоряло“ или OBD код като P0300." />
      ) : hits && hits.length === 0 ? (
        <EmptyState title="Не намерихме точно съвпадение" text="Опитай с по-кратко описание или разгледай по тема.">
          <div className="flex flex-wrap justify-center gap-2">
            <Link to="/diagnose" className="btn btn-primary">Диагностика стъпка по стъпка</Link>
            <Link to="/dashboard" className="btn btn-ghost">Лампи на таблото</Link>
          </div>
        </EmptyState>
      ) : (
        <div className="space-y-2.5">
          <p className="text-sm text-muted" aria-live="polite">{hits!.length} резултата · най-подходящите са най-отгоре</p>
          {hits!.map((h) => (
            <div key={h.id}>
              <EntryCard e={h} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function SourcesPage() {
  useHead({ title: 'Източници и методология', description: 'Как подготвяме съдържанието на Чекап: проверени източници (AA, RAC, AAA, NHTSA, Consumer Reports, Bosch, NGK, Michelin, производители) и правила за безопасна информация.', path: '/sources' })
  const groups = SOURCES.reduce<Record<string, typeof SOURCES>>((acc, s) => {
    ;(acc[s.publisher.split(' (')[0]] ??= []).push(s)
    return acc
  }, {})
  return (
    <div className="mx-auto max-w-3xl">
      <Crumbs items={[{ name: 'Източници' }]} />
      <PageHeader eyebrow="Методология" title="Източници и методология" intro="Чекап е справочник, а не сервиз. Ето как подготвяме информацията." />
      <div className="space-y-4">
        <section className="card space-y-3 p-4 text-[0.97rem] text-ink-2 sm:p-6">
          <h2 className="text-lg font-bold text-ink">Принципи</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>Техническите твърдения са базирани на автомобилни организации (AA, RAC, AAA), регулатори (NHTSA, CARB, EPA), производители (ръководства на VW, Kia, Toyota, BMW, Ford), доставчици (Bosch, NGK, VARTA, Michelin, Continental) и технически издания.</li>
            <li>Форумите (напр. българските маркови клубове и Reddit) използваме само за да разберем как шофьорите описват проблемите си – за по-добро търсене. Не ги използваме като източник за технически твърдения и не копираме мнения.</li>
            <li>Не поставяме диагноза. Показваме възможни причини, как да ги различиш и какво проверява механикът. Разграничаваме симптом, възможна причина, диагностичен тест и потвърдена повреда.</li>
            <li>Спешността е контекстна – зависи от ситуацията, не само от цвета на лампата.</li>
            <li>Не даваме универсални интервали за обслужване. Общите ориентири са ясно обозначени – точните интервали са в ръководството на автомобила.</li>
          </ul>
        </section>
        <section className="card p-4 sm:p-6">
          <h2 className="mb-3 text-lg font-bold">Използвани източници ({SOURCES.length})</h2>
          <div className="space-y-4">
            {Object.entries(groups).map(([pub, list]) => (
              <div key={pub}>
                <p className="eyebrow mb-1.5">{pub}</p>
                <ul className="space-y-1 text-sm">
                  {list.map((s) => (
                    <li key={s.id}>
                      <a href={s.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-start gap-1.5 text-ink-2 hover:text-accent">
                        {s.title} <Icon name="ExternalLink" size={12} className="mt-1 shrink-0" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
        <p className="text-sm text-muted">Откри грешка? Отвори issue в <a className="text-accent underline" href="https://github.com/nikovassi/chekap/issues" target="_blank" rel="noopener noreferrer">GitHub</a>.</p>
      </div>
    </div>
  )
}
