'use client'
import { useState } from 'react'
import AdBanner from '@/components/AdBanner'

export default function LoveLetterPage() {
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
      const res = await fetch('/api/ai-love-letter', {
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
      <h1 className="text-3xl font-bold mb-2">AI Love Letter Generator — Romantic Letter Writer</h1>
      <p className="text-gray-500 mb-6">Free AI love letter generator. Write beautiful, romantic love letters. Express your feelings with poetic, heartfelt, or playful messages.</p>
      <AdBanner className="mb-8 h-20" />
      <div className="bg-white dark:bg-gray-800 border rounded-xl p-6 mb-8">
        <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Describe the person and your relationship (qualities you love, special memories)..." className="w-full p-4 border rounded-xl text-sm min-h-[120px] dark:bg-gray-700 dark:border-gray-600 mb-4" />
        <div className="flex flex-wrap gap-4 mb-4">
          <select value={tone} onChange={e => setTone(e.target.value)} className="px-3 py-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600">
            <option value="">Any Tone</option>
            <option value="romantic">Romantic</option>
            <option value="poetic">Poetic</option>
            <option value="heartfelt">Heartfelt</option>
            <option value="playful">Playful</option>
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
        <h2>How to Use</h2><ol><li>Describe the person and your relationship</li><li>Choose a tone</li><li>Click Generate</li><li>Copy your letter</li></ol>
        <h2>Tips</h2><ul><li>Include specific qualities and memories for a personal touch</li><li>Read it aloud before sending to ensure it feels authentic</li></ul>
        <h2>FAQ</h2>
        <div><strong>What is an AI love letter generator?</strong><p>It helps you express your feelings through beautifully crafted love letters, whether romantic, poetic, heartfelt, or playful.</p></div>
        <div><strong>Can I personalize the letter?</strong><p>Yes, add specific details in your input for a more personalized result.</p></div>
        <div><strong>Is my content private?</strong><p>Yes, your input is processed in real-time and not stored.</p></div>
      </section>
    </div>
  )
}
