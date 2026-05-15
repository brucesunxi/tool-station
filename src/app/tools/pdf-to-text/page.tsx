'use client'

import { useState, useCallback } from 'react'
import AdBanner from '@/components/AdBanner'

export default function PdfToTextPage() {
  const [file, setFile] = useState<File | null>(null)
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [progress, setProgress] = useState('')
  const [copied, setCopied] = useState(false)
  const [charCount, setCharCount] = useState(0)
  const [wordCount, setWordCount] = useState(0)

  const handleUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f || f.type !== 'application/pdf') {
      setError('Please select a valid PDF file.')
      return
    }
    setError('')
    setText('')
    setCharCount(0)
    setWordCount(0)
    setFile(f)
    setLoading(true)
    setProgress('Loading PDF document...')

    try {
      const pdfjs = await import('pdfjs-dist')
      pdfjs.GlobalWorkerOptions.workerSrc = '//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'

      const buffer = await f.arrayBuffer()
      const pdfDoc = await pdfjs.getDocument({ data: buffer }).promise
      const numPages = pdfDoc.numPages
      const extractedTexts: string[] = []

      for (let i = 1; i <= numPages; i++) {
        setProgress(`Extracting page ${i}/${numPages}...`)
        const page = await pdfDoc.getPage(i)
        const content = await page.getTextContent()
        const pageText = content.items
          .map((item) => ('str' in item ? (item as { str: string }).str : ''))
          .join(' ')
        extractedTexts.push(pageText)
      }

      const fullText = extractedTexts.join('\n\n--- Page Break ---\n\n')
      setText(fullText)
      setCharCount(fullText.length)
      setWordCount(fullText ? fullText.split(/\s+/).filter(Boolean).length : 0)
      setProgress('')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error'
      setError(`Failed to extract text: ${msg}`)
    }
    setLoading(false)
  }, [])

  const downloadAsTxt = useCallback(() => {
    if (!text) return
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = (file?.name || 'document').replace(/\.pdf$/i, '') + '-extracted.txt'
    link.click()
    URL.revokeObjectURL(url)
  }, [text, file])

  const handleCopy = useCallback(async () => {
    if (!text) return
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback
    }
  }, [text])

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-2">PDF to Text Extractor</h1>
      <p className="text-gray-500 mb-6">
        Extract all text content from PDF files for copying and editing.
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

        {error && (
          <div className="p-3 mb-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-lg text-sm text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        {loading && (
          <div className="text-center py-8 text-gray-500">
            <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
            <p className="text-sm">{progress}</p>
          </div>
        )}

        {!loading && text && (
          <div>
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <div className="flex gap-3 text-xs text-gray-500">
                <span><strong>{charCount.toLocaleString()}</strong> characters</span>
                <span><strong>{wordCount.toLocaleString()}</strong> words</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 text-xs border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  {copied ? 'Copied!' : 'Copy Text'}
                </button>
                <button
                  onClick={downloadAsTxt}
                  className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Download .txt
                </button>
              </div>
            </div>
            <textarea
              value={text}
              readOnly
              rows={20}
              className="w-full p-3 border rounded-lg text-sm font-mono dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
            />
          </div>
        )}

        {!file && !loading && !text && (
          <div className="text-center py-12 text-gray-400 dark:text-gray-500 border-2 border-dashed rounded-lg">
            <svg className="mx-auto h-12 w-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-sm">Upload a PDF to extract its text</p>
          </div>
        )}

        {file && !loading && !text && !error && (
          <div className="text-center py-8 text-gray-400">
            <p className="text-sm">Ready to extract text from <strong>{file.name}</strong></p>
          </div>
        )}
      </div>

      <section className="prose dark:prose-invert max-w-none">
        <h2>How to Use</h2>
        <ol>
          <li>Upload a PDF file using the file picker. Text extraction starts automatically.</li>
          <li>Wait for extraction to complete — the tool processes each page to collect all text content.</li>
          <li>Review the extracted text in the text area. Page breaks are marked for reference.</li>
          <li>Click <strong>Copy Text</strong> to copy to clipboard or <strong>Download .txt</strong> to save as a text file.</li>
        </ol>

        <h2>Tips</h2>
        <ul>
          <li>This tool works best with text-based PDFs (digital documents, reports, academic papers).</li>
          <li>For scanned PDFs (image-based), the text content will be empty — use an OCR tool instead.</li>
          <li>The page order and basic layout structure are preserved, but complex formatting (tables, columns) may not render perfectly.</li>
        </ul>

        <h2>FAQ</h2>
        <div className="space-y-4 not-prose">
          <div>
            <h3 className="font-semibold">Why is the extracted text for my PDF empty or garbled?</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              This usually means the PDF is a scanned document (image-based) rather than a digital text-based PDF. PDF.js extracts text from the text layer of PDFs, not from images. For scanned documents, you need an OCR (Optical Character Recognition) tool.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Does this tool preserve formatting like tables and columns?</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Text extraction focuses on raw text content. Simple formatting like paragraph order is preserved, but complex layouts (tables, columns, text boxes) may have text appearing in reading order rather than visual layout. For precise formatting, consider using the PDF to JPG converter instead.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Can I extract text from password-protected PDFs?</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              No. PDF.js cannot access the text content of encrypted PDFs. You will need to remove the password protection first using a PDF password removal tool before extracting text.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
