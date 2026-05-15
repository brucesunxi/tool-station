'use client'

import { useState, useMemo } from 'react'
import AdBanner from '@/components/AdBanner'

type StrikeStyle = 'unicode' | 'double' | 'slash'

const COMBINING_LONG_STROKE = '̶'
const COMBINING_SHORT_STROKE = '̵'
const COMBINING_DOUBLE_STROKE = '̷'
const COMBINING_SLASH = '̸'

export default function StrikethroughTextPage() {
  const [input, setInput] = useState('')
  const [style, setStyle] = useState<StrikeStyle>('unicode')
  const [copied, setCopied] = useState(false)

  const result = useMemo(() => {
    if (!input) return ''

    const char = style === 'unicode' ? COMBINING_LONG_STROKE
      : style === 'double' ? COMBINING_DOUBLE_STROKE
      : COMBINING_SLASH

    return input.split('').map(c => c === ' ' ? ' ' : c + char).join('')
  }, [input, style])

  const handleCopy = () => {
    if (!result) return
    navigator.clipboard.writeText(result).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-2">Strikethrough Text Generator</h1>
      <p className="text-gray-500 mb-6">Create cross-out text effects using Unicode combining characters.</p>
      <AdBanner className="mb-8 h-20" />

      <div className="bg-white dark:bg-gray-800 border rounded-xl p-6 mb-8">
        <div className="flex flex-wrap gap-2 mb-4">
          {([
            { value: 'unicode' as const, label: 'Strikethrough' },
            { value: 'double' as const, label: 'Double Strike' },
            { value: 'slash' as const, label: 'Slash' },
          ]).map(opt => (
            <button key={opt.value} onClick={() => setStyle(opt.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                style === opt.value ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}>
              {opt.label}
            </button>
          ))}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Enter Text</label>
          <textarea value={input} onChange={e => setInput(e.target.value)} rows={4}
            placeholder="Type something to strikethrough..."
            className="w-full p-4 border rounded-xl resize-y text-sm dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {result && (
          <div className="p-4 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/30 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-500">Result</span>
              <button onClick={handleCopy} className="text-xs px-2 py-1 border rounded hover:bg-white dark:hover:bg-gray-700 transition-colors">
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <p className="text-lg break-all">{result}</p>
          </div>
        )}
      </div>

      <section className="prose dark:prose-invert max-w-none">
        <h2>How to Use</h2>
        <ol>
          <li>Type or paste your text into the input box.</li>
          <li>Choose a strike style: <strong>Strikethrough</strong> (long stroke), <strong>Double Strike</strong> (two strokes), or <strong>Slash</strong> (forward slash).</li>
          <li>The strikethrough text generates instantly as you type.</li>
          <li>Click <strong>Copy</strong> to copy the styled text to your clipboard.</li>
          <li>Paste the result in social media bios, messages, forum posts, or anywhere that supports Unicode.</li>
        </ol>

        <h2>Tips</h2>
        <ul>
          <li><strong>Strikethrough</strong> style uses a long combining stroke for the most common cross-out effect.</li>
          <li><strong>Double Strike</strong> creates a bold crossed-out look — great for emphasis.</li>
          <li><strong>Slash</strong> uses forward-slash-like strokes for a different visual effect.</li>
        </ul>

        <h2>FAQ</h2>
        <div className="space-y-4 not-prose">
          <div>
            <h3 className="font-semibold">How does strikethrough text work?</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Strikethrough text is created using Unicode combining characters — special characters that are placed after a letter to draw a line through it. Each letter has the combining character appended after it, creating the cross-out effect.</p>
          </div>
          <div>
            <h3 className="font-semibold">Will strikethrough text work on all platforms?</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Most modern platforms (social media, messaging apps, forums) support Unicode combining characters and will display the strikethrough correctly. Some platforms with limited font support may not render it properly.</p>
          </div>
          <div>
            <h3 className="font-semibold">Why do spaces not have strikethrough?</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Spaces are left unchanged because applying a combining character to a space would create a visible artifact and make the text harder to read. The strikethrough effect on letters is sufficient to convey the crossed-out meaning.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
