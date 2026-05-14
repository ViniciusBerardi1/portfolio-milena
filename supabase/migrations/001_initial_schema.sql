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

-- ============================================================
-- RESET: drop all existing policies before recreating
-- ============================================================

DROP POLICY IF EXISTS "projetos_public_read"   ON projetos;
DROP POLICY IF EXISTS "projetos_auth_insert"   ON projetos;
DROP POLICY IF EXISTS "projetos_auth_update"   ON projetos;
DROP POLICY IF EXISTS "projetos_auth_delete"   ON projetos;
DROP POLICY IF EXISTS "projetos_select"        ON projetos;
DROP POLICY IF EXISTS "projetos_insert"        ON projetos;
DROP POLICY IF EXISTS "projetos_update"        ON projetos;
DROP POLICY IF EXISTS "projetos_delete"        ON projetos;

DROP POLICY IF EXISTS "imagens_public_read"    ON imagens_projeto;
DROP POLICY IF EXISTS "imagens_auth_insert"    ON imagens_projeto;
DROP POLICY IF EXISTS "imagens_auth_update"    ON imagens_projeto;
DROP POLICY IF EXISTS "imagens_auth_delete"    ON imagens_projeto;
DROP POLICY IF EXISTS "imagens_select"         ON imagens_projeto;
DROP POLICY IF EXISTS "imagens_insert"         ON imagens_projeto;
DROP POLICY IF EXISTS "imagens_update"         ON imagens_projeto;
DROP POLICY IF EXISTS "imagens_delete"         ON imagens_projeto;

DROP POLICY IF EXISTS "contatos_public_insert" ON contatos;
DROP POLICY IF EXISTS "contatos_auth_read"     ON contatos;

-- ============================================================
-- projetos policies
-- ============================================================

CREATE POLICY "projetos_select"
  ON projetos FOR SELECT USING (true);

CREATE POLICY "projetos_insert"
  ON projetos FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "projetos_update"
  ON projetos FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "projetos_delete"
  ON projetos FOR DELETE TO authenticated USING (true);

-- ============================================================
-- imagens_projeto policies
-- ============================================================

CREATE POLICY "imagens_select"
  ON imagens_projeto FOR SELECT USING (true);

CREATE POLICY "imagens_insert"
  ON imagens_projeto FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "imagens_update"
  ON imagens_projeto FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "imagens_delete"
  ON imagens_projeto FOR DELETE TO authenticated USING (true);

-- ============================================================
-- contatos policies
-- ============================================================

CREATE POLICY "contatos_public_insert"
  ON contatos FOR INSERT WITH CHECK (true);

CREATE POLICY "contatos_auth_read"
  ON contatos FOR SELECT USING (auth.uid() IS NOT NULL);

-- ============================================================
-- Storage policies for bucket "imagens"
-- Ensure bucket exists as public
-- ============================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('imagens', 'imagens', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Drop any existing storage policies for this bucket
DROP POLICY IF EXISTS "imagens_storage_select" ON storage.objects;
DROP POLICY IF EXISTS "imagens_storage_insert" ON storage.objects;
DROP POLICY IF EXISTS "imagens_storage_update" ON storage.objects;
DROP POLICY IF EXISTS "imagens_storage_delete" ON storage.objects;

-- Public read (no auth needed to view images)
CREATE POLICY "imagens_storage_select"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'imagens');

-- Authenticated users can upload
CREATE POLICY "imagens_storage_insert"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'imagens');

-- Authenticated users can replace/update
CREATE POLICY "imagens_storage_update"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'imagens');

-- Authenticated users can delete
CREATE POLICY "imagens_storage_delete"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'imagens');
