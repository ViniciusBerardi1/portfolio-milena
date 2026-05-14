import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../../utils/supabase'
import type { Projeto } from '../../../types'

export default function AdminProjects() {
  const [projetos, setProjetos] = useState<Projeto[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    fetchProjetos()
  }, [])

  async function fetchProjetos() {
    if (!supabase) return
    const { data } = await supabase
      .from('projetos')
      .select('*')
      .order('created_at', { ascending: false })
    setProjetos((data as Projeto[]) ?? [])
    setLoading(false)
  }

  async function handleDelete(id: string, titulo: string) {
    if (!confirm(`Excluir "${titulo}"? Essa ação não pode ser desfeita.`)) return
    if (!supabase) return

    setDeletingId(id)
    await supabase.from('projetos').delete().eq('id', id)
    setProjetos(prev => prev.filter(p => p.id !== id))
    setDeletingId(null)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-medium text-charcoal">Projetos</h1>
        <Link
          to="/admin/projetos/novo"
          className="bg-charcoal text-white text-sm px-4 py-2 hover:bg-black transition-colors"
        >
          + Novo projeto
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 bg-white border border-gray-200 rounded animate-pulse" />
          ))}
        </div>
      ) : projetos.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded p-12 text-center">
          <p className="text-mist text-sm">Nenhum projeto cadastrado.</p>
          <Link to="/admin/projetos/novo" className="text-charcoal text-sm underline mt-2 inline-block">
            Criar o primeiro projeto
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium uppercase tracking-wider w-16">Capa</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium uppercase tracking-wider">Título</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium uppercase tracking-wider hidden md:table-cell">Categoria</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium uppercase tracking-wider hidden lg:table-cell">Localização</th>
                <th className="text-right px-4 py-3 text-xs text-gray-500 font-medium uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {projetos.map(p => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    {p.capa_url ? (
                      <img src={p.capa_url} alt="" className="w-12 h-9 object-cover rounded" />
                    ) : (
                      <div className="w-12 h-9 bg-smoke rounded" />
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium text-charcoal">{p.titulo}</td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{p.categoria}</td>
                  <td className="px-4 py-3 text-gray-500 hidden lg:table-cell">{p.localizacao}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        to={`/admin/projetos/${p.id}/editar`}
                        className="text-xs text-gray-500 hover:text-charcoal transition-colors"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => handleDelete(p.id, p.titulo)}
                        disabled={deletingId === p.id}
                        className="text-xs text-red-400 hover:text-red-600 transition-colors disabled:opacity-50"
                      >
                        {deletingId === p.id ? '...' : 'Excluir'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
