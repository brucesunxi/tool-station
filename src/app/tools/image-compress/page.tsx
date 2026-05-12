'use client'

import { useState, useRef, useCallback } from 'react'
import { formatFileSize } from '@/lib/utils'
import AdBanner from '@/components/AdBanner'

interface CompressionResult {
  compressedUrl: string
  originalSize: number
  compressedSize: number
  format: string
  width: number
  height: number
}

export default function ImageCompressPage() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [quality, setQuality] = useState(80)
  const [format, setFormat] = useState('auto')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<CompressionResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback((selectedFile: File) => {
    setError(null)
    setResult(null)

    if (!selectedFile.type.startsWith('image/')) {
      setError('Please select an image file (JPG, PNG, WebP, GIF)')
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

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }, [])

  const handleCompress = async () => {
    if (!file) return
    setLoading(true)
    setError(null)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('quality', quality.toString())
    formData.append('format', format)

    try {
      const res = await fetch('/api/compress', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || 'Compression failed')
      }

      const data = await res.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setFile(null)
    setPreview(null)
    setResult(null)
    setError(null)
    setQuality(80)
    setFormat('auto')
  }

  const savings = result
    ? Math.round((1 - result.compressedSize / result.originalSize) * 100)
    : 0

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Image Compress</h1>
        <p className="text-gray-500">
          Compress JPG, PNG, and WebP images online. Reduce file size while keeping quality.
        </p>
      </div>

      <AdBanner className="mb-8 h-20" />

      {/* Upload Area */}
      {!file && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${
            dragOver
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          <div className="text-4xl mb-4">📁</div>
          <p className="text-lg font-medium mb-2">
            Drop an image here or click to browse
          </p>
          <p className="text-sm text-gray-400">
            Supports JPG, PNG, WebP, GIF &bull; Max 20MB
          </p>
        </div>
      )}

      {/* Controls */}
      {file && !result && (
        <div className="space-y-6">
          {/* Preview */}
          {preview && (
            <div className="rounded-xl overflow-hidden border bg-gray-50 dark:bg-gray-800">
              <img src={preview} alt="Preview" className="max-h-80 mx-auto object-contain" />
              <div className="p-3 border-t text-sm text-gray-500 flex items-center justify-between">
                <span>{file.name}</span>
                <span>{formatFileSize(file.size)}</span>
              </div>
            </div>
          )}

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Quality: {quality}%
              </label>
              <input
                type="range"
                min="10"
                max="100"
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Smaller file</span>
                <span>Better quality</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Output Format
              </label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full p-2 border rounded-lg bg-white dark:bg-gray-800"
              >
                <option value="auto">Auto (same as original)</option>
                <option value="jpeg">JPEG</option>
                <option value="png">PNG</option>
                <option value="webp">WebP</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleCompress}
              disabled={loading}
              className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Compressing...' : 'Compress Image'}
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="space-y-6">
          {/* Before/After */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl overflow-hidden border">
              <div className="p-2 bg-gray-50 dark:bg-gray-800 text-xs font-medium text-gray-500 uppercase">
                Before
              </div>
              {preview && <img src={preview} alt="Original" className="w-full" />}
              <div className="p-2 border-t text-sm text-gray-500">
                {formatFileSize(result.originalSize)}
              </div>
            </div>
            <div className="rounded-xl overflow-hidden border border-green-200">
              <div className="p-2 bg-green-50 dark:bg-green-900/20 text-xs font-medium text-green-600 uppercase">
                After &mdash; {savings}% smaller
              </div>
              <img src={result.compressedUrl} alt="Compressed" className="w-full" />
              <div className="p-2 border-t text-sm text-green-600 font-medium">
                {formatFileSize(result.compressedSize)}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-xs text-gray-400">Original</p>
              <p className="font-semibold">{formatFileSize(result.originalSize)}</p>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-xs text-green-600">Compressed</p>
              <p className="font-semibold text-green-600">{formatFileSize(result.compressedSize)}</p>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-xs text-blue-600">Savings</p>
              <p className="font-semibold text-blue-600">{savings}%</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-xs text-gray-400">Dimensions</p>
              <p className="font-semibold">{result.width} x {result.height}</p>
            </div>
          </div>

          {/* Download */}
          <div className="flex gap-3">
            <a
              href={result.compressedUrl}
              download={`compressed-${file?.name}`}
              className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 text-center transition-colors"
            >
              Download Compressed Image
            </a>
            <button
              onClick={handleReset}
              className="px-6 py-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Compress Another
            </button>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* SEO Content */}
      <div className="mt-12 pt-8 border-t">
        <h2 className="text-xl font-bold mb-4">About Online Image Compression</h2>
        <div className="text-sm text-gray-500 space-y-3">
          <p>
            Our image compression tool uses advanced algorithms to reduce the file size of your images
            without sacrificing visual quality. Whether you need to optimize images for your website,
            save storage space, or prepare images for email, our tool delivers optimal results.
          </p>
          <h3 className="font-semibold text-gray-700 dark:text-gray-300">Why compress images?</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Faster website loading times &mdash; compressed images load up to 80% faster</li>
            <li>Save bandwidth and storage costs</li>
            <li>Better user experience and higher SEO rankings</li>
            <li>Easier to share via email and messaging apps</li>
          </ul>
          <p>
            Supports JPEG, PNG, WebP, and GIF formats. All processing happens server-side with
            industry-standard compression algorithms. Your files are never stored permanently.
          </p>
        </div>
      </div>
    </div>
  )
}
