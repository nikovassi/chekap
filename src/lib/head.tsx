import { createContext, useContext, useEffect } from 'react'
import { SITE } from './meta'

export interface HeadData {
  title: string
  description: string
  path: string
  jsonLd?: object[]
  noindex?: boolean
}

/** During SSR the prerenderer passes a collector; on the client it is null. */
export const HeadContext = createContext<{ data?: HeadData } | null>(null)

export const fullTitle = (t: string) => (t.includes('Чекап') ? t : `${t} | Чекап`)
export const canonical = (path: string) => `${SITE.url}${path === '/' ? '/' : path}`

function setMeta(attr: 'name' | 'property', key: string, value: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.content = value
}

export function useHead(data: HeadData) {
  const ctx = useContext(HeadContext)
  if (ctx) ctx.data = data // SSR: collected synchronously during render
  useEffect(() => {
    const title = fullTitle(data.title)
    document.title = title
    setMeta('name', 'description', data.description)
    setMeta('property', 'og:title', title)
    setMeta('property', 'og:description', data.description)
    setMeta('property', 'og:url', canonical(data.path))
    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!link) {
      link = document.createElement('link')
      link.rel = 'canonical'
      document.head.appendChild(link)
    }
    link.href = canonical(data.path)
  }, [data.title, data.description, data.path])
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

/** Serialises head tags for the prerendered HTML. */
export function renderHead(d: HeadData, base: string) {
  const title = fullTitle(d.title)
  const url = canonical(d.path)
  const tags = [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(d.description)}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="Чекап" />`,
    `<meta property="og:locale" content="bg_BG" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(d.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${SITE.url}/og-image.png" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
  ]
  if (d.noindex) tags.push('<meta name="robots" content="noindex" />')
  for (const j of d.jsonLd ?? []) tags.push(`<script type="application/ld+json">${JSON.stringify(j).replace(/</g, '\\u003c')}</script>`)
  void base
  return tags.join('\n    ')
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: canonical(it.path) })),
  }
}

export function faqLd(qa: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: qa.map((x) => ({ '@type': 'Question', name: x.q, acceptedAnswer: { '@type': 'Answer', text: x.a } })),
  }
}
