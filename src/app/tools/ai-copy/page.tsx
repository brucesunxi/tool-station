'use client'

import { useState } from 'react'
import AdBanner from '@/components/AdBanner'

export default function AiCopyPage() {
  const [product, setProduct] = useState('')
  const [type, setType] = useState('ad')
  const [tone, setTone] = useState('professional')
  const [audience, setAudience] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!product.trim()) return
    setLoading(true); setError(null); setResult('')
    try {
      const res = await fetch('/api/copy', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product, type, tone, audience }),
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
        <h1 className="text-3xl font-bold mb-2">AI Copywriter</h1>
        <p className="text-gray-500">Generate ad copy, product descriptions, and social media posts with AI.</p>
      </div>
      <AdBanner className="mb-8 h-20" />
      <textarea value={product} onChange={e => setProduct(e.target.value)} rows={4}
        placeholder="Describe your product or service. Include key features, benefits, and unique selling points..."
        className="w-full p-4 border rounded-xl resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm dark:bg-gray-800 dark:border-gray-700 mb-3"
      />
      <input type="text" value={audience} onChange={e => setAudience(e.target.value)}
        placeholder="Target audience (optional) e.g. small business owners, tech professionals, parents"
        className="w-full p-3 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
      />
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-2">Type</label>
          <select value={type} onChange={e => setType(e.target.value)}
            className="w-full p-2.5 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="ad">Ad Copy</option>
            <option value="description">Product Description</option>
            <option value="social">Social Media Post</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Tone</label>
          <select value={tone} onChange={e => setTone(e.target.value)}
            className="w-full p-2.5 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="professional">Professional</option>
            <option value="persuasive">Persuasive</option>
            <option value="friendly">Friendly</option>
            <option value="luxury">Luxury</option>
          </select>
        </div>
      </div>
      <button onClick={handleGenerate} disabled={loading || !product.trim()}
        className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors">
        {loading ? '🤖 Writing...' : '✍️ Generate Copy'}
      </button>
      {error && <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>}
      {result && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-sm">Copy</h3>
            <button onClick={handleCopy} className="text-xs px-2 py-1 border rounded hover:bg-gray-50 dark:hover:bg-gray-800">Copy</button>
          </div>
          <div className="p-4 border rounded-xl bg-green-50/50 dark:bg-green-900/10 dark:border-green-900/30 text-sm whitespace-pre-wrap leading-relaxed">{result}</div>
        </div>
      )}
      {/* SEO Content */}
      <section className="mt-12 pt-8 border-t prose dark:prose-invert max-w-none">
        <h2>How to Use the AI Copywriter</h2>
        <ol>
          <li>Describe your product or service in detail &mdash; include key features, benefits, and unique selling points that set it apart from competitors.</li>
          <li>Optionally enter your target audience (e.g., &ldquo;small business owners,&rdquo; &ldquo;tech professionals,&rdquo; &ldquo;new parents&rdquo;) to tailor the copy to their interests.</li>
          <li>Choose the copy type: Ad Copy, Product Description, or Social Media Post &mdash; each follows a different structure and length.</li>
          <li>Select a tone that matches your brand voice: Professional, Persuasive, Friendly, or Luxury.</li>
          <li>Click &ldquo;Generate Copy&rdquo; and review the AI-written marketing text in the result panel.</li>
          <li>Use the Copy button to move the generated copy to your clipboard and paste it into your ad platform, website, or social media scheduler.</li>
        </ol>
        <h2>Tips for Better Results</h2>
        <ul>
          <li>Include specific data points, pricing, or testimonials in your product description so the AI can incorporate concrete selling points.</li>
          <li>For social media posts, mention the platform (Instagram, LinkedIn, Twitter, Facebook) so the AI adjusts length and format accordingly.</li>
          <li>Generate multiple variations with different tones to A/B test which messaging resonates best with your audience.</li>
          <li>Edit the generated copy to add your brand&rsquo;s unique voice and adjust any claims for accuracy before publishing.</li>
        </ul>
        <h2>FAQ</h2>
        <div className="space-y-4">
          <div><h3 className="font-semibold">What types of copy can I generate?</h3><p>You can generate ad copy, product descriptions, and social media posts. Each type follows best practices for its format &mdash; ads are concise and action-oriented, descriptions are detailed, and social posts are engaging and platform-appropriate.</p></div>
          <div><h3 className="font-semibold">Can I choose the tone of the generated copy?</h3><p>Yes, the tool offers four tones: Professional (formal and credible), Persuasive (benefit-driven with calls to action), Friendly (approachable and conversational), and Luxury (sophisticated and premium).</p></div>
          <div><h3 className="font-semibold">How long should my product description be?</h3><p>Aim for 2&ndash;4 sentences covering what the product is, its key benefit, and what makes it unique. You can provide more detail for longer-form content like landing pages.</p></div>
          <div><h3 className="font-semibold">Is the generated copy original?</h3><p>Yes, the AI generates original text based on your inputs. However, you should always review for brand alignment, factual accuracy, and compliance with advertising guidelines before publishing.</p></div>
        </div>
      </section>
    </div>
  )
}
