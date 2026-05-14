import { NextRequest, NextResponse } from 'next/server'
import { PDFDocument } from 'pdf-lib'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large (max 50MB)' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const originalSize = bytes.byteLength

    const pdfDoc = await PDFDocument.load(bytes, { ignoreEncryption: true })
    pdfDoc.setTitle('')
    pdfDoc.setAuthor('')
    pdfDoc.setSubject('')
    pdfDoc.setKeywords([])
    pdfDoc.setProducer('')
    pdfDoc.setCreator('')

    const compressedBytes = await pdfDoc.save({ useObjectStreams: true })
    const compressedSize = compressedBytes.length
    const ratio = Math.round((1 - compressedSize / originalSize) * 100)

    const base64 = Buffer.from(compressedBytes).toString('base64')

    return NextResponse.json({
      dataUrl: `data:application/pdf;base64,${base64}`,
      originalSize,
      compressedSize,
      ratio,
    })
  } catch (error: any) {
    return NextResponse.json({ error: `Compression failed: ${error?.message || 'Unknown error'}` }, { status: 500 })
  }
}

export const maxDuration = 30
