import { Link } from 'react-router-dom'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-charcoal text-white/60 py-12 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Link to="/" className="font-serif text-white text-xl tracking-widest uppercase">
            Milena
          </Link>
          <div className="flex gap-8 text-sm tracking-wider uppercase">
            <Link to="/#projetos" className="hover:text-gold transition-colors">Projetos</Link>
            <Link to="/sobre" className="hover:text-gold transition-colors">Sobre</Link>
            <Link to="/contato" className="hover:text-gold transition-colors">Contato</Link>
          </div>
          <p className="text-xs tracking-wide">
            © {year} Milena Arquitetura
          </p>
        </div>
      </div>
    </footer>
  )
}
