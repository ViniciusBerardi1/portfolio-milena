# Documento MVP — Portfólio Profissional para Arquiteto

## Visão Geral do Projeto

Desenvolver um site moderno e sofisticado para apresentação de projetos arquitetônicos, funcionando como uma vitrine digital premium para clientes potenciais.

O objetivo é transmitir:

- Elegância
- Modernidade
- Credibilidade profissional
- Experiência visual imersiva
- Navegação fluida e interativa

O site deve priorizar:

- Design minimalista
- Performance
- Responsividade
- Experiência visual cinematográfica
- Facilidade de atualização de projetos futuramente

---

## Objetivo do MVP

O MVP terá como foco:

- Exibir projetos arquitetônicos
- Mostrar imagens renderizadas e fotos reais
- Permitir navegação interativa
- Possuir animações suaves (com degradação para mobile)
- Ter painel administrativo simples (Fase 4)
- Estar preparado para expansão

---

## Estrutura do Projeto

### Frontend

#### Tecnologias

| Tecnologia       | Objetivo                          |
|------------------|-----------------------------------|
| HTML5            | Estrutura                         |
| CSS3 / TailwindCSS | Estilização moderna             |
| TypeScript       | Tipagem e segurança               |
| React + Vite     | Estrutura profissional            |
| Framer Motion    | Animações e transições (escolha principal) |
| GSAP             | Apenas se necessário ScrollTrigger avançado — não usar junto com Framer Motion por padrão |
| Lenis            | Scroll suave                      |
| Swiper.js        | Carrosséis modernos               |
| Three.js         | Efeitos 3D — diferido para fase pós-MVP |

> **Nota sobre animações:** Framer Motion é a biblioteca principal para o projeto React. GSAP só deve ser introduzido se surgir necessidade específica que Framer Motion não resolva (ex: ScrollTrigger com pinning complexo). Usar os dois simultaneamente aumenta o bundle sem benefício real no MVP.

> **Nota sobre Three.js:** Tecnologia sofisticada com custo de implementação alto. Não entra no MVP. Avaliar apenas após as fases 1–4 estabilizadas.

> **Nota sobre performance em mobile:** Todas as animações devem respeitar `prefers-reduced-motion` e ter versão simplificada para dispositivos móveis. Animar com `will-change` e `transform` apenas — evitar animações em propriedades que causam reflow.

---

#### Bibliotecas de Animação

**1. Framer Motion (principal)**

Ideal para:
- Transições entre páginas
- Hover effects e cards animados
- Fade e scroll reveal
- Micro animações e UX refinada
- Integração nativa com React

**2. Lenis**

Ideal para:
- Smooth scrolling premium
- Sensação de site moderno de alto nível

**3. Swiper.js**

Ideal para:
- Carrossel de projetos
- Galerias interativas
- Slides fullscreen

**4. PhotoSwipe**

Ideal para:
- Lightbox de imagens em fullscreen
- Leve, moderno, sem dependências externas

> **Nota:** Fancybox foi removido. PhotoSwipe é mais leve, mais atual e sem dependência de jQuery.

---

### Estrutura Visual do Site

#### Página Inicial (Home)

**Hero Section**

Objetivo: impacto visual imediato.

Elementos:
- Imagem fullscreen
- Vídeo de fundo opcional
- Texto minimalista
- Animação suave de entrada
- Scroll reveal

Exemplo: *"Arquitetura contemporânea com identidade e sofisticação."*

---

**Seção de Projetos — Grid Dinâmico**

Cada projeto terá:
- Thumbnail
- Nome do projeto
- Categoria
- Hover animation
- Preview interativo

Interações:
- Zoom suave
- Movimento parallax leve
- Reveal animation conforme scroll

---

#### Página Individual do Projeto

Conteúdo:
- Galeria fullscreen
- Informações do projeto
- Localização
- Conceito arquitetônico
- Materiais utilizados
- Renderizações
- Planta (opcional)

Recursos visuais:
- Scroll storytelling
- Transições suaves
- Imagens em alta resolução com lazy loading

---

#### Sobre o Arquiteto

Conteúdo:
- História profissional
- Filosofia de design
- Especialidades
- Foto profissional
- Formação

---

#### Contato

Funcionalidades:
- Formulário de contato (dados salvos via Supabase — tabela `contatos`)
- WhatsApp
- Instagram
- Email
- Localização

---

### Estrutura de Pastas — Frontend

```
frontend/
├── components/
├── pages/
├── animations/
├── hooks/
├── types/
├── utils/
├── assets/
└── styles/
```

