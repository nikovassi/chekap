import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
import { chromium } from 'playwright'
const [,, url, out, w = '390', h = '844', full = '1'] = process.argv
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH || (require('node:fs').existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined) })
const p = await b.newPage({ viewport: { width: +w, height: +h }, deviceScaleFactor: 2 })
const errs = []
p.on('console', (m) => m.type() === 'error' && errs.push(m.text()))
p.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message))
await p.goto(url, { waitUntil: 'networkidle' })
await p.waitForTimeout(600)
await p.screenshot({ path: out, fullPage: full === '1' })
console.log(errs.length ? errs.join('\n') : 'no console errors')
await b.close()
