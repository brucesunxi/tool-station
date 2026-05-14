'use client'

import { useState } from 'react'
import AdBanner from '@/components/AdBanner'

export default function AiProsConsPage() {
  const [topic, setTopic] = useState('')
  const [aspect, setAspect] = useState('all')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleAnalyze = async () => {
    if (!topic.trim()) return
    setLoading(true); setError(null); setResult('')
    try {
      const res = await fetch('/api/pros-cons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, aspect }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Analysis failed')
      setResult(data.result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => { if (result) navigator.clipboard.writeText(result).catch(() => {}) }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">AI Pros & Cons</h1>
        <p className="text-gray-500">Get a balanced analysis of any decision, product, or idea. AI evaluates both sides objectively.</p>
      </div>

      <AdBanner className="mb-8 h-20" />

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">What do you want to analyze?</label>
        <textarea value={topic} onChange={e => setTopic(e.target.value)}
          placeholder="e.g. Switching to a 4-day work week, Using React vs Vue for a new project, Buying an electric car in 2026..."
          rows={4}
          className="w-full p-4 border rounded-xl resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm dark:bg-gray-800 dark:border-gray-700"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Focus</label>
        <div className="flex gap-2">
          {[
            { value: 'all', label: 'All Aspects', desc: 'Complete analysis' },
            { value: 'cost', label: 'Cost', desc: 'Financial focus' },
            { value: 'practical', label: 'Practical', desc: 'Time & effort' },
          ].map(opt => (
            <button key={opt.value} onClick={() => setAspect(opt.value)}
              className={`flex-1 p-3 rounded-lg border text-center transition-all ${
                aspect === opt.value
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-200'
                  : 'hover:border-blue-300'
              }`}>
              <p className="font-semibold text-sm">{opt.label}</p>
              <p className="text-xs text-gray-400">{opt.desc}</p>
            </button>
          ))}
        </div>
      </div>

      <button onClick={handleAnalyze} disabled={loading || !topic.trim()}
        className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors">
        {loading ? '🤖 Analyzing...' : '⚖️ Analyze'}
      </button>

      {error && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>
      )}

      {result && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-sm">Analysis</h3>
            <button onClick={handleCopy} className="text-xs px-2 py-1 border rounded hover:bg-gray-50 dark:hover:bg-gray-800">Copy</button>
          </div>
          <div className="p-4 border rounded-xl bg-green-50/50 dark:bg-green-900/10 dark:border-green-900/30 text-sm whitespace-pre-wrap leading-relaxed">
            {result}
          </div>
        </div>
      )}

      <div className="mt-12 pt-8 border-t">
        <h2 className="text-xl font-bold mb-4">Free AI Pros & Cons Analyzer</h2>
        <p className="text-sm text-gray-500">
          Make better decisions with AI-powered pros and cons analysis. Get balanced, objective evaluations
          of any decision, product, or idea with actionable recommendations.
        </p>
      </div>
    </div>
  )
}
