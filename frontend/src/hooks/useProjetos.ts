import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'
import type { Projeto } from '../types'
import { projetosMock } from '../utils/mockData'

interface State {
  projetos: Projeto[]
  loading: boolean
  error: string | null
}

export function useProjetos() {
  const [state, setState] = useState<State>({ projetos: [], loading: true, error: null })

  useEffect(() => {
    if (!supabase) {
      setState({ projetos: projetosMock, loading: false, error: null })
      return
    }

    supabase
      .from('projetos')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          setState({ projetos: projetosMock, loading: false, error: error.message })
        } else {
          setState({ projetos: (data as Projeto[]) ?? [], loading: false, error: null })
        }
      })
  }, [])

  return state
}
