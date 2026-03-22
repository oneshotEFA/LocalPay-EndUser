import { Buffer } from 'node:buffer'
import { NextRequest, NextResponse } from 'next/server'
import { extractTextFromImageBuffer } from '@/lib/server/imageExtraction'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file')
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ message: 'No file provided' }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const text = await extractTextFromImageBuffer(buffer)

    return NextResponse.json({ text })
  } catch (error: any) {
    console.error('extract-screenshot error', error)
    return NextResponse.json({ message: error?.message ?? 'Failed to extract text' }, { status: 500 })
  }
}
