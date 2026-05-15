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

      {/* SEO Content */}
      <section className="mt-12 pt-8 border-t prose dark:prose-invert max-w-none">
        <h2>How to Use the AI Blog Generator</h2>
        <ol>
          <li>Enter your blog topic in the topic field — be specific for better results (e.g., &quot;Benefits of remote work for software teams&quot;).</li>
          <li>Optionally add target keywords to help the AI optimize your content for SEO.</li>
          <li>Choose the output format — Outline, Introduction Only, or Full Blog Post.</li>
          <li>Select the tone — Professional, Conversational, or Persuasive — to match your brand voice.</li>
          <li>Click &quot;Generate Blog Content&quot; and the AI will produce your content. Copy it with one click when ready.</li>
        </ol>

        <h2>Tips for Better Blog Content</h2>
        <ul>
          <li>Start with the Outline format to plan your structure, then generate a Full Blog Post once you are happy with the flow.</li>
          <li>Use the Conversational tone for lifestyle blogs and the Professional tone for industry or B2B content.</li>
          <li>Include 3-5 relevant keywords to help the AI naturally incorporate them into the generated content.</li>
        </ul>

        <h2>Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div><h3 className="font-semibold">Is the blog content original and plagiarism-free?</h3><p>Yes, the AI generates unique content from scratch based on your topic and keywords. However, you should always review and fact-check before publishing.</p></div>
          <div><h3 className="font-semibold">Can I use the generated content for commercial purposes?</h3><p>Yes, you own the content generated by this tool. You can use it for your website, blog, newsletters, or any commercial purpose.</p></div>
          <div><h3 className="font-semibold">What is the difference between Outline and Full Blog Post formats?</h3><p>Outline generates a structured plan with headings and bullet points. Full Blog Post produces complete paragraphs with an introduction, body sections, and a conclusion.</p></div>
        </div>
      </section>
    </div>
  )
}
