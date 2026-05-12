'use client'

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

const formats = [
  { value: 'jpeg', label: 'JPEG', desc: 'Best for photos, small file size' },
  { value: 'png', label: 'PNG', desc: 'Lossless, supports transparency' },
  { value: 'webp', label: 'WebP', desc: 'Modern format, best compression' },
  { value: 'gif', label: 'GIF', desc: 'Supports animation, limited colors' },
  { value: 'avif', label: 'AVIF', desc: 'Next-gen, excellent compression' },
]

export default function FormatConverterPage() {
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
      setError('Please select an image file')
      return
    }
    if (selectedFile.size > 20 * 1024 * 1024) {
      setError('File size must be under 20MB')
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
        throw new Error(errData.error || 'Conversion failed')
      }
      setResult(await res.json())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
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
        <h1 className="text-3xl font-bold mb-2">Image Format Converter</h1>
        <p className="text-gray-500">
          Convert images between JPEG, PNG, WebP, GIF, and AVIF formats.
        </p>
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
          <p className="text-lg font-medium mb-2">Drop an image here or click to browse</p>
          <p className="text-sm text-gray-400">Supports JPG, PNG, WebP, GIF &bull; Max 20MB</p>
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
            <label className="block text-sm font-medium mb-3">Convert to:</label>
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
              {loading ? 'Converting...' : `Convert to ${formats.find(f => f.value === targetFormat)?.label}`}
            </button>
            <button onClick={handleReset}
              className="px-6 py-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Cancel</button>
          </div>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl overflow-hidden border">
              <div className="p-2 bg-gray-50 dark:bg-gray-800 text-xs font-medium text-gray-500 uppercase">Original</div>
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
              <p className="text-xs text-gray-400">Original Format</p>
              <p className="font-semibold">{file?.name.split('.').pop()?.toUpperCase()}</p>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-xs text-green-600">New Format</p>
              <p className="font-semibold text-green-600">{result.format.toUpperCase()}</p>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-xs text-blue-600">Dimensions</p>
              <p className="font-semibold text-blue-600">{result.width} x {result.height}</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-xs text-gray-400">Size Change</p>
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
              className="px-6 py-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Convert Another</button>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>
      )}

      {/* SEO */}
      <div className="mt-12 pt-8 border-t">
        <h2 className="text-xl font-bold mb-4">Free Online Image Format Converter</h2>
        <div className="text-sm text-gray-500 space-y-3">
          <p>Convert images between all major formats instantly in your browser. No uploads to external servers, no sign-ups required.</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Convert JPEG to PNG, PNG to WebP, and any combination</li>
            <li>AVIF support for next-generation compression</li>
            <li>Maintain original quality with optimized conversion settings</li>
            <li>Batch ready for Pro users (coming soon)</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
