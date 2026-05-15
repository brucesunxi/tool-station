'use client'

import { useState, useRef } from 'react'
import AdBanner from '@/components/AdBanner'

export default function ImageOcrPage() {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')
  const [progress, setProgress] = useState('')
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = (file: File) => {
    setError(null); setResult('')
    if (!file.type.startsWith('image/')) { setError('Please upload an image file'); return }
    if (file.size > 10 * 1024 * 1024) { setError('Image must be under 10MB'); return }
    setImageFile(file)
    setImageUrl(URL.createObjectURL(file))
  }

  const extractText = async () => {
    if (!imageFile) return
    setLoading(true); setError(null); setResult(''); setProgress('Loading OCR engine...')

    try {
      const Tesseract = await import('tesseract.js')
      const { data } = await Tesseract.recognize(imageFile, 'eng', {
        logger: (m: any) => {
          if (m.status === 'recognizing text') {
            setProgress(`Recognizing... ${Math.round(m.progress * 100)}%`)
          }
        },
      })
      setResult(data.text)
      setProgress('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'OCR failed')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => { setImageUrl(null); setImageFile(null); setResult(''); setError(null); setProgress('') }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Image to Text (OCR)</h1>
        <p className="text-gray-500">Extract text from images using optical character recognition. Supports JPG, PNG, and WebP.</p>
      </div>
      <AdBanner className="mb-8 h-20" />

      {!imageUrl && (
        <div className="border-2 border-dashed rounded-xl p-12 text-center cursor-pointer hover:border-blue-400 transition-colors"
          onClick={() => inputRef.current?.click()}
          onDrop={e => { e.preventDefault(); e.dataTransfer.files[0] && handleFile(e.dataTransfer.files[0]) }}
          onDragOver={e => e.preventDefault()}>
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
          <p className="text-4xl mb-3">🖼️</p>
          <p className="font-medium">Upload an image to extract text</p>
          <p className="text-sm text-gray-400 mt-1">Supports JPG, PNG, WebP — Max 10MB</p>
        </div>
      )}

      {imageUrl && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <img src={imageUrl} alt="Uploaded" className="w-full rounded-xl border max-h-80 object-contain" />
            <div className="flex gap-2 mt-3">
              <button onClick={extractText} disabled={loading}
                className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors">
                {loading ? 'Extracting...' : 'Extract Text'}
              </button>
              <button onClick={handleReset}
                className="px-4 py-2.5 border rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Remove</button>
            </div>
            {progress && (
              <div className="mt-3 flex items-center gap-2 text-sm text-blue-600">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                {progress}
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Extracted Text</label>
              {result && <button onClick={() => navigator.clipboard.writeText(result).catch(() => {})}
                className="text-xs px-2 py-1 border rounded hover:bg-gray-50 dark:hover:bg-gray-800">Copy</button>}
            </div>
            <div className={`min-h-[300px] p-4 border rounded-xl text-sm whitespace-pre-wrap ${
              result ? 'border-green-200 bg-green-50/50 dark:bg-green-900/10' : 'bg-gray-50 dark:bg-gray-800/50'
            }`}>
              {result || <p className="text-gray-400">{loading ? '' : 'Text will appear here...'}</p>}
            </div>
          </div>
        </div>
      )}

      {error && <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>}

      <section className="mt-12 pt-8 border-t prose dark:prose-invert max-w-none">
        <h2>How to Use</h2>
        <ol>
          <li>Upload an image containing text by clicking the upload area or dragging a file onto it.</li>
          <li>Click <strong>Extract Text</strong> to run the OCR engine on your image.</li>
          <li>Wait for the progress indicator to reach 100% &mdash; processing time depends on image size and content.</li>
          <li>Review the extracted text in the right panel.</li>
          <li>Click <strong>Copy</strong> to copy the text to your clipboard for use in other applications.</li>
          <li>Use <strong>Remove</strong> to clear the current image and start over with a new one.</li>
        </ol>
        <h2>Tips</h2>
        <ul>
          <li>High-resolution images with clear, well-lit text produce the most accurate results.</li>
          <li>Printed text (documents, receipts, signs) works significantly better than handwriting.</li>
          <li>Ensure text is horizontally oriented &mdash; rotated or skewed text reduces recognition accuracy.</li>
          <li>High contrast between text and background (e.g., black text on white paper) improves OCR quality.</li>
        </ul>
        <h2>FAQ</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">Is my data sent to a server?</h3>
            <p>No, all OCR processing happens entirely in your browser using Tesseract.js. Nothing is uploaded to any server.</p>
          </div>
          <div>
            <h3 className="font-semibold">What languages are supported?</h3>
            <p>Currently English (eng) is supported. Additional languages will be added in future updates.</p>
          </div>
          <div>
            <h3 className="font-semibold">What image formats are accepted?</h3>
            <p>We support JPG, PNG, and WebP images up to 10MB.</p>
          </div>
          <div>
            <h3 className="font-semibold">How accurate is the OCR?</h3>
            <p>Accuracy depends on image quality. Clear, high-resolution images with standard fonts typically achieve 90% or higher accuracy.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
