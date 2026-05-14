import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import ProjectDetail from './pages/ProjectDetail'
import About from './pages/About'
import Contact from './pages/Contact'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="projetos/:id" element={<ProjectDetail />} />
          <Route path="sobre" element={<About />} />
          <Route path="contato" element={<Contact />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
