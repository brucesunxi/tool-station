'use client'
import { useState } from 'react'
import AdBanner from '@/components/AdBanner'

export default function BirthdayWishPage() {
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
      const res = await fetch('/api/ai-birthday-wish', {
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
      <h1 className="text-3xl font-bold mb-2">AI Birthday Wish Generator — Birthday Greeting Writer</h1>
      <p className="text-gray-500 mb-6">Free AI birthday wish generator. Create personalized birthday greetings for friends, family, colleagues, and partners. Multiple options.</p>
      <AdBanner className="mb-8 h-20" />
      <div className="bg-white dark:bg-gray-800 border rounded-xl p-6 mb-8">
        <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Describe the recipient and your relationship (e.g., 'my best friend Sarah, known her for 10 years')..." className="w-full p-4 border rounded-xl text-sm min-h-[120px] dark:bg-gray-700 dark:border-gray-600 mb-4" />
        <div className="flex flex-wrap gap-4 mb-4">
          <select value={tone} onChange={e => setTone(e.target.value)} className="px-3 py-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600">
            <option value="">Any Tone</option>
            <option value="heartfelt">Heartfelt</option>
            <option value="funny">Funny</option>
            <option value="formal">Formal</option>
            <option value="warm">Warm</option>
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
        <h2>How to Use</h2><ol><li>Describe the recipient and your relationship</li><li>Choose a tone</li><li>Click Generate</li><li>Copy the greeting</li></ol>
        <h2>Tips</h2><ul><li>Include specific memories or inside jokes</li><li>Match the tone to your relationship</li></ul>
        <h2>FAQ</h2>
        <div><strong>What is an AI birthday wish generator?</strong><p>It creates personalized birthday greetings for any recipient using AI, saving you time while keeping messages meaningful.</p></div>
        <div><strong>Can I generate multiple options?</strong><p>Yes, try different tones or rephrase your input for new variations.</p></div>
        <div><strong>Is it free to use?</strong><p>Yes, the birthday wish generator is completely free.</p></div>
      </section>
    </div>
  )
}
