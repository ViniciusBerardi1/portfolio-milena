-- ============================================================
-- 003_security_hardening.sql
-- Execute no SQL Editor do Supabase Dashboard
-- ============================================================

-- ── 0. Limpar imagem padrão do Unsplash da página Sobre ──────
-- A foto agora só aparece se for enviada pelo painel admin

UPDATE site_config
  SET sobre_foto_url = ''
  WHERE id = 1 AND sobre_foto_url LIKE '%unsplash%';

-- ── 1. Tabela de admins autorizados ─────────────────────────

CREATE TABLE IF NOT EXISTS admin_users (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_users_self_read"
  ON admin_users FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- ── 2. Função helper reutilizável ───────────────────────────

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_users WHERE user_id = auth.uid()
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ── 3. Constraints de tamanho em contatos ───────────────────

ALTER TABLE contatos
  ALTER COLUMN nome     TYPE VARCHAR(100),
  ALTER COLUMN email    TYPE VARCHAR(254),
  ALTER COLUMN mensagem TYPE VARCHAR(5000);

-- Validação de formato de email no banco (defesa contra API direta)
ALTER TABLE contatos
  ADD CONSTRAINT contatos_email_format
  CHECK (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$');

-- Bloquear null bytes e RTL override em texto livre
ALTER TABLE contatos
  ADD CONSTRAINT contatos_nome_safe
  CHECK (nome NOT SIMILAR TO '%[\x00-\x08\x0b\x0c\x0e-\x1f‪-‮⁦-⁩]%'),
  ADD CONSTRAINT contatos_mensagem_safe
  CHECK (mensagem NOT SIMILAR TO '%[\x00-\x08\x0b\x0c\x0e-\x1f‪-‮⁦-⁩]%');

-- ── 4. Políticas de ESCRITA: projetos ───────────────────────

DROP POLICY IF EXISTS "projetos_insert" ON projetos;
DROP POLICY IF EXISTS "projetos_update" ON projetos;
DROP POLICY IF EXISTS "projetos_delete" ON projetos;

CREATE POLICY "projetos_insert"
  ON projetos FOR INSERT TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "projetos_update"
  ON projetos FOR UPDATE TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "projetos_delete"
  ON projetos FOR DELETE TO authenticated
  USING (is_admin());

-- ── 5. Políticas de ESCRITA: imagens_projeto ─────────────────

DROP POLICY IF EXISTS "imagens_insert" ON imagens_projeto;
DROP POLICY IF EXISTS "imagens_update" ON imagens_projeto;
DROP POLICY IF EXISTS "imagens_delete" ON imagens_projeto;

CREATE POLICY "imagens_insert"
  ON imagens_projeto FOR INSERT TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "imagens_update"
  ON imagens_projeto FOR UPDATE TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "imagens_delete"
  ON imagens_projeto FOR DELETE TO authenticated
  USING (is_admin());

-- ── 6. Leitura de contatos: somente admin ───────────────────

DROP POLICY IF EXISTS "contatos_auth_read"  ON contatos;
DROP POLICY IF EXISTS "contatos_admin_read" ON contatos;

CREATE POLICY "contatos_admin_read"
  ON contatos FOR SELECT TO authenticated
  USING (is_admin());

-- ── 7. Políticas de ESCRITA: site_config ────────────────────

DROP POLICY IF EXISTS "site_config_update" ON site_config;
DROP POLICY IF EXISTS "site_config_insert" ON site_config;

CREATE POLICY "site_config_update"
  ON site_config FOR UPDATE TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "site_config_insert"
  ON site_config FOR INSERT TO authenticated
  WITH CHECK (is_admin());

-- ── 8. Políticas de ESCRITA: Storage ────────────────────────

DROP POLICY IF EXISTS "imagens_storage_insert" ON storage.objects;
DROP POLICY IF EXISTS "imagens_storage_update" ON storage.objects;
DROP POLICY IF EXISTS "imagens_storage_delete" ON storage.objects;

CREATE POLICY "imagens_storage_insert"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'imagens' AND is_admin());

CREATE POLICY "imagens_storage_update"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'imagens' AND is_admin());

CREATE POLICY "imagens_storage_delete"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'imagens' AND is_admin());

-- ── 9. Rate limiting para formulário de contato ─────────────
-- Usada pela Edge Function contact-submit

CREATE TABLE IF NOT EXISTS contact_rate_limit (
  id         BIGSERIAL    PRIMARY KEY,
  ip         VARCHAR(45)  NOT NULL,
  created_at TIMESTAMPTZ  DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_rate_limit_ip_time
  ON contact_rate_limit (ip, created_at);

ALTER TABLE contact_rate_limit ENABLE ROW LEVEL SECURITY;
-- Nenhuma policy pública: só a Edge Function (service role) pode inserir/ler

-- Limpeza automática de registros antigos (> 1 hora)
CREATE OR REPLACE FUNCTION cleanup_rate_limit() RETURNS void AS $$
  DELETE FROM contact_rate_limit WHERE created_at < now() - interval '1 hour';
$$ LANGUAGE sql SECURITY DEFINER;

-- ── 10. Desabilitar Realtime na tabela contatos ───────────────
-- Impede subscription spy mesmo que RLS falhe

ALTER PUBLICATION supabase_realtime DROP TABLE contatos;

-- ── INSTRUÇÃO FINAL ──────────────────────────────────────────
-- 1. Execute este script inteiro no SQL Editor do Supabase Dashboard
-- 2. Insira o UUID da Milena como admin:
--    INSERT INTO admin_users (user_id) VALUES ('<cole-o-uuid-aqui>');
--    UUID disponível em: Authentication > Users
-- 3. Deploy da Edge Function:
--    supabase functions deploy contact-submit
-- 4. No dashboard Supabase: Authentication > Settings
--    → Disable Signup: ON
--    → Rate limit for /auth/v1/token: 5 per minute
-- 5. No dashboard Storage: bucket "imagens"
--    → Allowed MIME types: image/jpeg,image/png,image/webp,image/avif,image/gif
--    → Max file size: 15728640 (15 MB)
