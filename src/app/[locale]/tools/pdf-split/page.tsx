'use client'

import { useState, useCallback } from 'react'
import AdBanner from '@/components/AdBanner'

export default function PdfSplitPage() {
  const [file, setFile] = useState<File | null>(null)
  const [pageCount, setPageCount] = useState(0)
  const [pageRanges, setPageRanges] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f || f.type !== 'application/pdf') {
      setError('Please select a valid PDF file.')
      return
    }
    setError('')
    setSuccess(false)
    setPageRanges('')
    setFile(f)

    try {
      const pdfLib = await import('pdf-lib')
      const buffer = await f.arrayBuffer()
      const pdfDoc = await pdfLib.PDFDocument.load(buffer)
      setPageCount(pdfDoc.getPageCount())
    } catch {
      setError('Failed to read PDF file. It may be corrupted or password-protected.')
    }
  }, [])

  const parseRanges = useCallback((input: string, maxPage: number): number[] => {
    const pages: Set<number> = new Set()
    const parts = input.split(',').map((p) => p.trim())

    for (const part of parts) {
      if (/^\d+$/.test(part)) {
        const p = parseInt(part, 10)
        if (p >= 1 && p <= maxPage) pages.add(p)
      } else if (/^\d+-\d+$/.test(part)) {
        const [startStr, endStr] = part.split('-')
        const start = parseInt(startStr, 10)
        const end = parseInt(endStr, 10)
        for (let i = Math.max(1, start); i <= Math.min(maxPage, end); i++) {
          pages.add(i)
        }
      }
    }

    return Array.from(pages).sort((a, b) => a - b)
  }, [])

  const handleSplit = useCallback(async () => {
    if (!file || pageCount === 0) return
    setError('')
    setSuccess(false)
    setLoading(true)

    const pagesToExtract = parseRanges(pageRanges, pageCount)
    if (pagesToExtract.length === 0) {
      setError('No valid pages found in the specified range. Check your input.')
      setLoading(false)
      return
    }

    try {
      const pdfLib = await import('pdf-lib')
      const buffer = await file.arrayBuffer()
      const srcDoc = await pdfLib.PDFDocument.load(buffer)
      const newDoc = await pdfLib.PDFDocument.create()

      const pageIndices = pagesToExtract.map((p) => p - 1)
      const copiedPages = await newDoc.copyPages(srcDoc, pageIndices)
      for (const page of copiedPages) {
        newDoc.addPage(page)
      }

      const pdfBytes = await newDoc.save()
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `extracted-pages-${pagesToExtract.join('-')}.pdf`
      link.click()
      URL.revokeObjectURL(url)

      setSuccess(true)
    } catch {
      setError('Failed to extract pages. The PDF may be encrypted or corrupted.')
    }
    setLoading(false)
  }, [file, pageCount, pageRanges, parseRanges])

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-2">PDF Splitter</h1>
      <p className="text-gray-500 mb-6">
        Extract specific pages from PDF files. Choose individual pages or ranges.
      </p>
      <AdBanner className="mb-8 h-20" />

      <div className="bg-white dark:bg-gray-800 border rounded-xl p-6 mb-8">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Upload PDF</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleUpload}
            className="w-full p-2 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-700 file:mr-3 file:py-2 file:px-4 file:border-0 file:rounded-lg file:text-sm file:bg-blue-50 file:text-blue-700 dark:file:bg-blue-900/30 dark:file:text-blue-300 hover:file:bg-blue-100"
          />
        </div>

        {pageCount > 0 && (
          <div className="mb-4">
            <p className="text-sm mb-2">
              PDF loaded: <strong>{pageCount}</strong> page{pageCount !== 1 ? 's' : ''}
            </p>
            <label className="block text-sm font-medium mb-1">
              Page Ranges (e.g. 1,3,5-8)
            </label>
            <input
              type="text"
              value={pageRanges}
              onChange={(e) => setPageRanges(e.target.value)}
              placeholder={`Pages 1-${pageCount}, e.g. 1,3,5-8`}
              className="w-full p-2.5 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-400 mt-1">
              Enter individual page numbers (1, 3, 5) or ranges (5-8), separated by commas.
            </p>
          </div>
        )}

        {error && (
          <div className="p-3 mb-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-lg text-sm text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 mb-4 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/30 rounded-lg text-sm text-green-700 dark:text-green-400">
            Pages extracted successfully! Your download should begin automatically.
          </div>
        )}

        {pageCount > 0 && (
          <button
            onClick={handleSplit}
            disabled={loading || !pageRanges.trim()}
            className="w-full px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Extracting Pages...' : 'Extract Pages'}
          </button>
        )}

        {!file && (
          <div className="text-center py-12 text-gray-400 dark:text-gray-500 border-2 border-dashed rounded-lg">
            <svg className="mx-auto h-12 w-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <p className="text-sm">Upload a PDF to extract pages</p>
          </div>
        )}
      </div>

      <section className="prose dark:prose-invert max-w-none">
        <h2>How to Use</h2>
        <ol>
          <li>Upload a PDF file using the file picker.</li>
          <li>The tool displays the total <strong>page count</strong> of your PDF.</li>
          <li>Enter the <strong>page ranges</strong> you want to extract (e.g., <code>1,3,5-8</code>).</li>
          <li>Click <strong>Extract Pages</strong> to generate and download the new PDF containing only the selected pages.</li>
        </ol>

        <h2>Tips</h2>
        <ul>
          <li>Use commas to separate individual pages (e.g., <code>1, 4, 7</code>) and hyphens for ranges (e.g., <code>2-6</code>).</li>
          <li>You can combine both formats in one input: <code>1,3,5-8,10,12-15</code>.</li>
          <li>Page numbers start at 1 — entering a page number outside the document range will be ignored.</li>
        </ul>

        <h2>FAQ</h2>
        <div className="space-y-4 not-prose">
          <div>
            <h3 className="font-semibold">Does this tool work with scanned PDFs?</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Yes — scanned PDFs are supported as long as they are valid PDF files. The tool copies entire pages including all content, images, and text. However, the content of scanned pages is image-based, not text-based.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Are there any file size limits?</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              There is no artificial file size limit. Very large PDFs may take longer to process depending on your device&apos;s memory and processing power. All processing happens locally in your browser.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Can I extract pages from a password-protected PDF?</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              No. Password-protected PDFs cannot be processed because pdf-lib cannot open encrypted files without a password. You will need to remove the password first using a PDF password tool, then split the unprotected document.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
