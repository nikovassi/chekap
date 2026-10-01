/** Interaction smoke tests: search suggestions, wizard flow, OBD lookup, filters, garage (localStorage), checklist. */
import { existsSync } from 'node:fs'
import { chromium } from 'playwright'
const BASE = process.env.QA_BASE ?? 'http://localhost:4173/chekap'
const SHOTS = process.env.SHOTS
const exe = process.env.CHROME_PATH || (existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined)
const b = await chromium.launch({ executablePath: exe })
const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })
const errs = []
p.on('console', (m) => m.type() === 'error' && errs.push(p.url() + ' → ' + m.text().slice(0, 160)))
p.on('pageerror', (e) => errs.push(p.url() + ' → ' + e.message.slice(0, 160)))
const ok = []
const fail = []
const t = async (name, fn) => { try { await fn(); ok.push(name) } catch (e) { fail.push(`${name}: ${e.message.split('\n')[0]}`) } }
const shot = async (n) => SHOTS && p.screenshot({ path: `${SHOTS}/${n}.png` })

await t('search suggestions', async () => {
  await p.goto(BASE + '/', { waitUntil: 'networkidle' })
  await p.getByRole('combobox').first().fill('светна ми лампата за маслото')
  await p.getByRole('option').first().waitFor({ timeout: 5000 })
  const first = await p.getByRole('option').first().innerText()
  if (!/масл/i.test(first)) throw new Error('unexpected first hit: ' + first)
  await shot('i-search')
  await p.getByRole('option').first().click()
  await p.waitForURL(/dashboard\/oil-pressure/)
  await shot('i-light')
})
await t('search page', async () => {
  await p.goto(BASE + '/search/?q=' + encodeURIComponent('колата пуши бяло'), { waitUntil: 'networkidle' })
  await p.getByText('Бял пушек', { exact: false }).first().waitFor({ timeout: 5000 })
})
await t('search empty state', async () => {
  await p.goto(BASE + '/search/?q=' + encodeURIComponent('qqqqzzzz xxxx'), { waitUntil: 'networkidle' })
  await p.getByText('Не намерихме точно съвпадение').waitFor({ timeout: 5000 })
})
await t('wizard no-start flow', async () => {
  await p.goto(BASE + '/', { waitUntil: 'networkidle' })
  await p.getByRole('button', { name: 'Не пали' }).click()
  await p.getByText('Въпрос 1').waitFor({ timeout: 5000 })
  await shot('i-wizard-q1')
  for (let k = 0; k < 6; k++) {
    if (await p.getByText('Най-вероятни направления за проверка').count()) break
    await p.locator('#main .card button.min-h-14').first().click()
    await p.waitForTimeout(250)
  }
  await p.getByText('Най-вероятни направления за проверка').waitFor({ timeout: 3000 })
  await shot('i-wizard-result')
  await p.getByRole('button', { name: /Започни отначало/ }).click()
  await p.getByText('Въпрос 1').waitFor()
})
await t('obd lookup', async () => {
  await p.goto(BASE + '/obd/', { waitUntil: 'networkidle' })
  await p.fill('#obd-in', 'р0301')
  await p.getByRole('button', { name: 'Покажи' }).click()
  await p.waitForURL(/obd\/p0301/)
  await p.goto(BASE + '/obd/', { waitUntil: 'networkidle' })
  await p.fill('#obd-in', 'hello')
  await p.getByRole('button', { name: 'Покажи' }).click()
  await p.getByRole('alert').waitFor()
})
await t('lights filter', async () => {
  await p.goto(BASE + '/dashboard/', { waitUntil: 'networkidle' })
  await p.getByRole('textbox', { name: 'Търси лампа' }).fill('костенурка')
  const n = await p.locator('a[href*="/dashboard/"]').filter({ hasText: 'мощност' }).count()
  if (n < 1) throw new Error('turtle light not found')
})
await t('topic filters', async () => {
  await p.goto(BASE + '/noises/', { waitUntil: 'networkidle' })
  await p.getByRole('button', { name: 'При завиване' }).click()
  const txt = await p.getByText(/резултата/).innerText()
  if (!/^\d+/.test(txt) || txt.startsWith('0')) throw new Error(txt)
})
await t('garage localStorage', async () => {
  await p.goto(BASE + '/garage/', { waitUntil: 'networkidle' })
  await p.getByLabel('Марка *').fill('BMW')
  await p.getByLabel('Модел').fill('320d')
  await p.getByLabel('Година').fill('2018')
  await p.getByLabel('Текущи километри').fill('180000')
  await p.getByRole('button', { name: 'Запази' }).click()
  await p.getByRole('heading', { name: 'BMW 320d' }).waitFor()
  const due = new Date(Date.now() + 9 * 86400000).toISOString().slice(0, 10)
  await p.getByLabel('Дата').fill(due)
  await p.getByRole('button', { name: 'Добави', exact: true }).click()
  await p.locator('li', { hasText: 'Скоро' }).first().waitFor({ timeout: 5000 })
  await shot('i-garage')
  await p.reload({ waitUntil: 'networkidle' })
  await p.getByRole('heading', { name: 'BMW 320d' }).waitFor({ timeout: 5000 })
  const stored = await p.evaluate(() => localStorage.getItem('chekap.garage.v1'))
  if (!stored?.includes('320d')) throw new Error('not persisted')
})
await t('checklist prefill', async () => {
  await p.goto(BASE + '/checklist/', { waitUntil: 'networkidle' })
  await p.waitForTimeout(300)
  if ((await p.getByLabel('Марка').inputValue()) !== 'BMW') throw new Error('not prefilled')
  await p.getByRole('button', { name: 'Покажи какво да проверя' }).click()
  await p.getByText('ОБЪРНИ ВНИМАНИЕ').first().waitFor()
  await p.locator('input[type=checkbox]').first().check()
  await shot('i-checklist')
})
await t('menu', async () => {
  await p.goto(BASE + '/', { waitUntil: 'networkidle' })
  await p.getByRole('button', { name: 'Меню' }).click()
  await p.getByRole('dialog').getByRole('link', { name: 'Check Engine' }).click()
  await p.waitForURL(/check-engine/)
})
await t('404', async () => {
  const r = await p.goto(BASE + '/no-such-page/', { waitUntil: 'networkidle' })
  await p.getByText('Тази страница не съществува').waitFor()
  void r
})

await b.close()
console.log('passed:', ok.length, ok.join(', '))
if (errs.length) console.log('console errors:', [...new Set(errs)].join('\n'))
if (fail.length) { console.log('FAILED:\n' + fail.join('\n')); process.exit(1) }
