'use client'

import { useState, useRef, useCallback } from 'react'
import AdBanner from '@/components/AdBanner'

export default function ImageSplitterPage() {
  const [image, setImage] = useState<string | null>(null)
  const [rows, setRows] = useState(3)
  const [cols, setCols] = useState(3)
  const [pieces, setPieces] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef = useRef<HTMLImageElement | null>(null)

  const handleUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setError('')
    setPieces([])

    const reader = new FileReader()
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string
      setImage(dataUrl)
    }
    reader.readAsDataURL(file)
  }, [])

  const splitImage = useCallback(() => {
    if (!image) return
    setLoading(true)
    setError('')

    const img = new Image()
    img.onload = () => {
      imgRef.current = img
      const pieceW = Math.floor(img.naturalWidth / cols)
      const pieceH = Math.floor(img.naturalHeight / rows)
      const generated: string[] = []

      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        setError('Canvas not supported')
        setLoading(false)
        return
      }

      canvas.width = pieceW
      canvas.height = pieceH

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          ctx.clearRect(0, 0, pieceW, pieceH)
          ctx.drawImage(img, c * pieceW, r * pieceH, pieceW, pieceH, 0, 0, pieceW, pieceH)
          generated.push(canvas.toDataURL('image/png'))
        }
      }

      setPieces(generated)
      setLoading(false)
    }
    img.onerror = () => {
      setError('Failed to load image')
      setLoading(false)
    }
    img.src = image
  }, [image, rows, cols])

  const downloadPiece = useCallback((dataUrl: string, index: number) => {
    const link = document.createElement('a')
    link.download = `piece-${index + 1}.png`
    link.href = dataUrl
    link.click()
  }, [])

  const downloadAll = useCallback(() => {
    pieces.forEach((dataUrl, i) => {
      const link = document.createElement('a')
      link.download = `piece-${i + 1}.png`
      link.href = dataUrl
      link.click()
    })
  }, [pieces])

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-2">Image Splitter</h1>
      <p className="text-gray-500 mb-6">
        Split images into equal rows and columns. Great for creating Instagram grids and puzzles.
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

        {image && (
          <div className="mb-4">
            <img src={image} alt="Preview" className="max-h-64 rounded-lg mx-auto" />
          </div>
        )}

        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex-1 min-w-[100px]">
            <label className="block text-sm font-medium mb-1">Rows</label>
            <input
              type="number"
              value={rows}
              onChange={(e) => setRows(Math.max(1, Math.min(20, Number(e.target.value))))}
              min={1}
              max={20}
              className="w-full p-2.5 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex-1 min-w-[100px]">
            <label className="block text-sm font-medium mb-1">Columns</label>
            <input
              type="number"
              value={cols}
              onChange={(e) => setCols(Math.max(1, Math.min(20, Number(e.target.value))))}
              min={1}
              max={20}
              className="w-full p-2.5 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={splitImage}
              disabled={!image || loading}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Splitting...' : 'Split Image'}
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-lg text-sm text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        {pieces.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium">
                {pieces.length} pieces generated
              </span>
              <button
                onClick={downloadAll}
                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
              >
                Download All
              </button>
            </div>
            <div
              className="grid gap-3"
              style={{ gridTemplateColumns: `repeat(${Math.min(cols, 4)}, 1fr)` }}
            >
              {pieces.map((dataUrl, i) => (
                <div key={i} className="border rounded-lg overflow-hidden">
                  <img src={dataUrl} alt={`Piece ${i + 1}`} className="w-full" />
                  <button
                    onClick={() => downloadPiece(dataUrl, i)}
                    className="w-full p-2 text-xs font-medium bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    Piece {i + 1}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <section className="prose dark:prose-invert max-w-none">
        <h2>How to Use</h2>
        <ol>
          <li>Upload an image using the file picker — supports all common formats.</li>
          <li>Set the number of <strong>Rows</strong> and <strong>Columns</strong> for the grid (1 to 20).</li>
          <li>Click <strong>Split Image</strong> to divide the image into equal pieces.</li>
          <li>Preview each piece, download individually, or click <strong>Download All</strong> to save all pieces at once.</li>
        </ol>

        <h2>Tips</h2>
        <ul>
          <li>For Instagram grids, use 3x3 for a classic 9-square layout or 2x2 for a simple 4-piece grid.</li>
          <li>Larger images produce better quality pieces — use high-resolution source images for best results.</li>
          <li>All processing happens locally in your browser. Your images are never uploaded to any server.</li>
        </ul>

        <h2>FAQ</h2>
        <div className="space-y-4 not-prose">
          <div>
            <h3 className="font-semibold">What image formats are supported?</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Any image format your browser supports — JPG, PNG, GIF, WebP, BMP, and SVG. The tool works entirely in the browser using the HTML5 Canvas API.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">What happens if the dimensions don&apos;t divide evenly?</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              The tool uses <code>Math.floor</code> for piece dimensions, so pieces are as equal as possible. If the image is 100px wide with 3 columns, each piece is 33px wide and the remaining pixels are excluded.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Can I split images larger than 10MB?</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Yes — performance depends on your device. Very large images may take a moment to process, but there is no file size limit since everything runs locally.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
