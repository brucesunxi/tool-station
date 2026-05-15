'use client'

import { useTranslations } from 'next-intl'
import { useState, useRef, useCallback } from 'react'
import { formatFileSize } from '@/lib/utils'
import AdBanner from '@/components/AdBanner'

interface CropResult {
  imageUrl: string
  originalSize: number
  newSize: number
  originalWidth: number
  originalHeight: number
  newWidth: number
  newHeight: number
  format: string
}

const fitOptions = [
  { value: 'cover', label: 'Cover', desc: 'Fill, may crop edges' },
  { value: 'contain', label: 'Contain', desc: 'Fit entirely, may add bars' },
  { value: 'fill', label: 'Fill', desc: 'Stretch to fit exactly' },
  { value: 'inside', label: 'Inside', desc: 'Shrink to fit inside' },
]

export default function ImageCropPage() {
  const t = useTranslations('tools.image-crop')
  const ct = useTranslations('common')

  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [width, setWidth] = useState(800)
  const [height, setHeight] = useState(600)
  const [lockRatio, setLockRatio] = useState(true)
  const [fit, setFit] = useState('cover')
  const [mode] = useState('resize')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<CropResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback((selectedFile: File) => {
    setError(null); setResult(null)
    if (!selectedFile.type.startsWith('image/')) { setError(ct("selectImageFile")); return }
    if (selectedFile.size > 20 * 1024 * 1024) { setError(ct("fileMustBeUnder", { size: "20MB" })); return }
    setFile(selectedFile)
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        setWidth(img.naturalWidth)
        setHeight(img.naturalHeight)
      }
      img.src = e.target?.result as string
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(selectedFile)
  }, [])

  const handleProcess = async () => {
    if (!file) return
    setLoading(true); setError(null)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('width', width.toString())
    formData.append('height', height.toString())
    formData.append('mode', mode)
    formData.append('fit', fit)
    formData.append('format', 'auto')

    try {
      const res = await fetch('/api/crop', { method: 'POST', body: formData })
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || 'Processing failed') }
      setResult(await res.json())
    } catch (err) {
      setError(err instanceof Error ? err.message : ct("somethingWentWrong"))
    } finally { setLoading(false) }
  }

  const handleReset = () => {
    setFile(null); setPreview(null); setResult(null); setError(null)
    setFit('cover')
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('h1')}</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{t('description')}</p>
      </div>

      <AdBanner className="mb-8 h-20" />

      {!file && (
        <div onDrop={(e) => { e.preventDefault(); setDragOver(false); e.dataTransfer.files[0] && handleFile(e.dataTransfer.files[0]) }}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }} onDragLeave={() => setDragOver(false)}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'}`}>
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
          <div className="text-4xl mb-4">📐</div>
          <p className="text-lg font-medium mb-2">{ct("dropFileHere")}</p>
          <p className="text-sm text-gray-400">Supports JPG, PNG, WebP &bull; {ct("maxFileSize", { size: "20MB" })}</p>
        </div>
      )}

      {file && !result && (
        <div className="space-y-6">
          {preview && (
            <div className="rounded-xl overflow-hidden border bg-gray-50 dark:bg-gray-800">
              <img src={preview} alt="Preview" className="max-h-64 mx-auto object-contain" />
              <div className="p-3 border-t text-sm text-gray-500 flex items-center justify-between">
                <span>{file.name}</span>
                <span>{formatFileSize(file.size)}</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Width (px)</label>
              <input type="number" min={1} max={10000} value={width}
                onChange={(e) => { setWidth(Number(e.target.value)) }}
                className="w-full p-2 border rounded-lg bg-white dark:bg-gray-800" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Height (px)</label>
              <input type="number" min={1} max={10000} value={height}
                onChange={(e) => { setHeight(Number(e.target.value)) }}
                className="w-full p-2 border rounded-lg bg-white dark:bg-gray-800" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Fit Mode</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {fitOptions.map(o => (
                <button key={o.value} onClick={() => setFit(o.value)}
                  className={`p-2 rounded-lg border text-center text-sm transition-all ${fit === o.value ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-200' : 'hover:border-blue-300'}`}>
                  <p className="font-semibold">{o.label}</p>
                  <p className="text-xs text-gray-400">{o.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={handleProcess} disabled={loading}
              className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors">
              {loading ? 'Processing...' : `Resize to ${width}×${height}`}
            </button>
            <button onClick={handleReset}
              className="px-6 py-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">{ct("cancel")}</button>
          </div>
        </div>
      )}

      {result && (
        <div className="space-y-6">
          {/* Fit mode indicator */}
          <div className="text-center">
            <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm rounded-full font-medium">
              Mode: {fitOptions.find(o => o.value === fit)?.label || fit} &mdash; {fitOptions.find(o => o.value === fit)?.desc || ''}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl overflow-hidden border">
              <div className="p-2 bg-gray-50 dark:bg-gray-800 text-xs font-medium uppercase text-gray-500">{ct("original")}</div>
              <div className="bg-gray-100 dark:bg-gray-800 flex items-center justify-center" style={{ minHeight: '200px' }}>
                {preview && <img src={preview} alt="Original" className="max-w-full max-h-64 object-contain" />}
              </div>
              <div className="p-2 border-t text-sm text-gray-500">{result.originalWidth}×{result.originalHeight}</div>
            </div>
            <div className="rounded-xl overflow-hidden border border-green-200">
              <div className="p-2 bg-green-50 dark:bg-green-900/20 text-xs font-medium text-green-600 uppercase">
                Fit: {fit.toUpperCase()}
              </div>
              <div className="bg-[repeating-conic-gradient(#e5e7eb_0%_25%,#fff_0%_50%)_50%/20px_20px] flex items-center justify-center" style={{ minHeight: '200px' }}>
                <img src={result.imageUrl} alt="Resized" className="max-w-full max-h-64" />
              </div>
              <div className="p-2 border-t text-sm text-green-600 font-medium">{result.newWidth}×{result.newHeight}px</div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-xs text-gray-400">Original Size</p>
              <p className="font-semibold">{formatFileSize(result.originalSize)}</p>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-xs text-green-600">New Size</p>
              <p className="font-semibold text-green-600">{formatFileSize(result.newSize)}</p>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-xs text-blue-600">{ct("original")}</p>
              <p className="font-semibold text-blue-600">{result.originalWidth}×{result.originalHeight}</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-xs text-gray-400">New</p>
              <p className="font-semibold">{result.newWidth}×{result.newHeight}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <a href={result.imageUrl} download={`resized-${file?.name}`}
              className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 text-center transition-colors">{ct("download")}</a>
            <button onClick={handleReset}
              className="px-6 py-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Process Another</button>
          </div>
        </div>
      )}

      {error && <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>}

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
