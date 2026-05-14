import type { Projeto } from '../types'

export const projetosMock: Projeto[] = [
  {
    id: '1',
    titulo: 'Residência Vila Nova',
    descricao: 'Projeto residencial que explora a relação entre interior e exterior através de grandes planos envidraçados e a integração com a paisagem natural. A linguagem contemporânea se manifesta em volumes limpos e materiais nobres.',
    categoria: 'Residencial',
    localizacao: 'São Paulo, SP',
    capa_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
    created_at: '2024-03-15',
    imagens: [
      { id: '1a', projeto_id: '1', imagem_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80', alt_text: 'Fachada principal da residência', ordem: 1 },
      { id: '1b', projeto_id: '1', imagem_url: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&q=80', alt_text: 'Sala de estar integrada', ordem: 2 },
      { id: '1c', projeto_id: '1', imagem_url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=80', alt_text: 'Cozinha contemporânea', ordem: 3 },
    ],
  },
  {
    id: '2',
    titulo: 'Escritório Contemporâneo',
    descricao: 'Espaço corporativo projetado para estimular a criatividade e a colaboração. O design biofílico e a entrada generosa de luz natural criam um ambiente de trabalho inspirador e produtivo.',
    categoria: 'Comercial',
    localizacao: 'Rio de Janeiro, RJ',
    capa_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
    created_at: '2024-01-20',
    imagens: [
      { id: '2a', projeto_id: '2', imagem_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80', alt_text: 'Área de trabalho colaborativa', ordem: 1 },
      { id: '2b', projeto_id: '2', imagem_url: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&q=80', alt_text: 'Sala de reunião', ordem: 2 },
    ],
  },
  {
    id: '3',
    titulo: 'Casa de Campo',
    descricao: 'Residência de fim de semana inserida em meio à natureza serrana. A arquitetura dialoga com a topografia e a vegetação local, usando madeira e pedra como materiais principais.',
    categoria: 'Residencial',
    localizacao: 'Campos do Jordão, SP',
    capa_url: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&q=80',
    created_at: '2023-11-10',
    imagens: [
      { id: '3a', projeto_id: '3', imagem_url: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=1200&q=80', alt_text: 'Vista externa da casa', ordem: 1 },
      { id: '3b', projeto_id: '3', imagem_url: 'https://images.unsplash.com/photo-1549497538-303791108f95?w=1200&q=80', alt_text: 'Área de lazer com paisagem', ordem: 2 },
    ],
  },
  {
    id: '4',
    titulo: 'Loft Industrial',
    descricao: 'Conversão de antigo galpão em residência contemporânea. A intervenção preserva a memória industrial do espaço enquanto insere elementos de conforto e sofisticação.',
    categoria: 'Residencial',
    localizacao: 'São Paulo, SP',
    capa_url: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80',
    created_at: '2023-08-05',
    imagens: [
      { id: '4a', projeto_id: '4', imagem_url: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&q=80', alt_text: 'Quarto principal', ordem: 1 },
      { id: '4b', projeto_id: '4', imagem_url: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&q=80', alt_text: 'Cozinha integrada ao living', ordem: 2 },
    ],
  },
  {
    id: '5',
    titulo: 'Apartamento Minimalista',
    descricao: 'Reforma completa de apartamento com foco em minimalismo e funcionalidade. Cada elemento foi cuidadosamente selecionado para criar um espaço harmonioso e atemporal.',
    categoria: 'Residencial',
    localizacao: 'São Paulo, SP',
    capa_url: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&q=80',
    created_at: '2023-05-18',
    imagens: [
      { id: '5a', projeto_id: '5', imagem_url: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1200&q=80', alt_text: 'Sala de estar minimalista', ordem: 1 },
    ],
  },
  {
    id: '6',
    titulo: 'Restaurante Moderno',
    descricao: 'Projeto gastronômico que explora a sobreposição entre experiência culinária e experiência espacial. O design cria ambiências distintas que se transformam ao longo do dia.',
    categoria: 'Comercial',
    localizacao: 'São Paulo, SP',
    capa_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
    created_at: '2023-02-28',
    imagens: [
      { id: '6a', projeto_id: '6', imagem_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80', alt_text: 'Salão principal do restaurante', ordem: 1 },
    ],
  },
]

export function getProjetoById(id: string): Projeto | undefined {
  return projetosMock.find(p => p.id === id)
}
