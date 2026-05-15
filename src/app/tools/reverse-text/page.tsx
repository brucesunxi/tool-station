'use client'

import { useState, useMemo } from 'react'
import AdBanner from '@/components/AdBanner'

type ReverseMode = 'string' | 'words' | 'each-word'

export default function ReverseTextPage() {
  const [input, setInput] = useState('')
  const [mode, setMode] = useState<ReverseMode>('string')
  const [copied, setCopied] = useState(false)

  const result = useMemo(() => {
    if (!input) return ''
    switch (mode) {
      case 'string':
        return input.split('').reverse().join('')
      case 'words':
        return input.split(/\s+/).reverse().join(' ')
      case 'each-word':
        return input.split(/\s+/).map(w => w.split('').reverse().join('')).join(' ')
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
      <h1 className="text-3xl font-bold mb-2">Reverse Text</h1>
      <p className="text-gray-500 mb-6">Reverse entire strings, words, or letters instantly.</p>
      <AdBanner className="mb-8 h-20" />

      <div className="bg-white dark:bg-gray-800 border rounded-xl p-6 mb-8">
        <div className="flex flex-wrap gap-2 mb-4">
          {([
            { value: 'string' as const, label: 'Reverse String' },
            { value: 'words' as const, label: 'Reverse Words' },
            { value: 'each-word' as const, label: 'Reverse Each Word' },
          ]).map(opt => (
            <button key={opt.value} onClick={() => setMode(opt.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                mode === opt.value ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}>
              {opt.label}
            </button>
          ))}
        </div>

        <textarea value={input} onChange={e => setInput(e.target.value)} rows={6}
          placeholder="Type or paste text to reverse..."
          className="w-full p-4 border rounded-xl resize-y text-sm dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        />

        {result && (
          <div className="p-4 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/30 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-500">Result</span>
              <button onClick={handleCopy} className="text-xs px-2 py-1 border rounded hover:bg-white dark:hover:bg-gray-700 transition-colors">
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <p className="text-sm break-all font-mono">{result}</p>
          </div>
        )}
      </div>

      <section className="prose dark:prose-invert max-w-none">
        <h2>How to Use</h2>
        <ol>
          <li>Type or paste your text into the input box.</li>
          <li>Choose a reverse mode: <strong>Reverse String</strong> flips all characters, <strong>Reverse Words</strong> reverses word order, <strong>Reverse Each Word</strong> reverses letters within each word.</li>
          <li>The result updates instantly as you type or change modes.</li>
          <li>Click the <strong>Copy</strong> button to copy the reversed text to your clipboard.</li>
          <li>Use the reversed text anywhere — social media, puzzles, or creative projects.</li>
        </ol>

        <h2>Tips</h2>
        <ul>
          <li>Use <strong>Reverse String</strong> to quickly check if a phrase is a palindrome.</li>
          <li><strong>Reverse Words</strong> is great for rewording sentences or creating word puzzles.</li>
          <li>Combine reversed text with other tools like the Case Converter for more creative effects.</li>
        </ul>

        <h2>FAQ</h2>
        <div className="space-y-4 not-prose">
          <div>
            <h3 className="font-semibold">What is the difference between Reverse Words and Reverse Each Word?</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Reverse Words changes the order of words (e.g., &quot;hello world&quot; becomes &quot;world hello&quot;). Reverse Each Word keeps word order but flips the letters in each word (e.g., &quot;hello world&quot; becomes &quot;olleh dlrow&quot;).</p>
          </div>
          <div>
            <h3 className="font-semibold">Does this tool work with special characters and numbers?</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Yes. All characters including punctuation, numbers, symbols, and emoji are reversed correctly.</p>
          </div>
          <div>
            <h3 className="font-semibold">Is my text sent to a server?</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">No. All processing happens in your browser. Your text never leaves your device.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
