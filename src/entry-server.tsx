import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import App from './App'
import { preloadAll } from './data/load'
import { HeadContext, renderHead, type HeadData } from './lib/head'

/**
 * Renders one route to static HTML. All content chunks are preloaded first (and their promises
 * marked as fulfilled), so `use()` never suspends and renderToString produces complete, inline HTML.
 */
export async function render(url: string, basename: string) {
  await preloadAll()
  const ctx: { data?: HeadData } = {}
  const html = renderToString(
    <StrictMode>
      <HeadContext.Provider value={ctx}>
        <StaticRouter location={basename + url} basename={basename}>
          <App />
        </StaticRouter>
      </HeadContext.Provider>
    </StrictMode>,
  )
  const head = ctx.data ? renderHead(ctx.data, basename) : ''
  return { html, head, data: ctx.data }
}

export { ALIASES } from './aliases'
