'use client'

import { useState, useRef, useCallback } from 'react'
import { formatFileSize, clamp } from '@/lib/utils'
import AdBanner from '@/components/AdBanner'

interface PptResult {
  pptxDataUrl: string
  size: number
  slides: number
}

interface TextItem {
  text: string
  x: number
  y: number
  w: number
  h: number
  fontSize: number
  fontFace: string
  bold: boolean
  italic: boolean
  color: string
}

// 16:9 widescreen slide dimensions in inches
const SLIDE_W = 13.33
const SLIDE_H = 7.5

export default function PdfToPptPage() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState('')
  const [result, setResult] = useState<PptResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback((selectedFile: File) => {
    setError(null); setResult(null)
    if (selectedFile.type !== 'application/pdf' && !selectedFile.name.toLowerCase().endsWith('.pdf')) {
      setError('Please upload a PDF file'); return
    }
    if (selectedFile.size > 50 * 1024 * 1024) { setError('File size must be under 50MB'); return }
    setFile(selectedFile)
  }, [])

  const handleConvert = async () => {
    if (!file) return
    setLoading(true); setError(null)

    try {
      setProgress('Loading PDF engine...')
      const pdfjsLib = await loadPdfJs()

      setProgress('Reading PDF...')
      const arrayBuffer = await file.arrayBuffer()
      const pdfDoc = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise
      const totalPages = pdfDoc.numPages

      const slides: { textItems: TextItem[] }[] = []

      for (let i = 1; i <= totalPages; i++) {
        setProgress(`Extracting content from page ${i} of ${totalPages}...`)
        const page = await pdfDoc.getPage(i)

        const textContent = await page.getTextContent()
        const viewport = page.getViewport({ scale: 1 })
        const pageW = viewport.width
        const pageH = viewport.height

        // Scale factors: map PDF page coordinates proportionally to slide
        // PDF coordinates are in points (1/72 inch), origin at bottom-left
        // PPTX coordinates are in inches, origin at top-left
        const sx = SLIDE_W / pageW
        const sy = SLIDE_H / pageH

        const items: TextItem[] = []

        for (const raw of textContent.items) {
          const item = raw as any
          const text = (item.str || '').trim()
          if (!text) continue

          // Transform matrix: [a, b, c, d, e, f]
          // e = x offset from left (PDF points), f = y from bottom (baseline)
          const tx = item.transform[4]
          const ty = item.transform[5]
          // d component = font size in PDF points (for non-rotated text)
          let fontSize = Math.abs(item.transform[3])
          if (!fontSize || fontSize < 1) fontSize = 12
          // Clamp to reasonable PPTX range
          fontSize = clamp(fontSize, 8, 96)

          // X: proportionally scale from PDF points to slide inches
          const xIn = clamp(tx * sx, 0, SLIDE_W - 0.3)

          // Y: PDF origin is bottom-left, PPTX origin is top-left.
          //   ty = baseline distance from bottom of PDF page.
          //   Distance from top of PDF to baseline = pageH - ty (PDF points).
          //   Proportional position on slide = (pageH - ty) * sy (inches from top).
          //   Text box top ≈ baseline - font height offset.
          //   font height offset in slide inches = fontSize * FONT_ASCENT / 72
          //   BUT: we're working in proportional slide space, so the y offset
          //   from font size needs to be: fontSize * sy * FONT_ASCENT
          const yIn = clamp((pageH - ty) * sy - fontSize * sy * 0.8, 0, SLIDE_H - 0.3)

          // Width: use item.width if available (in PDF space), scaled to slide
          let wIn: number
          if (item.width && item.width > 0) {
            wIn = Math.max(item.width * sx, 0.5)
          } else {
            // Estimate: average char is ~0.6em wide
            wIn = Math.max(text.length * fontSize * 0.03, 0.5)
          }
          // Constrain to right edge
          wIn = Math.min(wIn, SLIDE_W - xIn - 0.2)

          // Height in slide inches: font point size / 72 with line spacing
          const hIn = Math.max(fontSize / 72 * 1.5, 0.2)

          // Parse font properties from the font name
          const { fontFace, bold, italic } = parseFontName(item.fontName)

          items.push({
            text,
            x: xIn,
            y: yIn,
            w: wIn,
            h: hIn,
            fontSize,
            fontFace,
            bold,
            italic,
            color: '333333',
          })
        }

        // Merge adjacent text items on the same line
        const mergedItems = mergeTextItems(items)
        slides.push({ textItems: mergedItems })
      }

      setProgress('Creating PowerPoint file...')
      const res = await fetch('/api/pdf-to-ppt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slides }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'PPTX creation failed')

      setResult({ pptxDataUrl: data.pptxDataUrl, size: data.size, slides: data.slides })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Conversion failed')
    } finally { setLoading(false); setProgress('') }
  }

  const handleReset = () => { setFile(null); setResult(null); setError(null) }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">PDF to PowerPoint</h1>
        <p className="text-gray-500">
          Convert PDF to editable PowerPoint. Text and formatting are preserved, not screenshots.
        </p>
      </div>
      <AdBanner className="mb-8 h-20" />

      {!file && !result && (
        <div onDrop={(e) => { e.preventDefault(); setDragOver(false); e.dataTransfer.files[0] && handleFile(e.dataTransfer.files[0]) }}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }} onDragLeave={() => setDragOver(false)}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${dragOver ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' : 'border-gray-300 dark:border-gray-600 hover:border-orange-400'}`}>
          <input ref={inputRef} type="file" accept=".pdf,application/pdf" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
          <div className="text-5xl mb-4">📽️</div>
          <p className="text-lg font-medium mb-2">Drop a PDF here to convert to PowerPoint</p>
          <p className="text-sm text-gray-400">PDF → Editable PPTX &bull; Text preserved &bull; Max 50MB</p>
        </div>
      )}

      {file && !result && (
        <div className="space-y-6">
          <div className="flex items-center gap-4 p-4 border rounded-xl bg-gray-50 dark:bg-gray-800">
            <div className="text-2xl">📕</div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{file.name}</p>
              <p className="text-sm text-gray-400">{formatFileSize(file.size)}</p>
            </div>
            <button onClick={handleReset} className="text-gray-400 hover:text-red-500 text-lg">✕</button>
          </div>

          {loading && progress && (
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-blue-600">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                {progress}
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full animate-pulse" style={{ width: '60%' }} />
              </div>
            </div>
          )}

          {!loading && (
            <button onClick={handleConvert}
              className="w-full py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors">
              📽️ Convert to Editable PowerPoint
            </button>
          )}
        </div>
      )}

      {result && (
        <div className="space-y-6">
          <div className="p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 rounded-xl text-center">
            <div className="text-4xl mb-2">✅</div>
            <h2 className="text-xl font-bold mb-1">PowerPoint Created!</h2>
            <p className="text-sm text-gray-500">{result.slides} slide{result.slides > 1 ? 's' : ''} with editable text</p>
          </div>
          <div className="flex gap-3">
            <a href={result.pptxDataUrl} download={file?.name?.replace(/\.pdf$/i, '') + '.pptx'}
              className="flex-1 py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 text-center transition-colors">
              Download PowerPoint ({formatFileSize(result.size)})
            </a>
            <button onClick={handleReset}
              className="px-6 py-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Convert Another</button>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>
      )}

      <section className="mt-12 pt-8 border-t prose dark:prose-invert max-w-none">
        <h2>How to Use</h2>
        <ol>
          <li>Upload a PDF file by clicking the upload area or dragging it onto the drop zone.</li>
          <li>Review the file details and click <strong>Convert to Editable PowerPoint</strong>.</li>
          <li>Wait for the progress bar to complete &mdash; the tool extracts text from each page.</li>
          <li>Download the resulting PPTX file once processing finishes.</li>
          <li>Open the file in Microsoft PowerPoint, Google Slides, or LibreOffice.</li>
          <li>Edit the text, adjust formatting, and add your own styling as needed.</li>
        </ol>
        <h2>Tips</h2>
        <ul>
          <li>Text-heavy PDFs with simple layouts produce the best conversion results.</li>
          <li>Each PDF page becomes a separate slide in the PowerPoint presentation.</li>
          <li>Embedded fonts are mapped to commonly available alternatives such as Calibri or Consolas.</li>
          <li>Complex layouts with tables, columns, or overlapping elements may need manual adjustment after conversion.</li>
        </ul>
        <h2>FAQ</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">Does the conversion preserve images?</h3>
            <p>This tool primarily extracts and recreates text content as editable text boxes. Complex graphics and embedded images may not transfer perfectly.</p>
          </div>
          <div>
            <h3 className="font-semibold">Can I convert a scanned PDF?</h3>
            <p>This tool extracts text content from the PDF directly. For scanned documents (image-based PDFs), use our OCR tool first to extract the text, then paste it into PowerPoint.</p>
          </div>
          <div>
            <h3 className="font-semibold">What PowerPoint format is used?</h3>
            <p>The output is PPTX format, compatible with Microsoft PowerPoint 2007 and later, plus Google Slides and LibreOffice.</p>
          </div>
          <div>
            <h3 className="font-semibold">Will my formatting be preserved?</h3>
            <p>Text positioning, font faces, and bold/italic styling are preserved. Complex layouts may require some manual adjustment in PowerPoint.</p>
          </div>
        </div>
      </section>
    </div>
  )
}

