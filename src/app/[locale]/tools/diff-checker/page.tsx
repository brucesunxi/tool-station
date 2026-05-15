'use client'

import { useState } from 'react'
import AdBanner from '@/components/AdBanner'

export default function DiffCheckerPage() {
  const [left, setLeft] = useState('')
  const [right, setRight] = useState('')
  const [diffs, setDiffs] = useState<{ type: 'added' | 'removed' | 'unchanged'; text: string }[]>([])
  const [showDiff, setShowDiff] = useState(false)

  const computeDiff = async () => {
    const { diffLines } = await import('diff')
    const result = diffLines(left, right)
    const items = result.map(part => ({
      type: part.added ? 'added' as const : part.removed ? 'removed' as const : 'unchanged' as const,
      text: part.value,
    }))
    setDiffs(items)
    setShowDiff(true)
  }

  const handleCopy = () => {
    const text = diffs.map(d => d.text).join('')
    navigator.clipboard.writeText(text).catch(() => {})
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Diff Checker</h1>
        <p className="text-gray-500">Compare two texts and see the differences highlighted. Ideal for code, documents, and configuration files.</p>
      </div>
      <AdBanner className="mb-8 h-20" />

      {!showDiff ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Original</label>
              <textarea value={left} onChange={e => setLeft(e.target.value)} rows={14}
                className="w-full p-4 border rounded-xl resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-mono dark:bg-gray-800 dark:border-gray-700" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Modified</label>
              <textarea value={right} onChange={e => setRight(e.target.value)} rows={14}
                className="w-full p-4 border rounded-xl resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-mono dark:bg-gray-800 dark:border-gray-700" />
            </div>
          </div>
          <button onClick={computeDiff} disabled={!left && !right}
            className="w-full mt-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors">
            Compare
          </button>
        </>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setShowDiff(false)} className="text-sm text-blue-600 hover:underline">← Back</button>
            <button onClick={handleCopy} className="text-sm px-3 py-1 border rounded hover:bg-gray-50 dark:hover:bg-gray-800">Copy All</button>
            <span className="text-xs text-gray-400">
              <span className="inline-block w-3 h-3 bg-green-200 dark:bg-green-800 rounded align-middle mr-1" /> Added
              <span className="inline-block w-3 h-3 bg-red-200 dark:bg-red-800 rounded align-middle mx-1" /> Removed
            </span>
          </div>
          <div className="border rounded-xl overflow-hidden text-sm font-mono">
            {diffs.map((d, i) => (
              <pre key={i} className={`px-4 py-1 whitespace-pre-wrap ${
                d.type === 'added' ? 'bg-green-100 dark:bg-green-900/30 text-green-900 dark:text-green-200' :
                d.type === 'removed' ? 'bg-red-100 dark:bg-red-900/30 text-red-900 dark:text-red-200' : ''
              }`}>{d.text}</pre>
            ))}
          </div>
        </div>
      )}

      {/* SEO Content */}
      <section className="mt-12 pt-8 border-t prose dark:prose-invert max-w-none">
        <h2>How to Use</h2>
        <ol>
          <li>Paste the original text into the left text area labeled "Original."</li>
          <li>Paste the modified or updated text into the right text area labeled "Modified."</li>
          <li>Click the "Compare" button to compute the differences between the two texts.</li>
          <li>Review the highlighted output -- green for added lines, red for removed lines, and unhighlighted for unchanged text.</li>
        </ol>
        <h2>Tips</h2>
        <ul>
          <li>Use the diff checker to compare code changes before committing to catch unintended modifications.</li>
          <li>Compare configuration files when troubleshooting to quickly spot what changed between working and broken setups.</li>
          <li>Click "Copy All" to copy the complete diff output for pasting into pull request descriptions or code review comments.</li>
        </ul>
        <h2>FAQ</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">What types of differences does the tool detect?</h3>
            <p>It detects line-level differences -- lines that were added (highlighted green), removed (highlighted red), or unchanged between the two texts.</p>
          </div>
          <div>
            <h3 className="font-semibold">What algorithm is used for text comparison?</h3>
            <p>The tool uses the popular diff library, which implements a line-level diff algorithm similar to the Unix diff command.</p>
          </div>
          <div>
            <h3 className="font-semibold">Is there a limit on text size?</h3>
            <p>The tool works with standard text sizes. For extremely large files, consider splitting the content into smaller sections for comparison.</p>
          </div>
          <div>
            <h3 className="font-semibold">Is my text uploaded to any server?</h3>
            <p>No. All diff computation happens entirely within your browser using client-side JavaScript. Your text never leaves your computer.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
