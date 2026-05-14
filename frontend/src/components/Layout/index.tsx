import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from '../Navbar'
import Footer from '../Footer'

export default function Layout() {
  const location = useLocation()

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <AnimatePresence mode="wait">
        <main key={location.pathname} className="flex-1">
          <Outlet />
        </main>
      </AnimatePresence>
      <Footer />
    </div>
  )
}