function mergeTextItems(items: TextItem[]): TextItem[] {
  if (items.length === 0) return []

  // Sort by Y (top to bottom), then X (left to right)
  const sorted = [...items].sort((a, b) => Math.abs(a.y - b.y) < 0.2 ? a.x - b.x : b.y - a.y)

  const merged: TextItem[] = []
  let current = { ...sorted[0] }

  for (let i = 1; i < sorted.length; i++) {
    const item = sorted[i]
    const yGap = Math.abs(item.y - current.y)
    const xGap = item.x - (current.x + current.w)

    // Same line? (close Y, adjacent or slightly overlapping X)
    if (yGap < 0.2) {
      if (xGap > 0 && xGap < 0.5) {
        // Adjacent words — add a space between them
        current.text += ' ' + item.text
        current.w = item.x + item.w - current.x
      } else if (xGap <= 0) {
        // Overlapping or touching — merge directly
        current.text += item.text
        current.w = current.w > (item.x + item.w - current.x)
          ? current.w
          : item.x + item.w - current.x
      } else {
        // Too far apart — start new item
        merged.push(current)
        current = { ...item }
        continue
      }
      current.fontSize = Math.max(current.fontSize, item.fontSize)
      current.h = Math.max(current.h, item.h)
    } else {
      merged.push(current)
      current = { ...item }
    }
  }
  merged.push(current)

  return merged
}

