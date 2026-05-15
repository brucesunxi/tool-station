'use client'

import { useState, useMemo } from 'react'
import AdBanner from '@/components/AdBanner'

type SortMode = 'az' | 'za' | 'length-asc' | 'length-desc' | 'shuffle' | 'reverse'

export default function LineSorterPage() {
  const [input, setInput] = useState('')
  const [mode, setMode] = useState<SortMode>('az')
  const [removeDups, setRemoveDups] = useState(false)
  const [copied, setCopied] = useState(false)

  const result = useMemo(() => {
    if (!input) return ''
    let lines = input.split('\n')

    if (removeDups) {
      lines = lines.filter((line, i) => lines.indexOf(line) === i)
    }

    switch (mode) {
      case 'az':
        return lines.sort((a, b) => a.localeCompare(b)).join('\n')
      case 'za':
        return lines.sort((a, b) => b.localeCompare(a)).join('\n')
      case 'length-asc':
        return lines.sort((a, b) => a.length - b.length).join('\n')
      case 'length-desc':
        return lines.sort((a, b) => b.length - a.length).join('\n')
      case 'shuffle': {
        const arr = [...lines]
        for (let i = arr.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [arr[i], arr[j]] = [arr[j], arr[i]]
        }
        return arr.join('\n')
      }
      case 'reverse':
        return lines.reverse().join('\n')
    }
  }, [input, mode, removeDups])

  const handleCopy = () => {
    if (!result) return
    navigator.clipboard.writeText(result).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-2">Line Sorter</h1>
      <p className="text-gray-500 mb-6">Sort text lines A-Z, Z-A, by length, or shuffle randomly.</p>
      <AdBanner className="mb-8 h-20" />

      <div className="bg-white dark:bg-gray-800 border rounded-xl p-6 mb-8">
        <div className="flex flex-wrap gap-2 mb-4">
          {([
            { value: 'az' as const, label: 'A to Z' },
            { value: 'za' as const, label: 'Z to A' },
            { value: 'length-asc' as const, label: 'Length (short first)' },
            { value: 'length-desc' as const, label: 'Length (long first)' },
            { value: 'shuffle' as const, label: 'Shuffle' },
            { value: 'reverse' as const, label: 'Reverse' },
          ]).map(opt => (
            <button key={opt.value} onClick={() => setMode(opt.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                mode === opt.value ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}>
              {opt.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Input (one item per line)</label>
            <textarea value={input} onChange={e => setInput(e.target.value)} rows={8}
              placeholder={`Banana\nApple\nCherry`}
              className="w-full p-4 border rounded-xl resize-y text-sm dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium">Output</label>
              {result && (
                <button onClick={handleCopy} className="text-xs px-2 py-1 border rounded hover:bg-gray-50 dark:hover:bg-gray-800">{copied ? 'Copied!' : 'Copy'}</button>
              )}
            </div>
            <textarea value={result} readOnly rows={8}
              className="w-full p-4 border rounded-xl resize-y text-sm bg-gray-50 dark:bg-gray-800 dark:border-gray-700 font-mono" placeholder="Sorted lines will appear here..."
            />
          </div>
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={removeDups} onChange={e => setRemoveDups(e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
          <span className="text-sm">Remove duplicate lines</span>
        </label>
      </div>

      <section className="prose dark:prose-invert max-w-none">
        <h2>How to Use</h2>
        <ol>
          <li>Type or paste your text with one item per line in the input box.</li>
          <li>Select a sort method: <strong>A to Z</strong>, <strong>Z to A</strong>, <strong>by Length</strong>, <strong>Shuffle</strong>, or <strong>Reverse</strong>.</li>
          <li>Toggle <strong>Remove duplicate lines</strong> to eliminate repeated entries.</li>
          <li>The sorted output appears instantly in the output panel.</li>
          <li>Click <strong>Copy</strong> to use the sorted list elsewhere.</li>
        </ol>

        <h2>Tips</h2>
        <ul>
          <li>Use <strong>Shuffle</strong> to randomize a list for contests, raffles, or drawing names.</li>
          <li>Sorting by <strong>Length</strong> helps quickly find the shortest or longest entries in a list.</li>
          <li>Enable <strong>Remove duplicates</strong> before shuffling to ensure fair randomization without repeats.</li>
        </ul>

        <h2>FAQ</h2>
        <div className="space-y-4 not-prose">
          <div>
            <h3 className="font-semibold">Does the line sorter handle blank lines?</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Yes. Blank lines are treated as empty strings and sorted along with the rest. Enable Remove duplicates to clean up blank lines.</p>
          </div>
          <div>
            <h3 className="font-semibold">What sorting algorithm is used for alphabetical sorting?</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">The sorter uses JavaScript&apos;s locale-aware comparison, which handles accented characters and international text correctly.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
