/**
 * Chekap smart search – understands how Bulgarian drivers actually describe problems.
 *
 * Pipeline:  normalise → (Latin→Cyrillic transliteration) → tokenise → drop stop-words → light stemming
 * Scoring:   exact / prefix / fuzzy token matches against title+keyword phrases (high weight)
 *            and causes/summary text (low weight), plus phrase bonuses and context boosts
 *            (e.g. "свети/светна/лампа" boosts dashboard lights). OBD codes are detected directly.
 *
 * The index (src/generated/search.json) is lazy-loaded so it never blocks the first paint.
 */
import { CATALOG_MAP, type CatalogEntry } from './catalog'

export interface SearchDoc {
  id: string
  k: string[]
  x: string
  c: string[]
}

export interface SearchHit extends CatalogEntry {
  score: number
  causes: string[]
}

// ---------------- normalisation ----------------

const LAT2CYR: [RegExp, string][] = [
  [/sht/g, 'щ'], [/sh/g, 'ш'], [/ch/g, 'ч'], [/zh/g, 'ж'], [/ts/g, 'ц'], [/yu/g, 'ю'], [/ya/g, 'я'], [/ia/g, 'я'], [/iu/g, 'ю'],
  [/a/g, 'а'], [/b/g, 'б'], [/c/g, 'к'], [/d/g, 'д'], [/e/g, 'е'], [/f/g, 'ф'], [/g/g, 'г'], [/h/g, 'х'], [/i/g, 'и'],
  [/j/g, 'дж'], [/k/g, 'к'], [/l/g, 'л'], [/m/g, 'м'], [/n/g, 'н'], [/o/g, 'о'], [/p/g, 'п'], [/q/g, 'к'], [/r/g, 'р'],
  [/s/g, 'с'], [/t/g, 'т'], [/u/g, 'у'], [/v/g, 'в'], [/w/g, 'в'], [/x/g, 'кс'], [/y/g, 'й'], [/z/g, 'з'], [/4/g, 'ч'], [/6/g, 'ш'],
]

/** Latin acronyms that should stay as they are (not be transliterated) */
const KEEP_LATIN = new Set([
  'abs', 'esp', 'esc', 'asr', 'tcs', 'dpf', 'fap', 'egr', 'epc', 'obd', 'obd2', 'srs', 'tpms', 'led', 'dsg', 'dct', 'cvt',
  'adblue', 'lpg', 'ac', 'maf', 'map', 'tdi', 'hdi', 'cdi', 'tdci', 'crdi', 'dci', 'ecu', 'ev', 'awd', '4wd', '4x4', 'abs-а',
])

/** Common slang / spelling variants → canonical form (applied per token after normalisation) */
const ALIASES: Record<string, string> = {
  чекът: 'чек', чекк: 'чек', чекка: 'чек', чека: 'чек', чекa: 'чек', чецк: 'чек', check: 'чек', chek: 'чек', mil: 'чек',
  абеесе: 'abs', абс: 'abs', есп: 'esp', еспе: 'esp', еспето: 'esp', дпф: 'dpf', фап: 'dpf', егр: 'egr', ерг: 'egr', епц: 'epc', епс: 'epc',
  люфт: 'луфт', люфта: 'луфт', бубина: 'бобина', бубини: 'бобини', аварийен: 'авариен', аварийна: 'авариен', аварийния: 'авариен',
  масльонка: 'масльонка', масльонката: 'масльонка', маслинката: 'масльонка', мaслото: 'масло',
  лампичка: 'лампа', лампичката: 'лампа', лампата: 'лампа', лампичкa: 'лампа', светлинка: 'лампа',
  климата: 'климатик', клима: 'климатик', климатика: 'климатик', печката: 'парно', печка: 'парно',
  акумулатора: 'акумулатор', акумолатор: 'акумулатор', акомулатор: 'акумулатор', акума: 'акумулатор',
  турбото: 'турбо', турбината: 'турбо', турбина: 'турбо', гумата: 'гума', гумите: 'гуми', спирачките: 'спирачки',
  ауспуха: 'ауспух', двигателя: 'двигател', мотора: 'двигател', мотор: 'двигател', двигателят: 'двигател',
  пушек: 'пуши', дими: 'пуши', дим: 'пуши', пушене: 'пуши', пушeк: 'пуши', пуша: 'пуши',
  тресе: 'тресе', треси: 'тресе', друса: 'тресе', тресене: 'тресе', вибрира: 'тресе', вибрации: 'тресе',
  светна: 'свети', светва: 'свети', светят: 'свети', запали: 'свети', светеше: 'свети', светнала: 'свети',
}

