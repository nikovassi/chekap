import { useEffect, useId, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loadIndex, search, type SearchHit } from '../lib/search'
import { sectionLabel, CATEGORIES } from '../lib/meta'
import type { CategoryId } from '../data/types'
import { Icon } from './Icon'
import { LightIcon } from './LightIcon'
import { UrgencyBadge, sectionIcon } from './ui'

const EXAMPLES = [
  'Светна ми лампата за маслото',
  'Колата тресе на празен ход',
  'От ауспуха излиза бял пушек',
  'Чува се тракане от двигателя',
  'Колата не пали',
  'Свети ABS',
]

export function SearchBox({
  size = 'lg',
  autoFocus = false,
  initial = '',
  onNavigate,
  placeholder = 'Например: колата ми тресе при ускорение',
}: {
  size?: 'lg' | 'md'
  autoFocus?: boolean
  initial?: string
  onNavigate?: () => void
  placeholder?: string
}) {
  const [q, setQ] = useState(initial)
  const [hits, setHits] = useState<SearchHit[]>([])
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const [ready, setReady] = useState(false)
  const nav = useNavigate()
  const listId = useId()
  const wrap = useRef<HTMLDivElement>(null)
  const input = useRef<HTMLInputElement>(null)

  // warm the index after first paint
  useEffect(() => {
    const t = setTimeout(() => loadIndex().then(() => setReady(true)), 600)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    let live = true
    if (!q.trim()) {
      setHits([])
      return
    }
    search(q, 7).then((r) => {
      if (live) {
        setHits(r)
        setActive(-1)
        setReady(true)
      }
    })
    return () => {
      live = false
    }
  }, [q])

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (wrap.current && !wrap.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  const go = (path: string) => {
    setOpen(false)
    onNavigate?.()
    nav(path)
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (active >= 0 && hits[active]) return go(hits[active].path)
    if (q.trim()) go(`/search?q=${encodeURIComponent(q.trim())}`)
  }

  const onKey = (e: React.KeyboardEvent) => {
    if (!open || !hits.length) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((a) => Math.min(a + 1, hits.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => Math.max(a - 1, -1))
    } else if (e.key === 'Escape') setOpen(false)
  }

  const big = size === 'lg'
  const showList = open && q.trim().length > 0

  return (
    <div ref={wrap} className="relative w-full">
      <form onSubmit={submit} role="search" className="relative">
        <label htmlFor={`${listId}-in`} className="sr-only">
          Опиши проблема си
        </label>
        <Icon name="Search" size={big ? 22 : 18} className={`pointer-events-none absolute top-1/2 z-10 -translate-y-1/2 text-muted ${big ? 'left-4' : 'left-3.5'}`} />
        <input
          id={`${listId}-in`}
          ref={input}
          value={q}
          autoFocus={autoFocus}
          onChange={(e) => {
            setQ(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKey}
          placeholder={placeholder}
          autoComplete="off"
          enterKeyHint="search"
          role="combobox"
          aria-expanded={showList}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
          className={`w-full rounded-2xl border border-line-strong bg-surface-2/90 text-ink shadow-[0_10px_40px_-20px_#000] backdrop-blur placeholder:text-muted focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15 ${
            big ? 'h-16 pl-12 pr-[6.5rem] text-[1.05rem] sm:h-[4.25rem] sm:pr-32 sm:text-lg' : 'h-12 pl-10 pr-20 text-base sm:pr-28'
          }`}
        />
        <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
          {q && (
            <button type="button" aria-label="Изчисти" onClick={() => { setQ(''); input.current?.focus() }} className="grid h-9 w-9 place-items-center rounded-lg text-muted hover:text-ink">
              <Icon name="X" size={18} />
            </button>
          )}
          <button type="submit" aria-label="Търси" className={`grid place-items-center rounded-xl bg-accent font-bold text-accent-ink hover:brightness-110 ${big ? 'h-12 w-12 sm:w-auto sm:px-4' : 'h-9 w-9 sm:w-auto sm:px-3 text-sm'}`}>
            <Icon name="ArrowRight" size={20} className="sm:hidden" />
            <span className="hidden sm:inline">Търси</span>
          </button>
        </div>
      </form>

      {showList && (
        <div className="absolute inset-x-0 top-full z-40 mt-2 max-h-[70vh] overflow-auto rounded-2xl border border-line-strong bg-surface shadow-2xl animate-fade-up">
          <ul id={listId} role="listbox" aria-label="Предложения">
            {hits.length === 0 && (
              <li className="px-4 py-5 text-sm text-muted">
                {ready ? 'Няма точно съвпадение. Опитай с други думи – напр. „тресе“, „свети лампа“, „мирише на изгоряло“.' : 'Търсене…'}
              </li>
            )}
            {hits.map((h, i) => (
              <li key={h.id} id={`${listId}-${i}`} role="option" aria-selected={active === i}>
                <Link
                  to={h.path}
                  onClick={() => { setOpen(false); onNavigate?.() }}
                  className={`flex gap-3 border-b border-line/60 px-3.5 py-3 last:border-0 hover:bg-surface-2 ${active === i ? 'bg-surface-2' : ''}`}
                >
                  <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#07090c] ring-1 ring-line">
                    {h.section === 'dashboard' && h.icon ? <LightIcon name={h.icon} color={h.colors?.[0]} size={28} /> : <Icon name={sectionIcon(h.section)} size={18} className="text-accent" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="eyebrow !text-[0.6rem]">
                        {sectionLabel(h.section)}
                        {h.category ? ` · ${CATEGORIES[h.category as CategoryId]?.label ?? ''}` : ''}
                      </span>
                      {h.urgency && <UrgencyBadge level={h.urgency} />}
                    </span>
                    <span className="mt-0.5 block font-semibold leading-snug text-ink">{h.title}</span>
                    {h.causes.length > 0 && <span className="mt-0.5 block truncate text-xs text-muted">Възможни причини: {h.causes.join(', ')}</span>}
                  </span>
                  <Icon name="ChevronRight" size={18} className="mt-3 shrink-0 text-muted" />
                </Link>
              </li>
            ))}
          </ul>
          {hits.length > 0 && (
            <button type="button" onClick={() => go(`/search?q=${encodeURIComponent(q.trim())}`)} className="w-full border-t border-line px-4 py-3 text-left text-sm font-semibold text-accent hover:bg-surface-2">
              Всички резултати за „{q.trim()}“ →
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export function SearchExamples({ onPick }: { onPick?: (q: string) => void }) {
  const nav = useNavigate()
  return (
    <div className="flex flex-wrap gap-2">
      {EXAMPLES.map((e) => (
        <button key={e} type="button" onClick={() => (onPick ? onPick(e) : nav(`/search?q=${encodeURIComponent(e)}`))} className="rounded-full border border-line px-3 py-1.5 text-xs text-muted transition hover:border-accent hover:text-ink">
          „{e}“
        </button>
      ))}
    </div>
  )
}
