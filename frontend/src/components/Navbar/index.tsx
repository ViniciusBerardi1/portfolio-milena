import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useScrolled } from '../../hooks/useScrolled'

const navLinks = [
  { to: '/#projetos', label: 'Projetos' },
  { to: '/sobre', label: 'Sobre' },
  { to: '/contato', label: 'Contato' },
]

export default function Navbar() {
  const scrolled = useScrolled()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link
            to="/"
            className={`font-serif text-xl font-medium tracking-widest uppercase transition-colors duration-300 ${
              scrolled ? 'text-charcoal' : 'text-white'
            }`}
          >
            Milena
          </Link>

          <div className="hidden md:flex items-center gap-10">
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                className={`text-sm font-medium tracking-wider uppercase transition-colors duration-300 hover:text-gold ${
                  scrolled ? 'text-charcoal' : 'text-white/90'
                }`}
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          <button
            className={`md:hidden flex flex-col gap-1.5 p-3 min-h-[44px] min-w-[44px] items-center justify-center ${
              scrolled ? 'text-charcoal' : 'text-white'
            }`}
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Abrir menu"
          >
            <span className={`block w-6 h-px bg-current transition-all duration-300 origin-center ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
            <span className={`block w-6 h-px bg-current transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-px bg-current transition-all duration-300 origin-center ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
          </button>
        </div>

        <div
          className={`md:hidden overflow-hidden transition-all duration-300 bg-white ${
            menuOpen ? 'max-h-60 pb-6' : 'max-h-0'
          }`}
        >
          <div className="flex flex-col gap-5 pt-4">
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className="text-charcoal text-sm font-medium tracking-wider uppercase hover:text-gold transition-colors"
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}
