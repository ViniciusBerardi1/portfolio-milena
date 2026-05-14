import { useState, useEffect, useRef } from 'react'
import { supabase } from '../../../utils/supabase'
import { DEFAULT_CONFIG } from '../../../hooks/useSiteConfig'
import type { SiteConfig, Especialidade } from '../../../types'

async function uploadFoto(file: File): Promise<string> {
  if (!supabase) throw new Error('Supabase não configurado')
  const ext = file.name.split('.').pop() ?? 'jpg'
  const path = `config/sobre-${Date.now()}.${ext}`
  const { error } = await supabase.storage.from('imagens').upload(path, file, { upsert: true })
  if (error) throw new Error(`Storage: ${error.message}`)
  return supabase.storage.from('imagens').getPublicUrl(path).data.publicUrl
}

export default function AdminConfig() {
  const [config, setConfig] = useState<SiteConfig>(DEFAULT_CONFIG)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [uploadingFoto, setUploadingFoto] = useState(false)
  const fotoInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!supabase) { setLoading(false); return }
    supabase
      .from('site_config')
      .select('*')
      .eq('id', 1)
      .single()
      .then(({ data }) => {
        if (data) {
          setConfig({
            sobre_foto_url: (data.sobre_foto_url as string) ?? DEFAULT_CONFIG.sobre_foto_url,
            sobre_nome: (data.sobre_nome as string) ?? DEFAULT_CONFIG.sobre_nome,
            sobre_cargo: (data.sobre_cargo as string) ?? DEFAULT_CONFIG.sobre_cargo,
            sobre_bio1: (data.sobre_bio1 as string) ?? DEFAULT_CONFIG.sobre_bio1,
            sobre_bio2: (data.sobre_bio2 as string) ?? DEFAULT_CONFIG.sobre_bio2,
            sobre_bio3: (data.sobre_bio3 as string) ?? DEFAULT_CONFIG.sobre_bio3,
            sobre_especialidades:
              Array.isArray(data.sobre_especialidades) && (data.sobre_especialidades as unknown[]).length > 0
                ? (data.sobre_especialidades as Especialidade[])
                : DEFAULT_CONFIG.sobre_especialidades,
            contato_email: (data.contato_email as string) ?? DEFAULT_CONFIG.contato_email,
            contato_whatsapp: (data.contato_whatsapp as string) ?? DEFAULT_CONFIG.contato_whatsapp,
            contato_instagram: (data.contato_instagram as string) ?? DEFAULT_CONFIG.contato_instagram,
          })
        }
        setLoading(false)
      })
  }, [])

  const set = <K extends keyof SiteConfig>(key: K, val: SiteConfig[K]) =>
    setConfig(prev => ({ ...prev, [key]: val }))

  const setEsp = (i: number, field: keyof Especialidade, val: string) =>
    setConfig(prev => ({
      ...prev,
      sobre_especialidades: prev.sobre_especialidades.map((e, idx) =>
        idx === i ? { ...e, [field]: val } : e
      ),
    }))

  const addEsp = () =>
    setConfig(prev => ({
      ...prev,
      sobre_especialidades: [...prev.sobre_especialidades, { titulo: '', descricao: '' }],
    }))

  const removeEsp = (i: number) =>
    setConfig(prev => ({
      ...prev,
      sobre_especialidades: prev.sobre_especialidades.filter((_, idx) => idx !== i),
    }))

  const handleFotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingFoto(true)
    setError('')
    try {
      const url = await uploadFoto(file)
      set('sobre_foto_url', url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer upload.')
    }
    setUploadingFoto(false)
    e.target.value = ''
  }

  const handleSave = async () => {
    if (!supabase) return
    setSaving(true)
    setError('')
    setSaved(false)

    const { error } = await supabase.from('site_config').upsert({
      id: 1,
      ...config,
      updated_at: new Date().toISOString(),
    })

    if (error) {
      setError(`Erro ao salvar: ${error.message}`)
    } else {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-5 h-5 border-2 border-gray-300 border-t-charcoal rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-medium text-charcoal">Configurações</h1>
        <div className="flex items-center gap-4">
          {saved && <span className="text-sm text-green-600">Salvo com sucesso.</span>}
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-charcoal text-white text-sm px-6 py-2.5 font-medium hover:bg-black transition-colors disabled:opacity-50 cursor-pointer"
          >
            {saving ? 'Salvando...' : 'Salvar alterações'}
          </button>
        </div>
      </div>

      {error && <p className="text-red-500 text-sm mb-6">{error}</p>}

      <div className="space-y-8">

        {/* ── SOBRE ── */}
        <div className="bg-white border border-gray-200 rounded p-6 space-y-6">
          <h2 className="text-sm font-semibold text-charcoal border-b border-gray-100 pb-3">
            Página Sobre
          </h2>

          {/* Foto */}
          <div>
            <label className="block text-xs text-gray-500 mb-2">Foto de perfil</label>
            <div className="flex items-start gap-4">
              {config.sobre_foto_url && (
                <img
                  src={config.sobre_foto_url}
                  alt="Foto de perfil"
                  className="w-20 h-24 object-cover rounded border border-gray-200 shrink-0"
                />
              )}
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={config.sobre_foto_url}
                  onChange={e => set('sobre_foto_url', e.target.value)}
                  placeholder="URL da imagem"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-charcoal transition-colors"
                />
                <button
                  type="button"
                  onClick={() => fotoInputRef.current?.click()}
                  disabled={uploadingFoto}
                  className="text-xs border border-gray-300 rounded px-3 py-1.5 hover:border-charcoal transition-colors disabled:opacity-50"
                >
                  {uploadingFoto ? 'Enviando...' : 'Fazer upload'}
                </button>
                <input
                  ref={fotoInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFotoUpload}
                />
              </div>
            </div>
          </div>

          {/* Nome e cargo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Nome</label>
              <input
                type="text"
                value={config.sobre_nome}
                onChange={e => set('sobre_nome', e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-charcoal transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Cargo / Título profissional</label>
              <input
                type="text"
                value={config.sobre_cargo}
                onChange={e => set('sobre_cargo', e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-charcoal transition-colors"
              />
            </div>
          </div>

          {/* Bio */}
          {(['sobre_bio1', 'sobre_bio2', 'sobre_bio3'] as const).map((field, i) => (
            <div key={field}>
              <label className="block text-xs text-gray-500 mb-1">
                Bio — parágrafo {i + 1}
              </label>
              <textarea
                rows={3}
                value={config[field]}
                onChange={e => set(field, e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-charcoal transition-colors resize-none"
              />
            </div>
          ))}

          {/* Especialidades */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs text-gray-500">Especialidades</label>
              <button
                type="button"
                onClick={addEsp}
                className="text-xs border border-gray-300 rounded px-3 py-1.5 hover:border-charcoal transition-colors"
              >
                + Adicionar
              </button>
            </div>
            <div className="space-y-2">
              {config.sobre_especialidades.map((esp, i) => (
                <div
                  key={i}
                  className="grid grid-cols-1 sm:grid-cols-[1fr_2fr_auto] gap-2 p-3 border border-gray-100 rounded"
                >
                  <input
                    type="text"
                    value={esp.titulo}
                    onChange={e => setEsp(i, 'titulo', e.target.value)}
                    placeholder="Título"
                    className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-charcoal transition-colors"
                  />
                  <input
                    type="text"
                    value={esp.descricao}
                    onChange={e => setEsp(i, 'descricao', e.target.value)}
                    placeholder="Descrição"
                    className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-charcoal transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => removeEsp(i)}
                    className="text-xs text-red-400 hover:text-red-600 transition-colors px-2 self-center"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── CONTATO ── */}
        <div className="bg-white border border-gray-200 rounded p-6 space-y-5">
          <h2 className="text-sm font-semibold text-charcoal border-b border-gray-100 pb-3">
            Página Contato
          </h2>

          <div>
            <label className="block text-xs text-gray-500 mb-1">Email</label>
            <input
              type="email"
              value={config.contato_email}
              onChange={e => set('contato_email', e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-charcoal transition-colors"
              placeholder="email@exemplo.com"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">WhatsApp</label>
            <input
              type="text"
              value={config.contato_whatsapp}
              onChange={e => set('contato_whatsapp', e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-charcoal transition-colors"
              placeholder="+55 11 99999-9999"
            />
            <p className="text-xs text-gray-400 mt-1">
              Inclua o código do país. Ex: +55 11 99999-9999 — o link wa.me será gerado automaticamente.
            </p>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">Instagram</label>
            <input
              type="text"
              value={config.contato_instagram}
              onChange={e => set('contato_instagram', e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-charcoal transition-colors"
              placeholder="@usuario"
            />
            <p className="text-xs text-gray-400 mt-1">
              Apenas o @usuario — o link será gerado automaticamente.
            </p>
          </div>
        </div>

      </div>

      {/* Botão salvar no rodapé também */}
      <div className="flex items-center justify-end gap-4 mt-6 pt-6 border-t border-gray-200">
        {saved && <span className="text-sm text-green-600">Salvo com sucesso.</span>}
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-charcoal text-white text-sm px-6 py-2.5 font-medium hover:bg-black transition-colors disabled:opacity-50 cursor-pointer"
        >
          {saving ? 'Salvando...' : 'Salvar alterações'}
        </button>
      </div>
    </div>
  )
}
