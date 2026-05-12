import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const quality = parseInt(formData.get('quality') as string) || 80
    const format = (formData.get('format') as string) || 'auto'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const originalSize = buffer.length

    let compressedBuffer: Buffer
    let outputFormat: string

    // Determine output format
    const targetFormat = format !== 'auto'
      ? format
      : file.type === 'image/png' ? 'png'
      : file.type === 'image/webp' ? 'webp'
      : file.type === 'image/gif' ? 'gif'
      : 'jpeg'
    outputFormat = targetFormat

    // Get image metadata
    const metadata = await sharp(buffer).metadata()

    // Compress
    const pipeline = sharp(buffer)

    if (targetFormat === 'jpeg') {
      pipeline.jpeg({ quality, mozjpeg: true })
    } else if (targetFormat === 'png') {
      pipeline.png({ quality, compressionLevel: 9 })
    } else if (targetFormat === 'webp') {
      pipeline.webp({ quality })
    } else if (targetFormat === 'gif') {
      // GIF compression is limited
      compressedBuffer = buffer
    }

    if (targetFormat !== 'gif') {
      compressedBuffer = await pipeline.toBuffer()
    }

    const compressedSize = compressedBuffer!.length
    const base64 = compressedBuffer!.toString('base64')
    const mimeType = targetFormat === 'jpeg' ? 'image/jpeg'
      : targetFormat === 'png' ? 'image/png'
      : targetFormat === 'webp' ? 'image/webp'
      : targetFormat === 'gif' ? 'image/gif'
      : 'application/octet-stream'

    const dataUrl = `data:${mimeType};base64,${base64}`

    return NextResponse.json({
      compressedUrl: dataUrl,
      originalSize,
      compressedSize,
      format: outputFormat,
      width: metadata.width,
      height: metadata.height,
    })
  } catch (error) {
    console.error('Compression error:', error)
    return NextResponse.json(
      { error: 'Failed to compress image. Please try again.' },
      { status: 500 }
    )
  }
}

