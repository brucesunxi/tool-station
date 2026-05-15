'use client'

import { useState, useCallback } from 'react'
import AdBanner from '@/components/AdBanner'

interface ColorSwatch {
  hex: string
  rgb: string
  hsl: string
  count: number
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('')
}

function rgbToHsl(r: number, g: number, b: number): string {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h = 0, s = 0, l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }

  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`
}

function colorDistance(a: number[], b: number[]): number {
  return Math.sqrt(
    (a[0] - b[0]) ** 2 +
    (a[1] - b[1]) ** 2 +
    (a[2] - b[2]) ** 2
  )
}

function quantizeColors(imageData: ImageData, maxColors: number = 10): ColorSwatch[] {
  const data = imageData.data
  const colorMap = new Map<string, { r: number; g: number; b: number; count: number }>()

  // Quantize by rounding to nearest 8 to reduce unique colors, then count frequency
  for (let i = 0; i < data.length; i += 4) {
    const r = Math.round(data[i] / 8) * 8
    const g = Math.round(data[i + 1] / 8) * 8
    const b = Math.round(data[i + 2] / 8) * 8
    const key = `${r},${g},${b}`

    const existing = colorMap.get(key)
    if (existing) {
      existing.count++
    } else {
      colorMap.set(key, { r, g, b, count: 1 })
    }
  }

  // Sort by frequency descending
  const sorted = Array.from(colorMap.values()).sort((a, b) => b.count - a.count)

  // Filter similar colors: pick top colors but skip ones too close to already selected
  const selected: { r: number; g: number; b: number; count: number }[] = []
  for (const color of sorted) {
    let tooClose = false
    for (const sel of selected) {
      if (colorDistance([color.r, color.g, color.b], [sel.r, sel.g, sel.b]) < 30) {
        tooClose = true
        break
      }
    }
    if (!tooClose) {
      selected.push(color)
      if (selected.length >= maxColors) break
    }
  }

  // If we have fewer than maxColors, fill with more from sorted
  if (selected.length < maxColors) {
    for (const color of sorted) {
      if (selected.length >= maxColors) break
      if (!selected.find((s) => s.r === color.r && s.g === color.g && s.b === color.b)) {
        selected.push(color)
      }
    }
  }

  return selected.map((c) => ({
    hex: rgbToHex(c.r, c.g, c.b),
    rgb: `rgb(${c.r}, ${c.g}, ${c.b})`,
    hsl: rgbToHsl(c.r, c.g, c.b),
    count: c.count,
  }))
}

export default function ColorExtractorPage() {
  const [image, setImage] = useState<string | null>(null)
  const [colors, setColors] = useState<ColorSwatch[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const handleUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setError('')
    setColors([])
    setLoading(true)

    const reader = new FileReader()
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string
      setImage(dataUrl)

      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        // Sample at max 300px to keep performance reasonable
        const maxDim = 300
        let w = img.naturalWidth
        let h = img.naturalHeight
        if (w > maxDim || h > maxDim) {
          const ratio = Math.min(maxDim / w, maxDim / h)
          w = Math.round(w * ratio)
          h = Math.round(h * ratio)
        }

        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          setError('Canvas not supported')
          setLoading(false)
          return
        }
        ctx.drawImage(img, 0, 0, w, h)
        const imageData = ctx.getImageData(0, 0, w, h)
        const extracted = quantizeColors(imageData, 10)
        setColors(extracted)
        setLoading(false)
      }
      img.onerror = () => {
        setError('Failed to load image')
        setLoading(false)
      }
      img.src = dataUrl
    }
    reader.readAsDataURL(file)
  }, [])

  const copyColor = useCallback(async (hex: string, index: number) => {
    try {
      await navigator.clipboard.writeText(hex)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000)
    } catch {
      // fallback
    }
  }, [])

  const totalPixels = colors.reduce((sum, c) => sum + c.count, 0)

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-2">Image Color Extractor</h1>
      <p className="text-gray-500 mb-6">
        Upload any image and extract its dominant colors. Get HEX, RGB, and HSL values.
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
        </div>

        {loading && (
          <div className="text-center py-8 text-gray-500">
            <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
            <p className="text-sm">Analyzing image colors...</p>
          </div>
        )}

        {error && (
          <div className="p-3 mb-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-lg text-sm text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        {image && !loading && (
          <div className="mb-6">
            <img src={image} alt="Uploaded" className="max-h-48 rounded-lg mx-auto" />
          </div>
        )}

        {colors.length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-3">Dominant Colors</h3>
            <div className="space-y-2">
              {colors.map((color, i) => {
                const percentage = totalPixels > 0 ? ((color.count / totalPixels) * 100).toFixed(1) : '0'
                return (
                  <div key={i} className="flex items-center gap-3 p-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <div
                      className="w-10 h-10 rounded-lg border flex-shrink-0"
                      style={{ backgroundColor: color.hex }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-sm font-semibold">{color.hex}</span>
                        <span className="text-xs text-gray-500">{color.rgb}</span>
                        <span className="text-xs text-gray-400 hidden sm:inline">{color.hsl}</span>
                      </div>
                      <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5 mt-1">
                        <div
                          className="h-1.5 rounded-full"
                          style={{ width: `${percentage}%`, backgroundColor: color.hex }}
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => copyColor(color.hex, i)}
                      className="flex-shrink-0 px-3 py-1 text-xs border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      {copiedIndex === i ? 'Copied!' : 'Copy'}
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1m-6 9l3-3m0 0l-3-3m3 3H9m6 0H9" />
            </svg>
            <p className="text-sm">Upload an image to extract its colors</p>
          </div>
        )}
      </div>

      <section className="prose dark:prose-invert max-w-none">
        <h2>How to Use</h2>
        <ol>
          <li>Upload any image (JPG, PNG, GIF, WebP) using the file picker.</li>
          <li>The tool automatically analyzes the image and extracts up to 10 dominant colors.</li>
          <li>Each color swatch displays HEX, RGB, and HSL values with a visual percentage bar.</li>
          <li>Click <strong>Copy</strong> next to any color to copy its HEX value to your clipboard.</li>
        </ol>

        <h2>Tips</h2>
        <ul>
          <li>Use images with clear, distinct colors for the most accurate results — busy photos with many small details may return more muted palettes.</li>
          <li>Click any color swatch to copy its HEX code instantly for use in design tools.</li>
          <li>The tool samples the image at a reduced resolution for performance — this does not affect color accuracy.</li>
        </ul>

        <h2>FAQ</h2>
        <div className="space-y-4 not-prose">
          <div>
            <h3 className="font-semibold">How does the color extraction work?</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              The tool reads every pixel of your image using the HTML5 Canvas API, then uses color quantization to group similar colors together. The most frequent color groups are selected and displayed as your dominant color palette.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">How many colors can it extract?</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              The tool extracts up to 10 dominant colors. It filters out very similar colors to give you a diverse and useful palette rather than multiple nearly-identical shades.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Are my images uploaded to a server?</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              No. All image processing happens entirely in your browser using JavaScript and the Canvas API. Your images never leave your device — nothing is uploaded to any server.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
