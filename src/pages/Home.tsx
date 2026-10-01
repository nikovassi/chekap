import { Suspense, useState } from 'react'
import { Link } from 'react-router-dom'
import { SearchBox, SearchExamples } from '../components/SearchBox'
import { Icon } from '../components/Icon'
import { LightIcon } from '../components/LightIcon'
import { EntryCard, Loader, UrgencyDot } from '../components/ui'
import { FlowRunner } from '../components/FlowRunner'
import { QUICK, SITE } from '../lib/meta'
import { byIds, getRef } from '../lib/catalog'
import { useHead } from '../lib/head'
import { prefetchData, useData } from '../data/load'

const WIZARD = [
  { slug: 'warning-light', label: 'Лампа', icon: 'AlertTriangle', tone: '#ff3b30' },
  { slug: 'noise', label: 'Шум', icon: 'Volume2', tone: '#4da3ff' },
  { slug: 'smoke', label: 'Пушек', icon: 'Wind', tone: '#c3cbd6' },
  { slug: 'smell', label: 'Миризма', icon: 'Sparkles', tone: '#c084fc' },
  { slug: 'leak', label: 'Теч', icon: 'Droplets', tone: '#38bdf8' },
  { slug: 'no-start', label: 'Не пали', icon: 'KeyRound', tone: '#3df5c8' },
  { slug: 'overheating', label: 'Прегрява', icon: 'Thermometer', tone: '#ff9f1c' },
  { slug: 'electrical', label: 'Електрически проблем', icon: 'Zap', tone: '#ffd23f' },
  { slug: 'tires', label: 'Проблем с гуми', icon: 'CircleDot', tone: '#8a95a6' },
  { slug: 'brakes', label: 'Проблем със спирачки', icon: 'Disc', tone: '#ff4d4f' },
]

const SECTIONS = [
  { to: '/dashboard', label: 'Лампи на таблото', icon: 'Gauge', text: '54 символа – значение и спешност' },
  { to: '/noises', label: 'Шумове', icon: 'Volume2', text: 'Чукане, тракане, свистене, бучене' },
  { to: '/smoke', label: 'Пушек', icon: 'Wind', text: 'Бял, син, черен, сив – какво значи' },
  { to: '/smells', label: 'Миризми', icon: 'Sparkles', text: 'Бензин, газ, изгоряло, антифриз' },
  { to: '/leaks', label: 'Течове', icon: 'Droplets', text: 'Разпознай течността по цвета' },
  { to: '/no-start', label: 'Не пали', icon: 'KeyRound', text: 'Стъпка по стъпка до причината' },
  { to: '/maintenance', label: 'Поддръжка', icon: 'Wrench', text: 'Проверки, сезонна подготовка' },
  { to: '/obd', label: 'OBD2 кодове', icon: 'Cpu', text: 'Търси по код: P0300, P0420…' },
  { to: '/systems', label: 'Автомобилни системи', icon: 'BookOpen', text: 'Масло, охлаждане, спирачки, гуми' },
]

const TOP_PROBLEMS = [
  'symptoms/engine-shaking-idle', 'symptoms/no-start-cranks', 'symptoms/overheating', 'symptoms/battery-drains',
  'smoke/white-smoke', 'symptoms/loss-of-power', 'symptoms/brake-vibration', 'symptoms/clutch-slipping',
]
const TOP_LIGHTS = ['dashboard/check-engine', 'dashboard/oil-pressure', 'dashboard/battery', 'dashboard/engine-temperature', 'dashboard/abs', 'dashboard/airbag', 'dashboard/tpms', 'dashboard/glow-plug', 'dashboard/dpf', 'dashboard/esp', 'dashboard/brake-system', 'dashboard/epc']
const TOP_NOISES = ['noises/engine-ticking', 'noises/engine-knocking', 'noises/belt-squeal', 'noises/clunk-over-bumps', 'noises/wheel-bearing-hum', 'noises/cv-joint-clicking']
const CHECKS = ['maintenance/weekly', 'maintenance/before-trip', 'maintenance/before-winter', 'maintenance/oil-change', 'guides/engine-oil', 'guides/tires']

function Wizard() {
  const [sel, setSel] = useState<string | null>(null)
  return (
    <section aria-labelledby="wiz" className="card relative overflow-hidden p-4 sm:p-7">
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
      <p className="eyebrow mb-2 !text-accent">Кажи ми какво се случва</p>
      <h2 id="wiz" className="text-2xl font-bold sm:text-3xl">
        Какво прави колата?
      </h2>
      <p className="mt-2 text-ink-2">Избери какво забелязваш. Ще ти зададем няколко кратки въпроса и ще стесним възможните причини.</p>
      <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-5">
        {WIZARD.map((w) => (
          <button
            key={w.slug}
            type="button"
            aria-pressed={sel === w.slug}
            onMouseEnter={() => prefetchData('flows')}
            onFocus={() => prefetchData('flows')}
            onClick={() => setSel(sel === w.slug ? null : w.slug)}
            className={`flex min-h-[5.25rem] flex-col items-start justify-between gap-2 rounded-2xl border p-3 text-left transition active:scale-[0.98] ${
              sel === w.slug ? 'border-accent bg-accent/10' : 'border-line bg-surface-2/70 hover:border-line-strong'
            }`}
          >
            <span className="grid h-9 w-9 place-items-center rounded-xl" style={{ background: `${w.tone}22`, color: w.tone }}>
              <Icon name={w.icon} size={19} />
            </span>
            <span className="text-[0.92rem] font-bold leading-tight">{w.label}</span>
          </button>
        ))}
      </div>
      {sel && (
        <div className="mt-6 border-t border-line pt-6">
          <Suspense fallback={<Loader />}>
            <WizardFlow slug={sel} />
          </Suspense>
        </div>
      )}
    </section>
  )
}

