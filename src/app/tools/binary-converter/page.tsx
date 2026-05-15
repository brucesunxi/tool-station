'use client'

import { useState, useMemo } from 'react'
import AdBanner from '@/components/AdBanner'

type BinaryMode = 'encode' | 'decode'

export default function BinaryConverterPage() {
  const [input, setInput] = useState('')
  const [mode, setMode] = useState<BinaryMode>('encode')
  const [separator, setSeparator] = useState(' ')
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  const result = useMemo(() => {
    setError('')
    if (!input.trim()) return ''

    try {
      if (mode === 'encode') {
        return input.split('').map(char => {
          return char.charCodeAt(0).toString(2).padStart(8, '0')
        }).join(separator)
      } else {
        const cleaned = input.trim().replace(/\s+/g, ' ')
        const bytes = cleaned.split(' ')

        for (const byte of bytes) {
          if (!/^[01]+$/.test(byte)) {
            setError(`Invalid binary: "${byte}" is not a binary string. Use only 0s and 1s.`)
            return ''
          }
        }

        return bytes.map(byte => {
          return String.fromCharCode(parseInt(byte, 2))
        }).join('')
      }
    } catch (e) {
      setError('Conversion error. Check your input and try again.')
      return ''
    }
  }, [input, mode, separator])

  const handleCopy = () => {
    if (!result) return
    navigator.clipboard.writeText(result).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-2">Binary Converter</h1>
      <p className="text-gray-500 mb-6">Convert text to binary code and decode binary back to text.</p>
      <AdBanner className="mb-8 h-20" />

      <div className="bg-white dark:bg-gray-800 border rounded-xl p-6 mb-8">
        <div className="flex gap-2 mb-4">
          <button onClick={() => setMode('encode')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              mode === 'encode' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}>
            Text to Binary
          </button>
          <button onClick={() => setMode('decode')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              mode === 'decode' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}>
            Binary to Text
          </button>
        </div>

        {mode === 'encode' && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Output Separator</label>
            <select value={separator} onChange={e => setSeparator(e.target.value)}
              className="w-full max-w-xs p-2.5 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value=" ">Space</option>
              <option value="">None</option>
              <option value=",">Comma</option>
            </select>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              {mode === 'encode' ? 'Text' : 'Binary'}
            </label>
            <textarea value={input} onChange={e => setInput(e.target.value)} rows={6}
              placeholder={mode === 'encode' ? 'Enter text to convert...' : 'Enter binary (8-bit groups separated by spaces)...'}
              className="w-full p-4 border rounded-xl resize-y text-sm dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium">
                {mode === 'encode' ? 'Binary' : 'Text'}
              </label>
              {result && (
                <button onClick={handleCopy} className="text-xs px-2 py-1 border rounded hover:bg-gray-50 dark:hover:bg-gray-800">{copied ? 'Copied!' : 'Copy'}</button>
              )}
            </div>
            <textarea value={result} readOnly rows={6}
              className="w-full p-4 border rounded-xl resize-y text-sm bg-gray-50 dark:bg-gray-800 dark:border-gray-700 font-mono" placeholder="Result will appear here..."
            />
          </div>
        </div>

        {error && (
          <p className="mt-2 text-sm text-red-500">{error}</p>
        )}
      </div>

      <section className="prose dark:prose-invert max-w-none">
        <h2>How to Use</h2>
        <ol>
          <li>Select <strong>Text to Binary</strong> to encode text, or <strong>Binary to Text</strong> to decode.</li>
          <li>Type or paste your input in the appropriate field.</li>
          <li>For encoding, choose a separator (space, comma, or none) between binary groups.</li>
          <li>For decoding, enter 8-bit binary groups separated by spaces.</li>
          <li>The converted result updates in real time.</li>
        </ol>

        <h2>Tips</h2>
        <ul>
          <li>Each character is represented as 8 bits (one byte) using ASCII/Unicode encoding.</li>
          <li>When decoding, ensure binary groups are separated by spaces for proper conversion.</li>
          <li>Use this tool to understand how computers store text data at the binary level.</li>
        </ul>

        <h2>FAQ</h2>
        <div className="space-y-4 not-prose">
          <div>
            <h3 className="font-semibold">What is binary encoding?</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Binary encoding represents each character as an 8-bit sequence of 0s and 1s. Each character&apos;s numeric code (ASCII/Unicode) is converted to base-2 notation. For example, &quot;A&quot; (ASCII 65) becomes &quot;01000001&quot;.</p>
          </div>
          <div>
            <h3 className="font-semibold">Why are binary values 8 bits long?</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">8 bits (one byte) is the standard unit for representing a single character in computing. Eight bits can represent 256 different values (0-255), which covers all standard ASCII characters.</p>
          </div>
          <div>
            <h3 className="font-semibold">Can this convert Unicode characters like emoji?</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Yes. Characters outside the ASCII range will still be converted to their binary representation based on their Unicode code point (in 8-bit groups for each byte of the UTF-8 representation).</p>
          </div>
        </div>
      </section>
    </div>
  )
}
