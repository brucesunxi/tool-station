'use client'

import { useState, useMemo } from 'react'
import AdBanner from '@/components/AdBanner'

type UnicodeMode = 'encode' | 'decode'

export default function UnicodeConverterPage() {
  const [input, setInput] = useState('')
  const [mode, setMode] = useState<UnicodeMode>('encode')
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  const result = useMemo(() => {
    setError('')
    if (!input) return ''

    try {
      if (mode === 'encode') {
        return input.split('').map(char => {
          const code = char.charCodeAt(0)
          if (code < 128) return char
          return '\\u' + code.toString(16).padStart(4, '0')
        }).join('')
      } else {
        return input.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => {
          return String.fromCharCode(parseInt(hex, 16))
        })
      }
    } catch (e) {
      setError('Conversion error. Check your input and try again.')
      return ''
    }
  }, [input, mode])

  const handleCopy = () => {
    if (!result) return
    navigator.clipboard.writeText(result).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-2">Unicode Converter</h1>
      <p className="text-gray-500 mb-6">Convert text to Unicode escape sequences and back.</p>
      <AdBanner className="mb-8 h-20" />

      <div className="bg-white dark:bg-gray-800 border rounded-xl p-6 mb-8">
        <div className="flex gap-2 mb-4">
          <button onClick={() => setMode('encode')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              mode === 'encode' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}>
            Text to Unicode
          </button>
          <button onClick={() => setMode('decode')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              mode === 'decode' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}>
            Unicode to Text
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              {mode === 'encode' ? 'Text Input' : 'Unicode Input'}
            </label>
            <textarea value={input} onChange={e => setInput(e.target.value)} rows={6}
              placeholder={mode === 'encode' ? 'Enter text to convert...' : 'Enter \\uXXXX sequences...'}
              className="w-full p-4 border rounded-xl resize-y text-sm dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium">
                {mode === 'encode' ? 'Unicode Output' : 'Text Output'}
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
          <li>Select the conversion direction: <strong>Text to Unicode</strong> or <strong>Unicode to Text</strong>.</li>
          <li>Enter your text or Unicode escape sequences in the input box.</li>
          <li>ASCII characters (A-Z, a-z, 0-9, basic symbols) remain unchanged in encode mode.</li>
          <li>Non-ASCII characters are converted to <code>\uXXXX</code> format.</li>
          <li>Click <strong>Copy</strong> to copy the result to your clipboard.</li>
        </ol>

        <h2>Tips</h2>
        <ul>
          <li>Unicode escape sequences use the format <code>\uXXXX</code> where XXXX is a 4-digit hexadecimal code.</li>
          <li>Use Text to Unicode mode when you need to embed special characters in JavaScript or JSON strings.</li>
          <li>Emoji characters produce surrogate pairs in <code>\uXXXX</code> notation — decode mode handles these automatically.</li>
        </ul>

        <h2>FAQ</h2>
        <div className="space-y-4 not-prose">
          <div>
            <h3 className="font-semibold">What is a Unicode escape sequence?</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">A Unicode escape sequence is a way to represent a Unicode character using a backslash followed by &apos;u&apos; and a 4-digit hexadecimal number. For example, the copyright symbol &copy; is <code>©</code>.</p>
          </div>
          <div>
            <h3 className="font-semibold">Why are ASCII characters not escaped?</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">ASCII characters (code points 0-127) are typically left as-is because they are already universally supported. Only characters outside the ASCII range are converted to escape sequences.</p>
          </div>
          <div>
            <h3 className="font-semibold">Does this work with emoji?</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Yes. Emoji characters are represented using Unicode and will be encoded/decoded correctly, though they may use two surrogate <code>\uXXXX</code> sequences in JavaScript.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
