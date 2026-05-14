import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'
import type { Projeto, ImagemProjeto } from '../types'
import { getProjetoById } from '../utils/mockData'

interface State {
  projeto: Projeto | undefined
  loading: boolean
  error: string | null
}

export function useProjeto(id: string | undefined) {
  const [state, setState] = useState<State>({ projeto: undefined, loading: true, error: null })

  useEffect(() => {
    if (!id) {
      setState({ projeto: undefined, loading: false, error: null })
      return
    }

    if (!supabase) {
      setState({ projeto: getProjetoById(id), loading: false, error: null })
      return
    }

    supabase
      .from('projetos')
      .select('*, imagens_projeto(*)')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          setState({ projeto: getProjetoById(id), loading: false, error: error?.message ?? null })
          return
        }

        const raw = data as Projeto & { imagens_projeto: ImagemProjeto[] }
        const projeto: Projeto = {
          ...raw,
          imagens: (raw.imagens_projeto ?? []).sort((a, b) => a.ordem - b.ordem),
        }
        setState({ projeto, loading: false, error: null })
      })
  }, [id])

  return state
}
