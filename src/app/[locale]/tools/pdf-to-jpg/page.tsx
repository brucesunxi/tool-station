'use client'

import { useTranslations } from 'next-intl'
import { useState, useCallback } from 'react'
import AdBanner from '@/components/AdBanner'

interface RenderedPage {
  dataUrl: string
  pageNumber: number
}

export default function PdfToJpgPage() {
  const t = useTranslations('tools.pdf-to-jpg')
  const ct = useTranslations('common')

  const [file, setFile] = useState<File | null>(null)
  const [pages, setPages] = useState<RenderedPage[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [scale, setScale] = useState(1.5)
  const [progress, setProgress] = useState('')

  const handleUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f || f.type !== 'application/pdf') {
      setError(ct("selectValidPdf"))
      return
    }
    setError('')
    setPages([])
    setFile(f)
    setLoading(true)
    setProgress('Loading PDF document...')

    try {
      const pdfjs = await import('pdfjs-dist')
      pdfjs.GlobalWorkerOptions.workerSrc = '//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'

      const buffer = await f.arrayBuffer()
      const pdfDoc = await pdfjs.getDocument({ data: buffer }).promise
      const numPages = pdfDoc.numPages
      const rendered: RenderedPage[] = []

      for (let i = 1; i <= numPages; i++) {
        setProgress(`Rendering page ${i}/${numPages}...`)
        const page = await pdfDoc.getPage(i)
        const viewport = page.getViewport({ scale })
        const canvas = document.createElement('canvas')
        canvas.width = viewport.width
        canvas.height = viewport.height

        await page.render({ canvas, viewport }).promise
        rendered.push({
          dataUrl: canvas.toDataURL('image/jpeg', 0.92),
          pageNumber: i,
        })
      }

      setPages(rendered)
      setProgress('')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error'
      setError(`Failed to process PDF: ${msg}`)
    }
    setLoading(false)
  }, [scale])

  const downloadPage = useCallback((dataUrl: string, pageNumber: number) => {
    const link = document.createElement('a')
    link.download = `page-${pageNumber}.jpg`
    link.href = dataUrl
    link.click()
  }, [])

  const downloadAll = useCallback(() => {
    for (const page of pages) {
      const link = document.createElement('a')
      link.download = `page-${page.pageNumber}.jpg`
      link.href = page.dataUrl
      link.click()
    }
  }, [pages])

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-2">{t('h1')}</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">{t('description')}</p>
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

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Image Quality Scale: {scale}x</label>
          <input
            type="range"
            min={0.5}
            max={3}
            step={0.25}
            value={scale}
            onChange={(e) => setScale(parseFloat(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>Draft (0.5x)</span>
            <span>HD (3x)</span>
          </div>
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

        {pages.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium">{pages.length} page(s) converted</span>
              <button
                onClick={downloadAll}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Download All
              </button>
            </div>
            <div className="space-y-4">
              {pages.map((page) => (
                <div key={page.pageNumber} className="border rounded-lg overflow-hidden">
                  <img src={page.dataUrl} alt={`Page ${page.pageNumber}`} className="w-full" />
                  <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50">
                    <span className="text-xs font-medium">Page {page.pageNumber}</span>
                    <button
                      onClick={() => downloadPage(page.dataUrl, page.pageNumber)}
                      className="px-3 py-1 text-xs border rounded hover:bg-white dark:hover:bg-gray-700 transition-colors"
                    >
                      Download JPG
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!file && !loading && (
          <div className="text-center py-12 text-gray-400 dark:text-gray-500 border-2 border-dashed rounded-lg">
            <svg className="mx-auto h-12 w-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm">Upload a PDF to convert to JPG</p>
          </div>
        )}
      </div>

      <section className="prose dark:prose-invert max-w-none">
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
        <div className="space-y-4 not-prose">
          {(t.raw('faq.items') as { q: string; a: string }[]).map((item, i) => (
            <div key={i}>
              <h3 className="font-semibold">{item.q}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{item.a}</p>
            </div>
          ))}
        </div></section>
    </div>
  )
}
