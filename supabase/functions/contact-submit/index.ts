import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RATE_LIMIT_WINDOW_SEC = 60
const RATE_LIMIT_MAX        = 3   // 3 submissões por IP por minuto

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface Body {
  nome: string
  email: string
  mensagem: string
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin':  '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey',
      },
    })
  }

  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  // ── Rate limiting por IP ─────────────────────────────────
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  )

  // Contar submissões recentes deste IP (usando tabela de rate limit)
  const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_SEC * 1000).toISOString()

  const { count } = await supabase
    .from('contact_rate_limit')
    .select('*', { count: 'exact', head: true })
    .eq('ip', ip)
    .gte('created_at', windowStart)

  if ((count ?? 0) >= RATE_LIMIT_MAX) {
    return new Response(
      JSON.stringify({ error: 'Muitas mensagens enviadas. Aguarde 1 minuto.' }),
      { status: 429, headers: { 'Content-Type': 'application/json' } },
    )
  }

  // ── Validar payload ──────────────────────────────────────
  let body: Body
  try {
    body = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: 'JSON inválido.' }), { status: 400 })
  }

  const { nome, email, mensagem } = body

  if (!nome?.trim() || nome.length > 100)
    return new Response(JSON.stringify({ error: 'Nome inválido.' }), { status: 400 })

  if (!EMAIL_RE.test(email ?? '') || email.length > 254)
    return new Response(JSON.stringify({ error: 'Email inválido.' }), { status: 400 })

  if (!mensagem?.trim() || mensagem.length < 10 || mensagem.length > 5000)
    return new Response(JSON.stringify({ error: 'Mensagem inválida.' }), { status: 400 })

  // ── Registrar tentativa de rate limit ────────────────────
  await supabase.from('contact_rate_limit').insert({ ip })

  // ── Inserir contato ──────────────────────────────────────
  const { error } = await supabase.from('contatos').insert({
    nome:     nome.trim().slice(0, 100),
    email:    email.trim().slice(0, 254),
    mensagem: mensagem.trim().slice(0, 5000),
  })

  if (error) {
    console.error('DB error:', error.message)
    return new Response(JSON.stringify({ error: 'Erro ao enviar.' }), { status: 500 })
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
})
