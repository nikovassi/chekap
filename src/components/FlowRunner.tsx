import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Flow } from '../data/types'
import { Icon } from './Icon'
import { BulletList, DoNow, Related, TellMechanic, UrgencyBanner } from './ui'

/** Interactive diagnostic flow: short questions → narrowed directions (never a final diagnosis). */
export function FlowRunner({ flow, compact = false }: { flow: Flow; compact?: boolean }) {
  const [path, setPath] = useState<string[]>([flow.start])
  const [answers, setAnswers] = useState<string[]>([])
  const top = useRef<HTMLDivElement>(null)
  const first = useRef(true)

  useEffect(() => {
    setPath([flow.start])
    setAnswers([])
  }, [flow.slug, flow.start])

  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    top.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [path.length])

  const node = flow.nodes[path[path.length - 1]]
  const step = path.length
  const choose = (next: string, label: string) => {
    setPath((p) => [...p, next])
    setAnswers((a) => [...a, label])
  }
  const back = () => {
    setPath((p) => (p.length > 1 ? p.slice(0, -1) : p))
    setAnswers((a) => a.slice(0, -1))
  }
  const reset = () => {
    setPath([flow.start])
    setAnswers([])
  }

  if (!node) return null

  return (
    <div ref={top} className="scroll-mt-24 space-y-4">
      {answers.length > 0 && (
        <ol className="flex flex-wrap gap-1.5" aria-label="Твоите отговори">
          {answers.map((a, i) => (
            <li key={i} className="rounded-full border border-line bg-surface-2 px-2.5 py-1 text-xs text-ink-2">
              {flow.nodes[path[i]]?.question ? <span className="text-muted">{i + 1}. </span> : null}
              {a}
            </li>
          ))}
        </ol>
      )}

      {node.question && node.options && (
        <div key={node.id} className="card animate-fade-up p-4 sm:p-6">
          <p className="eyebrow mb-2">Въпрос {step}</p>
          <h3 className="text-xl font-bold leading-snug sm:text-2xl">{node.question}</h3>
          {node.hint && <p className="mt-2 text-sm text-muted">{node.hint}</p>}
          <div className={`mt-5 grid gap-2.5 ${node.options.length > 2 ? 'sm:grid-cols-2' : 'grid-cols-2'}`}>
            {node.options.map((o) => (
              <button key={o.label} type="button" onClick={() => choose(o.next, o.label)} className="min-h-14 rounded-2xl border border-line-strong bg-surface-2 px-4 py-3 text-left text-[1rem] font-bold text-ink transition hover:border-accent hover:bg-accent/10 active:scale-[0.99]">
                {o.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {node.result && (
        <div key={node.id} className="animate-fade-up space-y-4">
          <div className="card p-4 sm:p-6">
            <p className="eyebrow mb-1 !text-accent">Резултат</p>
            <h3 className="text-xl font-bold sm:text-2xl">{node.result.title}</h3>
            <div className="mt-4">
              <UrgencyBanner level={node.result.urgency} />
            </div>
            <h4 className="mb-3 mt-5 font-bold">Най-вероятни направления за проверка</h4>
            <BulletList items={node.result.directions} />
            <p className="mt-4 text-xs text-muted">Това стеснява възможностите, но не е окончателна диагноза. Потвърждава се с проверка.</p>
          </div>
          <DoNow steps={node.result.doNow} />
          <TellMechanic items={node.result.tellMechanic} />
          <Related refs={node.result.related} title="Свързани статии" />
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {path.length > 1 && (
          <button type="button" onClick={back} className="btn btn-ghost text-sm">
            <Icon name="ArrowLeft" size={16} /> Назад
          </button>
        )}
        {path.length > 1 && (
          <button type="button" onClick={reset} className="btn btn-ghost text-sm">
            <Icon name="RotateCcw" size={16} /> Започни отначало
          </button>
        )}
        {compact && (
          <Link to={`/diagnose/${flow.slug}`} className="btn btn-ghost text-sm">
            Отвори на отделна страница
          </Link>
        )}
      </div>
    </div>
  )
}
