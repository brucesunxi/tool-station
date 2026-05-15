'use client'
import { useState } from 'react'
import AdBanner from '@/components/AdBanner'

export default function ThanksPage() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [tone, setTone] = useState('')

  async function handleSubmit() {
    if (!input.trim()) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/ai-thanks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input, tone: tone || undefined }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setOutput(data.content)
    } catch (err: any) { setError(err.message) }
    finally { setLoading(false) }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-2">AI Thank You Note Generator — Thank You Message Writer</h1>
      <p className="text-gray-500 mb-6">Free AI thank you note generator. Write heartfelt thank-you messages for any occasion. Choose from formal, warm, or casual tones.</p>
      <AdBanner className="mb-8 h-20" />
      <div className="bg-white dark:bg-gray-800 border rounded-xl p-6 mb-8">
        <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Describe the situation or reason for thanks..." className="w-full p-4 border rounded-xl text-sm min-h-[120px] dark:bg-gray-700 dark:border-gray-600 mb-4" />
        <div className="flex flex-wrap gap-4 mb-4">
          <select value={tone} onChange={e => setTone(e.target.value)} className="px-3 py-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600">
            <option value="">Any Tone</option>
            <option value="formal">Formal</option>
            <option value="warm">Warm</option>
            <option value="casual">Casual</option>
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
        <h2>How to Use</h2><ol><li>Describe the situation</li><li>Choose a tone</li><li>Click Generate</li><li>Copy the result</li></ol>
        <h2>Tips</h2><ul><li>Include specific details for a more personal touch</li><li>Match the tone to your relationship with the recipient</li></ul>
        <h2>FAQ</h2>
        <div><strong>What is an AI thank you note generator?</strong><p>It creates personalized thank-you messages for any occasion — gifts, support, interviews, or gestures of kindness.</p></div>
        <div><strong>Can I send these directly?</strong><p>Yes, the messages are ready to use in cards, emails, or texts.</p></div>
        <div><strong>Are the notes personalized?</strong><p>Yes, the AI crafts each note based on your specific situation and chosen tone.</p></div>
      </section>
    </div>
  )
}
