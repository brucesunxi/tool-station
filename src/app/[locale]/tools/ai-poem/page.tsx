'use client'
import { useState } from 'react'
import AdBanner from '@/components/AdBanner'

export default function PoemPage() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [style, setStyle] = useState('')

  async function handleSubmit() {
    if (!input.trim()) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/ai-poem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input, style: style || undefined }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setOutput(data.content)
    } catch (err: any) { setError(err.message) }
    finally { setLoading(false) }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-2">AI Poem Generator Free Online — Poetry Writer</h1>
      <p className="text-gray-500 mb-6">Free AI poem generator. Write beautiful poems on any topic. Choose from sonnet, haiku, free verse, limerick, and acrostic styles.</p>
      <AdBanner className="mb-8 h-20" />
      <div className="bg-white dark:bg-gray-800 border rounded-xl p-6 mb-8">
        <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Enter a topic or theme for your poem..." className="w-full p-4 border rounded-xl text-sm min-h-[120px] dark:bg-gray-700 dark:border-gray-600 mb-4" />
        <div className="flex flex-wrap gap-4 mb-4">
          <select value={style} onChange={e => setStyle(e.target.value)} className="px-3 py-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600">
            <option value="">Any Style</option>
            <option value="sonnet">Sonnet</option>
            <option value="haiku">Haiku</option>
            <option value="free verse">Free Verse</option>
            <option value="limerick">Limerick</option>
            <option value="acrostic">Acrostic</option>
          </select>
        </div>
        <button onClick={handleSubmit} disabled={loading || !input.trim()} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50">Generate</button>
        {loading && <p className="text-sm text-gray-400 mt-2">Generating...</p>}
        {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
        {output && (
          <div className="mt-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl whitespace-pre-wrap text-sm font-serif italic">{output}</div>
            <button onClick={() => navigator.clipboard.writeText(output)} className="mt-2 text-xs text-blue-600">Copy to clipboard</button>
          </div>
        )}
      </div>
      <section className="prose dark:prose-invert max-w-none">
        <h2>How to Use</h2><ol><li>Enter a topic or theme</li><li>Choose a poem style</li><li>Click Generate</li><li>Copy the result</li></ol>
        <h2>Tips</h2><ul><li>Be descriptive in your topic for richer poems</li><li>Try different styles to see various formats</li></ul>
        <h2>FAQ</h2>
        <div><strong>What is an AI poem generator?</strong><p>An AI poem generator creates poetry using artificial intelligence based on your chosen topic and style preferences.</p></div>
        <div><strong>Are the poems original?</strong><p>Yes, each poem is generated uniquely by AI based on your input.</p></div>
        <div><strong>Can I share these poems?</strong><p>Absolutely! You can use them for personal projects, gifts, or social media.</p></div>
      </section>
    </div>
  )
}