function parseFontName(fontName: string): { fontFace: string; bold: boolean; italic: boolean } {
  if (!fontName) return { fontFace: 'Calibri', bold: false, italic: false }

  // Remove PDF internal font prefix (e.g. "EAAAAA+Helvetica" -> "Helvetica")
  let name = fontName.replace(/^[A-Za-z0-9]+\+/, '')

  const bold = /\bbold\b/i.test(name)
  const italic = /\bitalic\b/i.test(name) || /\boblique\b/i.test(name)

  // Strip style suffixes
  name = name.replace(/-(bold|italic|oblique|regular|normal)\b/gi, '')

  const lower = name.toLowerCase().trim()

  // Map common PDF base fonts to widely-available system fonts
  if (!name || lower === 'helvetica' || lower === 'arial' || lower === 'sans-serif') {
    return { fontFace: 'Calibri', bold, italic }
  }
  if (lower === 'times' || lower === 'timesnewroman' || lower === 'timesnewromanps' || lower === 'serif') {
    return { fontFace: 'Calibri', bold, italic }
  }
  if (lower === 'courier' || lower === 'consolas' || lower === 'monospace') {
    return { fontFace: 'Consolas', bold, italic }
  }

  return { fontFace: name || 'Calibri', bold, italic }
}

function loadPdfJs(): Promise<any> {
  const win = window as any
  if (win.pdfjsLib) return Promise.resolve(win.pdfjsLib)

  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js'
    script.onload = () => {
      win.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'
      resolve(win.pdfjsLib)
    }
    script.onerror = () => reject(new Error('Failed to load PDF.js'))
    document.head.appendChild(script)
  })
}
