'use client'

import { useTranslations } from 'next-intl'
import { useState, useRef, useCallback } from 'react'
import AdBanner from '@/components/AdBanner'

export default function ImageToPdfPage() {
  const t = useTranslations('tools.image-to-pdf')
  const ct = useTranslations('common')

  const [images, setImages] = useState<string[]>([])
  const [pageSize, setPageSize] = useState<'A4' | 'Letter' | 'Legal'>('A4')
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait')
  const [error, setError] = useState('')
  const printContainerRef = useRef<HTMLDivElement>(null)

  const handleUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setError('')

    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    const invalid = files.find((f) => !validTypes.includes(f.type))
    if (invalid) {
      setError(`Unsupported format: ${invalid.name}. Use JPG, PNG, GIF, or WebP.`)
      return
    }

    const readers = files.map(
      (file) =>
        new Promise<string>((resolve) => {
          const reader = new FileReader()
          reader.onload = (ev) => resolve(ev.target?.result as string)
          reader.readAsDataURL(file)
        })
    )

    Promise.all(readers).then((dataUrls) => {
      setImages((prev) => [...prev, ...dataUrls])
    })
  }, [])

  const removeImage = useCallback((index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const clearAll = useCallback(() => {
    setImages([])
  }, [])

  const printAsPdf = useCallback(() => {
    window.print()
  }, [])

  const getPageDimensions = () => {
    if (pageSize === 'A4') return { width: '210mm', height: '297mm' }
    if (pageSize === 'Letter') return { width: '215.9mm', height: '279.4mm' }
    return { width: '215.9mm', height: '355.6mm' }
  }

  const dims = getPageDimensions()

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-2">{t('h1')}</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">{t('description')}</p>
      <AdBanner className="mb-8 h-20" />

      <div className="bg-white dark:bg-gray-800 border rounded-xl p-6 mb-8">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Upload Images</label>
          <input
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            multiple
            onChange={handleUpload}
            className="w-full p-2 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-700 file:mr-3 file:py-2 file:px-4 file:border-0 file:rounded-lg file:text-sm file:bg-blue-50 file:text-blue-700 dark:file:bg-blue-900/30 dark:file:text-blue-300 hover:file:bg-blue-100"
          />
        </div>

        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex-1 min-w-[140px]">
            <label className="block text-sm font-medium mb-1">Page Size</label>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(e.target.value as 'A4' | 'Letter' | 'Legal')}
              className="w-full p-2.5 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="A4">A4 (210 x 297 mm)</option>
              <option value="Letter">Letter (216 x 279 mm)</option>
              <option value="Legal">Legal (216 x 356 mm)</option>
            </select>
          </div>
          <div className="flex-1 min-w-[140px]">
            <label className="block text-sm font-medium mb-1">Orientation</label>
            <select
              value={orientation}
              onChange={(e) => setOrientation(e.target.value as 'portrait' | 'landscape')}
              className="w-full p-2.5 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="portrait">Portrait</option>
              <option value="landscape">Landscape</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="p-3 mb-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-lg text-sm text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        {images.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium">{images.length} image(s)</span>
              <div className="flex gap-2">
                <button
                  onClick={clearAll}
                  className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Clear All
                </button>
                <button
                  onClick={printAsPdf}
                  className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Print as PDF
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {images.map((dataUrl, i) => (
                <div key={i} className="relative border rounded-lg overflow-hidden group">
                  <img src={dataUrl} alt={`Image ${i + 1}`} className="w-full h-32 object-cover" />
                  <button
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    &times;
                  </button>
                  <span className="block p-1 text-xs text-center text-gray-500 truncate">
                    Image {i + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {images.length === 0 && (
          <div className="text-center py-12 text-gray-400 dark:text-gray-500 border-2 border-dashed rounded-lg">
            <svg className="mx-auto h-12 w-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm">Upload images to get started</p>
          </div>
        )}
      </div>

      {/* Hidden print container */}
      <div ref={printContainerRef} className="print-only">
        <style>{`
          @media print {
            body * { visibility: hidden; }
            .print-only, .print-only * { visibility: visible; }
            .print-only { position: absolute; left: 0; top: 0; width: 100%; }
            @page { size: ${orientation === 'landscape' ? `${dims.height} ${dims.width}` : `${dims.width} ${dims.height}`}; margin: 10mm; }
          }
          .print-only { display: none; }
          @media print {
            .print-only { display: block; }
          }
        `}</style>
        {images.map((dataUrl, i) => (
          <div key={i} className="print-page" style={{ pageBreakAfter: i < images.length - 1 ? 'always' : 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: orientation === 'landscape' ? dims.height : dims.width }}>
            <img src={dataUrl} alt="" style={{ maxWidth: '100%', maxHeight: orientation === 'portrait' ? `${dims.height}` : `${dims.width}`, objectFit: 'contain' }} />
          </div>
        ))}
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
