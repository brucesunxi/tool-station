'use client'

import { useState } from 'react'
import AdBanner from '@/components/AdBanner'

const styles = [
  { value: 'professional', label: 'Professional', desc: 'Authoritative', icon: '👔' },
  { value: 'clickbait', label: 'Click-Worthy', desc: 'Attention-grabbing', icon: '🎯' },
  { value: 'howto', label: 'How-to', desc: 'Actionable', icon: '📋' },
  { value: 'question', label: 'Question', desc: 'Curiosity-driven', icon: '❓' },
  { value: 'creative', label: 'Creative', desc: 'Social media style', icon: '✨' },
]

export default function AiTitlePage() {
  const [topic, setTopic] = useState('')
  const [style, setStyle] = useState('professional')
  const [count, setCount] = useState(5)
  const [loading, setLoading] = useState(false)
  const [titles, setTitles] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!topic.trim()) return
    setLoading(true); setError(null); setTitles([])
    try {
      const res = await fetch('/api/title', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, style, count }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Generation failed')
      setTitles(data.titles || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">AI Title Generator</h1>
        <p className="text-gray-500">Generate catchy titles for blog posts, videos, ads, and more. Multiple styles and lengths.</p>
      </div>

      <AdBanner className="mb-8 h-20" />

      {/* Topic */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Topic / Subject</label>
        <input type="text" value={topic} onChange={e => setTopic(e.target.value)}
          placeholder="e.g. How to start a podcast, Best running shoes 2026, Easy vegan recipes..."
          className="w-full p-3 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Style */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Style</label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {styles.map(s => (
            <button key={s.value} onClick={() => setStyle(s.value)}
              className={`p-3 rounded-lg border text-center transition-all ${
                style === s.value
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-200'
                  : 'hover:border-blue-300'
              }`}>
              <p className="text-lg">{s.icon}</p>
              <p className="text-sm font-medium">{s.label}</p>
              <p className="text-xs text-gray-400">{s.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Count */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Number of titles: {count}</label>
        <input type="range" min="3" max="10" value={count} onChange={e => setCount(Number(e.target.value))}
          className="w-full accent-blue-600" />
      </div>

      {/* Generate */}
      <button onClick={handleGenerate} disabled={loading || !topic.trim()}
        className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors">
        {loading ? '🤖 Generating...' : '🚀 Generate Titles'}
      </button>

      {error && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>
      )}

      {/* Results */}
      {titles.length > 0 && (
        <div className="mt-6 p-4 border rounded-xl bg-green-50/50 dark:bg-green-900/10 dark:border-green-900/30">
          <h3 className="font-semibold text-sm mb-3">Generated Titles</h3>
          <ul className="space-y-2">
            {titles.map((title, i) => (
              <li key={i} className="flex items-start gap-3 p-2 rounded-lg hover:bg-white dark:hover:bg-gray-800 transition-colors">
                <span className="text-xs font-mono text-gray-400 mt-0.5 shrink-0">#{i + 1}</span>
                <p className="text-sm flex-1">{title}</p>
                <button onClick={() => navigator.clipboard.writeText(title).catch(() => {})}
                  className="text-xs text-blue-600 hover:underline shrink-0">Copy</button>
              </li>
            ))}
          </ul>
          <button onClick={() => navigator.clipboard.writeText(titles.join('\n')).catch(() => {})}
            className="mt-3 text-xs text-gray-400 hover:text-gray-600 transition-colors">Copy all</button>
        </div>
      )}

      <div className="mt-12 pt-8 border-t">
        <h2 className="text-xl font-bold mb-4">Free AI Title Generator</h2>
        <p className="text-sm text-gray-500">
          Generate attention-grabbing titles for blog posts, YouTube videos, social media, ads, and more.
          Choose from 5 styles and generate 3-10 titles at a time.
        </p>
      </div>
    </div>
  )
}