---

## Estrutura de Backend

### Decisão de Arquitetura

O backend do MVP é inteiramente suportado pelo **Supabase**. Não há necessidade de Node.js + Express nesta fase, pois o Supabase entrega nativamente:

- API REST e GraphQL auto-gerada
- Autenticação com JWT gerenciado internamente
- Storage para upload de imagens
- Row Level Security (RLS) para proteger rotas admin
- Edge Functions para lógica customizada futura

Um backend Express customizado só será relevante se surgir lógica de negócio complexa que o Supabase não resolva — isso não se aplica ao MVP.

---

### Stack

| Tecnologia        | Função                         |
|-------------------|-------------------------------|
| Supabase          | Banco de dados, Auth, Storage, API |
| PostgreSQL        | Banco relacional (via Supabase) |
| Supabase Auth     | Login admin com JWT nativo     |
| Supabase Storage  | Upload e servir imagens        |

---

### Funcionalidades Backend

**Painel Administrativo (Fase 4)**

- Login seguro via Supabase Auth
- Cadastro de projetos
- Editar projetos
- Excluir projetos
- Upload de imagens
- Organização por categorias

---

### Estrutura do Banco

**Tabela: projetos**

| Campo        | Tipo      |
|--------------|-----------|
| id           | UUID      |
| titulo       | VARCHAR   |
| descricao    | TEXT      |
| categoria    | VARCHAR   |
| localizacao  | VARCHAR   |
| capa_url     | TEXT      |
| created_at   | TIMESTAMP |

**Tabela: imagens_projeto**

| Campo       | Tipo    |
|-------------|---------|
| id          | UUID    |
| projeto_id  | UUID    |
| imagem_url  | TEXT    |
| alt_text    | VARCHAR |
| ordem       | INTEGER |

> **Nota:** Campo `alt_text` adicionado para SEO e acessibilidade. Imagens sem texto alternativo prejudicam indexação e não atendem padrões WCAG.

**Tabela: contatos**

| Campo      | Tipo      |
|------------|-----------|
| id         | UUID      |
| nome       | VARCHAR   |
| email      | VARCHAR   |
| mensagem   | TEXT      |
| created_at | TIMESTAMP |

> **Nota:** Tabela adicionada para receber submissões do formulário de contato, que estava especificado na UI mas sem correspondência no backend.

---

## Funcionalidades Interativas

1. **Smooth Scroll** — Lenis
2. **Page Transitions** — Framer Motion
3. **Mouse Interactions** — cursor personalizado, hover dinâmico, parallax leve
4. **Scroll Reveal** — elementos aparecem conforme o usuário navega
5. **Gallery Lightbox** — PhotoSwipe

---

## Responsividade

O site deve funcionar perfeitamente em:
- Desktop
- Tablet
- Mobile

Prioridade: **Mobile first**

Estratégia de animações em mobile:
- Respeitar `prefers-reduced-motion`
- Animações simplificadas em telas menores
- Sem parallax pesado em touch devices

---

## SEO

Implementar:
- Meta tags
- Open Graph
- Schema.org (structured data para obras criativas — `CreativeWork` / `VisualArtwork`)
- Sitemap
- URLs amigáveis
- Compressão de imagens
- `alt_text` em todas as imagens

---

## Performance

Otimizações:
- Lazy loading de imagens
- Formato WebP com fallback
- Code splitting por rota
- CDN para imagens via Supabase Storage
- Cache inteligente
- Animações apenas em propriedades `transform` e `opacity` (sem reflow)

---

## Hospedagem

| Camada   | Serviço  |
|----------|----------|
| Frontend | Vercel   |
| Backend  | Supabase (nativo, sem servidor separado no MVP) |
| Banco    | Supabase |
| Storage  | Supabase |

---

## Roadmap do MVP

**Fase 1 — Estrutura**
- Setup do projeto
- Layout inicial
- Responsividade mobile first

**Fase 2 — Visual Premium**
- Animações com Framer Motion
- Scroll effects com Lenis
- Carrosséis com Swiper.js
- Hover effects
- Lightbox com PhotoSwipe

**Fase 3 — Backend**
- Configuração do Supabase (banco, auth, storage)
- Tabelas e RLS
- Formulário de contato funcional
- Upload de imagens

**Fase 4 — Painel Admin**
- Login seguro
- CRUD de projetos
- Gerenciamento de imagens

**Fase 5 — Otimização**
- SEO completo (meta tags, Schema.org, sitemap)
- Performance (WebP, lazy loading, code splitting)
- Deploy final
