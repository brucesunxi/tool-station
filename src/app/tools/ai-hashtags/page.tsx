'use client'

import { useState } from 'react'
import AdBanner from '@/components/AdBanner'

const platforms = [
  { value: 'all', label: 'All Platforms' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'twitter', label: 'Twitter / X' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'linkedin', label: 'LinkedIn' },
]

export default function AiHashtagsPage() {
  const [text, setText] = useState('')
  const [platform, setPlatform] = useState('all')
  const [count, setCount] = useState(10)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!text.trim()) return
    setLoading(true); setError(null); setResult('')
    try {
      const res = await fetch('/api/hashtags', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, platform, count }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Generation failed')
      setResult(data.result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed')
    } finally { setLoading(false) }
  }

  const handleCopy = () => { if (result) navigator.clipboard.writeText(result).catch(() => {}) }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">AI Hashtag Generator</h1>
        <p className="text-gray-500">Generate relevant, high-performing hashtags for Instagram, X, TikTok, and LinkedIn.</p>
      </div>
      <AdBanner className="mb-8 h-20" />
      <textarea value={text} onChange={e => setText(e.target.value)} rows={5}
        placeholder="Describe your post, topic, or content..."
        className="w-full p-4 border rounded-xl resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm dark:bg-gray-800 dark:border-gray-700 mb-4"
      />
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-2">Platform</label>
          <select value={platform} onChange={e => setPlatform(e.target.value)}
            className="w-full p-2.5 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            {platforms.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Count: {count}</label>
          <input type="range" min="5" max="20" value={count} onChange={e => setCount(Number(e.target.value))} className="w-full accent-blue-600" />
        </div>
      </div>
      <button onClick={handleGenerate} disabled={loading || !text.trim()}
        className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors">
        {loading ? '🤖 Generating...' : '# Generate Hashtags'}
      </button>
      {error && <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>}
      {result && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-sm">Hashtags</h3>
            <button onClick={handleCopy} className="text-xs px-2 py-1 border rounded hover:bg-gray-50 dark:hover:bg-gray-800">Copy</button>
          </div>
          <div className="p-4 border rounded-xl bg-green-50/50 dark:bg-green-900/10 dark:border-green-900/30 text-sm whitespace-pre-wrap leading-relaxed">{result}</div>
        </div>
      )}
      {/* SEO Content */}
      <section className="mt-12 pt-8 border-t prose dark:prose-invert max-w-none">
        <h2>How to Use the AI Hashtag Generator</h2>
        <ol>
          <li>Describe your post, topic, or content in the text area — the more detail you provide, the more relevant the hashtags.</li>
          <li>Select your target platform — Instagram, Twitter/X, TikTok, or LinkedIn — for platform-specific hashtag suggestions.</li>
          <li>Adjust the number of hashtags using the slider (5 to 20 hashtags).</li>
          <li>Click &quot;Generate Hashtags&quot; and the AI will produce a curated list of relevant hashtags.</li>
          <li>Copy the generated hashtags and paste them directly into your social media post.</li>
        </ol>

        <h2>Tips for Better Hashtag Strategy</h2>
        <ul>
          <li>Use a mix of broad and niche hashtags — broad ones for reach, niche ones for targeted engagement.</li>
          <li>Select a specific platform to get hashtags optimized for that platform&apos;s algorithm and audience behavior.</li>
          <li>Aim for 10-15 hashtags per post on Instagram and 3-5 on LinkedIn for optimal engagement.</li>
        </ul>

        <h2>Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div><h3 className="font-semibold">Are the hashtags specific to each social media platform?</h3><p>Yes, when you select a platform, the AI generates hashtags that are relevant and popular on that specific platform. Different platforms have different hashtag cultures and best practices.</p></div>
          <div><h3 className="font-semibold">How many hashtags should I use for each platform?</h3><p>For Instagram, 10-15 hashtags work well. For TikTok, 3-5 focused hashtags are effective. For LinkedIn, 3-5 professional hashtags. For Twitter/X, 1-3 hashtags is the sweet spot.</p></div>
          <div><h3 className="font-semibold">Does the tool categorize hashtags by popularity?</h3><p>Yes, the generated hashtags are typically categorized to show which are trending or high-volume versus niche or community-specific tags.</p></div>
        </div>
      </section>
    </div>
  )
}
