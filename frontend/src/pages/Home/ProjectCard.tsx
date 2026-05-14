import { Link } from 'react-router-dom'
import type { Projeto } from '../../types'

interface Props {
  projeto: Projeto
}

export default function ProjectCard({ projeto }: Props) {
  return (
    <Link to={`/projetos/${projeto.id}`} className="group block">
      <div className="relative overflow-hidden aspect-[4/3] mb-4">
        <img
          src={projeto.capa_url}
          alt={projeto.titulo}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/35 transition-all duration-500" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-white/70 text-xs tracking-widest uppercase mb-1">
            {projeto.categoria} — {projeto.localizacao}
          </span>
          <p className="text-white font-serif text-xl font-light">{projeto.titulo}</p>
        </div>
      </div>
      <p className="text-xs text-mist tracking-widest uppercase mb-1">{projeto.categoria}</p>
      <h3 className="font-serif text-lg text-charcoal font-medium group-hover:text-gold transition-colors duration-300">
        {projeto.titulo}
      </h3>
      <p className="text-sm text-mist mt-1">{projeto.localizacao}</p>
    </Link>
  )
}
