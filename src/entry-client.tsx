import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { dataForPath, loadData } from './data/load'
import './index.css'

const basename = import.meta.env.BASE_URL.replace(/\/$/, '')
const root = document.getElementById('root')!
const app = (
  <StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </StrictMode>
)

// Prerendered pages are hydrated; the dev server renders from scratch.
if (root.hasChildNodes() && root.dataset.render !== 'client') {
  // load this page's data first so hydration matches the prerendered HTML without suspending
  const path = location.pathname.slice(basename.length) || '/'
  const pages: Promise<unknown>[] = []
  if (path.startsWith('/garage')) pages.push(import('./pages/Garage'))
  if (path.startsWith('/checklist')) pages.push(import('./pages/Checklist'))
  Promise.all([...dataForPath(path).map(loadData), ...pages])
    .catch(() => undefined)
    .then(() => hydrateRoot(root, app))
} else {
  root.textContent = ''
  createRoot(root).render(app)
}
