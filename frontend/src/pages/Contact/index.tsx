import { useState } from 'react'
import { motion } from 'framer-motion'
import { fadeIn, fadeUp, staggerContainer } from '../../animations/variants'
import type { ContatoForm } from '../../types'

const contatos = [
  { label: 'Email', value: 'milena@arquitetura.com.br', href: 'mailto:milena@arquitetura.com.br' },
  { label: 'WhatsApp', value: '+55 11 99999-9999', href: 'https://wa.me/5511999999999' },
  { label: 'Instagram', value: '@milena.arquitetura', href: 'https://instagram.com' },
]

export default function Contact() {
  const [form, setForm] = useState<ContatoForm>({ nome: '', email: '', mensagem: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    // Supabase integration in Fase 3
    await new Promise(r => setTimeout(r, 800))
    setStatus('sent')
  }

  return (
    <motion.div variants={fadeIn} initial="hidden" animate="visible">
      <section className="pt-40 pb-20 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <motion.p
            className="text-xs text-mist tracking-[0.3em] uppercase mb-4"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            Contato
          </motion.p>
          <motion.h1
            className="font-serif text-5xl lg:text-7xl font-light text-charcoal"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            Vamos criar<br />
            <em>juntos</em>
          </motion.h1>
        </div>
      </section>

      <section className="px-6 lg:px-12 pb-32">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.p
              className="text-mist font-light text-lg leading-relaxed mb-12"
              variants={fadeUp}
            >
              Tem um projeto em mente? Adoraria conversar. Me envie uma mensagem e responderei em até 48 horas.
            </motion.p>

            <div className="space-y-8">
              {contatos.map(c => (
                <motion.div key={c.label} variants={fadeUp} className="border-t border-smoke pt-6">
                  <p className="text-xs text-mist tracking-widest uppercase mb-2">{c.label}</p>
                  <a
                    href={c.href}
                    target={c.href.startsWith('http') ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    className="text-charcoal hover:text-gold transition-colors font-light"
                  >
                    {c.value}
                  </a>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {status === 'sent' ? (
              <div className="pt-4">
                <p className="font-serif text-3xl text-charcoal mb-4">Mensagem enviada.</p>
                <p className="text-mist font-light">Responderei em breve. Obrigada pelo contato.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-2">
                  <label className="text-xs text-mist tracking-widest uppercase" htmlFor="nome">
                    Nome
                  </label>
                  <input
                    id="nome"
                    name="nome"
                    type="text"
                    required
                    value={form.nome}
                    onChange={handleChange}
                    placeholder="Seu nome"
                    className="w-full border-b border-smoke bg-transparent py-3 text-charcoal focus:outline-none focus:border-charcoal transition-colors placeholder:text-mist/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-mist tracking-widest uppercase" htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="seu@email.com"
                    className="w-full border-b border-smoke bg-transparent py-3 text-charcoal focus:outline-none focus:border-charcoal transition-colors placeholder:text-mist/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-mist tracking-widest uppercase" htmlFor="mensagem">
                    Mensagem
                  </label>
                  <textarea
                    id="mensagem"
                    name="mensagem"
                    required
                    rows={5}
                    value={form.mensagem}
                    onChange={handleChange}
                    placeholder="Conte-me sobre seu projeto..."
                    className="w-full border-b border-smoke bg-transparent py-3 text-charcoal focus:outline-none focus:border-charcoal transition-colors resize-none placeholder:text-mist/50"
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="text-xs tracking-[0.2em] uppercase font-medium text-charcoal border border-charcoal px-8 py-4 hover:bg-charcoal hover:text-white transition-all duration-300 disabled:opacity-50 cursor-pointer"
                >
                  {status === 'sending' ? 'Enviando...' : 'Enviar mensagem'}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </section>
    </motion.div>
  )
}