const STOP = new Set([
  'на', 'ми', 'се', 'от', 'и', 'в', 'във', 'при', 'с', 'със', 'за', 'е', 'да', 'колата', 'кола', 'ме', 'ли', 'по', 'а', 'че',
  'много', 'малко', 'моята', 'моята', 'нещо', 'има', 'когато', 'като', 'съм', 'ни', 'го', 'й', 'то', 'той', 'тя', 'това',
  'автомобила', 'автомобил', 'колата', 'колaта', 'ми', 'мой', 'моя', 'моят', 'ги', 'им', 'до', 'към', 'но', 'или', 'пък',
  'the', 'my', 'car', 'is', 'a', 'and', 'of', 'when', 'on', 'it', 'in',
])

const SUFFIXES = ['ията', 'ието', 'ящия', 'ащия', 'ите', 'ата', 'ото', 'ета', 'ът', 'ят', 'та', 'то', 'те', 'ия', 'ие', 'ни', 'на', 'но', 'ен', 'а', 'я', 'о', 'е', 'и', 'ъ', 'у']

export function normalise(s: string): string {
  let t = s.toLowerCase().replace(/ё/g, 'е').replace(/ѝ/g, 'и').replace(/[“”„"'`´’.,!?;:()[\]{}/\\|*+=<>~^%$#@&_]/g, ' ').replace(/-/g, ' ')
  // transliterate Latin words that are not known acronyms
  t = t.replace(/[a-z0-9]+/g, (w) => {
    if (KEEP_LATIN.has(w) || /^[pbcu][0-9a-f]{4}$/.test(w) || /^\d+$/.test(w) || /\d+w\d+/.test(w)) return w
    let r = w
    for (const [re, rep] of LAT2CYR) r = r.replace(re, rep)
    return r
  })
  return t.replace(/\s+/g, ' ').trim()
}

function stem(w: string): string {
  if (w.length <= 4 || /[a-z0-9]/.test(w)) return w
  for (const s of SUFFIXES) if (w.endsWith(s) && w.length - s.length >= 3) return w.slice(0, -s.length)
  return w
}

export function tokens(s: string): string[] {
  return normalise(s)
    .split(' ')
    .filter(Boolean)
    .map((w) => ALIASES[w] ?? w)
    .filter((w) => !STOP.has(w))
    .map(stem)
}

function lev(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1
  const prev = Array.from({ length: b.length + 1 }, (_, i) => i)
  for (let i = 1; i <= a.length; i++) {
    let cur = [i]
    let rowMin = i
    for (let j = 1; j <= b.length; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1))
      rowMin = Math.min(rowMin, cur[j])
    }
    if (rowMin > max) return max + 1
    for (let j = 0; j <= b.length; j++) prev[j] = cur[j]
    cur = []
  }
  return prev[b.length]
}

/** similarity of a query token to a doc token: 1 exact, .8 prefix, .55 fuzzy */
function tokenSim(q: string, d: string): number {
  if (q === d) return 1
  if (q.length >= 3 && d.startsWith(q)) return 0.85
  if (d.length >= 4 && q.startsWith(d)) return 0.75
  if (q.length >= 5 && d.length >= 5) {
    const max = q.length >= 8 ? 2 : 1
    if (lev(q, d, max) <= max) return 0.55
  }
  return 0
}

// ---------------- index ----------------

export interface Prepared {
  id: string
  phrases: string[][] // tokenised title + keywords
  extra: Set<string>
  causes: string[]
}

export function prepare(docs: SearchDoc[]): Prepared[] {
  return docs.map((d) => ({
    id: d.id,
    phrases: d.k.map(tokens).filter((p) => p.length),
    extra: new Set(tokens(d.x)),
    causes: d.c,
  }))
}

