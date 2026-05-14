import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../../utils/supabase'
import { useAuth } from '../../../hooks/useAuth'

const MAX_ATTEMPTS = 5
const LOCKOUT_MS = 5 * 60 * 1000

export default function AdminLogin() {
  const navigate = useNavigate()
  const { user, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const attempts = useRef(0)
  const lockedUntil = useRef<number | null>(null)

  useEffect(() => {
    if (!loading && user) navigate('/admin', { replace: true })
  }, [user, loading, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!supabase) return

    if (lockedUntil.current && Date.now() < lockedUntil.current) {
      const secs = Math.ceil((lockedUntil.current - Date.now()) / 1000)
      setError(`Muitas tentativas. Aguarde ${secs}s para tentar novamente.`)
      return
    }

    setSubmitting(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      attempts.current += 1
      if (attempts.current >= MAX_ATTEMPTS) {
        lockedUntil.current = Date.now() + LOCKOUT_MS
        setError('Acesso bloqueado por 5 minutos após muitas tentativas incorretas.')
      } else {
        const remaining = MAX_ATTEMPTS - attempts.current
        setError(`Email ou senha incorretos. ${remaining} tentativa${remaining !== 1 ? 's' : ''} restante${remaining !== 1 ? 's' : ''}.`)
      }
      setSubmitting(false)
    } else {
      navigate('/admin', { replace: true })
    }
  }

  if (loading) return null

  return (
    <div className="min-h-screen bg-stone flex items-center justify-center p-6">
      <div className="w-full max-w-sm bg-white p-8 shadow-sm">
        <h1 className="font-serif text-2xl text-charcoal mb-1">Painel Admin</h1>
        <p className="text-sm text-mist mb-8">Milena Arquitetura</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs text-gray-500 mb-1" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-charcoal transition-colors"
              placeholder="admin@email.com"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1" htmlFor="password">Senha</label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-charcoal transition-colors"
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-charcoal text-white py-2.5 text-sm font-medium hover:bg-black transition-colors disabled:opacity-50 cursor-pointer"
          >
            {submitting ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}
