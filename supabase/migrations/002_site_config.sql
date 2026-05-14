-- ============================================================
-- 002_site_config.sql
-- Execute no SQL Editor do Supabase Dashboard
-- ============================================================

CREATE TABLE IF NOT EXISTS site_config (
  id                   INTEGER      PRIMARY KEY DEFAULT 1,
  sobre_foto_url       TEXT         DEFAULT 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80',
  sobre_nome           VARCHAR      DEFAULT 'Milena',
  sobre_cargo          VARCHAR      DEFAULT 'Arquiteta e Urbanista',
  sobre_bio1           TEXT         DEFAULT 'Arquiteta e urbanista com mais de 10 anos de experiência em projetos residenciais e comerciais. Formada pela FAU-USP, com especialização em Design de Interiores pela FAAP.',
  sobre_bio2           TEXT         DEFAULT 'Minha abordagem é sempre centrada no cliente: entender seus sonhos, sua rotina e sua personalidade é o ponto de partida para criar espaços que realmente façam sentido para quem os vive.',
  sobre_bio3           TEXT         DEFAULT 'Acredito que a boa arquitetura não precisa gritar — ela sussurra, com elegância e precisão.',
  sobre_especialidades JSONB        DEFAULT '[{"titulo":"Residencial","descricao":"Casas e apartamentos que expressam a personalidade de quem os habita."},{"titulo":"Comercial","descricao":"Espaços corporativos e de varejo que comunicam a essência de cada marca."},{"titulo":"Interiores","descricao":"Design de interiores refinado, com atenção a cada detalhe e material."},{"titulo":"Reformas","descricao":"Transformações de espaços com respeito à história e propósito renovado."}]',
  contato_email        VARCHAR      DEFAULT 'milena@arquitetura.com.br',
  contato_whatsapp     VARCHAR      DEFAULT '+55 11 99999-9999',
  contato_instagram    VARCHAR      DEFAULT '@milena.arquitetura',
  updated_at           TIMESTAMPTZ  DEFAULT now(),
  CONSTRAINT site_config_single_row CHECK (id = 1)
);

-- Seed the single row with defaults
INSERT INTO site_config (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;

-- Public can read
CREATE POLICY "site_config_select"
  ON site_config FOR SELECT USING (true);

-- Authenticated can update (upsert = update existing row)
CREATE POLICY "site_config_update"
  ON site_config FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Authenticated can insert (needed for upsert when row doesn't exist)
CREATE POLICY "site_config_insert"
  ON site_config FOR INSERT TO authenticated WITH CHECK (true);
