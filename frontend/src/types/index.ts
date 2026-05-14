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
