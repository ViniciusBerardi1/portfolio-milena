import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getProjetoById } from '../../utils/mockData'
import { fadeIn, fadeUp, staggerContainer, scaleIn } from '../../animations/variants'

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const projeto = id ? getProjetoById(id) : undefined

  if (!projeto) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-mist mb-6 font-light">Projeto não encontrado.</p>
          <button
            onClick={() => navigate('/')}
            className="text-xs tracking-widest uppercase underline text-charcoal hover:text-gold transition-colors"
          >
            Voltar ao início
          </button>
        </div>
      </div>
    )
  }

  return (
    <motion.article variants={fadeIn} initial="hidden" animate="visible">
      <div className="relative w-full overflow-hidden" style={{ height: '70vh' }}>
        <img
          src={projeto.capa_url.replace('w=800', 'w=1600')}
          alt={projeto.titulo}
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <motion.div
        className="max-w-4xl mx-auto px-6 lg:px-12 py-16"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={fadeUp}>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs text-mist tracking-widest uppercase mb-10 hover:text-gold transition-colors"
          >
            <svg width="16" height="8" viewBox="0 0 16 8" fill="none" aria-hidden="true">
              <path d="M0 4H15M5 0L0 4L5 8" stroke="currentColor" strokeWidth="1" />
            </svg>
            Todos os projetos
          </Link>
        </motion.div>

        <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3 text-xs text-mist tracking-widest uppercase mb-6">
          <span>{projeto.categoria}</span>
          <span className="text-smoke">—</span>
          <span>{projeto.localizacao}</span>
          <span className="text-smoke">—</span>
          <span>{new Date(projeto.created_at).getFullYear()}</span>
        </motion.div>

        <motion.h1
          variants={fadeUp}
          className="font-serif text-4xl lg:text-5xl font-light text-charcoal mb-8 leading-tight"
        >
          {projeto.titulo}
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="text-mist text-lg font-light leading-relaxed max-w-2xl"
        >
          {projeto.descricao}
        </motion.p>
      </motion.div>

      {projeto.imagens && projeto.imagens.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 lg:px-12 pb-28">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projeto.imagens.map((img, index) => (
              <motion.div
                key={img.id}
                className={index === 0 ? 'md:col-span-2' : ''}
                variants={scaleIn}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
              >
                <img
                  src={img.imagem_url}
                  alt={img.alt_text}
                  className="w-full object-cover"
                  style={{ aspectRatio: index === 0 ? '16 / 7' : '4 / 3' }}
                  loading="lazy"
                />
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.article>
  )
}
