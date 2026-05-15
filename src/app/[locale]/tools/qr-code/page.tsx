'use client'

import { useState, useRef } from 'react'
import AdBanner from '@/components/AdBanner'

export default function QrCodePage() {
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
        <h1 className="text-3xl font-bold mb-2">QR Code Generator</h1>
        <p className="text-gray-500">Generate QR codes for URLs, text, contact info, and more. Free and instant.</p>
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
        <h2>How to Use</h2>
        <ol>
          <li>Enter the content you want to encode -- a URL, text, phone number, or any other information.</li>
          <li>Select the QR code size from 128 by 128 up to 1024 by 1024 pixels using the dropdown menu.</li>
          <li>Customize the foreground and background colors using the color picker inputs.</li>
          <li>Click "Generate QR Code" to create your QR code image instantly.</li>
          <li>Click "Download PNG" to save the QR code as a PNG image file for use in print or digital materials.</li>
        </ol>
        <h2>Tips</h2>
        <ul>
          <li>Always test your QR code by scanning it with a phone before printing it on materials to ensure the encoded content is correct.</li>
          <li>Use higher resolution (512 or 1024) for printed materials like business cards and posters to ensure scanners can read it reliably.</li>
          <li>Choose high-contrast color combinations -- dark foreground on a light background provides the best readability.</li>
        </ul>
        <h2>FAQ</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">What type of error correction does the QR code use?</h3>
            <p>The tool uses Medium (M) error correction level, which allows the QR code to be scanned even if up to 15 percent of it is damaged or obscured.</p>
          </div>
          <div>
            <h3 className="font-semibold">Can I customize the colors of the QR code?</h3>
            <p>Yes. You can set both the foreground (dark module) and background (light module) colors using the built-in color pickers before generating.</p>
          </div>
          <div>
            <h3 className="font-semibold">What content can I encode in a QR code?</h3>
            <p>Any text content including URLs, plain text, phone numbers, email addresses, Wi-Fi credentials, and contact information.</p>
          </div>
          <div>
            <h3 className="font-semibold">How do I save the QR code image?</h3>
            <p>Click "Download PNG" to save the QR code as a PNG image file. You can also right-click the generated image in most browsers to save it directly.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
