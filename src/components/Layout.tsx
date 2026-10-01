import { useEffect, useState, type ReactNode } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Logo } from './Logo'
import { Icon } from './Icon'
import { SearchBox } from './SearchBox'

const NAV = [
  { to: '/dashboard', label: 'Лампи' },
  { to: '/symptoms', label: 'Симптоми' },
  { to: '/noises', label: 'Шумове' },
  { to: '/obd', label: 'OBD2' },
  { to: '/diagnose', label: 'Диагностика' },
  { to: '/maintenance', label: 'Поддръжка' },
  { to: '/garage', label: 'Моят гараж' },
]

const MENU = [
  { to: '/dashboard', label: 'Лампи на таблото', icon: 'Gauge' },
  { to: '/check-engine', label: 'Check Engine', icon: 'Cog' },
  { to: '/obd', label: 'OBD2 кодове', icon: 'Cpu' },
  { to: '/symptoms', label: 'Симптоми', icon: 'Activity' },
  { to: '/noises', label: 'Шумове', icon: 'Volume2' },
  { to: '/smoke', label: 'Пушек', icon: 'Wind' },
  { to: '/smells', label: 'Миризми', icon: 'Sparkles' },
  { to: '/leaks', label: 'Течове', icon: 'Droplets' },
  { to: '/no-start', label: 'Не пали', icon: 'KeyRound' },
  { to: '/systems', label: 'Автомобилни системи', icon: 'BookOpen' },
  { to: '/diagnose', label: 'Диагностика стъпка по стъпка', icon: 'Route' },
  { to: '/maintenance', label: 'Поддръжка', icon: 'Wrench' },
  { to: '/checklist', label: 'Service checklist', icon: 'ClipboardCheck' },
  { to: '/garage', label: 'Моят гараж и напомняния', icon: 'Car' },
  { to: '/sources', label: 'Източници и методология', icon: 'Info' },
]

