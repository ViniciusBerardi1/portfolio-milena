import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './pages/Admin/ProtectedRoute'

const Home = lazy(() => import('./pages/Home'))
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const AdminLayout = lazy(() => import('./pages/Admin/AdminLayout'))
const AdminLogin = lazy(() => import('./pages/Admin/Login'))
const AdminDashboard = lazy(() => import('./pages/Admin/Dashboard'))
const AdminProjects = lazy(() => import('./pages/Admin/Projects'))
const ProjectForm = lazy(() => import('./pages/Admin/Projects/ProjectForm'))
const AdminConfig = lazy(() => import('./pages/Admin/Config'))

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-5 h-5 border-2 border-gray-200 border-t-charcoal rounded-full animate-spin" />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Site público */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="projetos/:id" element={<ProjectDetail />} />
            <Route path="sobre" element={<About />} />
            <Route path="contato" element={<Contact />} />
          </Route>

          {/* Admin */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="projetos" element={<AdminProjects />} />
              <Route path="projetos/novo" element={<ProjectForm />} />
              <Route path="projetos/:id/editar" element={<ProjectForm />} />
              <Route path="configuracoes" element={<AdminConfig />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
