import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { supabase } from '../../utils/supabase'

export default function AdminLayout() {
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await supabase?.auth.signOut()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-8">
          <Link to="/" className="font-serif text-charcoal font-medium text-lg" target="_blank">
            Milena ↗
          </Link>
          <nav className="flex gap-6">
            <NavLink
              to="/admin"
              end
              className={({ isActive }) =>
                `text-sm transition-colors ${isActive ? 'text-charcoal font-medium' : 'text-gray-500 hover:text-charcoal'}`
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/admin/projetos"
              className={({ isActive }) =>
                `text-sm transition-colors ${isActive ? 'text-charcoal font-medium' : 'text-gray-500 hover:text-charcoal'}`
              }
            >
              Projetos
            </NavLink>
          </nav>
        </div>
        <button
          onClick={handleSignOut}
          className="text-sm text-gray-500 hover:text-charcoal transition-colors"
        >
          Sair
        </button>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  )
}