export function Layout({ children }: { children: ReactNode }) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const loc = useLocation()

  useEffect(() => {
    setSearchOpen(false)
    setMenuOpen(false)
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [loc.pathname])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSearchOpen(false)
        setMenuOpen(false)
      }
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement))) {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="flex min-h-dvh flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[100] focus:rounded-lg focus:bg-accent focus:px-3 focus:py-2 focus:text-accent-ink">
        Към съдържанието
      </a>
      <header className="sticky top-0 z-30 border-b border-line/70 bg-bg/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4">
          <Link to="/" aria-label="Чекап – начало" className="shrink-0">
            <Logo />
          </Link>
          <nav aria-label="Основна навигация" className="ml-6 hidden items-center gap-1 lg:flex">
            {NAV.map((n) => (
              <NavLink key={n.to} to={n.to} className={({ isActive }) => `rounded-lg px-3 py-2 text-sm font-semibold transition ${isActive ? 'bg-surface-2 text-ink' : 'text-muted hover:text-ink'}`}>
                {n.label}
              </NavLink>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-1.5">
            <button type="button" onClick={() => setSearchOpen(true)} className="flex h-10 items-center gap-2 rounded-xl border border-line bg-surface px-3 text-sm text-muted hover:border-line-strong hover:text-ink" aria-label="Търсене">
              <Icon name="Search" size={18} />
              <span className="hidden sm:inline">Търси симптом…</span>
              <kbd className="hidden rounded border border-line px-1.5 text-[0.65rem] md:inline">/</kbd>
            </button>
            <button type="button" onClick={() => setMenuOpen(true)} className="grid h-10 w-10 place-items-center rounded-xl border border-line bg-surface text-ink-2 hover:text-ink" aria-label="Меню" aria-expanded={menuOpen}>
              <Icon name="Menu" size={20} />
            </button>
          </div>
        </div>
      </header>

      <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-4 pb-28 pt-6 sm:pt-8 lg:pb-16">
        {children}
      </main>

      <footer className="border-t border-line/70 pb-24 lg:pb-0">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3">
            <Logo />
            <p className="text-sm text-muted">Разбери какво ти казва колата. Справочник за диагностика, поддръжка и чести проблеми – за обикновения шофьор.</p>
          </div>
          <FooterCol title="Диагностика" links={[['/dashboard', 'Лампи на таблото'], ['/check-engine', 'Check Engine'], ['/obd', 'OBD2 кодове'], ['/diagnose', 'Стъпка по стъпка'], ['/no-start', 'Колата не пали']]} />
          <FooterCol title="Симптоми" links={[['/symptoms', 'Всички симптоми'], ['/noises', 'Шумове'], ['/smoke', 'Пушек'], ['/smells', 'Миризми'], ['/leaks', 'Течове']]} />
          <FooterCol title="Поддръжка" links={[['/maintenance', 'Поддръжка'], ['/checklist', 'Service checklist'], ['/garage', 'Моят гараж'], ['/systems', 'Системи'], ['/sources', 'Източници']]} />
        </div>
        <div className="mx-auto max-w-6xl px-4 pb-8 text-xs text-muted">
          © {new Date().getFullYear()} Чекап. Справочник, а не сервиз – информацията не замества професионална диагностика. При опасност: 112.
        </div>
      </footer>

      {/* mobile bottom nav */}
      <nav aria-label="Бърза навигация" className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-bg/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden">
        <div className="mx-auto grid max-w-md grid-cols-5">
          <BottomLink to="/" icon="Home" label="Начало" />
          <BottomLink to="/dashboard" icon="Gauge" label="Лампи" />
          <button type="button" onClick={() => setSearchOpen(true)} className="flex flex-col items-center justify-center gap-0.5 py-2 text-[0.68rem] font-semibold text-muted" aria-label="Търсене">
            <span className="-mt-6 grid h-12 w-12 place-items-center rounded-2xl bg-accent text-accent-ink shadow-[0_8px_30px_-6px_#3df5c8]">
              <Icon name="Search" size={22} />
            </span>
            Търси
          </button>
          <BottomLink to="/diagnose" icon="Stethoscope" label="Диагноза" />
          <BottomLink to="/garage" icon="Car" label="Гараж" />
        </div>
      </nav>

      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" onClick={() => setSearchOpen(false)} role="dialog" aria-modal="true" aria-label="Търсене">
          <div className="mx-auto mt-3 max-w-2xl px-3 sm:mt-20 animate-fade-up" onClick={(e) => e.stopPropagation()}>
            <div className="mb-2 flex items-center justify-between px-1">
              <p className="eyebrow">Опиши проблема с твои думи</p>
              <button type="button" onClick={() => setSearchOpen(false)} className="grid h-9 w-9 place-items-center rounded-lg text-muted hover:text-ink" aria-label="Затвори">
                <Icon name="X" size={20} />
              </button>
            </div>
            <SearchBox size="md" autoFocus onNavigate={() => setSearchOpen(false)} placeholder="Например: светна ми лампата за маслото" />
          </div>
        </div>
      )}

      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" onClick={() => setMenuOpen(false)} role="dialog" aria-modal="true" aria-label="Меню">
          <div className="absolute inset-y-0 right-0 w-[min(88vw,360px)] overflow-y-auto border-l border-line bg-surface p-4 animate-fade-up" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <Logo size={28} />
              <button type="button" onClick={() => setMenuOpen(false)} className="grid h-10 w-10 place-items-center rounded-lg text-muted hover:text-ink" aria-label="Затвори менюто">
                <Icon name="X" size={20} />
              </button>
            </div>
            <ul className="space-y-1">
              {MENU.map((m) => (
                <li key={m.to}>
                  <NavLink to={m.to} className={({ isActive }) => `flex min-h-12 items-center gap-3 rounded-xl px-3 text-[0.95rem] font-semibold ${isActive ? 'bg-surface-3 text-ink' : 'text-ink-2 hover:bg-surface-2'}`}>
                    <Icon name={m.icon} size={18} className="text-accent" />
                    {m.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

function BottomLink({ to, icon, label }: { to: string; icon: string; label: string }) {
  return (
    <NavLink to={to} end={to === '/'} className={({ isActive }) => `flex flex-col items-center justify-center gap-1 py-2.5 text-[0.68rem] font-semibold ${isActive ? 'text-accent' : 'text-muted'}`}>
      <Icon name={icon} size={21} />
      {label}
    </NavLink>
  )
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <p className="eyebrow mb-3">{title}</p>
      <ul className="space-y-2 text-sm">
        {links.map(([to, l]) => (
          <li key={to}>
            <Link to={to} className="text-ink-2 hover:text-accent">
              {l}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
