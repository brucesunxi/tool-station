'use client'

import { useState } from 'react'
import AdBanner from '@/components/AdBanner'

interface SummaryResult {
  summary: string
  wordCount: number
  originalLength: number
  length: string
  style: string
}

export default function AiSummaryPage() {
  const [text, setText] = useState('')
  const [length, setLength] = useState('medium')
  const [style, setStyle] = useState('paragraph')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<SummaryResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSummarize = async () => {
    if (!text.trim()) return
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, length, style }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Summarization failed')
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    if (!result) return
    try {
      await navigator.clipboard.writeText(result.summary)
    } catch { /* ignore */ }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">AI Text Summarizer</h1>
        <p className="text-gray-500">
          Summarize long articles, documents, and text with AI. Get the key points in seconds.
        </p>
      </div>

      <AdBanner className="mb-8 h-20" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input */}
        <div>
          <label className="block text-sm font-medium mb-2">Text to Summarize</label>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Paste the article, document, or text you want to summarize..."
            rows={16}
            className="w-full p-4 border rounded-xl resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm dark:bg-gray-800 dark:border-gray-700"
          />
          <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
            <span>{text.length} characters</span>
            {text.length > 0 && (
              <span>~{Math.max(1, Math.round(text.trim().split(/\s+/).length))} words</span>
            )}
          </div>
        </div>

        {/* Output */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">Summary</label>
            {result && (
              <button onClick={handleCopy}
                className="text-xs px-2 py-1 border rounded hover:bg-gray-50 dark:hover:bg-gray-800">Copy</button>
            )}
          </div>
          <div className={`min-h-[400px] p-4 border rounded-xl text-sm ${
            result ? 'border-green-200 bg-green-50/50 dark:bg-green-900/10' : 'bg-gray-50 dark:bg-gray-800/50'
          }`}>
            {result ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-0.5 rounded">
                    {result.wordCount} words
                  </span>
                  <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                    {Math.round((1 - result.summary.length / result.originalLength) * 100)}% reduction
                  </span>
                </div>
                <p className="leading-relaxed whitespace-pre-wrap">{result.summary}</p>
              </div>
            ) : (
              <p className="text-gray-400">AI summary will appear here...</p>
            )}
          </div>
        </div>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <div>
          <label className="block text-sm font-medium mb-2">Summary Length</label>
          <div className="flex gap-2">
            {[
              { value: 'short', label: 'Short', desc: '2-3 sentences' },
              { value: 'medium', label: 'Medium', desc: 'Paragraph' },
              { value: 'long', label: 'Long', desc: 'Detailed' },
            ].map(opt => (
              <button key={opt.value} onClick={() => setLength(opt.value)}
                className={`flex-1 p-3 rounded-lg border text-center transition-all ${
                  length === opt.value
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-200'
                    : 'hover:border-blue-300'
                }`}>
                <p className="font-semibold text-sm">{opt.label}</p>
                <p className="text-xs text-gray-400">{opt.desc}</p>
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Output Style</label>
          <div className="flex gap-2">
            {[
              { value: 'paragraph', label: 'Paragraph', desc: 'Flowing text' },
              { value: 'bullet', label: 'Bullet Points', desc: 'Key points list' },
              { value: 'one-sentence', label: 'One Sentence', desc: 'Ultra short' },
            ].map(opt => (
              <button key={opt.value} onClick={() => setStyle(opt.value)}
                className={`flex-1 p-3 rounded-lg border text-center transition-all ${
                  style === opt.value
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-200'
                    : 'hover:border-blue-300'
                }`}>
                <p className="font-semibold text-sm">{opt.label}</p>
                <p className="text-xs text-gray-400">{opt.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Submit */}
      <button onClick={handleSummarize} disabled={loading || !text.trim()}
        className="w-full mt-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors">
        {loading ? '🤖 AI is thinking...' : '🤖 Summarize with AI'}
      </button>

      {error && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>
      )}

      {/* SEO */}
      <div className="mt-12 pt-8 border-t">
        <h2 className="text-xl font-bold mb-4">Free AI Text Summarizer</h2>
        <div className="text-sm text-gray-500 space-y-3">
          <p>
            Use AI to instantly summarize long articles, research papers, and documents.
            Powered by DeepSeek AI, our text summarizer extracts the key points so you can read less and understand more.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Summarize articles, essays, reports, and more</li>
            <li>Choose from short, medium, or detailed summaries</li>
            <li>Select paragraph format or bullet points</li>
            <li>Get a one-sentence TL;DR for quick overviews</li>
          </ul>
          <p className="text-xs text-gray-400 mt-4">
            Note: Requires ANTHROPIC_API_KEY environment variable to be set. Your text is sent securely to the AI API for processing.
          </p>
        </div>
      </div>
    </div>
  )
}
