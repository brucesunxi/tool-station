import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const format = formData.get('format') as string || 'png'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Please upload an image file' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const metadata = await sharp(buffer).metadata()
    let pipeline = sharp(buffer)
    let mimeType: string
    let ext: string

    switch (format) {
      case 'jpeg':
      case 'jpg':
        pipeline = pipeline.jpeg({ quality: 90, mozjpeg: true })
        mimeType = 'image/jpeg'
        ext = 'jpg'
        break
      case 'png':
        pipeline = pipeline.png({ compressionLevel: 8 })
        mimeType = 'image/png'
        ext = 'png'
        break
      case 'webp':
        pipeline = pipeline.webp({ quality: 90 })
        mimeType = 'image/webp'
        ext = 'webp'
        break
      case 'gif':
        pipeline = pipeline.gif()
        mimeType = 'image/gif'
        ext = 'gif'
        break
      case 'avif':
        pipeline = pipeline.avif({ quality: 80 })
        mimeType = 'image/avif'
        ext = 'avif'
        break
      default:
        return NextResponse.json({ error: `Unsupported format: ${format}` }, { status: 400 })
    }

    const outputBuffer = await pipeline.toBuffer()
    const base64 = outputBuffer.toString('base64')
    const dataUrl = `data:${mimeType};base64,${base64}`

    return NextResponse.json({
      convertedUrl: dataUrl,
      originalSize: buffer.length,
      convertedSize: outputBuffer.length,
      format,
      width: metadata.width,
      height: metadata.height,
      mimeType,
      ext,
    })
  } catch (error) {
    console.error('Conversion error:', error)
    return NextResponse.json(
      { error: 'Failed to convert image. Please try again.' },
      { status: 500 }
    )
  }
}
