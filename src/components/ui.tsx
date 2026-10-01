import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import type { Urgency, UrgencyContext } from '../data/types'
import { URGENCY, sectionLabel } from '../lib/meta'
import { byIds, type CatalogEntry } from '../lib/catalog'
import { SOURCE_MAP } from '../data/sources'
import { Icon } from './Icon'
import { LightIcon } from './LightIcon'

// ---------------- Urgency ----------------

export function UrgencyDot({ level, className = '' }: { level: Urgency; className?: string }) {
  return (
    <span
      className={`inline-block h-2.5 w-2.5 shrink-0 rounded-full ${level === 'stop' ? 'animate-pulse-soft' : ''} ${className}`}
      style={{ background: URGENCY[level].color, boxShadow: `0 0 10px ${URGENCY[level].color}` }}
      aria-hidden="true"
    />
  )
}

export function UrgencyBadge({ level, size = 'sm' }: { level: Urgency; size?: 'sm' | 'md' }) {
  const u = URGENCY[level]
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-extrabold tracking-wide ${size === 'md' ? 'px-3 py-1.5 text-xs' : 'px-2.5 py-1 text-[0.68rem]'}`}
      style={{ color: u.color, background: `color-mix(in srgb, ${u.color} 14%, transparent)`, border: `1px solid color-mix(in srgb, ${u.color} 35%, transparent)` }}
    >
      <UrgencyDot level={level} className="!h-2 !w-2" />
      {size === 'md' ? u.label : u.short.toUpperCase()}
    </span>
  )
}

export function UrgencyBanner({ level, note }: { level: Urgency; note?: string }) {
  const u = URGENCY[level]
  return (
    <div
      role={level === 'stop' ? 'alert' : undefined}
      className="relative overflow-hidden rounded-2xl p-4 sm:p-5"
      style={{ background: `linear-gradient(135deg, color-mix(in srgb, ${u.color} 20%, #11151b), #11151b 70%)`, border: `1px solid color-mix(in srgb, ${u.color} 45%, transparent)` }}
    >
      <div className="flex items-start gap-3">
        <span className="mt-1.5">
          <UrgencyDot level={level} className="!h-3.5 !w-3.5" />
        </span>
        <div>
          <p className="eyebrow !text-ink-2">Спешност · обичайно</p>
          <p className="font-display text-lg font-bold sm:text-xl" style={{ color: u.color }}>
            {u.label}
          </p>
          <p className="mt-0.5 text-sm text-ink-2">{note ?? u.text}</p>
        </div>
      </div>
    </div>
  )
}

export function UrgencyContextList({ items }: { items: UrgencyContext[] }) {
  if (!items?.length) return null
  return (
    <Block title="Колко спешно е – зависи от ситуацията" icon="AlertTriangle">
      <ul className="divide-y divide-line">
        {items.map((c, i) => (
          <li key={i} className="flex items-start justify-between gap-3 py-3 first:pt-0 last:pb-0">
            <span className="text-[0.95rem] text-ink-2">{c.when}</span>
            <UrgencyBadge level={c.level} />
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-muted">Спешността не се определя само по цвета. Значението може да се различава според марката, модела и конкретната ситуация.</p>
    </Block>
  )
}

// ---------------- Layout blocks ----------------

export function Block({ title, icon, children, tone, id }: { title: string; icon?: string; children: ReactNode; tone?: 'stop' | 'accent'; id?: string }) {
  const border = tone === 'stop' ? 'border-stop/40' : tone === 'accent' ? 'border-accent/40' : 'border-line'
  return (
    <section id={id} className={`card ${border} p-4 sm:p-6`}>
      <h2 className="mb-3 flex items-center gap-2 text-base font-bold sm:text-lg">
        {icon && <Icon name={icon} size={18} className={tone === 'stop' ? 'text-stop' : 'text-accent'} />}
        {title}
      </h2>
      {children}
    </section>
  )
}

export function BulletList({ items, icon = 'dot' }: { items: string[]; icon?: 'dot' | 'check' | 'stop' }) {
  if (!items?.length) return null
  return (
    <ul className="space-y-2.5">
      {items.map((t, i) => (
        <li key={i} className="flex gap-2.5 text-[0.95rem] leading-relaxed text-ink-2">
          {icon === 'check' ? (
            <Icon name="Check" size={18} className="mt-0.5 shrink-0 text-accent" />
          ) : icon === 'stop' ? (
            <Icon name="AlertTriangle" size={18} className="mt-0.5 shrink-0 text-stop" />
          ) : (
            <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent/70" />
          )}
          <span>{t}</span>
        </li>
      ))}
    </ul>
  )
}

/** The main UX block: "Какво да направиш сега" */
export function DoNow({ steps, title = 'Какво да направиш сега' }: { steps: string[]; title?: string }) {
  if (!steps?.length) return null
  return (
    <section className="relative overflow-hidden rounded-[1.4rem] border border-accent/40 bg-gradient-to-br from-accent/[0.12] via-surface to-surface p-4 shadow-[0_20px_60px_-30px_#3df5c8] sm:p-6" aria-labelledby="donow">
      <h2 id="donow" className="mb-4 flex items-center gap-2 text-lg font-bold sm:text-xl">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent text-accent-ink">
          <Icon name="Zap" size={18} />
        </span>
        {title}
      </h2>
      <ol className="space-y-3">
        {steps.map((s, i) => (
          <li key={i} className="flex gap-3">
            <span className="font-display grid h-7 w-7 shrink-0 place-items-center rounded-full border border-accent/50 text-sm font-bold text-accent">{i + 1}</span>
            <span className="pt-0.5 text-[1rem] leading-relaxed text-ink">{s}</span>
          </li>
        ))}
      </ol>
    </section>
  )
}

export function TellMechanic({ items }: { items: string[] }) {
  const [copied, setCopied] = useState(false)
  if (!items?.length) return null
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(items.map((t) => `• ${t}`).join('\n'))
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      /* clipboard not available */
    }
  }
  return (
    <Block title="Какво да кажеш на механика" icon="MessageSquareText">
      <p className="mb-3 text-sm text-muted">Запиши си тези неща – помагат за по-бърза и точна диагностика.</p>
      <BulletList items={items} icon="check" />
      <button type="button" onClick={copy} className="btn btn-ghost mt-4 w-full text-sm sm:w-auto">
        <Icon name={copied ? 'Check' : 'ClipboardCopy'} size={16} />
        {copied ? 'Копирано' : 'Копирай списъка'}
      </button>
    </Block>
  )
}

export function Causes({ causes }: { causes: { name: string; detail?: string; distinguish?: string }[] }) {
  const [open, setOpen] = useState<number | null>(0)
  if (!causes?.length) return null
  return (
    <Block title="Възможни причини" icon="Stethoscope">
      <p className="mb-3 text-sm text-muted">Подредени приблизително по честота. Това не е диагноза – необходима е проверка, за да се установи причината.</p>
      <ol className="space-y-2">
        {causes.map((c, i) => {
          const isOpen = open === i
          const has = !!(c.detail || c.distinguish)
          return (
            <li key={i} className="rounded-xl border border-line bg-surface-2/60">
              <button
                type="button"
                className="flex w-full items-center gap-3 px-3 py-3 text-left"
                aria-expanded={has ? isOpen : undefined}
                onClick={() => has && setOpen(isOpen ? null : i)}
              >
                <span className="font-display grid h-6 w-6 shrink-0 place-items-center rounded-md bg-surface-3 text-xs font-bold text-ink-2">{i + 1}</span>
                <span className="flex-1 font-semibold text-ink">{c.name}</span>
                {has && <Icon name="ChevronDown" size={18} className={`text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} />}
              </button>
              {has && isOpen && (
                <div className="animate-fade-up space-y-2 px-3 pb-3 pl-12 text-[0.93rem] text-ink-2">
                  {c.detail && <p>{c.detail}</p>}
                  {c.distinguish && (
                    <p className="rounded-lg border border-info/25 bg-info/[0.07] p-2.5 text-ink-2">
                      <span className="font-bold text-info">Как да го различиш: </span>
                      {c.distinguish}
                    </p>
                  )}
                </div>
              )}
            </li>
          )
        })}
      </ol>
    </Block>
  )
}

// ---------------- Cards & links ----------------

export function EntryCard({ e, compact = false }: { e: CatalogEntry; compact?: boolean }) {
  return (
    <Link to={e.path} className="card card-hover group flex min-w-0 items-start gap-3 p-3.5 sm:p-4">
      {e.section === 'dashboard' && e.icon ? (
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#07090c] ring-1 ring-line">
          <LightIcon name={e.icon} color={e.colors?.[0]} size={30} />
        </span>
      ) : e.colors?.[0] ? (
        <span className="h-11 w-11 shrink-0 rounded-xl ring-1 ring-line" style={{ background: `radial-gradient(circle at 35% 35%, ${e.colors[0]}, color-mix(in srgb, ${e.colors[0]} 50%, #000))` }} />
      ) : (
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-surface-3 text-accent ring-1 ring-line">
          <Icon name={e.icon ?? sectionIcon(e.section)} size={20} />
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="eyebrow !text-[0.62rem]">{sectionLabel(e.section)}</span>
          {e.urgency && <UrgencyDot level={e.urgency} className="!h-2 !w-2" />}
        </span>
        <span className="mt-0.5 block font-bold leading-snug text-ink group-hover:text-accent">{e.title}</span>
        {!compact && <span className="mt-1 line-clamp-2 block text-sm text-muted">{e.summary}</span>}
      </span>
    </Link>
  )
}

const SECTION_ICONS: Record<string, string> = {
  symptoms: 'Activity', noises: 'Volume2', smoke: 'Wind', smells: 'Sparkles', leaks: 'Droplets', obd: 'Cpu', guides: 'BookOpen', maintenance: 'Wrench', flow: 'Route', dashboard: 'Gauge',
}
export const sectionIcon = (s: string) => SECTION_ICONS[s] ?? 'CircleDot'

export function Related({ refs, title = 'Свързани проблеми' }: { refs: string[]; title?: string }) {
  const items = byIds(refs ?? [])
  if (!items.length) return null
  return (
    <section>
      <h2 className="mb-3 text-lg font-bold">{title}</h2>
      <div className="grid gap-2.5 sm:grid-cols-2">
        {items.map((e) => (
          <EntryCard key={e.id} e={e} compact />
        ))}
      </div>
    </section>
  )
}

export function Sources({ ids }: { ids: string[] }) {
  const items = (ids ?? []).map((i) => SOURCE_MAP[i]).filter(Boolean)
  if (!items.length) return null
  return (
    <section className="rounded-2xl border border-line p-4 sm:p-5">
      <h2 className="mb-2 flex items-center gap-2 text-sm font-bold text-ink-2">
        <Icon name="BookOpen" size={16} className="text-muted" /> Източници
      </h2>
      <ul className="space-y-1.5 text-sm">
        {items.map((s) => (
          <li key={s.id}>
            <a href={s.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-start gap-1.5 text-muted hover:text-accent">
              <span>
                <span className="font-semibold text-ink-2">{s.publisher}</span> – {s.title}
              </span>
              <Icon name="ExternalLink" size={13} className="mt-1 shrink-0" />
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-muted">
        Информацията е обобщена и преведена от посочените източници. <Link to="/sources" className="underline hover:text-accent">Методология</Link>
      </p>
    </section>
  )
}

export function Disclaimer() {
  return (
    <p className="flex gap-2 rounded-xl border border-line bg-surface/60 p-3 text-xs leading-relaxed text-muted">
      <Icon name="Info" size={16} className="mt-0.5 shrink-0" />
      Чекап е справочник, а не сервиз. Описаните причини са възможни, а не сигурна диагноза. При съмнение за опасност спри на безопасно място и потърси професионална помощ (112 при спешност).
    </p>
  )
}

export function Crumbs({ items }: { items: { name: string; path?: string }[] }) {
  return (
    <nav aria-label="Навигация" className="mb-4 overflow-x-auto scrollbar-none">
      <ol className="flex items-center gap-1.5 whitespace-nowrap text-xs text-muted">
        <li>
          <Link to="/" className="hover:text-accent">
            Начало
          </Link>
        </li>
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-1.5">
            <Icon name="ChevronRight" size={12} />
            {it.path ? (
              <Link to={it.path} className="hover:text-accent">
                {it.name}
              </Link>
            ) : (
              <span className="text-ink-2" aria-current="page">
                {it.name}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

export function PageHeader({ eyebrow, title, intro, children }: { eyebrow?: string; title: string; intro?: string; children?: ReactNode }) {
  return (
    <header className="mb-6 animate-fade-up">
      {eyebrow && <p className="eyebrow mb-2 !text-accent">{eyebrow}</p>}
      <h1 className="text-[1.65rem] font-bold sm:text-4xl">{title}</h1>
      {intro && <p className="mt-3 max-w-2xl text-[1.02rem] text-ink-2">{intro}</p>}
      {children}
    </header>
  )
}

export function Loader() {
  return (
    <div className="flex items-center justify-center gap-3 py-24 text-muted" role="status" aria-live="polite">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-line border-t-accent" />
      Зареждане…
    </div>
  )
}

export function EmptyState({ title, text, children }: { title: string; text?: string; children?: ReactNode }) {
  return (
    <div className="card flex flex-col items-center px-6 py-10 text-center">
      <span className="mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-surface-3 text-muted">
        <Icon name="Search" size={22} />
      </span>
      <p className="font-bold">{title}</p>
      {text && <p className="mt-1 max-w-md text-sm text-muted">{text}</p>}
      {children && <div className="mt-4">{children}</div>}
    </div>
  )
}

export function QuickAnswers({ items }: { items: { q: string; a: string; tone?: Urgency | 'ok' }[] }) {
  return (
    <div className="grid gap-2.5 sm:grid-cols-3">
      {items.map((it, i) => (
        <div key={i} className="card p-3.5">
          <p className="eyebrow !text-[0.62rem]">{it.q}</p>
          <p className="mt-1 text-[0.95rem] font-semibold leading-snug" style={{ color: it.tone && it.tone !== 'ok' ? URGENCY[it.tone].color : it.tone === 'ok' ? 'var(--color-ok)' : undefined }}>
            {it.a}
          </p>
        </div>
      ))}
    </div>
  )
}
