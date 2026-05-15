'use client'

import { useTranslations } from 'next-intl'
import { useState, useRef } from 'react'
import AdBanner from '@/components/AdBanner'

export default function QrCodePage() {
  const t = useTranslations('tools.qr-code')
  const ct = useTranslations('common')

  const [text, setText] = useState('')
  const [size, setSize] = useState(256)
  const [fgColor, setFgColor] = useState('#000000')
  const [bgColor, setBgColor] = useState('#ffffff')
  const [qrDataUrl, setQrDataUrl] = useState('')
  const [error, setError] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const generate = async () => {
    if (!text.trim()) return
    setError(null)

    try {
      const QRCode = (await import('qrcode')).default
      const url = await QRCode.toDataURL(text, {
        width: size,
        margin: 2,
        color: { dark: fgColor, light: bgColor },
        errorCorrectionLevel: 'M',
      })
      setQrDataUrl(url)
    } catch {
      setError('Failed to generate QR code')
    }
  }

  const handleDownload = () => {
    if (!qrDataUrl) return
    const a = document.createElement('a')
    a.href = qrDataUrl
    a.download = 'qrcode.png'
    a.click()
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('h1')}</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{t('description')}</p>
      </div>
      <AdBanner className="mb-8 h-20" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Content</label>
          <textarea value={text} onChange={e => setText(e.target.value)} rows={4}
            placeholder="Enter text or URL..."
            className="w-full p-3 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="grid grid-cols-2 gap-3 mt-3">
            <div>
              <label className="block text-sm font-medium mb-1">Size</label>
              <select value={size} onChange={e => setSize(Number(e.target.value))}
                className="w-full p-2 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-700">
                <option value="128">128 x 128</option>
                <option value="256">256 x 256</option>
                <option value="512">512 x 512</option>
                <option value="1024">1024 x 1024</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">FG Color</label>
              <input type="color" value={fgColor} onChange={e => setFgColor(e.target.value)} className="w-full h-9 rounded border cursor-pointer" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">BG Color</label>
              <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-full h-9 rounded border cursor-pointer" />
            </div>
          </div>

          <button onClick={generate} disabled={!text.trim()}
            className="w-full mt-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors">
            Generate QR Code
          </button>

          {error && <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>}
        </div>

        <div className="flex flex-col items-center justify-center">
          {qrDataUrl ? (
            <>
              <img src={qrDataUrl} alt="QR Code" className="border rounded-xl p-2 bg-white" style={{ maxWidth: size }} />
              <button onClick={handleDownload}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                Download PNG
              </button>
            </>
          ) : (
            <div className="w-64 h-64 border-2 border-dashed rounded-xl flex items-center justify-center text-gray-400 text-sm">
              QR code will appear here
            </div>
          )}
        </div>
      </div>

      {/* SEO Content */}
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
