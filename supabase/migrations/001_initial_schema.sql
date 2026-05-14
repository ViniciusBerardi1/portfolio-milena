-- ============================================================
-- 001_initial_schema.sql
-- Execute no SQL Editor do Supabase Dashboard
-- ============================================================

-- projetos
CREATE TABLE IF NOT EXISTS projetos (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo      VARCHAR        NOT NULL,
  descricao   TEXT,
  categoria   VARCHAR,
  localizacao VARCHAR,
  capa_url    TEXT,
  created_at  TIMESTAMPTZ    DEFAULT now()
);

-- imagens_projeto
CREATE TABLE IF NOT EXISTS imagens_projeto (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  projeto_id  UUID REFERENCES projetos(id) ON DELETE CASCADE,
  imagem_url  TEXT           NOT NULL,
  alt_text    VARCHAR,
  ordem       INTEGER        DEFAULT 0
);

-- contatos
CREATE TABLE IF NOT EXISTS contatos (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome       VARCHAR        NOT NULL,
  email      VARCHAR        NOT NULL,
  mensagem   TEXT           NOT NULL,
  created_at TIMESTAMPTZ    DEFAULT now()
);

-- ============================================================
-- Row Level Security
-- ============================================================

ALTER TABLE projetos        ENABLE ROW LEVEL SECURITY;
ALTER TABLE imagens_projeto ENABLE ROW LEVEL SECURITY;
ALTER TABLE contatos        ENABLE ROW LEVEL SECURITY;

-- projetos: leitura pública, escrita somente autenticado
CREATE POLICY "projetos_public_read"
  ON projetos FOR SELECT USING (true);

CREATE POLICY "projetos_auth_insert"
  ON projetos FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "projetos_auth_update"
  ON projetos FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "projetos_auth_delete"
  ON projetos FOR DELETE USING (auth.uid() IS NOT NULL);

-- imagens_projeto: leitura pública, escrita somente autenticado
CREATE POLICY "imagens_public_read"
  ON imagens_projeto FOR SELECT USING (true);

CREATE POLICY "imagens_auth_insert"
  ON imagens_projeto FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "imagens_auth_update"
  ON imagens_projeto FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "imagens_auth_delete"
  ON imagens_projeto FOR DELETE USING (auth.uid() IS NOT NULL);

-- contatos: insert público, leitura somente autenticado
CREATE POLICY "contatos_public_insert"
  ON contatos FOR INSERT WITH CHECK (true);

CREATE POLICY "contatos_auth_read"
  ON contatos FOR SELECT USING (auth.uid() IS NOT NULL);

-- ============================================================
-- Storage
-- Criar manualmente no dashboard:
-- Storage > New bucket > nome: "imagens" > Public bucket: ON
-- ============================================================
