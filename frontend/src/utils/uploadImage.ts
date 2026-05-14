import type { SupabaseClient } from '@supabase/supabase-js'

const ALLOWED_MIMES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/gif',
])

const MIME_TO_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
  'image/gif': 'gif',
}

const MAX_BYTES = 15 * 1024 * 1024 // 15 MB

function secureRandomId(): string {
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('')
}

export async function uploadImage(
  client: SupabaseClient,
  file: File,
  folder: string
): Promise<string> {
  if (!ALLOWED_MIMES.has(file.type))
    throw new Error('Tipo de arquivo não permitido. Use JPG, PNG, WebP, AVIF ou GIF.')

  if (file.size > MAX_BYTES)
    throw new Error('O arquivo excede o limite de 15 MB.')

  const ext = MIME_TO_EXT[file.type] ?? 'bin'
  const path = `${folder}/${secureRandomId()}.${ext}`

  const { error } = await client.storage.from('imagens').upload(path, file, {
    contentType: file.type,
    cacheControl: '3600',
  })
  if (error) throw new Error('Erro no upload da imagem.')

  return client.storage.from('imagens').getPublicUrl(path).data.publicUrl
}
