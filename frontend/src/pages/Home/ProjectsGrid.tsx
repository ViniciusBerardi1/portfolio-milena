import { motion } from 'framer-motion'
import { staggerContainer, scaleIn } from '../../animations/variants'
import { useProjetos } from '../../hooks/useProjetos'
import ProjectCard from './ProjectCard'

function ProjectCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[4/3] bg-smoke mb-4" />
      <div className="h-2.5 w-16 bg-smoke rounded mb-2" />
      <div className="h-4 w-48 bg-smoke rounded mb-2" />
      <div className="h-2.5 w-24 bg-smoke rounded" />
    </div>
  )
}

export default function ProjectsGrid() {
  const { projetos, loading } = useProjetos()

  return (
    <section id="projetos" className="py-24 lg:py-32 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <p className="text-xs text-mist tracking-[0.3em] uppercase mb-3">Portfólio</p>
          <h2 className="font-serif text-4xl lg:text-5xl font-light text-charcoal">
            Projetos selecionados
          </h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProjectCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
          >
            {projetos.map(projeto => (
              <motion.div key={projeto.id} variants={scaleIn}>
                <ProjectCard projeto={projeto} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  )
}
