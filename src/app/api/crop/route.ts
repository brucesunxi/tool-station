import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const width = parseInt(formData.get('width') as string) || 0
    const height = parseInt(formData.get('height') as string) || 0
    const mode = (formData.get('mode') as string) || 'resize'
    const fit = (formData.get('fit') as string) || 'cover'
    const format = (formData.get('format') as string) || 'auto'

    if (!file || !file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Please provide a valid image' }, { status: 400 })
    }

    if (width <= 0 || height <= 0) {
      return NextResponse.json({ error: 'Width and height must be positive numbers' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const metadata = await sharp(buffer).metadata()

    let pipeline = sharp(buffer)
    const fitMode = fit as keyof sharp.FitEnum || 'cover'

    if (mode === 'resize') {
      pipeline = pipeline.resize(width, height, { fit: fitMode, withoutEnlargement: false })
    } else if (mode === 'crop') {
      pipeline = pipeline.resize(width, height, { fit: 'cover', position: sharp.strategy.attention })
    }

    // Determine output format
    let targetFormat = format
    if (targetFormat === 'auto') {
      targetFormat = file.type === 'image/png' ? 'png'
        : file.type === 'image/webp' ? 'webp'
        : file.type === 'image/gif' ? 'gif'
        : 'jpeg'
    }

    const mimeType = targetFormat === 'jpeg' ? 'image/jpeg'
      : targetFormat === 'png' ? 'image/png'
      : targetFormat === 'webp' ? 'image/webp'
      : targetFormat === 'gif' ? 'image/gif'
      : 'image/jpeg'

    const outputBuffer = await pipeline.toFormat(targetFormat as any, { quality: 92 }).toBuffer()
    const base64 = outputBuffer.toString('base64')
    const newMetadata = await sharp(outputBuffer).metadata()

    return NextResponse.json({
      imageUrl: `data:${mimeType};base64,${base64}`,
      originalSize: buffer.length,
      newSize: outputBuffer.length,
      originalWidth: metadata.width,
      originalHeight: metadata.height,
      newWidth: newMetadata.width,
      newHeight: newMetadata.height,
      format: targetFormat,
    })
  } catch (error) {
    console.error('Crop/resize error:', error)
    return NextResponse.json(
      { error: 'Failed to process image. Try different dimensions.' },
      { status: 500 }
    )
  }
}
