import { NextRequest, NextResponse } from 'next/server'
import { Document, Packer, Paragraph, ImageRun, TextRun, PageBreak } from 'docx'
import sharp from 'sharp'

// Extract images from PDF raw bytes
function extractImagesFromPdf(buffer: Buffer): { data: Buffer; width: number; height: number; ext: string }[] {
  const images: { data: Buffer; width: number; height: number; ext: string }[] = []
  const str = buffer.toString('binary')

  // Find all objects with /Subtype /Image
  const objRegex = /(\d+ \d+ obj\n?)([\s\S]*?)endobj/g
  let match

  while ((match = objRegex.exec(str)) !== null) {
    const objContent = match[2]

    // Check if it's an image
    if (!/\/Subtype\s*\/Image/.test(objContent)) continue

    // Extract dimensions
    const wMatch = objContent.match(/\/Width\s+(\d+)/)
    const hMatch = objContent.match(/\/Height\s+(\d+)/)
    const filterMatch = objContent.match(/\/Filter\s*\[?\/(\w+)\]?/)

    const width = wMatch ? parseInt(wMatch[1]) : 0
    const height = hMatch ? parseInt(hMatch[1]) : 0
    if (!width || !height) continue

    const filter = filterMatch ? filterMatch[1] : ''

    // Extract stream data
    const streamMatch = objContent.match(/stream\n?([\s\S]*?)\n?endstream/)
    if (!streamMatch) continue

    let imgData: Buffer
    let ext: string

    if (filter === 'DCTDecode') {
      // JPEG - stream data is raw JPEG bytes
      // Need to find the actual bytes (binary match)
      const streamStart = match.index + match[0].indexOf('stream') + 6
      const endStream = buffer.indexOf(Buffer.from('endstream'), streamStart)
      if (endStream === -1) continue
      // Skip any EOL markers
      let start = streamStart
      while (start < endStream && (buffer[start] === 0x0A || buffer[start] === 0x0D)) start++
      let end = endStream
      while (end > start && (buffer[end - 1] === 0x0A || buffer[end - 1] === 0x0D)) end--
      imgData = buffer.slice(start, end)
      ext = 'jpeg'
    } else if (filter === 'FlateDecode') {
      // FlateDecode - would need zlib decompress
      // Skip for simplicity, return raw data
      continue
    } else {
      // Raw or unknown - skip
      continue
    }

    images.push({ data: imgData, width, height, ext })
  }

  return images
}

// Convert raw pixel data to PNG buffer using sharp
async function rawToPng(data: Buffer, width: number, height: number, colorSpace: string): Promise<Buffer> {
  try {
    const c = colorSpace === 'DeviceRGB' ? 3 : colorSpace === 'DeviceGray' ? 1 : 4
    return await sharp(data, { raw: { width, height, channels: c as any } }).png().toBuffer()
  } catch {
    return data
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const pageImagesJson = formData.get('pageImages') as string | null
    const textContent = formData.get('textContent') as string || ''
    const direction = formData.get('direction') as string

    let allImages: { data: Buffer; width: number; height: number; ext: string }[] = []
    let extractedText = textContent

    if (direction === 'pdf-to-word-images') {
      // Method 1: Direct PDF parsing for embedded images
      if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })
      const buffer = Buffer.from(await file.arrayBuffer())

      // Extract images from PDF structure
      allImages = extractImagesFromPdf(buffer)

      // Also try to get text from pdf-parse
      if (!extractedText) {
        try {
          const pdfParse = require('pdf-parse')
          const data = await pdfParse(buffer)
          extractedText = data.text || ''
        } catch {}
      }
    }

    // Fallback: accept pre-extracted page images from frontend
    if (allImages.length === 0 && pageImagesJson) {
      try {
        const pageImages = JSON.parse(pageImagesJson) as { data: string; width: number; height: number }[]
        for (const pi of pageImages) {
          const raw = Buffer.from(pi.data.split(',')[1] || pi.data, 'base64')
          allImages.push({ data: raw, width: pi.width, height: pi.height, ext: 'png' })
        }
      } catch {}
    }

    const children: (Paragraph | any)[] = []

    // Add title
    const fileName = file?.name || 'document'
    children.push(
      new Paragraph({
        spacing: { after: 400 },
        children: [new TextRun({ text: fileName.replace(/\.pdf$/i, ''), bold: true, size: 28, font: 'Calibri' })],
      })
    )

    // Add extracted text (editable!)
    if (extractedText?.trim()) {
      const textLines = extractedText.substring(0, 50000).split('\n')
      for (const line of textLines) {
        if (line.trim()) {
          children.push(
            new Paragraph({
              spacing: { after: 80 },
              children: [new TextRun({ text: line.trim(), size: 22, font: 'Calibri' })],
            })
          )
        }
      }
    }

    // Add images found in the PDF
    if (allImages.length > 0) {
      children.push(
        new Paragraph({
          spacing: { before: 400, after: 200 },
          children: [new TextRun({ text: 'Images from document:', bold: true, size: 24, font: 'Calibri' })],
        })
      )

      for (const img of allImages) {
        const maxWidth = 450
        const scale = Math.min(maxWidth / img.width, 1)
        const w = Math.round(img.width * scale)
        const h = Math.round(img.height * scale)

        try {
          children.push(
            new Paragraph({
              spacing: { before: 200, after: 200 },
              alignment: 'center',
              children: [
                new ImageRun({
                  data: img.data,
                  transformation: { width: w, height: h },
                  type: img.ext as any,
                }),
              ],
            })
          )
        } catch (e) {
          // Image might fail, skip it
        }
      }
    }

    const doc = new Document({
      title: fileName.replace(/\.pdf$/i, ''),
      sections: [{ properties: {}, children }],
    })

    const docxBuffer = await Packer.toBuffer(doc)
    const base64 = docxBuffer.toString('base64')

    return NextResponse.json({
      docxDataUrl: `data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,${base64}`,
      size: docxBuffer.length,
      imagesFound: allImages.length,
      textLength: extractedText.length,
    })
  } catch (error: any) {
    console.error('Docx creation error:', error?.message || error)
    return NextResponse.json({ error: `Failed: ${error?.message || 'Unknown error'}` }, { status: 500 })
  }
}
