'use client'

import { useTranslations } from 'next-intl'
import { useState, useCallback, useRef } from 'react'
import AdBanner from '@/components/AdBanner'

declare global {
  interface Window {
    jsQR?: (data: Uint8ClampedArray, width: number, height: number) => { data: string } | null
  }
}

export default function QrReaderPage() {
  const t = useTranslations('tools.qr-reader')
  const ct = useTranslations('common')

  const [image, setImage] = useState<string | null>(null)
  const [result, setResult] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [jsqrLoaded, setJsqrLoaded] = useState(false)
  const [copied, setCopied] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const loadJsQr = useCallback(async () => {
    if (window.jsQR) {
      setJsqrLoaded(true)
      return true
    }

    try {
      await new Promise<void>((resolve, reject) => {
        const script = document.createElement('script')
        script.src = 'https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js'
        script.onload = () => {
          setJsqrLoaded(true)
          resolve()
        }
        script.onerror = () => reject(new Error('Failed to load jsQR library'))
        document.head.appendChild(script)
      })
      return true
    } catch {
      setError('Failed to load QR decoder library. Please check your internet connection and try again.')
      return false
    }
  }, [])

  const handleUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setError('')
    setResult(null)
    setLoading(true)

    const loaded = await loadJsQr()
    if (!loaded) {
      setLoading(false)
      return
    }

    const reader = new FileReader()
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string
      setImage(dataUrl)

      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.naturalWidth
        canvas.height = img.naturalHeight
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          setError('Canvas not supported')
          setLoading(false)
          return
        }
        ctx.drawImage(img, 0, 0)
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

        try {
          const code = window.jsQR!(imageData.data, imageData.width, imageData.height)
          if (code) {
            setResult(code.data)
          } else {
            setError('No QR code found in the image. Try a clearer image.')
          }
        } catch {
          setError('Error decoding QR code. The image may be corrupted.')
        }
        setLoading(false)
      }
      img.onerror = () => {
        setError('Failed to load image')
        setLoading(false)
      }
      img.src = dataUrl
    }
    reader.readAsDataURL(file)
  }, [loadJsQr])

  const handleCopy = useCallback(async () => {
    if (!result) return
    try {
      await navigator.clipboard.writeText(result)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback
    }
  }, [result])

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-2">{t('h1')}</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">{t('description')}</p>
      <AdBanner className="mb-8 h-20" />

      <div className="bg-white dark:bg-gray-800 border rounded-xl p-6 mb-8">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Upload QR Code Image</label>
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
            <p className="text-sm">
              {jsqrLoaded ? 'Decoding QR code...' : 'Loading QR decoder library...'}
            </p>
          </div>
        )}

        {error && (
          <div className="p-3 mb-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-lg text-sm text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        {image && !loading && (
          <div className="mb-4">
            <img src={image} alt="QR Code" className="max-h-48 rounded-lg mx-auto" />
          </div>
        )}

        {result && (
          <div className="p-4 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/30 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Decoded Content</span>
              <button
                onClick={handleCopy}
                className="text-xs px-2 py-1 border rounded hover:bg-white dark:hover:bg-gray-700 transition-colors"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <p className="text-sm font-mono break-all bg-white dark:bg-gray-800 p-3 rounded border">
              {result}
            </p>
          </div>
        )}

        {!image && !loading && !result && (
          <div className="text-center py-12 text-gray-400 dark:text-gray-500 border-2 border-dashed rounded-lg">
            <svg className="mx-auto h-12 w-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
            <p className="text-sm">Upload a QR code image to read it</p>
          </div>
        )}
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