function WizardFlow({ slug }: { slug: string }) {
  const flows = useData('flows')
  const flow = flows.find((f) => f.slug === slug)
  if (!flow) return null
  return (
    <div>
      <p className="mb-1 font-display text-lg font-bold">{flow.title}</p>
      <p className="mb-4 text-sm text-muted">{flow.intro}</p>
      <FlowRunner flow={flow} compact />
    </div>
  )
}

function ListBlock({ title, ids, to, linkLabel }: { title: string; ids: string[]; to: string; linkLabel: string }) {
  return (
    <section>
      <div className="mb-3 flex items-end justify-between gap-3">
        <h2 className="text-xl font-bold">{title}</h2>
        <Link to={to} className="shrink-0 text-sm font-semibold text-accent hover:underline">
          {linkLabel} →
        </Link>
      </div>
      <div className="grid gap-2.5 sm:grid-cols-2">
        {byIds(ids).map((e) => (
          <EntryCard key={e.id} e={e} compact />
        ))}
      </div>
    </section>
  )
}

export default function Home() {
  useHead({
    title: 'Чекап – какво не е наред с колата ти? Лампи, шумове, пушек, OBD2',
    description: SITE.description,
    path: '/',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Чекап',
        url: SITE.url + '/',
        inLanguage: 'bg',
        potentialAction: { '@type': 'SearchAction', target: `${SITE.url}/search?q={search_term_string}`, 'query-input': 'required name=search_term_string' },
      },
    ],
  })

  return (
    <div className="space-y-14 sm:space-y-20">
      {/* HERO */}
      <section className="relative pt-2 sm:pt-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow mb-4 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 !text-ink-2">
            <UrgencyDot level="info" className="!h-2 !w-2" /> Справочник за шофьори · на български
          </p>
          <h1 className="animate-fade-up text-[2.1rem] font-bold leading-[1.08] sm:text-6xl">
            Какво не е наред <br className="hidden sm:block" />
            с <span className="bg-gradient-to-r from-accent to-info bg-clip-text text-transparent">колата ти?</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[1.05rem] text-ink-2 sm:text-lg">Опиши симптома и намери какво означава, колко е сериозно и какво да направиш сега.</p>
        </div>
        <div className="relative z-20 mx-auto mt-7 max-w-2xl">
          <SearchBox size="lg" placeholder="Например: светна ми лампата за маслото…" />
          <div className="mt-3 hidden justify-center sm:flex">
            <SearchExamples />
          </div>
        </div>
        <div className="mx-auto mt-6 max-w-4xl">
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-none sm:mx-0 sm:flex-wrap sm:justify-center sm:px-0">
            {QUICK.map((q) => (
              <Link key={q.label} to={q.to} className="chip">
                <Icon name={q.icon} size={15} className="text-accent" />
                {q.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Wizard />

      {/* SECTIONS */}
      <section aria-labelledby="sec">
        <h2 id="sec" className="mb-4 text-xl font-bold sm:text-2xl">
          Разгледай по тема
        </h2>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {SECTIONS.map((s) => (
            <Link key={s.to} to={s.to} className="card card-hover group p-4">
              <span className="mb-3 grid h-10 w-10 place-items-center rounded-xl bg-accent/10 text-accent">
                <Icon name={s.icon} size={20} />
              </span>
              <span className="block font-bold group-hover:text-accent">{s.label}</span>
              <span className="mt-1 block text-xs text-muted sm:text-sm">{s.text}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* LIGHTS */}
      <section>
        <div className="mb-3 flex items-end justify-between gap-3">
          <h2 className="text-xl font-bold">Най-търсени лампи</h2>
          <Link to="/dashboard" className="text-sm font-semibold text-accent hover:underline">
            Всички лампи →
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-6">
          {TOP_LIGHTS.map((id) => {
            const e = getRef(id)
            if (!e) return null
            return (
              <Link key={id} to={e.path} className="card card-hover group flex flex-col items-center gap-2 p-3 text-center">
                <span className="grid h-16 w-16 place-items-center rounded-2xl bg-[#07090c] ring-1 ring-line">
                  <LightIcon name={e.icon!} color={e.colors?.[0]} size={40} />
                </span>
                <span className="text-xs font-semibold leading-tight text-ink-2 group-hover:text-ink">{e.title.split(' (')[0]}</span>
              </Link>
            )
          })}
        </div>
      </section>

      <div className="grid gap-12 lg:grid-cols-2">
        <ListBlock title="Най-търсени проблеми" ids={TOP_PROBLEMS} to="/symptoms" linkLabel="Всички симптоми" />
        <ListBlock title="Популярни шумове" ids={TOP_NOISES} to="/noises" linkLabel="Всички шумове" />
      </div>

      <ListBlock title="Най-важни проверки" ids={CHECKS} to="/maintenance" linkLabel="Поддръжка" />

      {/* trust */}
      <section className="card grid gap-6 p-5 sm:grid-cols-3 sm:p-7">
        {[
          ['ShieldAlert', 'Спешност според контекста', 'Не съдим само по цвета: една лампа може да значи различни неща при различни ситуации.'],
          ['BookOpen', 'Проверени източници', 'AA, RAC, AAA, NHTSA, Consumer Reports, Bosch, NGK, Michelin, ръководства на производители.'],
          ['Stethoscope', 'Не поставяме диагноза', 'Показваме възможни причини и как да ги различиш. Потвърждава се с проверка.'],
        ].map(([i, t, d]) => (
          <div key={t} className="flex gap-3">
            <Icon name={i} size={22} className="mt-0.5 shrink-0 text-accent" />
            <div>
              <p className="font-bold">{t}</p>
              <p className="mt-1 text-sm text-muted">{d}</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}
