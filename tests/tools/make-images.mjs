/** Generates PNG icons and the social share image from SVG/HTML (run once; outputs committed to /public). */
import { existsSync, readFileSync } from 'node:fs'
import { chromium } from 'playwright'
const exe = existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined
const b = await chromium.launch({ executablePath: exe })
const svg = readFileSync('public/favicon.svg', 'utf8')
for (const [n, s] of [['icon-192.png', 192], ['icon-512.png', 512], ['apple-touch-icon.png', 180]]) {
  const p = await b.newPage({ viewport: { width: s, height: s } })
  await p.setContent(`<html><body style="margin:0;background:#0a0d11">${svg.replace('<svg ', `<svg width="${s}" height="${s}" `)}</body></html>`)
  await p.screenshot({ path: `public/${n}`, omitBackground: false })
  await p.close()
}
const fonts = 'node_modules/@fontsource/unbounded/files/unbounded-cyrillic-700-normal.woff2'
const font = readFileSync(fonts).toString('base64')
const p = await b.newPage({ viewport: { width: 1200, height: 630 } })
await p.setContent(`<html><head><style>@font-face{font-family:U;src:url(data:font/woff2;base64,${font})}body{margin:0;width:1200px;height:630px;background:radial-gradient(800px 400px at 85% 0%,#3df5c822,transparent),#0a0d11;color:#eef2f6;font-family:U,sans-serif;display:flex;flex-direction:column;justify-content:center;padding:0 90px;box-sizing:border-box}h1{font-size:76px;line-height:1.05;margin:28px 0 18px}span{background:linear-gradient(90deg,#3df5c8,#4da3ff);-webkit-background-clip:text;color:transparent}p{font:500 30px sans-serif;color:#c3cbd6;margin:0}.row{display:flex;align-items:center;gap:22px;font-size:40px}</style></head><body><div class="row">${svg.replace('<svg ', '<svg width="84" height="84" ')}ЧЕКАП.</div><h1>Какво не е наред<br>с <span>колата ти?</span></h1><p>Лампи на таблото · шумове · пушек · OBD2 · поддръжка</p></body></html>`)
await p.waitForTimeout(300)
await p.screenshot({ path: 'public/og-image.png' })
await b.close()
console.log('images ok')
