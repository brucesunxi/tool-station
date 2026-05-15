'use client'

import { useState, useCallback } from 'react'
import AdBanner from '@/components/AdBanner'

interface FaviconSize {
  label: string
  size: number
}

const ICON_SIZES: FaviconSize[] = [
  { label: '16x16', size: 16 },
  { label: '32x32', size: 32 },
  { label: '48x48', size: 48 },
  { label: '64x64', size: 64 },
  { label: '128x128', size: 128 },
  { label: '256x256', size: 256 },
]

function createFaviconDataUrl(
  img: HTMLImageElement,
  size: number,
  borderRadius: number = 0
): string {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (!ctx) return ''

  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'

  if (borderRadius > 0) {
    ctx.beginPath()
    ctx.roundRect(0, 0, size, size, borderRadius)
    ctx.clip()
  }

  ctx.drawImage(img, 0, 0, size, size)
  return canvas.toDataURL('image/png')
}

export default function FaviconGeneratorPage() {
  const [image, setImage] = useState<string | null>(null)
  const [favicons, setFavicons] = useState<Record<number, string>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setError('')
    setFavicons({})
    setLoading(true)

    const reader = new FileReader()
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string
      setImage(dataUrl)

      const img = new Image()
      img.onload = () => {
        const generated: Record<number, string> = {}
        for (const { size } of ICON_SIZES) {
          generated[size] = createFaviconDataUrl(img, size)
        }
        setFavicons(generated)
        setLoading(false)
      }
      img.onerror = () => {
        setError('Failed to load image. Please try a different file.')
        setLoading(false)
      }
      img.src = dataUrl
    }
    reader.readAsDataURL(file)
  }, [])

  const downloadFavicon = useCallback((dataUrl: string, size: number) => {
    const link = document.createElement('a')
    link.download = `favicon-${size}x${size}.png`
    link.href = dataUrl
    link.click()
  }, [])

  const downloadAll = useCallback(() => {
    for (const { size } of ICON_SIZES) {
      const dataUrl = favicons[size]
      if (dataUrl) {
        const link = document.createElement('a')
        link.download = `favicon-${size}x${size}.png`
        link.href = dataUrl
        link.click()
      }
    }
  }, [favicons])

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-2">Favicon Generator</h1>
      <p className="text-gray-500 mb-6">
        Upload any image and generate favicons at all standard sizes.
      </p>
      <AdBanner className="mb-8 h-20" />

      <div className="bg-white dark:bg-gray-800 border rounded-xl p-6 mb-8">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="w-full p-2 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-700 file:mr-3 file:py-2 file:px-4 file:border-0 file:rounded-lg file:text-sm file:bg-blue-50 file:text-blue-700 dark:file:bg-blue-900/30 dark:file:text-blue-300 hover:file:bg-blue-100"
          />
          <p className="text-xs text-gray-400 mt-1">Square images work best for favicons.</p>
        </div>

        {error && (
          <div className="p-3 mb-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-lg text-sm text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        {loading && (
          <div className="text-center py-8 text-gray-500">
            <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
            <p className="text-sm">Generating favicons...</p>
          </div>
        )}

        {image && !loading && (
          <div className="mb-6">
            <img src={image} alt="Original" className="max-h-32 rounded-lg mx-auto" />
          </div>
        )}

        {Object.keys(favicons).length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium">Generated Favicons</span>
              <button
                onClick={downloadAll}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Download All Sizes
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {ICON_SIZES.map(({ label, size }) => {
                const dataUrl = favicons[size]
                return (
                  <div key={size} className="border rounded-lg p-3 text-center hover:shadow-md transition-shadow">
                    <div
                      className="mx-auto mb-2 border rounded flex items-center justify-center"
                      style={{
                        width: `${Math.min(size, 128)}px`,
                        height: `${Math.min(size, 128)}px`,
                        maxWidth: '100%',
                      }}
                    >
                      {dataUrl && (
                        <img
                          src={dataUrl}
                          alt={`${label} favicon`}
                          style={{ width: '100%', height: '100%' }}
                        />
                      )}
                    </div>
                    <p className="text-xs font-medium mb-2">{label}</p>
                    <button
                      onClick={() => dataUrl && downloadFavicon(dataUrl, size)}
                      disabled={!dataUrl}
                      className="w-full px-2 py-1 text-xs border rounded hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Download
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {!image && !loading && (
          <div className="text-center py-12 text-gray-400 dark:text-gray-500 border-2 border-dashed rounded-lg">
            <svg className="mx-auto h-12 w-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm">Upload an image to generate favicons</p>
          </div>
        )}
      </div>

      <section className="prose dark:prose-invert max-w-none">
        <h2>How to Use</h2>
        <ol>
          <li>Upload a square image (PNG, JPG, or SVG work best) using the file picker.</li>
          <li>The tool automatically generates favicons at 6 standard sizes: 16, 32, 48, 64, 128, and 256 pixels.</li>
          <li>Preview each size in the grid to see how it will look on different devices.</li>
          <li>Click <strong>Download</strong> on individual sizes or <strong>Download All Sizes</strong> to save all at once.</li>
        </ol>

        <h2>Tips</h2>
        <ul>
          <li>Start with a high-resolution square image for the best quality across all sizes, especially the larger ones.</li>
          <li>The 16x16 and 32x32 sizes are used for browser tabs and bookmarks — ensure your source is recognizable at those small sizes.</li>
          <li>Consider using a simple, high-contrast design as complex details become indistinguishable at small sizes.</li>
        </ul>

        <h2>FAQ</h2>
        <div className="space-y-4 not-prose">
          <div>
            <h3 className="font-semibold">What sizes do I need for a favicon?</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Standard favicon usage: 16x16 (browser tabs), 32x32 (bookmarks, taskbar), 48x48 (Windows shortcuts), 64x64 and 128x128 (high-DPI screens), and 256x256 (Chrome web store, Android). This tool generates all six sizes for broad compatibility.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">What image format should I use for the input?</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              PNG is recommended for the best quality with transparency support. JPG works too but doesn&apos;t support transparent backgrounds. All common image formats supported by your browser will work.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Do I need to combine the sizes into a single .ico file?</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Modern browsers no longer require .ico files — they accept PNG favicons. You can use the 32x32 or 48x48 PNG directly as your favicon by linking it in your HTML <code>&lt;link&gt;</code> tag. Each size is also useful for different platforms and devices.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
