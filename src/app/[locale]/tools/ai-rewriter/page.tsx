'use client'

import { useState } from 'react'
import AdBanner from '@/components/AdBanner'

const styles = [
  {
    value: 'formal', label: 'Formal', desc: 'Professional & polished',
    icon: '👔', color: 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-200',
  },
  {
    value: 'concise', label: 'Concise', desc: 'Brief & to-the-point',
    icon: '✂️', color: 'border-green-500 bg-green-50 dark:bg-green-900/20 ring-2 ring-green-200',
  },
  {
    value: 'casual', label: 'Casual', desc: 'Friendly & conversational',
    icon: '😊', color: 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 ring-2 ring-orange-200',
  },
  {
    value: 'marketing', label: 'Marketing', desc: 'Persuasive & engaging',
    icon: '📢', color: 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 ring-2 ring-purple-200',
  },
]

export default function AiRewriterPage() {
  const [text, setText] = useState('')
  const [style, setStyle] = useState('formal')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ rewrittenText: string; wordCount: number } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleRewrite = async () => {
    if (!text.trim()) return
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch('/api/rewrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, style }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Rewrite failed')
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Rewrite failed')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    if (result) navigator.clipboard.writeText(result.rewrittenText).catch(() => {})
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">AI Rewriter</h1>
        <p className="text-gray-500">Change the tone and style of your writing with AI. Formal, casual, concise, or marketing.</p>
      </div>

      <AdBanner className="mb-8 h-20" />

      {/* Style selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Writing Style</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {styles.map(s => (
            <button key={s.value} onClick={() => setStyle(s.value)}
              className={`p-3 rounded-lg border text-center transition-all ${
                style === s.value ? s.color : 'hover:border-gray-300'
              }`}>
              <p className="text-lg">{s.icon}</p>
              <p className="text-sm font-semibold">{s.label}</p>
              <p className="text-xs text-gray-400">{s.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Text Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Original Text</label>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Paste or type the text you want to rewrite..."
            rows={14}
            className="w-full p-4 border rounded-xl resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm dark:bg-gray-800 dark:border-gray-700"
          />
          <div className="mt-1 text-xs text-gray-400 text-right">{text.length} chars</div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">Rewritten</label>
            {result && (
              <button onClick={handleCopy}
                className="text-xs px-2 py-1 border rounded hover:bg-gray-50 dark:hover:bg-gray-800">Copy</button>
            )}
          </div>
          <div className={`min-h-[370px] p-4 border rounded-xl text-sm whitespace-pre-wrap ${
            result ? 'border-green-200 bg-green-50/50 dark:bg-green-900/10' : 'bg-gray-50 dark:bg-gray-800/50'
          }`}>
            {result ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-0.5 rounded">
                    {result.wordCount} words
                  </span>
                </div>
                <p className="leading-relaxed">{result.rewrittenText}</p>
              </div>
            ) : (
              <p className="text-gray-400">{loading ? 'Rewriting...' : 'Rewritten text will appear here...'}</p>
            )}
          </div>
        </div>
      </div>

      {/* Rewrite Button */}
      <button onClick={handleRewrite} disabled={loading || !text.trim()}
        className="w-full mt-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors">
        {loading ? '🤖 Rewriting...' : '✍️ Rewrite with AI'}
      </button>

      {error && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>
      )}

      {/* SEO Content */}
      <section className="mt-12 pt-8 border-t prose dark:prose-invert max-w-none">
        <h2>How to Use the AI Text Rewriter</h2>
        <ol>
          <li>Paste or type the text you want to rewrite into the original text field.</li>
          <li>Select your desired writing style — Formal, Concise, Casual, or Marketing.</li>
          <li>Click &quot;Rewrite with AI&quot; and the rewritten version will appear in the output panel.</li>
          <li>Review the word count to see how the length changed compared to your original text.</li>
          <li>Copy the rewritten text with one click and use it in your emails, social posts, or marketing copy.</li>
        </ol>

        <h2>Tips for Great Rewrites</h2>
        <ul>
          <li>Start with clear, well-structured text — the better your input, the more coherent the rewrite will be.</li>
          <li>Use Formal style for business proposals, cover letters, and professional correspondence.</li>
          <li>Try Casual style for social media updates, blog comments, and internal team messages.</li>
        </ul>

        <h2>Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div><h3 className="font-semibold">Does the AI rewriter change the meaning of my text?</h3><p>No, the AI preserves the original meaning while adjusting the tone, style, and word choice. Key facts and intended message remain intact.</p></div>
          <div><h3 className="font-semibold">Which style should I choose for academic writing?</h3><p>Formal style works best for academic writing, essays, and research papers. It produces polished, professional language suitable for scholarly contexts.</p></div>
          <div><h3 className="font-semibold">Can I rewrite marketing copy with this tool?</h3><p>Absolutely. The Marketing style is designed specifically for persuasive, engaging copy — perfect for ads, product descriptions, landing pages, and promotional content.</p></div>
        </div>
      </section>
    </div>
  )
}
