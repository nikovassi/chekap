import type { CategoryId, Urgency } from '../data/types'

export const SITE = {
  name: 'Чекап',
  nameLatin: 'Chekap',
  tagline: 'Разбери какво ти казва колата.',
  description:
    'Чекап е бърз справочник за шофьори: лампи на таблото, шумове, пушек, миризми, течове, OBD2 кодове и поддръжка. Какво означава, колко е сериозно и какво да направиш сега.',
  url: 'https://nikovassi.github.io/chekap',
}

export const URGENCY: Record<Urgency, { label: string; short: string; text: string; color: string; dot: string }> = {
  stop: {
    label: 'СПРИ ВЕДНАГА',
    short: 'Спри',
    text: 'Не продължавай да караш без проверка.',
    color: 'var(--color-stop)',
    dot: '🔴',
  },
  soon: {
    label: 'ПРОВЕРИ ВЪЗМОЖНО НАЙ-СКОРО',
    short: 'Скоро',
    text: 'Проблемът изисква внимание.',
    color: 'var(--color-soon)',
    dot: '🟠',
  },
  monitor: {
    label: 'НАБЛЮДАВАЙ И ПРОВЕРИ',
    short: 'Наблюдавай',
    text: 'Не изглежда непосредствено критично, но изисква проверка.',
    color: 'var(--color-monitor)',
    dot: '🟡',
  },
  info: {
    label: 'ИНФОРМАЦИЯ',
    short: 'Инфо',
    text: 'Системата показва активна функция или информация.',
    color: 'var(--color-info)',
    dot: '🔵',
  },
}

export const URGENCY_ORDER: Urgency[] = ['stop', 'soon', 'monitor', 'info']

export const SECTIONS: Record<string, { label: string; plural: string; path: string; icon: string }> = {
  dashboard: { label: 'Лампа на таблото', plural: 'Лампи на таблото', path: '/dashboard', icon: 'Gauge' },
  obd: { label: 'OBD2 код', plural: 'OBD2 кодове', path: '/obd', icon: 'Cpu' },
  symptoms: { label: 'Симптом', plural: 'Симптоми', path: '/symptoms', icon: 'Activity' },
  noises: { label: 'Шум', plural: 'Шумове', path: '/noises', icon: 'Volume2' },
  smoke: { label: 'Пушек', plural: 'Пушек от ауспуха', path: '/smoke', icon: 'Wind' },
  smells: { label: 'Миризма', plural: 'Миризми', path: '/smells', icon: 'Sparkles' },
  leaks: { label: 'Теч', plural: 'Течове', path: '/leaks', icon: 'Droplets' },
  guides: { label: 'Наръчник', plural: 'Автомобилни системи', path: '/systems', icon: 'BookOpen' },
  maintenance: { label: 'Поддръжка', plural: 'Поддръжка', path: '/maintenance', icon: 'Wrench' },
  flow: { label: 'Диагностика', plural: 'Диагностика стъпка по стъпка', path: '/diagnose', icon: 'Route' },
}

export const CATEGORIES: Record<CategoryId, { label: string; icon: string; guide?: string; blurb: string }> = {
  engine: { label: 'Двигател', icon: 'Cog', guide: 'check-engine', blurb: 'Тресене, прекъсване, загуба на мощност, палене.' },
  cooling: { label: 'Охлаждане', icon: 'Thermometer', guide: 'cooling-system', blurb: 'Прегряване, антифриз, вентилатор, термостат.' },
  oil: { label: 'Масло', icon: 'Droplet', guide: 'engine-oil', blurb: 'Ниво, налягане, разход, течове, вискозитет.' },
  fuel: { label: 'Гориво и газ', icon: 'Fuel', guide: 'lpg', blurb: 'Горивна система, дюзи, газова уредба.' },
  electrical: { label: 'Акумулатор и електрика', icon: 'BatteryCharging', guide: 'battery-electrical', blurb: 'Акумулатор, алтернатор, стартер, предпазители.' },
  brakes: { label: 'Спирачки', icon: 'Disc', guide: 'brakes', blurb: 'Накладки, дискове, течност, ABS.' },
  tires: { label: 'Гуми', icon: 'CircleDot', guide: 'tires', blurb: 'Налягане, износване, вибрации, TPMS.' },
  suspension: { label: 'Окачване и кормилно', icon: 'Wrench', guide: 'suspension-steering', blurb: 'Тропане, луфт, дърпане, лагери.' },
  transmission: { label: 'Скоростна кутия', icon: 'Cog', guide: 'transmission-clutch', blurb: 'Съединител, автоматик, DSG, CVT.' },
  climate: { label: 'Климатик и парно', icon: 'Snowflake', guide: 'ac-heating', blurb: 'Не охлажда, не грее, миризми, запотяване.' },
  lights: { label: 'Фарове и осветление', icon: 'Lightbulb', guide: 'lights', blurb: 'Крушки, LED, Xenon, конденз.' },
  exhaust: { label: 'Ауспух и емисии', icon: 'Wind', guide: 'dpf-egr-adblue', blurb: 'Пушек, катализатор, DPF, EGR, AdBlue.' },
  safety: { label: 'Безопасност', icon: 'ShieldAlert', blurb: 'Въздушни възглавници, колани, асистенти.' },
  ev: { label: 'Хибрид и EV', icon: 'Zap', blurb: 'Високоволтова система, зареждане, рекуперация.' },
}

/** Quick categories shown under the hero search */
export const QUICK: { label: string; to: string; icon: string }[] = [
  { label: 'Лампа на таблото', to: '/dashboard', icon: 'Gauge' },
  { label: 'Шум', to: '/noises', icon: 'Volume2' },
  { label: 'Пушек', to: '/smoke', icon: 'Wind' },
  { label: 'Миризма', to: '/smells', icon: 'Sparkles' },
  { label: 'Теч', to: '/leaks', icon: 'Droplets' },
  { label: 'Не пали', to: '/no-start', icon: 'KeyRound' },
  { label: 'Прегрява', to: '/symptoms/overheating', icon: 'Thermometer' },
  { label: 'Губи мощност', to: '/symptoms/loss-of-power', icon: 'TrendingDown' },
  { label: 'Тресе се', to: '/symptoms/engine-shaking-idle', icon: 'Activity' },
  { label: 'Спирачки', to: '/systems/brakes', icon: 'Disc' },
  { label: 'Акумулатор', to: '/systems/electrical', icon: 'BatteryCharging' },
  { label: 'Скоростна кутия', to: '/systems/transmission', icon: 'Cog' },
  { label: 'Окачване', to: '/systems/suspension', icon: 'Wrench' },
  { label: 'Климатик', to: '/systems/climate', icon: 'Snowflake' },
  { label: 'Електрика', to: '/systems/electrical', icon: 'Zap' },
]

export const sectionLabel = (s: string) => SECTIONS[s]?.label ?? s
