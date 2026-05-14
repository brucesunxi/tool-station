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
      <div className="mt-12 pt-8 border-t">
        <h2 className="text-xl font-bold mb-4">Free AI Copywriter</h2>
        <p className="text-sm text-gray-500">Generate compelling marketing copy, product descriptions, and social posts with AI. Choose the format and tone that fits your brand.</p>
      </div>
    </div>
  )
}
