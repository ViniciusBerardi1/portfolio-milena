import { motion } from 'framer-motion'
import { staggerContainer, scaleIn } from '../../animations/variants'
import { projetosMock } from '../../utils/mockData'
import ProjectCard from './ProjectCard'

export default function ProjectsGrid() {
  return (
    <section id="projetos" className="py-24 lg:py-32 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <p className="text-xs text-mist tracking-[0.3em] uppercase mb-3">Portfólio</p>
          <h2 className="font-serif text-4xl lg:text-5xl font-light text-charcoal">
            Projetos selecionados
          </h2>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {projetosMock.map(projeto => (
            <motion.div key={projeto.id} variants={scaleIn}>
              <ProjectCard projeto={projeto} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
