'use client'

import { useState } from 'react'
import AdBanner from '@/components/AdBanner'

export default function AiGrammarPage() {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleCheck = async () => {
    if (!text.trim()) return
    setLoading(true); setError(null); setResult('')
    try {
      const res = await fetch('/api/grammar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Check failed')
      setResult(data.result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Check failed')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => { if (result) navigator.clipboard.writeText(result).catch(() => {}) }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">AI Grammar Checker</h1>
        <p className="text-gray-500">Check spelling, grammar, punctuation, and style. Get corrected text with explanations.</p>
      </div>

      <AdBanner className="mb-8 h-20" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Text to Check</label>
          <textarea value={text} onChange={e => setText(e.target.value)}
            placeholder="Paste your text here for grammar checking..."
            rows={14}
            className="w-full p-4 border rounded-xl resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm dark:bg-gray-800 dark:border-gray-700"
          />
          <div className="mt-1 text-xs text-gray-400 text-right">{text.length} chars</div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">Results</label>
            {result && (
              <button onClick={handleCopy} className="text-xs px-2 py-1 border rounded hover:bg-gray-50 dark:hover:bg-gray-800">Copy</button>
            )}
          </div>
          <div className={`min-h-[370px] p-4 border rounded-xl text-sm whitespace-pre-wrap ${
            result ? 'border-green-200 bg-green-50/50 dark:bg-green-900/10' : 'bg-gray-50 dark:bg-gray-800/50'
          }`}>
            {result || <p className="text-gray-400">{loading ? 'Checking...' : 'Corrections will appear here...'}</p>}
          </div>
        </div>
      </div>

      <button onClick={handleCheck} disabled={loading || !text.trim()}
        className="w-full mt-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors">
        {loading ? '🤖 Checking...' : '✓ Check Grammar'}
      </button>

      {error && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>
      )}

      <div className="mt-12 pt-8 border-t">
        <h2 className="text-xl font-bold mb-4">Free AI Grammar Checker</h2>
        <p className="text-sm text-gray-500">
          AI-powered grammar and spell checker for English text. Get detailed corrections with explanations
          for each issue found, plus a fully corrected version of your text.
        </p>
      </div>
    </div>
  )
}
