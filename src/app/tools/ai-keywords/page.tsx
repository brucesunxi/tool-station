'use client'

import { useState } from 'react'
import AdBanner from '@/components/AdBanner'

export default function AiKeywordsPage() {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleExtract = async () => {
    if (!text.trim()) return
    setLoading(true); setError(null); setResult('')
    try {
      const res = await fetch('/api/keywords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Extraction failed')
      setResult(data.result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Extraction failed')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => { if (result) navigator.clipboard.writeText(result).catch(() => {}) }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">AI Keyword Extractor</h1>
        <p className="text-gray-500">Extract key topics, keywords, and phrases from any text. Perfect for SEO and content planning.</p>
      </div>

      <AdBanner className="mb-8 h-20" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Text to Analyze</label>
          <textarea value={text} onChange={e => setText(e.target.value)}
            placeholder="Paste article, blog post, product description, or any content to extract keywords..."
            rows={14}
            className="w-full p-4 border rounded-xl resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm dark:bg-gray-800 dark:border-gray-700"
          />
          <div className="mt-1 text-xs text-gray-400 text-right">{text.length} chars</div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">Extracted Keywords</label>
            {result && (
              <button onClick={handleCopy} className="text-xs px-2 py-1 border rounded hover:bg-gray-50 dark:hover:bg-gray-800">Copy</button>
            )}
          </div>
          <div className={`min-h-[370px] p-4 border rounded-xl text-sm whitespace-pre-wrap ${
            result ? 'border-green-200 bg-green-50/50 dark:bg-green-900/10' : 'bg-gray-50 dark:bg-gray-800/50'
          }`}>
            {result || <p className="text-gray-400">{loading ? 'Analyzing...' : 'Keywords will appear here...'}</p>}
          </div>
        </div>
      </div>

      <button onClick={handleExtract} disabled={loading || !text.trim()}
        className="w-full mt-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors">
        {loading ? '🤖 Analyzing...' : '🔑 Extract Keywords'}
      </button>

      {error && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>
      )}

      {/* SEO Content */}
      <section className="mt-12 pt-8 border-t prose dark:prose-invert max-w-none">
        <h2>How to Use the AI Keyword Extractor</h2>
        <ol>
          <li>Paste your article, blog post, product description, or any content into the text input area.</li>
          <li>Click &quot;Extract Keywords&quot; to start the AI analysis of your content.</li>
          <li>Review the extracted keywords, which include primary terms, secondary keywords, and long-tail phrases.</li>
          <li>Copy the keyword list with one click for use in your SEO strategy, content planning, or ad targeting.</li>
          <li>Refine your input text and re-extract to discover different keyword angles for the same topic.</li>
        </ol>

        <h2>Tips for SEO Keyword Extraction</h2>
        <ul>
          <li>Use longer content (300+ words) for more comprehensive and accurate keyword extraction results.</li>
          <li>Review the extracted keywords against your target audience&apos;s search intent — prioritize terms that match what users actually search for.</li>
          <li>Combine extracted keywords into topic clusters to build a more effective content strategy.</li>
        </ul>

        <h2>Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div><h3 className="font-semibold">What types of keywords does the AI extract?</h3><p>The AI extracts primary keywords (main topics), secondary keywords (supporting terms), and long-tail phrases (specific multi-word queries) from your content.</p></div>
          <div><h3 className="font-semibold">Can I use these keywords for SEO optimization?</h3><p>Yes, the extracted keywords are ideal for SEO. Use them in meta descriptions, heading tags, image alt text, and throughout your content to improve search rankings.</p></div>
          <div><h3 className="font-semibold">How accurate is the keyword extraction?</h3><p>The AI uses advanced natural language processing to identify the most relevant terms and phrases. Accuracy improves with well-written, focused content on a specific topic.</p></div>
        </div>
      </section>
    </div>
  )
}
