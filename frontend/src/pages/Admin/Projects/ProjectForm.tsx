import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { supabase } from '../../../utils/supabase'
import { uploadImage } from '../../../utils/uploadImage'
import type { ImagemProjeto } from '../../../types'

type ExistingImage = { type: 'existing'; id: string; url: string; alt_text: string }
type NewImage = { type: 'new'; file: File; preview: string; alt_text: string }
type ImageItem = ExistingImage | NewImage

const CATEGORIAS = ['Residencial', 'Comercial', 'Interiores', 'Reforma', 'Outro']

export default function ProjectForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEditing = Boolean(id)
  const capaInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)

  const [titulo, setTitulo] = useState('')
  const [descricao, setDescricao] = useState('')
  const [categoria, setCategoria] = useState('')
  const [localizacao, setLocalizacao] = useState('')

  const [capaUrl, setCapaUrl] = useState('')
  const [capaFile, setCapaFile] = useState<File | null>(null)
  const [capaPreview, setCapaPreview] = useState('')

  const [images, setImages] = useState<ImageItem[]>([])
  const [removedIds, setRemovedIds] = useState<string[]>([])

  const [loading, setLoading] = useState(isEditing)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEditing || !supabase) { setLoading(false); return }

    supabase
      .from('projetos')
      .select('*, imagens_projeto(*)')
      .eq('id', id)
      .single()
      .then(({ data }) => {
        if (!data) { navigate('/admin/projetos'); return }
        setTitulo(data.titulo ?? '')
        setDescricao(data.descricao ?? '')
        setCategoria(data.categoria ?? '')
        setLocalizacao(data.localizacao ?? '')
        setCapaUrl(data.capa_url ?? '')

        const sorted = ((data.imagens_projeto as ImagemProjeto[]) ?? [])
          .sort((a, b) => a.ordem - b.ordem)
          .map(img => ({
            type: 'existing' as const,
            id: img.id,
            url: img.imagem_url,
            alt_text: img.alt_text ?? '',
          }))
        setImages(sorted)
        setLoading(false)
      })
  }, [id, isEditing, navigate])

  const handleCapaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setCapaFile(file)
    setCapaPreview(URL.createObjectURL(file))
  }

  const handleGalleryAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    const newItems: NewImage[] = files.map(file => ({
      type: 'new',
      file,
      preview: URL.createObjectURL(file),
      alt_text: titulo || file.name,
    }))
    setImages(prev => [...prev, ...newItems])
    e.target.value = ''
  }

  const moveImage = (index: number, direction: -1 | 1) => {
    const newImages = [...images]
    const target = index + direction
    if (target < 0 || target >= newImages.length) return;
    [newImages[index], newImages[target]] = [newImages[target], newImages[index]]
    setImages(newImages)
  }

  const removeImage = (index: number) => {
    const item = images[index]
    if (item.type === 'existing') setRemovedIds(prev => [...prev, item.id])
    else URL.revokeObjectURL(item.preview)
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!supabase) return
    setSubmitting(true)
    setError('')

    try {
      // 1. Upload capa se houve troca
      let finalCapaUrl = capaUrl
      if (capaFile) finalCapaUrl = await uploadImage(supabase!, capaFile, 'projetos')

      const projetoData = { titulo, descricao, categoria, localizacao, capa_url: finalCapaUrl }

      // 2. Criar ou atualizar projeto
      let projetoId = id
      if (!isEditing) {
        const { data, error } = await supabase.from('projetos').insert(projetoData).select('id').single()
        if (error) throw new Error(`Projetos DB: ${error.message}`)
        projetoId = data.id
      } else {
        const { error } = await supabase.from('projetos').update(projetoData).eq('id', id!)
        if (error) throw new Error(`Projetos DB update: ${error.message}`)
      }

      // 3. Remover imagens deletadas
      if (removedIds.length > 0) {
        await supabase.from('imagens_projeto').delete().in('id', removedIds)
      }

      // 4. Processar imagens: upload novas + atualizar ordem das existentes
      for (let i = 0; i < images.length; i++) {
        const item = images[i]
        if (item.type === 'new') {
          const url = await uploadImage(supabase!, item.file, 'projetos')
          const { error } = await supabase.from('imagens_projeto').insert({
            projeto_id: projetoId,
            imagem_url: url,
            alt_text: item.alt_text,
            ordem: i,
          })
          if (error) throw new Error(`Imagens DB: ${error.message}`)
        } else {
          await supabase.from('imagens_projeto').update({ ordem: i }).eq('id', item.id)
        }
      }

      navigate('/admin/projetos')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar projeto.')
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-5 h-5 border-2 border-gray-300 border-t-charcoal rounded-full animate-spin" />
      </div>
    )
  }

  const capaDisplayUrl = capaPreview || capaUrl

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Link to="/admin/projetos" className="text-sm text-gray-500 hover:text-charcoal transition-colors">
          ← Projetos
        </Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-xl font-medium text-charcoal">
          {isEditing ? 'Editar projeto' : 'Novo projeto'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Informações */}
        <div className="bg-white border border-gray-200 rounded p-6 space-y-5">
          <h2 className="text-sm font-medium text-charcoal">Informações</h2>

          <div>
            <label className="block text-xs text-gray-500 mb-1">Título *</label>
            <input
              type="text"
              required
              value={titulo}
              onChange={e => setTitulo(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-charcoal transition-colors"
              placeholder="Ex: Residência Vila Nova"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">Descrição</label>
            <textarea
              rows={4}
              value={descricao}
              onChange={e => setDescricao(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-charcoal transition-colors resize-none"
              placeholder="Descreva o conceito e os destaques do projeto..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Categoria</label>
              <select
                value={categoria}
                onChange={e => setCategoria(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-charcoal transition-colors bg-white"
              >
                <option value="">Selecione...</option>
                {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Localização</label>
              <input
                type="text"
                value={localizacao}
                onChange={e => setLocalizacao(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-charcoal transition-colors"
                placeholder="Ex: São Paulo, SP"
              />
            </div>
          </div>
        </div>

        {/* Imagem de capa */}
        <div className="bg-white border border-gray-200 rounded p-6">
          <h2 className="text-sm font-medium text-charcoal mb-4">Imagem de capa</h2>
          <div className="flex gap-4 items-start">
            {capaDisplayUrl && (
              <img src={capaDisplayUrl} alt="Capa" className="w-32 h-24 object-cover rounded border border-gray-200" />
            )}
            <div>
              <button
                type="button"
                onClick={() => capaInputRef.current?.click()}
                className="text-sm border border-gray-300 rounded px-4 py-2 hover:border-charcoal transition-colors"
              >
                {capaDisplayUrl ? 'Trocar imagem' : 'Selecionar imagem'}
              </button>
              <p className="text-xs text-gray-400 mt-2">JPG, PNG ou WebP. Recomendado: 1200×800px.</p>
              <input
                ref={capaInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleCapaChange}
              />
            </div>
          </div>
        </div>

        {/* Galeria */}
        <div className="bg-white border border-gray-200 rounded p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-charcoal">Galeria de imagens</h2>
            <button
              type="button"
              onClick={() => galleryInputRef.current?.click()}
              className="text-xs border border-gray-300 rounded px-3 py-1.5 hover:border-charcoal transition-colors"
            >
              + Adicionar imagens
            </button>
            <input
              ref={galleryInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleGalleryAdd}
            />
          </div>

          {images.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8 border border-dashed border-gray-200 rounded">
              Nenhuma imagem adicionada ainda.
            </p>
          ) : (
            <div className="space-y-2">
              {images.map((img, i) => (
                <div key={img.type === 'existing' ? img.id : img.preview} className="flex items-center gap-3 p-2 border border-gray-100 rounded">
                  <img
                    src={img.type === 'existing' ? img.url : img.preview}
                    alt=""
                    className="w-16 h-12 object-cover rounded shrink-0"
                  />
                  <input
                    type="text"
                    value={img.alt_text}
                    onChange={e => {
                      const updated = [...images]
                      updated[i] = { ...updated[i], alt_text: e.target.value }
                      setImages(updated)
                    }}
                    placeholder="Descrição da imagem (alt text)"
                    className="flex-1 border border-gray-200 rounded px-2 py-1.5 text-xs focus:outline-none focus:border-gray-400 transition-colors"
                  />
                  <div className="flex flex-col gap-0.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => moveImage(i, -1)}
                      disabled={i === 0}
                      className="text-xs text-gray-400 hover:text-charcoal disabled:opacity-20 px-1"
                      title="Mover para cima"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => moveImage(i, 1)}
                      disabled={i === images.length - 1}
                      className="text-xs text-gray-400 hover:text-charcoal disabled:opacity-20 px-1"
                      title="Mover para baixo"
                    >
                      ↓
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="text-xs text-red-400 hover:text-red-600 transition-colors shrink-0 px-1"
                    title="Remover"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={submitting}
            className="bg-charcoal text-white text-sm px-6 py-2.5 font-medium hover:bg-black transition-colors disabled:opacity-50 cursor-pointer"
          >
            {submitting ? 'Salvando...' : isEditing ? 'Salvar alterações' : 'Criar projeto'}
          </button>
          <Link
            to="/admin/projetos"
            className="text-sm text-gray-500 hover:text-charcoal transition-colors px-4 py-2.5"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  )
}
