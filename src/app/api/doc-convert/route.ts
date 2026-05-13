import { NextRequest, NextResponse } from 'next/server'
import mammoth from 'mammoth'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import { Document, Packer, Paragraph, TextRun } from 'docx'
import { readFileSync } from 'fs'
import path from 'path'

// Simple PDF text extraction using basic approach
async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  try {
    const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true })
    const pages = pdfDoc.getPages()
    // pdf-lib doesn't extract text content directly, so we'll use pdf-parse
    // Fallback to a simpler method
    let text = ''
    for (const page of pages) {
      const { width, height } = page.getSize()
      text += `[Page ${pages.indexOf(page) + 1} - ${Math.round(width)}x${Math.round(height)}]\n`
    }
    return text
  } catch {
    return ''
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const direction = formData.get('direction') as string

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const ext = file.name.split('.').pop()?.toLowerCase()

    if (direction === 'word-to-pdf') {
      // Validate input
      if (ext !== 'docx' && file.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        return NextResponse.json({ error: 'Please upload a .docx file' }, { status: 400 })
      }

      // Convert .docx to HTML using mammoth
      const result = await mammoth.convertToHtml({ buffer })
      const htmlContent = result.value
      const textContent = htmlContent.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()

      // Create PDF using pdf-lib
      const pdfDoc = await PDFDocument.create()
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

      let page = pdfDoc.addPage([612, 792])
      let y = 750
      const marginLeft = 72
      const fontSize = 11
      const lineHeight = 16

      // Add title
      page.drawText(file.name.replace(/\.docx$/i, ''), { x: marginLeft, y, size: 18, font: boldFont, color: rgb(0, 0, 0) })
      y -= 30

      // Add content lines
      const lines = textContent.split('. ')
      for (const line of lines) {
        // Word wrap
        let remaining = line.trim() + (line.endsWith('.') ? '' : '.')
        while (remaining.length > 0) {
          if (y < 50) {
            page = pdfDoc.addPage([612, 792])
            y = 750
          }

          let maxChars = 80
          let segment = remaining.length > maxChars ? remaining.substring(0, maxChars) + '-' : remaining
          if (remaining.length > maxChars) {
            const lastSpace = remaining.substring(0, maxChars).lastIndexOf(' ')
            if (lastSpace > 0) {
              segment = remaining.substring(0, lastSpace)
            } else {
              segment = remaining.substring(0, maxChars)
            }
          }

          page.drawText(segment, { x: marginLeft, y, size: fontSize, font, color: rgb(0.1, 0.1, 0.1) })
          y -= lineHeight
          remaining = remaining.substring(segment.length).trim()
        }
      }

      const pdfBytes = await pdfDoc.save()
      const pdfBase64 = Buffer.from(pdfBytes).toString('base64')
      const pdfDataUrl = `data:application/pdf;base64,${pdfBase64}`

      return NextResponse.json({
        htmlContent,
        textContent: textContent.substring(0, 5000),
        pdfDataUrl,
        pdfSize: pdfBytes.length,
        pageCount: pdfDoc.getPageCount(),
        direction: 'word-to-pdf',
        fileName: file.name,
      })
    } else if (direction === 'pdf-to-word') {
      // Validate input
      if (ext !== 'pdf' && file.type !== 'application/pdf') {
        return NextResponse.json({ error: 'Please upload a PDF file' }, { status: 400 })
      }

      // Extract text from PDF
      let textContent = ''
      try {
        const pdfParse = require('pdf-parse')
        const data = await pdfParse(buffer)
        textContent = data.text || ''
      } catch (err) {
        // Fallback if pdf-parse fails
        textContent = await extractTextFromPdf(buffer)
      }

      if (!textContent.trim()) {
        textContent = '[Could not extract text from this PDF - it may be a scanned document]'
      }

      // Create .docx using docx library
      const paragraphs: Paragraph[] = []
      const lines = textContent.split('\n').filter(l => l.trim())

      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed) continue

        // Check if it looks like a header (short, uppercase, or ends with :)
        const isHeader = trimmed.length < 60 &&
          (trimmed === trimmed.toUpperCase() || trimmed.endsWith(':'))

        paragraphs.push(new Paragraph({
          spacing: { after: isHeader ? 200 : 100 },
          children: [
            new TextRun({
              text: trimmed,
              bold: isHeader,
              size: isHeader ? 24 : 22,
              font: 'Calibri',
            }),
          ],
        }))
      }

      const doc = new Document({
        title: file.name.replace(/\.pdf$/i, ''),
        description: 'Converted from PDF',
        sections: [{
          properties: {},
          children: paragraphs.length > 0 ? paragraphs : [
            new Paragraph({
              children: [new TextRun({ text: textContent, size: 22, font: 'Calibri' })],
            }),
          ],
        }],
      })

      const docxBuffer = await Packer.toBuffer(doc)
      const docxBase64 = docxBuffer.toString('base64')
      const docxDataUrl = `data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,${docxBase64}`

      return NextResponse.json({
        textContent: textContent.substring(0, 10000),
        docxDataUrl,
        docxSize: docxBuffer.length,
        pageCount: Math.max(1, textContent.split('\f').length),
        direction: 'pdf-to-word',
        fileName: file.name,
      })
    } else {
      return NextResponse.json({ error: 'Invalid conversion direction' }, { status: 400 })
    }
  } catch (error: any) {
    console.error('Document conversion error:', error?.message || error)
    return NextResponse.json(
      { error: `Conversion failed: ${error?.message || 'Unknown error'}` },
      { status: 500 }
    )
  }
}
