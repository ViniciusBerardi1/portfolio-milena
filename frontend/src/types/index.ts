export interface Projeto {
  id: string
  titulo: string
  descricao: string
  categoria: string
  localizacao: string
  capa_url: string
  created_at: string
  imagens?: ImagemProjeto[]
}

export interface ImagemProjeto {
  id: string
  projeto_id: string
  imagem_url: string
  alt_text: string
  ordem: number
}

export interface ContatoForm {
  nome: string
  email: string
  mensagem: string
}

export interface Especialidade {
  titulo: string
  descricao: string
}

export interface SiteConfig {
  sobre_foto_url: string
  sobre_nome: string
  sobre_cargo: string
  sobre_bio1: string
  sobre_bio2: string
  sobre_bio3: string
  sobre_especialidades: Especialidade[]
  contato_email: string
  contato_whatsapp: string
  contato_instagram: string
}
