'use client'
import { useState } from 'react'
import AdBanner from '@/components/AdBanner'

export default function SocialPage() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [platform, setPlatform] = useState('')

  async function handleSubmit() {
    if (!input.trim()) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/ai-social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input, platform: platform || undefined }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setOutput(data.content)
    } catch (err: any) { setError(err.message) }
    finally { setLoading(false) }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-2">AI Social Media Post Generator — Content Creator</h1>
      <p className="text-gray-500 mb-6">Free AI social media post generator. Create engaging content for Twitter, LinkedIn, Instagram, Facebook, and TikTok. Includes hashtags.</p>
      <AdBanner className="mb-8 h-20" />
      <div className="bg-white dark:bg-gray-800 border rounded-xl p-6 mb-8">
        <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="What do you want to post about?" className="w-full p-4 border rounded-xl text-sm min-h-[120px] dark:bg-gray-700 dark:border-gray-600 mb-4" />
        <div className="flex flex-wrap gap-4 mb-4">
          <select value={platform} onChange={e => setPlatform(e.target.value)} className="px-3 py-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600">
            <option value="">Any Platform</option>
            <option value="twitter">Twitter / X</option>
            <option value="linkedin">LinkedIn</option>
            <option value="instagram">Instagram</option>
            <option value="facebook">Facebook</option>
            <option value="tiktok">TikTok</option>
          </select>
        </div>
        <button onClick={handleSubmit} disabled={loading || !input.trim()} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50">Generate</button>
        {loading && <p className="text-sm text-gray-400 mt-2">Generating...</p>}
        {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
        {output && (
          <div className="mt-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl whitespace-pre-wrap text-sm">{output}</div>
            <button onClick={() => navigator.clipboard.writeText(output)} className="mt-2 text-xs text-blue-600">Copy to clipboard</button>
          </div>
        )}
      </div>
      <section className="prose dark:prose-invert max-w-none">
        <h2>How to Use</h2><ol><li>Enter your content topic</li><li>Choose a platform</li><li>Click Generate</li><li>Copy the post</li></ol>
        <h2>Tips</h2><ul><li>Tailor your message to the platform format</li><li>Include relevant keywords for better engagement</li></ul>
        <h2>FAQ</h2>
        <div><strong>What is an AI social media post generator?</strong><p>It creates platform-optimized social media content with engaging copy and relevant hashtags using AI.</p></div>
        <div><strong>Are hashtags included?</strong><p>Yes, relevant hashtags are automatically generated based on your content and selected platform.</p></div>
        <div><strong>Can I customize the output?</strong><p>Yes, you can edit any generated post to match your brand voice before publishing.</p></div>
      </section>
    </div>
  )
}
