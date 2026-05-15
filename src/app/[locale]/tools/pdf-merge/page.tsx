'use client'

import { useTranslations } from 'next-intl'
import { useState, useRef, useCallback } from 'react'
import { formatFileSize } from '@/lib/utils'
import AdBanner from '@/components/AdBanner'

interface PdfMergeResult {
  pdfDataUrl: string
  originalSize: number
  mergedSize: number
  totalPages: number
  fileCount: number
  fileNames: string[]
}

export default function PdfMergePage() {
  const t = useTranslations('tools.pdf-merge')
  const ct = useTranslations('common')

  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<PdfMergeResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const addFiles = useCallback((newFiles: FileList | File[]) => {
    setError(null)
    setResult(null)
    const valid: File[] = []
    const validPreviews: string[] = []

    Array.from(newFiles).forEach(f => {
      if (f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf')) {
        if (f.size <= 50 * 1024 * 1024) {
          valid.push(f)
          validPreviews.push(URL.createObjectURL(f))
        } else {
          setError(`"${f.name}" exceeds 50MB limit`)
        }
      } else {
        setError(`"${f.name}" is not a PDF file`)
      }
    })

    setFiles(prev => [...prev, ...valid])
    setPreviews(prev => [...prev, ...validPreviews])
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer.files.length > 0) addFiles(e.dataTransfer.files)
  }, [addFiles])

  const removeFile = useCallback((idx: number) => {
    setFiles(prev => prev.filter((_, i) => i !== idx))
    setPreviews(prev => {
      URL.revokeObjectURL(prev[idx])
      return prev.filter((_, i) => i !== idx)
    })
  }, [])

  const moveFile = useCallback((from: number, to: number) => {
    if (to < 0 || to >= files.length) return
    setFiles(prev => {
      const next = [...prev];
      [next[from], next[to]] = [next[to], next[from]]
      return next
    })
    setPreviews(prev => {
      const next = [...prev];
      [next[from], next[to]] = [next[to], next[from]]
      return next
    })
  }, [files.length])

  const handleMerge = async () => {
    if (files.length < 2) return
    setLoading(true)
    setError(null)

    const formData = new FormData()
    files.forEach((f, i) => formData.append(`file_${i}`, f))

    try {
      const res = await fetch('/api/pdf-merge', { method: 'POST', body: formData })
      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || 'Merge failed')
      }
      setResult(await res.json())
    } catch (err) {
      setError(err instanceof Error ? err.message : ct("somethingWentWrong"))
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setFiles([])
    setPreviews([])
    setResult(null)
    setError(null)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('h1')}</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{t('description')}</p>
      </div>

      <AdBanner className="mb-8 h-20" />

      {/* Upload */}
      {files.length === 0 && !result && (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${
            dragOver ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
          }`}
        >
          <input ref={inputRef} type="file" accept=".pdf,application/pdf" multiple className="hidden"
            onChange={(e) => e.target.files && addFiles(e.target.files)} />
          <div className="text-4xl mb-4">📑</div>
          <p className="text-lg font-medium mb-2">Drop PDF files here or click to browse</p>
          <p className="text-sm text-gray-400">Select multiple PDFs to merge them into one &bull; {ct("maxFileSize", { size: "50MB" })} each</p>
        </div>
      )}

      {/* File List */}
      {files.length > 0 && !result && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">{files.length} file{files.length > 1 ? 's' : ''} selected</h2>
            <div className="flex gap-2">
              <button onClick={() => inputRef.current?.click()}
                className="text-sm px-3 py-1.5 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                Add More
              </button>
              <button onClick={() => { setFiles([]); setPreviews([]) }}
                className="text-sm px-3 py-1.5 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                Clear All
              </button>
            </div>
          </div>
          <input ref={inputRef} type="file" accept=".pdf,application/pdf" multiple className="hidden"
            onChange={(e) => e.target.files && addFiles(e.target.files)} />

          <div className="space-y-2">
            {files.map((f, i) => (
              <div key={`${f.name}-${i}`}
                className="flex items-center gap-3 p-3 border rounded-lg bg-white dark:bg-gray-800">
                <div className="flex gap-1">
                  <button onClick={() => moveFile(i, i - 1)} disabled={i === 0}
                    className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30"
                    aria-label="Move up">&uarr;</button>
                  <button onClick={() => moveFile(i, i + 1)} disabled={i === files.length - 1}
                    className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30"
                    aria-label="Move down">&darr;</button>
                </div>
                <div className="w-8 h-10 bg-red-50 dark:bg-red-900/20 rounded flex items-center justify-center text-red-500 text-xs font-bold">
                  PDF
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{f.name}</p>
                  <p className="text-xs text-gray-400">{formatFileSize(f.size)}</p>
                </div>
                <button onClick={() => removeFile(i)}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors" aria-label="Remove">
                  ✕
                </button>
              </div>
            ))}
          </div>

          {files.length >= 2 && (
            <button onClick={handleMerge} disabled={loading}
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors">
              {loading ? 'Merging PDFs...' : `Merge ${files.length} PDFs`}
            </button>
          )}
          {files.length < 2 && (
            <p className="text-sm text-amber-600 text-center">Add at least 2 PDF files to merge</p>
          )}
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="space-y-6">
          <div className="p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 rounded-xl text-center">
            <div className="text-4xl mb-3">✅</div>
            <h2 className="text-xl font-bold mb-1">Merge Complete!</h2>
            <p className="text-sm text-gray-500">
              {result.fileCount} files merged into {result.totalPages} page{result.totalPages > 1 ? 's' : ''}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-xs text-gray-400">Total Original</p>
              <p className="font-semibold">{formatFileSize(result.originalSize)}</p>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-xs text-green-600">Merged Size</p>
              <p className="font-semibold text-green-600">{formatFileSize(result.mergedSize)}</p>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-xs text-blue-600">Total Pages</p>
              <p className="font-semibold text-blue-600">{result.totalPages}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <a href={result.pdfDataUrl} download="merged.pdf"
              className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 text-center transition-colors">
              Download Merged PDF
            </a>
            <button onClick={handleReset}
              className="px-6 py-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Merge More</button>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>
      )}

      {/* SEO */}
      <section className="mt-12 pt-8 border-t prose dark:prose-invert max-w-none">
        <h2>{t('howto.heading')}</h2>
        <ol>
          {(t.raw('howto.steps') as string[]).map((step, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: step }} />
          ))}
        </ol>
        <h2>{t('tips.heading')}</h2>
        <ul>
          {(t.raw('tips.items') as string[]).map((item, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
          ))}
        </ul>
        <h2>{t('faq.heading')}</h2>
        <div className="space-y-4">
          {(t.raw('faq.items') as { q: string; a: string }[]).map((item, i) => (
            <div key={i}>
              <h3 className="font-semibold">{item.q}</h3>
              <p>{item.a}</p>
            </div>
          ))}
        </div></section>
    </div>
  )
}
