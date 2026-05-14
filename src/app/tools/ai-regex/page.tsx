'use client'

import { useState } from 'react'
import Link from 'next/link'
import AdBanner from '@/components/AdBanner'

export default function AiRegexPage() {
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!description.trim()) return
    setLoading(true); setError(null); setResult('')
    try {
      const res = await fetch('/api/regex-gen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Generation failed')
      setResult(data.result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => { if (result) navigator.clipboard.writeText(result).catch(() => {}) }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">AI Regex Generator</h1>
        <p className="text-gray-500">Describe what you need to match, and AI will write the regex for you.</p>
      </div>

      <AdBanner className="mb-8 h-20" />

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Describe what you need to match</label>
        <textarea value={description} onChange={e => setDescription(e.target.value)}
          placeholder="e.g. Match email addresses, Extract all URLs from text, Validate phone numbers in US format..."
          rows={4}
          className="w-full p-4 border rounded-xl resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm dark:bg-gray-800 dark:border-gray-700"
        />
      </div>

      <button onClick={handleGenerate} disabled={loading || !description.trim()}
        className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors">
        {loading ? '🤖 Generating...' : '🔍 Generate Regex'}
      </button>

      {error && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>
      )}

      {result && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-sm">Result</h3>
            <button onClick={handleCopy} className="text-xs px-2 py-1 border rounded hover:bg-gray-50 dark:hover:bg-gray-800">Copy</button>
          </div>
          <div className="p-4 border rounded-xl bg-green-50/50 dark:bg-green-900/10 dark:border-green-900/30 text-sm whitespace-pre-wrap leading-relaxed">
            {result}
          </div>
          <p className="mt-3 text-xs text-gray-400">
            Test your regex with our{' '}
            <Link href="/tools/regex-tester" className="text-blue-600 dark:text-blue-400 hover:underline">Regex Tester</Link>.
          </p>
        </div>
      )}

      <div className="mt-12 pt-8 border-t">
        <h2 className="text-xl font-bold mb-4">Free AI Regex Generator</h2>
        <p className="text-sm text-gray-500">
          Describe your pattern matching needs in plain English and get the perfect regex.
          Includes explanation, examples, and flags. Supports all major regex flavors.
        </p>
      </div>
    </div>
  )
}
