/**
 * Chekap data model.
 *
 * All content lives in typed TS modules so it can later be moved to a database / CMS
 * without changing the UI: every page consumes these shapes only.
 *
 * Language rules for content (Bulgarian):
 *  - never diagnose categorically ("със сигурност е..."); use "възможните причини включват",
 *    "често се свързва с", "необходима е проверка".
 *  - distinguish: симптом / възможна причина / диагностичен тест / потвърдена повреда.
 */

/** stop = СПРИ ВЕДНАГА, soon = ПРОВЕРИ ВЪЗМОЖНО НАЙ-СКОРО, monitor = НАБЛЮДАВАЙ И ПРОВЕРИ, info = ИНФОРМАЦИЯ */
export type Urgency = 'stop' | 'soon' | 'monitor' | 'info'

/** Urgency is contextual: the same symptom/light can mean different things. */
export interface UrgencyContext {
  /** e.g. "Лампата мига и двигателят тресе" */
  when: string
  level: Urgency
}

export type CategoryId =
  | 'engine'
  | 'cooling'
  | 'oil'
  | 'fuel'
  | 'electrical'
  | 'brakes'
  | 'tires'
  | 'suspension'
  | 'transmission'
  | 'climate'
  | 'lights'
  | 'exhaust'
  | 'safety'
  | 'ev'

export interface Cause {
  /** short name, e.g. "Износени свещи" */
  name: string
  /** one-sentence explanation */
  detail?: string
  /** "Как да го различиш" – extra symptom or check that points towards / away from this cause */
  distinguish?: string
}

/**
 * A reference to another page, in the form "<section>/<slug>":
 *   symptoms/engine-shaking, noises/engine-ticking, smoke/white-smoke, smells/fuel-smell,
 *   leaks/engine-oil, dashboard/oil-pressure, obd/p0300, guides/engine-oil, flow/no-start
 */
export type Ref = string

/** Ids from src/data/sources.ts */
export type SourceId = string

export type TopicSection = 'symptoms' | 'noises' | 'smoke' | 'smells' | 'leaks'

/** Generic diagnostic article – used for symptoms, noises, smoke, smells and leaks. */
export interface Topic {
  slug: string
  section: TopicSection
  /** As a driver would say it: "Колата тресе на празен ход" */
  title: string
  /** Optional SEO <title> override, e.g. "Колата тресе на празен ход – причини и какво да направиш" */
  seoTitle?: string
  /** 1–2 sentences: what this means */
  summary: string
  category: CategoryId
  /** Default/typical urgency for the card badge */
  urgency: Urgency
  /** Context-dependent urgency rows (always at least 2 for anything non-trivial) */
  urgencyContext: UrgencyContext[]
  /** "Какво да направиш сега" – ordered, short imperative steps */
  doNow: string[]
  /** "Възможни причини" – ordered roughly by how common they are */
  causes: Cause[]
  /** "Какво можеш да провериш" – safe checks a normal driver can do */
  driverChecks: string[]
  /** "Какво ще провери механикът" – diagnostic tests */
  mechanicChecks: string[]
  /** "Какво да наблюдаваш" */
  watchFor: string[]
  /** "Кога да спреш автомобила" */
  stopIf: string[]
  /** "Какво да кажеш на механика" – facts the driver should note & report */
  tellMechanic: string[]

  // ---- section-specific optional fields ----
  /** noises: how it sounds */
  sound?: string
  /** noises: when it appears */
  whenOccurs?: string[]
  /** noises/leaks: where it may come from / where found */
  location?: string
  /** smoke: when it is normal */
  normalWhen?: string
  /** smoke/leaks: colour description */
  color?: string
  /** css colour for a swatch, e.g. "#7a4a1d" (leaks, smoke) */
  swatch?: string
  /** leaks/smoke: smell description */
  smell?: string

  /**
   * Situation tags used for filters (mainly noises/smoke):
   * 'cold-start' | 'warm' | 'acceleration' | 'braking' | 'turning' | 'bumps' | 'idle' | 'speed' | 'deceleration' | 'after-standing'
   */
  tags?: string[]

