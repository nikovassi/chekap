/**
 * Static prerender: renders every route to its own index.html so each page
 * is crawlable, shareable and paints instantly on a phone. Also writes
 * 404.html, alias redirect pages, sitemap.xml and robots.txt.
 */
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { pathToFileURL } from 'node:url'

const DIST = 'dist'
const base = (process.env.BASE_PATH ?? '/chekap/').replace(/\/$/, '')
const SITE_URL = process.env.SITE_URL ?? 'https://nikovassi.github.io/chekap'

const template = readFileSync(join(DIST, 'index.html'), 'utf8')
const { render, ALIASES } = await import(pathToFileURL(join('dist-ssr', 'entry-server.js')).href)
const routes = JSON.parse(readFileSync('src/generated/routes.json', 'utf8'))

const write = (file, html) => {
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, html)
}
const page = (head, html) => template.replace('<!--app-head-->', head).replace('<!--app-html-->', html)

// warm-up: initialise lazy route components so real renders never suspend
for (const r of ['/garage', '/checklist']) {
  await render(r, base)
  await new Promise((res) => setTimeout(res, 50))
}

let n = 0
const started = Date.now()
const sitemap = []
for (const route of routes) {
  const { html, head, data } = await render(route, base)
  if (html.includes('role="status"')) console.warn(`⚠ ${route} rendered a loading state`)
  const file = route === '/' ? join(DIST, 'index.html') : join(DIST, route, 'index.html')
  write(file, page(head, html))
  if (!data?.noindex) sitemap.push(route)
  n++
}

// 404 page (GitHub Pages serves it for unknown URLs; the client router renders NotFound)
{
  const { html, head } = await render('/__not-found__', base)
  write(join(DIST, '404.html'), page(head, html).replace('<div id="root">', '<div id="root" data-render="client">'))
}

// Alias pages → canonical
for (const [from, to] of Object.entries(ALIASES)) {
  const target = `${base}${to}`
  write(
    join(DIST, from, 'index.html'),
    `<!doctype html><html lang="bg"><head><meta charset="utf-8"><title>Пренасочване…</title><link rel="canonical" href="${SITE_URL}${to}"><meta name="robots" content="noindex"><meta http-equiv="refresh" content="0; url=${target}"></head><body><a href="${target}">Продължи</a></body></html>`,
  )
}

const today = new Date().toISOString().slice(0, 10)
write(
  join(DIST, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemap
    .map((r) => `  <url><loc>${SITE_URL}${r === '/' ? '/' : r}</loc><lastmod>${today}</lastmod><priority>${r === '/' ? '1.0' : r.split('/').length > 2 ? '0.7' : '0.8'}</priority></url>`)
    .join('\n')}\n</urlset>\n`,
)
write(join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`)
write(join(DIST, '.nojekyll'), '')

rmSync('dist-ssr', { recursive: true, force: true })
console.log(`prerendered ${n} routes + 404 + ${Object.keys(ALIASES).length} aliases in ${((Date.now() - started) / 1000).toFixed(1)}s`)
