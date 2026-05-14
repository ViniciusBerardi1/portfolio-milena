import { motion } from 'framer-motion'
import { fadeIn } from '../../animations/variants'
import SEO from '../../components/SEO'
import HeroSection from './HeroSection'
import ProjectsGrid from './ProjectsGrid'

const schema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Milena Arquitetura',
  description: 'Arquitetura contemporânea com identidade e sofisticação. Projetos residenciais e comerciais.',
  url: 'https://milena-arquitetura.vercel.app',
  founder: { '@type': 'Person', name: 'Milena' },
}

export default function Home() {
  return (
    <>
      <SEO path="/" schema={schema} />
      <motion.div variants={fadeIn} initial="hidden" animate="visible">
        <HeroSection />
        <ProjectsGrid />
      </motion.div>
    </>
  )
}
