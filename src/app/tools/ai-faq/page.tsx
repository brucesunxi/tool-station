'use client'
import { useState } from 'react'
import AdBanner from '@/components/AdBanner'

export default function FaqPage() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [count, setCount] = useState('')

  async function handleSubmit() {
    if (!input.trim()) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/ai-faq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input, count: count ? parseInt(count) : undefined }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setOutput(data.content)
    } catch (err: any) { setError(err.message) }
    finally { setLoading(false) }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-2">AI FAQ Generator Free Online — Frequently Asked Questions</h1>
      <p className="text-gray-500 mb-6">Free AI FAQ generator. Generate comprehensive FAQ sections from any topic. Cover the most important questions with clear answers.</p>
      <AdBanner className="mb-8 h-20" />
      <div className="bg-white dark:bg-gray-800 border rounded-xl p-6 mb-8">
        <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Describe the topic or paste your content..." className="w-full p-4 border rounded-xl text-sm min-h-[120px] dark:bg-gray-700 dark:border-gray-600 mb-4" />
        <div className="flex flex-wrap gap-4 mb-4">
          <input type="number" value={count} onChange={e => setCount(e.target.value)} placeholder="Number of Q&As (optional)" min="1" max="20" className="px-3 py-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 w-48" />
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
        <h2>How to Use</h2><ol><li>Enter your topic or content</li><li>Optionally set the number of Q&As</li><li>Click Generate</li><li>Copy the FAQ section</li></ol>
        <h2>Tips</h2><ul><li>Provide detailed content for more accurate FAQs</li><li>Adjust the count for shorter or longer sections</li></ul>
        <h2>FAQ</h2>
        <div><strong>What is an AI FAQ generator?</strong><p>It creates comprehensive FAQ sections from your content, identifying the most relevant questions and providing clear answers.</p></div>
        <div><strong>Can I specify how many questions to generate?</strong><p>Yes, you can optionally set the number of Q&A pairs.</p></div>
        <div><strong>Are the answers accurate?</strong><p>The AI generates answers based on common questions related to your topic. Always review for accuracy.</p></div>
      </section>
    </div>
  )
}
