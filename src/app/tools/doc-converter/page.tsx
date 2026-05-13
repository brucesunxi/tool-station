'use client'

import { useState, useRef, useCallback } from 'react'
import { formatFileSize } from '@/lib/utils'
import AdBanner from '@/components/AdBanner'

type Direction = 'word-to-pdf' | 'pdf-to-word'

interface WordToPdfResult {
  htmlContent: string
  pdfDataUrl: string
  pdfSize: number
  pageCount: number
  fileName: string
}

interface PdfToWordResult {
  docxDataUrl: string
  docxSize: number
  pages: number
}

export default function DocConverterPage() {
  const [direction, setDirection] = useState<Direction>('word-to-pdf')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState('')
  const [result, setResult] = useState<WordToPdfResult | PdfToWordResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback((selectedFile: File) => {
    setError(null); setResult(null)
    const ext = selectedFile.name.split('.').pop()?.toLowerCase()
    if (direction === 'word-to-pdf' && ext !== 'docx') { setError('Please upload a .docx file'); return }
    if (direction === 'pdf-to-word' && ext !== 'pdf') { setError('Please upload a PDF file'); return }
    if (selectedFile.size > 30 * 1024 * 1024) { setError('File size must be under 30MB'); return }
    setFile(selectedFile)
  }, [direction])

  const handleConvert = async () => {
    if (!file) return

    if (direction === 'word-to-pdf') {
      await convertWordToPdf(file)
    } else {
      await convertPdfToWord(file)
    }
  }

  const convertWordToPdf = async (f: File) => {
    setLoading(true); setError(null); setProgress('Converting Word to PDF...')
    try {
      const formData = new FormData()
      formData.append('file', f)
      formData.append('direction', 'word-to-pdf')
      const res = await fetch('/api/doc-convert', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Conversion failed')
      setResult({ htmlContent: data.htmlContent, pdfDataUrl: data.pdfDataUrl, pdfSize: data.pdfSize, pageCount: data.pageCount, fileName: data.fileName })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally { setLoading(false) }
  }

  const convertPdfToWord = async (f: File) => {
    setLoading(true); setError(null)
    try {
      setProgress('Extracting text and images from PDF...')
      const formData = new FormData()
      formData.append('file', f)
      formData.append('direction', 'pdf-to-word-images')

      const res = await fetch('/api/doc-convert-images', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Conversion failed')

      setResult({ docxDataUrl: data.docxDataUrl, docxSize: data.size, pages: data.imagesFound || 1 })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Conversion failed.')
    } finally { setLoading(false); setProgress('') }
  }

  const handleReset = () => { setFile(null); setResult(null); setError(null) }

  const w2pResult = result as WordToPdfResult | null
  const p2wResult = result as PdfToWordResult | null

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Document Converter</h1>
        <p className="text-gray-500">Convert Word to PDF and PDF to Word with images and formatting preserved.</p>
      </div>
      <AdBanner className="mb-8 h-20" />

      <div className="flex gap-2 mb-6">
        <button onClick={() => { setDirection('word-to-pdf'); handleReset() }}
          className={`flex-1 py-3 rounded-lg border font-medium text-sm transition-all ${direction === 'word-to-pdf' ? 'bg-blue-600 text-white border-blue-600' : 'hover:border-blue-400'}`}>
          📄 Word → PDF
        </button>
        <button onClick={() => { setDirection('pdf-to-word'); handleReset() }}
          className={`flex-1 py-3 rounded-lg border font-medium text-sm transition-all ${direction === 'pdf-to-word' ? 'bg-blue-600 text-white border-blue-600' : 'hover:border-blue-400'}`}>
          🖼 PDF → Word (with images)
        </button>
      </div>

      {!file && !result && (
        <div onDrop={(e) => { e.preventDefault(); setDragOver(false); e.dataTransfer.files[0] && handleFile(e.dataTransfer.files[0]) }}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }} onDragLeave={() => setDragOver(false)}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${dragOver ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'}`}>
          <input ref={inputRef} type="file" accept={direction === 'word-to-pdf' ? '.docx' : '.pdf'} className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
          <div className="text-5xl mb-4">{direction === 'word-to-pdf' ? '📝' : '📕'}</div>
          <p className="text-lg font-medium mb-2">Drop {direction === 'word-to-pdf' ? 'a Word file' : 'a PDF file'} here</p>
          <p className="text-sm text-gray-400">{direction === 'word-to-pdf' ? '.docx → PDF' : 'PDF → .docx with images & text'} &bull; Max 30MB</p>
        </div>
      )}

      {file && !result && (
        <div className="space-y-6">
          <div className="flex items-center gap-4 p-4 border rounded-xl bg-gray-50 dark:bg-gray-800">
            <div className="text-2xl">{direction === 'word-to-pdf' ? '📝' : '📕'}</div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{file.name}</p>
              <p className="text-sm text-gray-400">{formatFileSize(file.size)}</p>
            </div>
            <button onClick={handleReset} className="text-gray-400 hover:text-red-500 text-lg">✕</button>
          </div>

          {loading && progress && (
            <div className="flex items-center gap-3 text-sm text-blue-600">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              {progress}
            </div>
          )}

          {!loading && (
            <button onClick={handleConvert}
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Convert to {direction === 'word-to-pdf' ? 'PDF' : 'Word'}
            </button>
          )}
        </div>
      )}

      {/* Word → PDF Result */}
      {w2pResult && (
        <div className="space-y-6">
          <div className="p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 rounded-xl text-center">
            <div className="text-4xl mb-2">✅</div>
            <h2 className="text-xl font-bold mb-1">PDF Created!</h2>
            <p className="text-sm text-gray-500">{w2pResult.pageCount} page{w2pResult.pageCount > 1 ? 's' : ''}</p>
          </div>
          <div className="border rounded-xl overflow-hidden">
            <div className="p-2 bg-gray-50 dark:bg-gray-800 text-xs font-medium text-gray-500 uppercase border-b">Preview</div>
            <div className="p-6 max-h-80 overflow-auto" dangerouslySetInnerHTML={{ __html: w2pResult.htmlContent }} />
          </div>
          <div className="flex gap-3">
            <a href={w2pResult.pdfDataUrl} download={w2pResult.fileName?.replace(/\.docx$/i, '') + '.pdf'}
              className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 text-center transition-colors">
              Download PDF ({formatFileSize(w2pResult.pdfSize)})
            </a>
            <button onClick={handleReset} className="px-6 py-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Convert Another</button>
          </div>
        </div>
      )}

      {/* PDF → Word Result */}
      {p2wResult && (
        <div className="space-y-6">
          <div className="p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 rounded-xl text-center">
            <div className="text-4xl mb-2">✅</div>
            <h2 className="text-xl font-bold mb-1">Word Document Created!</h2>
            <p className="text-sm text-gray-500">{p2wResult.pages} page{p2wResult.pages > 1 ? 's' : ''} rendered with images</p>
          </div>
          <div className="flex gap-3">
            <a href={p2wResult.docxDataUrl} download={file?.name?.replace(/\.pdf$/i, '') + '.docx'}
              className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 text-center transition-colors">
              Download Word ({formatFileSize(p2wResult.docxSize)})
            </a>
            <button onClick={handleReset} className="px-6 py-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Convert Another</button>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-lg text-red-600 text-sm whitespace-pre-wrap">{error}</div>
      )}

      <div className="mt-12 pt-8 border-t">
        <h2 className="text-xl font-bold mb-4">Free Online Document Converter</h2>
        <p className="text-sm text-gray-500">
          Convert Word to PDF and PDF to Word documents. PDF → Word preserves text and images by rendering pages as images.
          All PDF rendering happens in your browser &mdash; your document stays private.
        </p>
      </div>
    </div>
  )
}
