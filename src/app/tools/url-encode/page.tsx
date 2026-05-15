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
    } catch {
      setOutput('Error')
    }
  }, [input, encodeWhole])

  const handleDecode = useCallback(() => {
    try {
      const result = encodeWhole ? decodeURI(input) : decodeURIComponent(input)
      setOutput(result)
    } catch {
      setOutput('Error: Invalid URL encoding')
    }
  }, [input, encodeWhole])

  const handleCopy = async () => {
    if (!output) return
    try {
      await navigator.clipboard.writeText(output)
      setCopyText('Copied!')
      setTimeout(() => setCopyText('Copy'), 2000)
    } catch { /* */ }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">URL Encoder / Decoder</h1>
        <p className="text-gray-500">Encode or decode URLs and URL components online.</p>
      </div>
      <AdBanner className="mb-8 h-20" />

      <div className="bg-white dark:bg-gray-800 border rounded-xl p-6 mb-8 space-y-4">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Enter URL or text to encode/decode..."
          className="w-full p-3 border rounded-lg text-sm min-h-[100px] dark:bg-gray-700 dark:border-gray-600"
        />
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={encodeWhole} onChange={e => setEncodeWhole(e.target.checked)} className="rounded" />
            Whole URL
          </label>
          <button onClick={handleEncode} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">Encode</button>
          <button onClick={handleDecode} className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-700">Decode</button>
          <button onClick={() => { setInput(''); setOutput('') }} className="px-4 py-2 border rounded-lg text-sm">Clear</button>
        </div>
        <div className="relative">
          <textarea
            value={output}
            readOnly
            placeholder="Result will appear here..."
            className="w-full p-3 border rounded-lg text-sm min-h-[80px] bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
          />
          {output && (
            <button onClick={handleCopy} className="absolute top-2 right-2 px-3 py-1 bg-gray-200 dark:bg-gray-600 rounded text-xs hover:bg-gray-300 dark:hover:bg-gray-500">
              {copyText}
            </button>
          )}
        </div>
      </div>

      <section className="mt-12 pt-8 border-t prose dark:prose-invert max-w-none">
        <h2>How to Use</h2>
        <ol>
          <li>Type or paste the URL or text you want to encode or decode into the input field.</li>
          <li>Toggle "Whole URL" on to encode/decode the full URL, or off to encode/decode only URL components (query parameters).</li>
          <li>Click "Encode" to percent-encode special characters, or "Decode" to convert encoded sequences back to readable text.</li>
          <li>Use the copy button to copy the result to your clipboard, or click "Clear" to start over.</li>
        </ol>

        <h2>Tips</h2>
        <ul>
          <li>Use "Whole URL" mode for encoding complete URLs — it preserves the URL structure while encoding necessary characters.</li>
          <li>Use component mode for encoding query parameter values — it encodes more characters including /, ?, &, and #.</li>
          <li>All processing happens in your browser using JavaScript's built-in URL encoding functions — your data stays private.</li>
        </ul>

        <h2>FAQ</h2>
        <div className="space-y-4">
          <div><h3 className="font-semibold">What is URL encoding?</h3><p>URL encoding converts characters that are not allowed in URLs into a format that can be safely transmitted. For example, a space becomes %20 and an ampersand becomes %26.</p></div>
          <div><h3 className="font-semibold">What&apos;s the difference between encodeURI and encodeURIComponent?</h3><p>encodeURI encodes a complete URI while preserving structural characters like /, ?, &amp;, #, and :. encodeURIComponent encodes a query string value and also encodes those special characters — use it for parameter values.</p></div>
          <div><h3 className="font-semibold">Is my data sent to a server?</h3><p>No. All encoding and decoding happens in your browser using JavaScript&apos;s built-in functions. Your data never leaves your device.</p></div>
        </div>
      </section>
    </div>
  )
}
