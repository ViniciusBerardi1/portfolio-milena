import { motion } from 'framer-motion'
import { fadeIn, fadeUp, staggerContainer } from '../../animations/variants'
import SEO from '../../components/SEO'
import { useSiteConfig } from '../../hooks/useSiteConfig'

export default function About() {
  const { config } = useSiteConfig()

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: config.sobre_nome,
    jobTitle: config.sobre_cargo,
    description: config.sobre_bio1,
    url: 'https://milena-arquitetura.vercel.app/sobre',
    alumniOf: [{ '@type': 'EducationalOrganization', name: 'FAU-USP' }],
  }

  return (
    <>
      <SEO
        title="Sobre"
        description={config.sobre_bio1}
        path="/sobre"
        schema={schema}
      />
      <motion.div variants={fadeIn} initial="hidden" animate="visible">
      <section className="pt-28 md:pt-40 pb-12 md:pb-20 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <motion.p
            className="text-xs text-mist tracking-[0.3em] uppercase mb-4"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            Sobre
          </motion.p>
          <motion.h1
            className="font-serif text-4xl sm:text-5xl lg:text-7xl font-light text-charcoal leading-tight"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            Arquitetura com <em>propósito</em>
          </motion.h1>
        </div>
      </section>

      <section className="px-6 lg:px-12 pb-16 md:pb-24">
        <div className={`max-w-7xl mx-auto grid grid-cols-1 gap-10 lg:gap-16 items-center${config.sobre_foto_url ? ' lg:grid-cols-2' : ''}`}>
          {config.sobre_foto_url && (
            <motion.div
              className="overflow-hidden"
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <img
                src={config.sobre_foto_url}
                alt={config.sobre_nome + ', arquiteta'}
                className="w-full object-cover aspect-[3/4]"
                loading="lazy"
              />
            </motion.div>
          )}

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h2
              className="font-serif text-3xl lg:text-4xl font-light text-charcoal mb-1"
              variants={fadeUp}
            >
              {config.sobre_nome}
            </motion.h2>
            <motion.p
              className="text-xs text-mist tracking-widest uppercase mb-6"
              variants={fadeUp}
            >
              {config.sobre_cargo}
            </motion.p>
            <motion.p
              className="text-mist leading-relaxed mb-6 font-light text-lg"
              variants={fadeUp}
            >
              {config.sobre_bio1}
            </motion.p>
            {config.sobre_bio2 && (
              <motion.p
                className="text-mist leading-relaxed mb-6 font-light"
                variants={fadeUp}
              >
                {config.sobre_bio2}
              </motion.p>
            )}
            {config.sobre_bio3 && (
              <motion.p
                className="text-mist leading-relaxed font-light"
                variants={fadeUp}
              >
                {config.sobre_bio3}
              </motion.p>
            )}
          </motion.div>
        </div>
      </section>

      {config.sobre_especialidades.length > 0 && (
        <section className="bg-stone py-24 px-6 lg:px-12">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="mb-16"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <p className="text-xs text-mist tracking-[0.3em] uppercase mb-3">Atuação</p>
              <h2 className="font-serif text-4xl font-light text-charcoal">Especialidades</h2>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {config.sobre_especialidades.map(esp => (
                <motion.div
                  key={esp.titulo}
                  variants={fadeUp}
                  className="border-t border-smoke pt-6"
                >
                  <h3 className="font-serif text-xl text-charcoal mb-3">{esp.titulo}</h3>
                  <p className="text-mist text-sm font-light leading-relaxed">{esp.descricao}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}
    </motion.div>
    </>
  )
}
