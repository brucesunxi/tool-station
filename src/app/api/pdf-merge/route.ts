import { NextRequest, NextResponse } from 'next/server'
import { PDFDocument } from 'pdf-lib'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files: File[] = []

    let i = 0
    while (formData.has(`file_${i}`)) {
      const f = formData.get(`file_${i}`) as File
      if (f && f.size > 0) files.push(f)
      i++
    }

    if (files.length < 2) {
      return NextResponse.json(
        { error: 'Please upload at least 2 PDF files to merge' },
        { status: 400 }
      )
    }

    for (const file of files) {
      if (file.type !== 'application/pdf') {
        return NextResponse.json(
          { error: `"${file.name}" is not a PDF file` },
          { status: 400 }
        )
      }
    }

    const mergedPdf = await PDFDocument.create()

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer())
      const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true })
      const pageIndices = pdf.getPageIndices()
      const copiedPages = await mergedPdf.copyPages(pdf, pageIndices)
      copiedPages.forEach(page => mergedPdf.addPage(page))
    }

    const pdfBytes = await mergedPdf.save()
    const base64 = Buffer.from(pdfBytes).toString('base64')
    const totalPages = mergedPdf.getPageCount()

    // Calculate original total size
    let originalSize = 0
    for (const file of files) {
      originalSize += file.size
    }

    return NextResponse.json({
      pdfDataUrl: `data:application/pdf;base64,${base64}`,
      originalSize,
      mergedSize: pdfBytes.length,
      totalPages,
      fileCount: files.length,
      fileNames: files.map(f => f.name),
    })
  } catch (error) {
    console.error('PDF merge error:', error)
    return NextResponse.json(
      { error: 'Failed to merge PDFs. Make sure the files are valid PDFs.' },
      { status: 500 }
    )
  }
}

export const runtime = 'nodejs'
