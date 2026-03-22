import sharp from 'sharp'
import Tesseract from 'tesseract.js'

const BASE_WIDTH = 1500

export async function extractTextFromImageBuffer(buffer: Buffer): Promise<string> {
  if (!buffer?.length) return ''

  const [buffer1, buffer2] = await Promise.all([
    sharp(buffer).resize({ width: BASE_WIDTH }).grayscale().normalize().toBuffer(),
    sharp(buffer)
      .resize({ width: BASE_WIDTH })
      .modulate({ saturation: 2 })
      .normalize()
      .toBuffer(),
  ])

  const [res1, res2] = await Promise.all([
    Tesseract.recognize(buffer1, 'eng'),
    Tesseract.recognize(buffer2, 'eng'),
  ])

  const combined = `${res1.data.text ?? ''} ${res2.data.text ?? ''}`
  return sanitizeOCR(combined)
}

function sanitizeOCR(text: string): string {
  return text
    .replace(/\n/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/[^\x20-\x7E]/g, '')
    .trim()
}
