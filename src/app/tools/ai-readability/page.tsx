'use client'

import { useState } from 'react'
import AdBanner from '@/components/AdBanner'

export default function AiReadabilityPage() {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleAnalyze = async () => {
    if (!text.trim()) return
    setLoading(true); setError(null); setResult('')
    try {
      const res = await fetch('/api/readability', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Analysis failed')
      setResult(data.result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed')
    } finally { setLoading(false) }
  }

  const handleCopy = () => { if (result) navigator.clipboard.writeText(result).catch(() => {}) }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">AI Readability Checker</h1>
        <p className="text-gray-500">Analyze text readability, get improvement suggestions, and a simplified version.</p>
      </div>
      <AdBanner className="mb-8 h-20" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Text to Analyze</label>
          <textarea value={text} onChange={e => setText(e.target.value)} rows={14}
            placeholder="Paste any text to analyze its readability..."
            className="w-full p-4 border rounded-xl resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm dark:bg-gray-800 dark:border-gray-700"
          />
          <div className="mt-1 text-xs text-gray-400 text-right">{text.length} chars</div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">Analysis</label>
            {result && <button onClick={handleCopy} className="text-xs px-2 py-1 border rounded hover:bg-gray-50 dark:hover:bg-gray-800">Copy</button>}
          </div>
          <div className={`min-h-[370px] p-4 border rounded-xl text-sm whitespace-pre-wrap leading-relaxed ${
            result ? 'border-green-200 bg-green-50/50 dark:bg-green-900/10' : 'bg-gray-50 dark:bg-gray-800/50'
          }`}>
            {result || <p className="text-gray-400">{loading ? 'Analyzing...' : 'Readability analysis will appear here...'}</p>}
          </div>
        </div>
      </div>
      <button onClick={handleAnalyze} disabled={loading || !text.trim()}
        className="w-full mt-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors">
        {loading ? '🤖 Analyzing...' : '📊 Analyze Readability'}
      </button>
      {error && <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>}
      {/* SEO Content */}
      <section className="mt-12 pt-8 border-t prose dark:prose-invert max-w-none">
        <h2>How to Use the AI Readability Checker</h2>
        <ol>
          <li>Paste or type the text you want to analyze into the left text area. This can be a blog post, article, email, documentation, or any written content.</li>
          <li>Click &ldquo;Analyze Readability&rdquo; to submit your text to the AI for evaluation.</li>
          <li>Review the readability score and detailed statistics including sentence length, word complexity, and grade-level estimates.</li>
          <li>Read the AI&rsquo;s suggestions for improving clarity &mdash; these may include shorter sentences, simpler vocabulary, or better paragraph structure.</li>
          <li>Check the simplified version provided by the AI to see how your text reads at a lower grade level.</li>
          <li>Apply the suggestions to your original text and re-analyze to track improvement in readability scores.</li>
        </ol>
        <h2>Tips for Better Results</h2>
        <ul>
          <li>For the most accurate analysis, submit complete paragraphs rather than isolated sentences &mdash; context helps the AI assess flow and coherence.</li>
          <li>If writing for a general audience, aim for a readability level around grade 6&ndash;8 (Flesch-Kincaid). Technical documentation can target a higher level.</li>
          <li>Pay attention to suggestions about passive voice and complex vocabulary &mdash; these are common culprits in hard-to-read text.</li>
          <li>Compare the original and simplified versions side by side to learn how specific changes affect readability.</li>
        </ul>
        <h2>FAQ</h2>
        <div className="space-y-4">
          <div><h3 className="font-semibold">What readability metrics does the tool provide?</h3><p>The AI provides a comprehensive analysis including estimated grade level, sentence length distribution, word complexity analysis, passive voice detection, and specific improvement suggestions.</p></div>
          <div><h3 className="font-semibold">What is a good readability score for my content?</h3><p>For general audiences, aim for a grade 6&ndash;8 reading level. Academic content can target grade 10&ndash;12, while technical documentation is acceptable at grade 10&ndash;14 depending on the audience.</p></div>
          <div><h3 className="font-semibold">Can the tool help me simplify complex text?</h3><p>Yes, along with analysis the AI generates a simplified version of your text that uses shorter sentences and simpler vocabulary while preserving the original meaning.</p></div>
          <div><h3 className="font-semibold">Does the tool work with non-English text?</h3><p>The analysis is optimized for English text. For other languages, the score estimates may be less reliable, but the general suggestions about clarity and structure can still be helpful.</p></div>
        </div>
      </section>
    </div>
  )
}
