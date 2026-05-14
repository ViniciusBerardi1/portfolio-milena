import { motion } from 'framer-motion'
import { fadeIn, fadeUp, staggerContainer } from '../../animations/variants'
import SEO from '../../components/SEO'

const ABOUT_IMAGE = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80'

const especialidades = [
  { titulo: 'Residencial', descricao: 'Casas e apartamentos que expressam a personalidade de quem os habita.' },
  { titulo: 'Comercial', descricao: 'Espaços corporativos e de varejo que comunicam a essência de cada marca.' },
  { titulo: 'Interiores', descricao: 'Design de interiores refinado, com atenção a cada detalhe e material.' },
  { titulo: 'Reformas', descricao: 'Transformações de espaços com respeito à história e propósito renovado.' },
]

const schema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Milena',
  jobTitle: 'Arquiteta e Urbanista',
  description: 'Arquiteta com mais de 10 anos de experiência em projetos residenciais e comerciais.',
  url: 'https://milena-arquitetura.vercel.app/sobre',
  alumniOf: [{ '@type': 'EducationalOrganization', name: 'FAU-USP' }],
}

export default function About() {
  return (
    <>
      <SEO
        title="Sobre"
        description="Arquiteta e urbanista com mais de 10 anos de experiência. Formada pela FAU-USP, especialização em Design de Interiores pela FAAP."
        path="/sobre"
        schema={schema}
      />
      <motion.div variants={fadeIn} initial="hidden" animate="visible">
      <section className="pt-40 pb-20 px-6 lg:px-12">
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
            className="font-serif text-5xl lg:text-7xl font-light text-charcoal leading-tight"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            Arquitetura com<br />
            <em>propósito</em>
          </motion.h1>
        </div>
      </section>

      <section className="px-6 lg:px-12 pb-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            className="overflow-hidden"
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <img
              src={ABOUT_IMAGE}
              alt="Milena, arquiteta"
              className="w-full object-cover aspect-[3/4]"
              loading="lazy"
            />
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h2
              className="font-serif text-3xl lg:text-4xl font-light text-charcoal mb-6"
              variants={fadeUp}
            >
              Milena
            </motion.h2>
            <motion.p
              className="text-mist leading-relaxed mb-6 font-light text-lg"
              variants={fadeUp}
            >
              Arquiteta e urbanista com mais de 10 anos de experiência em projetos residenciais e comerciais. Formada pela FAU-USP, com especialização em Design de Interiores pela FAAP.
            </motion.p>
            <motion.p
              className="text-mist leading-relaxed mb-6 font-light"
              variants={fadeUp}
            >
              Minha abordagem é sempre centrada no cliente: entender seus sonhos, sua rotina e sua personalidade é o ponto de partida para criar espaços que realmente façam sentido para quem os vive.
            </motion.p>
            <motion.p
              className="text-mist leading-relaxed font-light"
              variants={fadeUp}
            >
              Acredito que a boa arquitetura não precisa gritar — ela sussurra, com elegância e precisão.
            </motion.p>
          </motion.div>
        </div>
      </section>

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
            {especialidades.map(esp => (
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
    </motion.div>
    </>
  )
}
