'use client'

import { useState } from 'react'
import AdBanner from '@/components/AdBanner'

export default function AiBlogPage() {
  const [topic, setTopic] = useState('')
  const [keywords, setKeywords] = useState('')
  const [format, setFormat] = useState('outline')
  const [tone, setTone] = useState('professional')
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!topic.trim()) return
    setLoading(true); setError(null); setContent('')
    try {
      const res = await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, keywords, format, tone }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Generation failed')
      setContent(data.content)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => { if (content) navigator.clipboard.writeText(content).catch(() => {}) }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">AI Blog Generator</h1>
        <p className="text-gray-500">Generate blog outlines, intros, or full posts with AI. Choose format, tone, and target keywords.</p>
      </div>

      <AdBanner className="mb-8 h-20" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Topic</label>
            <input type="text" value={topic} onChange={e => setTopic(e.target.value)}
              placeholder="e.g. Benefits of remote work, How to start a newsletter..."
              className="w-full p-3 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Keywords (optional)</label>
            <input type="text" value={keywords} onChange={e => setKeywords(e.target.value)}
              placeholder="e.g. productivity, work-life balance, remote tools"
              className="w-full p-3 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Format</label>
              <select value={format} onChange={e => setFormat(e.target.value)}
                className="w-full p-2.5 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="outline">Outline</option>
                <option value="intro">Introduction Only</option>
                <option value="full">Full Blog Post</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Tone</label>
              <select value={tone} onChange={e => setTone(e.target.value)}
                className="w-full p-2.5 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="professional">Professional</option>
                <option value="conversational">Conversational</option>
                <option value="persuasive">Persuasive</option>
              </select>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">Generated Content</label>
            {content && (
              <button onClick={handleCopy} className="text-xs px-2 py-1 border rounded hover:bg-gray-50 dark:hover:bg-gray-800">Copy</button>
            )}
          </div>
          <div className={`min-h-[370px] p-4 border rounded-xl text-sm whitespace-pre-wrap ${
            content ? 'border-green-200 bg-green-50/50 dark:bg-green-900/10' : 'bg-gray-50 dark:bg-gray-800/50'
          }`}>
            {content || <p className="text-gray-400">{loading ? 'Writing...' : 'Blog content will appear here...'}</p>}
          </div>
        </div>
      </div>

      <button onClick={handleGenerate} disabled={loading || !topic.trim()}
        className="w-full mt-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors">
        {loading ? '🤖 Writing...' : '📝 Generate Blog Content'}
      </button>

      {error && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>
      )}

      <div className="mt-12 pt-8 border-t">
        <h2 className="text-xl font-bold mb-4">Free AI Blog Generator</h2>
        <p className="text-sm text-gray-500">
          Generate blog outlines, introductory paragraphs, or complete blog posts with AI.
          Customize the tone and include target keywords for SEO-friendly content.
        </p>
      </div>
    </div>
  )
}
