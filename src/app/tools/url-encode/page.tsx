'use client'

import { useState, useCallback } from 'react'
import AdBanner from '@/components/AdBanner'

export default function UrlEncodePage() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [encodeWhole, setEncodeWhole] = useState(true)
  const [copyText, setCopyText] = useState('Copy')

  const handleEncode = useCallback(() => {
    try {
      const result = encodeWhole ? encodeURI(input) : encodeURIComponent(input)
      setOutput(result)
    } catch { setOutput('Error') }
  }, [input, encodeWhole])

  const handleDecode = useCallback(() => {
    try {
      const result = encodeWhole ? decodeURI(input) : decodeURIComponent(input)
      setOutput(result)
    } catch { setOutput('Error: Invalid URL encoding') }
  }, [input, encodeWhole])

  const handleCopy = async () => {
    if (!output) return
    try { await navigator.clipboard.writeText(output); setCopyText('Copied!'); setTimeout(() => setCopyText('Copy'), 2000) } catch { /* */ }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">URL Encoder / Decoder</h1>
        <p className="text-gray-500">Encode or decode URLs and URL components online.</p>
      </div>
      <AdBanner className="mb-8 h-20" />

      <div className="flex gap-4 mb-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="radio" checked={encodeWhole} onChange={() => setEncodeWhole(true)} className="accent-blue-600" />
          <span className="text-sm">encodeURI / decodeURI <span className="text-gray-400">(whole URL)</span></span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="radio" checked={!encodeWhole} onChange={() => setEncodeWhole(false)} className="accent-blue-600" />
          <span className="text-sm">encodeURIComponent / decodeURIComponent <span className="text-gray-400">(query params)</span></span>
        </label>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Input</label>
          <textarea value={input} onChange={e => setInput(e.target.value)} rows={10}
            placeholder="Enter URL or text to encode/decode..."
            className="w-full p-4 border rounded-xl resize-y text-sm font-mono dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">Output</label>
            {output && <button onClick={handleCopy} className="text-xs px-2 py-1 border rounded hover:bg-gray-50 dark:hover:bg-gray-800">{copyText}</button>}
          </div>
          <textarea value={output} readOnly rows={10}
            className="w-full p-4 border rounded-xl resize-y text-sm font-mono bg-gray-50 dark:bg-gray-800 dark:border-gray-700" placeholder="Result..." />
        </div>
      </div>

      <div className="flex gap-3 mt-4">
        <button onClick={handleEncode} className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Encode →</button>
        <button onClick={handleDecode} className="px-6 py-2.5 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">← Decode</button>
        <button onClick={() => { setInput(''); setOutput('') }} className="px-6 py-2.5 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Clear</button>
      </div>

      <div className="mt-12 pt-8 border-t">
        <h2 className="text-xl font-bold mb-4">Free Online URL Encoder / Decoder</h2>
        <p className="text-sm text-gray-500">Encode URLs for web use, or decode percent-encoded URLs back to readable text. Two modes for whole URLs and query parameters.</p>
      </div>
    </div>
  )
}
