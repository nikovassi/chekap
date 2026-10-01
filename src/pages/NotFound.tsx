import { Link } from 'react-router-dom'
import { useHead } from '../lib/head'
import { SearchBox } from '../components/SearchBox'

export default function NotFound() {
  useHead({ title: 'Страницата не е намерена', description: 'Тази страница не съществува. Потърси симптома или разгледай лампите на таблото.', path: '/404', noindex: true })
  return (
    <div className="mx-auto max-w-xl py-10 text-center">
      <p className="font-display text-6xl font-bold text-accent">404</p>
      <h1 className="mt-3 text-2xl font-bold">Тази страница не съществува</h1>
      <p className="mt-2 text-ink-2">Може би линкът е стар. Опиши проблема и ще те насочим.</p>
      <div className="mt-6 text-left">
        <SearchBox size="md" />
      </div>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <Link to="/" className="btn btn-primary">Към началото</Link>
        <Link to="/dashboard" className="btn btn-ghost">Лампи на таблото</Link>
      </div>
    </div>
  )
}