  /** Search phrases: colloquial Bulgarian, slang, misspellings, transliteration, English */
  keywords: string[]
  related: Ref[]
  sources: SourceId[]
}

export type LightColor = 'red' | 'amber' | 'green' | 'blue' | 'white'

export type LightGroup = 'critical' | 'engine' | 'brakes' | 'safety' | 'assist' | 'lights' | 'ev' | 'info'

export interface WarningLight {
  slug: string
  /** Bulgarian name: "Лампа за маслено налягане" */
  name: string
  /** English name: "Oil Pressure" */
  nameEn: string
  /** Key of icon in src/components/LightIcon.tsx */
  icon: string
  colors: LightColor[]
  group: LightGroup
  urgency: Urgency
  urgencyContext: UrgencyContext[]
  /** what it means */
  meaning: string
  causes: string[]
  driverChecks: string[]
  doNow: string[]
  /** can you keep driving – short answer */
  canDrive: string
  stopIf: string[]
  /** when to visit a garage */
  garageWhen: string
  needsDiagnostics: 'yes' | 'no' | 'sometimes'
  /** manufacturer differences */
  variation: string
  tellMechanic?: string[]
  keywords: string[]
  related: Ref[]
  sources: SourceId[]
}

export interface ObdCode {
  /** upper-case, e.g. "P0300" */
  code: string
  titleEn: string
  /** Bulgarian description, phrased as "detected condition", not as a part diagnosis */
  titleBg: string
  system: string
  /** 1–2 sentence plain-language explanation */
  summary: string
  causes: string[]
  symptoms: string[]
  diagnosis: string[]
  urgency: Urgency
  urgencyContext?: UrgencyContext[]
  dontDo: string[]
  related: Ref[]
  keywords?: string[]
  sources: SourceId[]
}

// ---------------- Diagnostic flows ----------------

export interface FlowOption {
  label: string
  next: string
}

export interface FlowResult {
  title: string
  urgency: Urgency
  /** "Най-вероятни направления за проверка" */
  directions: string[]
  doNow: string[]
  tellMechanic: string[]
  related: Ref[]
}

export interface FlowNode {
  id: string
  question?: string
  hint?: string
  options?: FlowOption[]
  result?: FlowResult
}

export interface Flow {
  slug: string
  title: string
  /** lucide icon name key used by the UI (see src/components/icons.ts) */
  icon: string
  intro: string
  start: string
  nodes: Record<string, FlowNode>
  keywords: string[]
}

// ---------------- Guides (long-form: oil, cooling, battery, brakes, tyres...) ----------------

export interface GuideSection {
  heading: string
  /** paragraphs */
  body?: string[]
  bullets?: string[]
  /** optional simple 2-col table */
  table?: { head: [string, string] | string[]; rows: string[][] }
  /** a highlighted callout */
  callout?: { tone: Urgency | 'tip'; text: string }
}

export interface Guide {
  slug: string
  title: string
  seoTitle?: string
  summary: string
  category: CategoryId
  icon: string
  sections: GuideSection[]
  /** Optional "Какво да направиш сега" block */
  doNow?: string[]
  keywords: string[]
  related: Ref[]
  sources: SourceId[]
}

// ---------------- Maintenance ----------------

export interface MaintenanceGroup {
  slug: string
  title: string
  summary: string
  icon: string
  items: { name: string; detail: string }[]
  note?: string
  sources: SourceId[]
}

export type Fuel = 'petrol' | 'diesel' | 'lpg' | 'hybrid' | 'ev'
export type Transmission = 'manual' | 'automatic' | 'dct' | 'cvt'

export interface ChecklistItem {
  id: string
  name: string
  nameEn: string
  /** What to check / why */
  detail: string
  /** General orientation text – ALWAYS labelled as general info in UI */
  generalGuide: string
  /** applies only to these fuels / transmissions (undefined = all) */
  fuels?: Fuel[]
  transmissions?: Transmission[]
  /** rough km after which the item becomes "due for attention" as general reference */
  attentionKm?: number
  /** rough years after which the item becomes "due for attention" as general reference */
  attentionYears?: number
  sources: SourceId[]
}

export interface Source {
  id: SourceId
  publisher: string
  title: string
  url: string
}
