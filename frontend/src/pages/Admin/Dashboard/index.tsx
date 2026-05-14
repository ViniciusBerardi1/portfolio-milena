import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../../utils/supabase'

interface Contato {
  id: string
  nome: string
  email: string
  mensagem: string
  created_at: string
}

export default function AdminDashboard() {
  const [projetoCount, setProjetoCount] = useState<number | null>(null)
  const [contatos, setContatos] = useState<Contato[]>([])

  useEffect(() => {
    if (!supabase) return

    supabase.from('projetos').select('id', { count: 'exact', head: true })
      .then(({ count }) => setProjetoCount(count ?? 0))

    supabase.from('contatos').select('*').order('created_at', { ascending: false }).limit(5)
      .then(({ data }) => setContatos((data as Contato[]) ?? []))
  }, [])

  return (
    <div>
      <h1 className="text-xl font-medium text-charcoal mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        <div className="bg-white border border-gray-200 rounded p-6">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Projetos</p>
          <p className="text-3xl font-medium text-charcoal">{projetoCount ?? '—'}</p>
          <Link to="/admin/projetos" className="text-xs text-mist hover:text-charcoal mt-3 inline-block transition-colors">
            Gerenciar →
          </Link>
        </div>
        <div className="bg-white border border-gray-200 rounded p-6">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Mensagens recentes</p>
          <p className="text-3xl font-medium text-charcoal">{contatos.length}</p>
        </div>
      </div>

      {contatos.length > 0 && (
        <div className="bg-white border border-gray-200 rounded">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-medium text-charcoal">Últimas mensagens de contato</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {contatos.map(c => (
              <div key={c.id} className="px-5 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-charcoal">{c.nome}</p>
                    <p className="text-xs text-mist">{c.email}</p>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{c.mensagem}</p>
                  </div>
                  <p className="text-xs text-gray-400 whitespace-nowrap shrink-0">
                    {new Date(c.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
