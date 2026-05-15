'use client'

import { useState, useMemo } from 'react'
import AdBanner from '@/components/AdBanner'

type Delimiter = 'space' | 'comma' | 'newline' | 'none'

export default function TextRepeaterPage() {
  const [text, setText] = useState('')
  const [count, setCount] = useState(5)
  const [delimiter, setDelimiter] = useState<Delimiter>('space')
  const [copied, setCopied] = useState(false)

  const result = useMemo(() => {
    if (!text || count < 1) return ''
    const sep = delimiter === 'space' ? ' ' : delimiter === 'comma' ? ', ' : delimiter === 'newline' ? '\n' : ''
    return Array(count).fill(text).join(sep)
  }, [text, count, delimiter])

  const handleCopy = () => {
    if (!result) return
    navigator.clipboard.writeText(result).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-2">Text Repeater</h1>
      <p className="text-gray-500 mb-6">Repeat any text multiple times with custom separators.</p>
      <AdBanner className="mb-8 h-20" />

      <div className="bg-white dark:bg-gray-800 border rounded-xl p-6 mb-8">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Text to Repeat</label>
          <textarea value={text} onChange={e => setText(e.target.value)} rows={3}
            placeholder="Enter text to repeat..."
            className="w-full p-4 border rounded-xl resize-y text-sm dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Repeat Count</label>
            <input type="number" value={count} onChange={e => setCount(Math.max(1, Math.min(10000, Number(e.target.value))))} min={1} max={10000}
              className="w-full p-2.5 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Delimiter</label>
            <select value={delimiter} onChange={e => setDelimiter(e.target.value as Delimiter)}
              className="w-full p-2.5 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="space">Space</option>
              <option value="comma">Comma</option>
              <option value="newline">New Line</option>
              <option value="none">None (no separator)</option>
            </select>
          </div>
        </div>

        {result && (
          <div className="p-4 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/30 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-500">Result ({result.length.toLocaleString()} chars)</span>
              <button onClick={handleCopy} className="text-xs px-2 py-1 border rounded hover:bg-white dark:hover:bg-gray-700 transition-colors">
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <pre className="text-sm break-all whitespace-pre-wrap font-mono max-h-80 overflow-y-auto">{result}</pre>
          </div>
        )}
      </div>

      <section className="prose dark:prose-invert max-w-none">
        <h2>How to Use</h2>
        <ol>
          <li>Enter the text you want to repeat in the input field.</li>
          <li>Set the <strong>Repeat Count</strong> (1 to 10,000) to control how many times the text appears.</li>
          <li>Choose a <strong>Delimiter</strong> to separate repetitions: Space, Comma, New Line, or None.</li>
          <li>The repeated text appears instantly in the result box.</li>
          <li>Click <strong>Copy</strong> to copy the output to your clipboard.</li>
        </ol>

        <h2>Tips</h2>
        <ul>
          <li>Use the <strong>New Line</strong> delimiter to generate lists or fill template placeholders.</li>
          <li>Keep the count under 1,000 for large blocks of text to avoid browser slowdowns.</li>
          <li>The character count shown helps ensure the output fits within text limits of your target application.</li>
        </ul>

        <h2>FAQ</h2>
        <div className="space-y-4 not-prose">
          <div>
            <h3 className="font-semibold">What is the maximum repeat count?</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">The maximum repeat count is 10,000. For very large text blocks, we recommend staying under 1,000 to maintain performance.</p>
          </div>
          <div>
            <h3 className="font-semibold">Can I repeat multi-line text?</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Yes. You can enter multi-line text and it will be repeated exactly as entered, including line breaks.</p>
          </div>
          <div>
            <h3 className="font-semibold">Is this processing done on my device?</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Yes. Everything runs locally in your browser. No data is sent to any server.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