let prepared: Prepared[] | null = null
let loading: Promise<Prepared[]> | null = null

export function loadIndex(): Promise<Prepared[]> {
  if (prepared) return Promise.resolve(prepared)
  if (!loading) {
    loading = import('../generated/search.json').then((m) => {
      prepared = prepare((m.default ?? m) as SearchDoc[])
      return prepared
    })
  }
  return loading
}

const LIGHT_HINT = /(свет|лампа|лампичк|символ|таблот|индикатор|мига|свети)/
const SMOKE_HINT = /(пуш|дим|пара от ауспух|опушва|чади)/
const SMELL_HINT = /(мирис|мирише|воня|смърди)/
const LEAK_HINT = /(тече|теч|капе|локва|петно под)/
const NOISE_HINT = /(шум|звук|трак|чук|свир|скърц|стърж|вие|бучи|щрак|пук|тропа|съска|пищи|дрънч|цъка)/

export function detectObd(q: string): string | null {
  const m = q
    .toLowerCase()
    .replace(/р/g, 'p') // Cyrillic р typed instead of Latin p
    .replace(/с/g, 'c')
    .replace(/и/g, 'u')
    .match(/\b([pbcu])\s*-?\s*([0-9a-f]{4})\b/)
  return m ? `${m[1]}${m[2]}` : null
}

export function searchIndex(index: Prepared[], query: string, limit = 12): SearchHit[] {
  const q = tokens(query)
  const raw = normalise(query)
  const hits: SearchHit[] = []
  const obd = detectObd(query)

  if (!q.length && !obd) return []

  for (const doc of index) {
    let best = 0
    let coveredAll = 0
    for (const p of doc.phrases) {
      let sum = 0
      let matched = 0
      for (const qt of q) {
        let m = 0
        for (const dt of p) {
          const s = tokenSim(qt, dt)
          if (s > m) m = s
          if (m === 1) break
        }
        if (m > 0) matched++
        sum += m
      }
      // how much of the phrase is covered by the query (phrase contained in query)
      let phraseCovered = 0
      for (const dt of p) if (q.some((qt) => tokenSim(qt, dt) >= 0.75)) phraseCovered++
      const phraseRatio = p.length ? phraseCovered / p.length : 0
      let score = sum + (phraseRatio === 1 ? 1.5 + p.length * 0.6 : phraseRatio * 0.8)
      if (matched === q.length && q.length > 1) score += 1.2
      if (score > best) {
        best = score
        coveredAll = matched
      }
    }
    // low-weight matches in causes / summary
    let extra = 0
    for (const qt of q) {
      if (doc.extra.has(qt)) extra += 0.35
      else for (const e of doc.extra) if (qt.length >= 4 && e.startsWith(qt)) { extra += 0.2; break }
    }
    let score = best + extra
    if (score <= 0.6) continue
    const coverage = q.length ? Math.max(coveredAll / q.length, 0.25) : 1
    score *= 0.55 + 0.45 * coverage

    const sec = doc.id.split('/')[0]
    if (LIGHT_HINT.test(raw) && sec === 'dashboard') score *= 1.35
    if (SMOKE_HINT.test(raw) && sec === 'smoke') score *= 1.3
    if (SMELL_HINT.test(raw) && sec === 'smells') score *= 1.3
    if (LEAK_HINT.test(raw) && sec === 'leaks') score *= 1.3
    if (NOISE_HINT.test(raw) && sec === 'noises') score *= 1.2
    if (sec === 'obd' && !obd) score *= 0.6 // codes only when it looks like a code question
    if (sec === 'maintenance' || sec === 'guides') score *= 0.85

    const entry = CATALOG_MAP[doc.id]
    if (entry) hits.push({ ...entry, score, causes: doc.causes })
  }

  if (obd) {
    const entry = CATALOG_MAP[`obd/${obd}`]
    if (entry) {
      const existing = hits.find((h) => h.id === entry.id)
      if (existing) existing.score += 100
      else hits.push({ ...entry, score: 100, causes: [] })
    }
  }

  return hits.sort((a, b) => b.score - a.score).slice(0, limit)
}

export async function search(query: string, limit = 12) {
  const idx = await loadIndex()
  return searchIndex(idx, query, limit)
}
