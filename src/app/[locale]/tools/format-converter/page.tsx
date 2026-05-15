'use client'

import { useTranslations } from 'next-intl'
import { useState, useRef, useCallback } from 'react'
import { formatFileSize } from '@/lib/utils'
import AdBanner from '@/components/AdBanner'

interface ConvertResult {
  convertedUrl: string
  originalSize: number
  convertedSize: number
  format: string
  width: number
  height: number
  mimeType: string
  ext: string
}

export default function FormatConverterPage() {
  const t = useTranslations('tools.format-converter')
  const ct = useTranslations('common')

  const formats = [
    { value: 'jpeg', label: 'JPEG', desc: ct('formatDescJpeg') },
    { value: 'png', label: 'PNG', desc: ct('formatDescPng') },
    { value: 'webp', label: 'WebP', desc: ct('formatDescWebp') },
    { value: 'gif', label: 'GIF', desc: ct('formatDescGif') },
    { value: 'avif', label: 'AVIF', desc: ct('formatDescAvif') },
  ]

  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [targetFormat, setTargetFormat] = useState('png')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ConvertResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback((selectedFile: File) => {
    setError(null)
    setResult(null)
    if (!selectedFile.type.startsWith('image/')) {
      setError(ct("selectImageFile"))
      return
    }
    if (selectedFile.size > 20 * 1024 * 1024) {
      setError(ct("fileMustBeUnder", { size: "20MB" }))
      return
    }
    setFile(selectedFile)
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target?.result as string)
    reader.readAsDataURL(selectedFile)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const dropped = e.dataTransfer.files[0]
    if (dropped) handleFile(dropped)
  }, [handleFile])

  const handleConvert = async () => {
    if (!file) return
    setLoading(true)
    setError(null)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('format', targetFormat)

    try {
      const res = await fetch('/api/convert', { method: 'POST', body: formData })
      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || ct("conversionFailed"))
      }
      setResult(await res.json())
    } catch (err) {
      setError(err instanceof Error ? err.message : ct("somethingWentWrong"))
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setFile(null); setPreview(null); setResult(null); setError(null)
  }

  const savings = result
    ? Math.round((1 - result.convertedSize / result.originalSize) * 100)
    : 0

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('h1')}</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{t('description')}</p>
      </div>

      <AdBanner className="mb-8 h-20" />

      {/* Upload */}
      {!file && (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${
            dragOver ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
          }`}
        >
          <input ref={inputRef} type="file" accept="image/*" className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
          <div className="text-4xl mb-4">🖼️</div>
          <p className="text-lg font-medium mb-2">{ct("dropFileHere")}</p>
          <p className="text-sm text-gray-400">{ct("supportsFormats", { formats: "JPG, PNG, WebP, GIF" })} &bull; {ct("maxFileSize", { size: "20MB" })}</p>
        </div>
      )}

      {/* Controls */}
      {file && !result && (
        <div className="space-y-6">
          {preview && (
            <div className="rounded-xl overflow-hidden border bg-gray-50 dark:bg-gray-800">
              <img src={preview} alt="Preview" className="max-h-80 mx-auto object-contain" />
              <div className="p-3 border-t text-sm text-gray-500 flex items-center justify-between">
                <span>{file.name}</span>
                <span>{formatFileSize(file.size)}</span>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-3">{ct("convertToLabel")}</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {formats.map(fmt => (
                <button
                  key={fmt.value}
                  onClick={() => setTargetFormat(fmt.value)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    targetFormat === fmt.value
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-200'
                      : 'hover:border-blue-300'
                  }`}
                >
                  <p className="font-semibold text-sm">{fmt.label}</p>
                  <p className="text-xs text-gray-400 mt-1">{fmt.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={handleConvert} disabled={loading}
              className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors">
              {loading ? ct("converting") : ct("convertTo", { format: formats.find(f => f.value === targetFormat)?.label })}
            </button>
            <button onClick={handleReset}
              className="px-6 py-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">{ct("cancel")}</button>
          </div>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl overflow-hidden border">
              <div className="p-2 bg-gray-50 dark:bg-gray-800 text-xs font-medium text-gray-500 uppercase">{ct("original")}</div>
              {preview && <img src={preview} alt="Original" className="w-full" />}
              <div className="p-2 border-t text-sm text-gray-500">{formatFileSize(result.originalSize)}</div>
            </div>
            <div className="rounded-xl overflow-hidden border border-green-200">
              <div className="p-2 bg-green-50 dark:bg-green-900/20 text-xs font-medium text-green-600 uppercase">
                Converted to {result.format.toUpperCase()} &mdash; {savings > 0 ? `${savings}% smaller` : `${Math.abs(savings)}% larger`}
              </div>
              <img src={result.convertedUrl} alt="Converted" className="w-full" />
              <div className="p-2 border-t text-sm text-green-600 font-medium">{formatFileSize(result.convertedSize)}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-xs text-gray-400">{ct("originalFormat")}</p>
              <p className="font-semibold">{file?.name.split('.').pop()?.toUpperCase()}</p>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-xs text-green-600">{ct("newFormat")}</p>
              <p className="font-semibold text-green-600">{result.format.toUpperCase()}</p>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-xs text-blue-600">{ct("dimensions")}</p>
              <p className="font-semibold text-blue-600">{result.width} x {result.height}</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-xs text-gray-400">{ct("sizeChange")}</p>
              <p className={`font-semibold ${savings >= 0 ? 'text-green-600' : 'text-amber-600'}`}>
                {savings >= 0 ? `-${savings}%` : `+${Math.abs(savings)}%`}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <a href={result.convertedUrl} download={`converted-${file?.name?.replace(/\.[^.]+$/, '')}.${result.ext}`}
              className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 text-center transition-colors">
              Download {result.format.toUpperCase()}
            </a>
            <button onClick={handleReset}
              className="px-6 py-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">{ct("convertAnother")}</button>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>
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
