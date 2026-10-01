import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Loader } from './components/ui'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import { TopicIndex, TopicPage } from './pages/Topics'
import { LightPage, LightsIndex } from './pages/Lights'
import { ObdIndex, ObdPage } from './pages/Obd'
import { CheckEnginePage, GuidePage, SystemPage, SystemsIndex } from './pages/Guides'
import { DiagnoseIndex, DiagnosePage, NoStartPage } from './pages/Diagnose'
import { MaintenanceIndex, MaintenancePage } from './pages/Maintenance'
import { SearchPage, SourcesPage } from './pages/Misc'
import { ALIASES } from './aliases'

const ChecklistPage = lazy(() => import('./pages/Checklist'))
const GaragePage = lazy(() => import('./pages/Garage'))

const TOPIC_SECTIONS = ['symptoms', 'noises', 'smoke', 'smells', 'leaks'] as const

export default function App() {
  return (
    <Layout>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/dashboard" element={<LightsIndex />} />
          <Route path="/dashboard/:slug" element={<LightPage />} />
          <Route path="/check-engine" element={<CheckEnginePage />} />
          <Route path="/obd" element={<ObdIndex />} />
          <Route path="/obd/:code" element={<ObdPage />} />
          {Object.entries(ALIASES).map(([from, to]) => (
            <Route key={from} path={from} element={<Navigate to={to} replace />} />
          ))}
          {TOPIC_SECTIONS.map((s) => [
            <Route key={s} path={`/${s}`} element={<TopicIndex section={s} />} />,
            <Route key={`${s}-d`} path={`/${s}/:slug`} element={<TopicPage section={s} />} />,
          ])}
          <Route path="/systems" element={<SystemsIndex />} />
          <Route path="/systems/:category" element={<SystemPage />} />
          <Route path="/guides/:slug" element={<GuidePage />} />
          <Route path="/no-start" element={<NoStartPage />} />
          <Route path="/diagnose" element={<DiagnoseIndex />} />
          <Route path="/diagnose/:slug" element={<DiagnosePage />} />
          <Route path="/maintenance" element={<MaintenanceIndex />} />
          <Route path="/maintenance/:slug" element={<MaintenancePage />} />
          <Route path="/checklist" element={<ChecklistPage />} />
          <Route path="/garage" element={<GaragePage />} />
          <Route path="/sources" element={<SourcesPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Layout>
  )
}
