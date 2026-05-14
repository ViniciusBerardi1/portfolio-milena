import { motion } from 'framer-motion'
import { fadeIn } from '../../animations/variants'
import HeroSection from './HeroSection'
import ProjectsGrid from './ProjectsGrid'

export default function Home() {
  return (
    <motion.div variants={fadeIn} initial="hidden" animate="visible">
      <HeroSection />
      <ProjectsGrid />
    </motion.div>
  )
}
