import { motion } from 'framer-motion'
import { fadeIn, fadeUp } from '../../animations/variants'

const HERO_IMAGE = 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1920&q=85'

const contentVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.3 } },
}

export default function HeroSection() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <motion.div
        className="absolute inset-0"
        variants={fadeIn}
        initial="hidden"
        animate="visible"
      >
        <img
          src={HERO_IMAGE}
          alt="Projeto arquitetônico"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-black/45" />
      </motion.div>

      <motion.div
        className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto"
        variants={contentVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.p
          className="text-xs tracking-[0.35em] uppercase text-white/60 mb-5"
          variants={fadeUp}
        >
          Arquitetura & Design de Interiores
        </motion.p>
        <motion.h1
          className="font-serif text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-light leading-[1.05] mb-7"
          variants={fadeUp}
        >
          Arquitetura que <em>conta histórias</em>
        </motion.h1>
        <motion.p
          className="text-white/60 text-base md:text-lg max-w-sm mx-auto font-light"
          variants={fadeUp}
        >
          Projetos residenciais e comerciais com identidade própria e sofisticação.
        </motion.p>
        <motion.div className="mt-14" variants={fadeUp}>
          <a
            href="#projetos"
            className="inline-flex flex-col items-center gap-3 text-white/50 hover:text-white/90 transition-colors duration-300 text-xs tracking-[0.3em] uppercase"
          >
            <span>Ver projetos</span>
            <svg width="1" height="40" viewBox="0 0 1 40" fill="none" aria-hidden="true">
              <line x1="0.5" y1="0" x2="0.5" y2="40" stroke="currentColor" />
            </svg>
          </a>
        </motion.div>
      </motion.div>
    </section>
  )
}
