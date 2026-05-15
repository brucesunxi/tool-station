'use client'
import { useState } from 'react'
import AdBanner from '@/components/AdBanner'

export default function EmailReplyPage() {
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
      const res = await fetch('/api/ai-email-reply', {
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
      <h1 className="text-3xl font-bold mb-2">AI Email Reply Generator — Smart Reply Assistant</h1>
      <p className="text-gray-500 mb-6">Free AI email reply generator. Draft professional email replies quickly. Choose from professional, friendly, or formal tones.</p>
      <AdBanner className="mb-8 h-20" />
      <div className="bg-white dark:bg-gray-800 border rounded-xl p-6 mb-8">
        <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Paste the email or describe the context you need to reply to..." className="w-full p-4 border rounded-xl text-sm min-h-[120px] dark:bg-gray-700 dark:border-gray-600 mb-4" />
        <div className="flex flex-wrap gap-4 mb-4">
          <select value={tone} onChange={e => setTone(e.target.value)} className="px-3 py-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600">
            <option value="">Any Tone</option>
            <option value="professional">Professional</option>
            <option value="friendly">Friendly</option>
            <option value="formal">Formal</option>
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
        <h2>How to Use</h2><ol><li>Paste the email or describe the context</li><li>Choose a tone</li><li>Click Generate</li><li>Copy the reply</li></ol>
        <h2>Tips</h2><ul><li>Include key points you want to address</li><li>Choose a tone that matches your relationship</li></ul>
        <h2>FAQ</h2>
        <div><strong>What is an AI email reply generator?</strong><p>It helps draft professional email responses quickly, saving time while maintaining appropriate tone and structure.</p></div>
        <div><strong>Can I customize the reply?</strong><p>Yes, the generated reply serves as a draft you can edit further.</p></div>
        <div><strong>Is the content original?</strong><p>Yes, each reply is uniquely generated based on your input context.</p></div>
      </section>
    </div>
  )
}
