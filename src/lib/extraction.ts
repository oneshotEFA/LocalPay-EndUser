const EXTRACT_ENDPOINT = '/api/extract-screenshot'

export async function fetchExtractedText(file: Blob, fileName = 'screenshot.png'): Promise<string> {
  const form = new FormData()
  form.append('file', file, fileName)

  const res = await fetch(EXTRACT_ENDPOINT, { method: 'POST', body: form })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body?.message ?? 'Extraction request failed')
  }

  const data = await res.json()
  return typeof data.text === 'string' ? data.text : ''
}

export function base64ToBlob(base64: string): Blob | null {
  if (!base64) return null
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i)
  }
  return new Blob([bytes], { type: 'image/png' })
}
