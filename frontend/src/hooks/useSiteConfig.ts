import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'
import type { SiteConfig } from '../types'

export const DEFAULT_CONFIG: SiteConfig = {
  sobre_foto_url: '',
  sobre_nome: 'Milena',
  sobre_cargo: 'Arquiteta e Urbanista',
  sobre_bio1: 'Arquiteta e urbanista com mais de 10 anos de experiência em projetos residenciais e comerciais. Formada pela FAU-USP, com especialização em Design de Interiores pela FAAP.',
  sobre_bio2: 'Minha abordagem é sempre centrada no cliente: entender seus sonhos, sua rotina e sua personalidade é o ponto de partida para criar espaços que realmente façam sentido para quem os vive.',
  sobre_bio3: 'Acredito que a boa arquitetura não precisa gritar — ela sussurra, com elegância e precisão.',
  sobre_especialidades: [
    { titulo: 'Residencial', descricao: 'Casas e apartamentos que expressam a personalidade de quem os habita.' },
    { titulo: 'Comercial', descricao: 'Espaços corporativos e de varejo que comunicam a essência de cada marca.' },
    { titulo: 'Interiores', descricao: 'Design de interiores refinado, com atenção a cada detalhe e material.' },
    { titulo: 'Reformas', descricao: 'Transformações de espaços com respeito à história e propósito renovado.' },
  ],
  contato_email: 'milena@arquitetura.com.br',
  contato_whatsapp: '+55 11 99999-9999',
  contato_instagram: '@milena.arquitetura',
}

function parseConfig(data: Record<string, unknown>): SiteConfig {
  return {
    sobre_foto_url: (data.sobre_foto_url as string) ?? DEFAULT_CONFIG.sobre_foto_url,
    sobre_nome: (data.sobre_nome as string) ?? DEFAULT_CONFIG.sobre_nome,
    sobre_cargo: (data.sobre_cargo as string) ?? DEFAULT_CONFIG.sobre_cargo,
    sobre_bio1: (data.sobre_bio1 as string) ?? DEFAULT_CONFIG.sobre_bio1,
    sobre_bio2: (data.sobre_bio2 as string) ?? DEFAULT_CONFIG.sobre_bio2,
    sobre_bio3: (data.sobre_bio3 as string) ?? DEFAULT_CONFIG.sobre_bio3,
    sobre_especialidades:
      Array.isArray(data.sobre_especialidades) && data.sobre_especialidades.length > 0
        ? data.sobre_especialidades
        : DEFAULT_CONFIG.sobre_especialidades,
    contato_email: (data.contato_email as string) ?? DEFAULT_CONFIG.contato_email,
    contato_whatsapp: (data.contato_whatsapp as string) ?? DEFAULT_CONFIG.contato_whatsapp,
    contato_instagram: (data.contato_instagram as string) ?? DEFAULT_CONFIG.contato_instagram,
  }
}

export function useSiteConfig() {
  const [config, setConfig] = useState<SiteConfig>(DEFAULT_CONFIG)
  const [loading, setLoading] = useState(!!supabase)

  useEffect(() => {
    if (!supabase) return

    supabase
      .from('site_config')
      .select('*')
      .eq('id', 1)
      .single()
      .then(({ data }) => {
        if (data) setConfig(parseConfig(data as Record<string, unknown>))
        setLoading(false)
      })
  }, [])

  return { config, loading }
}
