/**
 * QA crawler: visits every prerendered route (mobile viewport) on a running preview server and checks
 * console errors, hydration warnings, horizontal overflow, <title>/<h1>/description, and broken internal links.
 * Usage: npm run build && npx vite preview --port 4173 & npm run qa   (QA_BASE=https://… to test production)
 */
import { readFileSync, existsSync } from 'node:fs'
import { chromium } from 'playwright'

const BASE = process.env.QA_BASE ?? 'http://localhost:4173/chekap'
const routes = JSON.parse(readFileSync('src/generated/routes.json', 'utf8'))
const exe = process.env.CHROME_PATH || (existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined)
const browser = await chromium.launch({ executablePath: exe })
const ctx = await browser.newContext({ viewport: { width: 375, height: 800 }, deviceScaleFactor: 1 })
const problems = []
const links = new Set()
const basePath = new URL(BASE).pathname.replace(/\/$/, '')
const pages = process.env.QA_LIMIT ? routes.slice(0, +process.env.QA_LIMIT) : routes

let i = 0
await Promise.all(
  Array.from({ length: 6 }, async () => {
    const page = await ctx.newPage()
    while (i < pages.length) {
      const r = pages[i++]
      const errs = []
      const onC = (m) => (m.type() === 'error' || /hydrat/i.test(m.text())) && errs.push(m.text())
      const onE = (e) => errs.push('PAGEERROR ' + e.message)
      page.on('console', onC)
      page.on('pageerror', onE)
      const res = await page.goto(BASE + (r === '/' ? '/' : r + '/'), { waitUntil: 'networkidle' })
      await page.waitForTimeout(150)
      const info = await page.evaluate(() => ({
        title: document.title,
        h1: document.querySelectorAll('h1').length,
        desc: document.querySelector('meta[name="description"]')?.getAttribute('content') ?? '',
        overflow: document.documentElement.scrollWidth - window.innerWidth,
        links: [...document.querySelectorAll('a[href]')].map((a) => a.getAttribute('href')),
      }))
      if (!res || res.status() !== 200) problems.push(`${r}: HTTP ${res?.status()}`)
      if (errs.length) problems.push(`${r}: console → ${errs.join(' | ').slice(0, 300)}`)
      if (info.overflow > 1) problems.push(`${r}: horizontal overflow ${info.overflow}px`)
      if (!info.title || info.title === 'chekap') problems.push(`${r}: missing title`)
      if (r !== '/search' && info.h1 !== 1) problems.push(`${r}: ${info.h1} <h1>`)
      if (info.desc.length < 50) problems.push(`${r}: short description`)
      info.links.forEach((l) => l.startsWith(basePath + '/') || l === basePath ? links.add(l) : null)
      page.off('console', onC)
      page.off('pageerror', onE)
    }
    await page.close()
  }),
)

// broken internal links
const known = new Set(routes.map((r) => basePath + (r === '/' ? '/' : r)))
for (const l of links) {
  const p = l.split(/[?#]/)[0].replace(/\/$/, '') || basePath
  const norm = p === basePath ? basePath + '/' : p
  if (!known.has(norm) && !norm.endsWith('/search')) {
    const res = await ctx.request.get(new URL(BASE).origin + l)
    if (res.status() !== 200) problems.push(`broken link: ${l} (${res.status()})`)
  }
}

await browser.close()
console.log(`checked ${pages.length} pages, ${links.size} unique internal links`)
if (problems.length) {
  console.log(problems.join('\n'))
  console.log(`\n${problems.length} problem(s)`)
  process.exit(1)
}
console.log('QA OK')
