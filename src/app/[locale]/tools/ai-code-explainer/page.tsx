'use client'
import { useState } from 'react'
import AdBanner from '@/components/AdBanner'

export default function CodeExplainerPage() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [language, setLanguage] = useState('')

  async function handleSubmit() {
    if (!input.trim()) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/ai-code-explainer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input, language: language || undefined }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setOutput(data.content)
    } catch (err: any) { setError(err.message) }
    finally { setLoading(false) }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-2">AI Code Explainer Free Online — Code Explanation Tool</h1>
      <p className="text-gray-500 mb-6">Free AI code explainer. Get plain-English explanations of any code. Understand complex programming concepts with simple breakdowns.</p>
      <AdBanner className="mb-8 h-20" />
      <div className="bg-white dark:bg-gray-800 border rounded-xl p-6 mb-8">
        <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Paste your code here..." className="w-full p-4 border rounded-xl text-sm min-h-[120px] dark:bg-gray-700 dark:border-gray-600 font-mono mb-4" />
        <div className="flex flex-wrap gap-4 mb-4">
          <input type="text" value={language} onChange={e => setLanguage(e.target.value)} placeholder="Language (e.g., Python, JavaScript) — optional" className="px-3 py-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600" />
        </div>
        <button onClick={handleSubmit} disabled={loading || !input.trim()} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50">Explain Code</button>
        {loading && <p className="text-sm text-gray-400 mt-2">Analyzing...</p>}
        {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
        {output && (
          <div className="mt-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl whitespace-pre-wrap text-sm">{output}</div>
            <button onClick={() => navigator.clipboard.writeText(output)} className="mt-2 text-xs text-blue-600">Copy to clipboard</button>
          </div>
        )}
      </div>
      <section className="prose dark:prose-invert max-w-none">
        <h2>How to Use</h2><ol><li>Paste your code snippet</li><li>Optionally specify the programming language</li><li>Click Explain Code</li><li>Read the plain-English explanation</li></ol>
        <h2>Tips</h2><ul><li>Include enough context for better explanations</li><li>Specify the language for more accurate results</li></ul>
        <h2>FAQ</h2>
        <div><strong>What is an AI code explainer?</strong><p>An AI code explainer analyzes code and generates plain-English explanations of what it does, how it works, and key concepts involved.</p></div>
        <div><strong>What languages are supported?</strong><p>Most popular programming languages are supported including Python, JavaScript, TypeScript, Java, C++, Go, Rust, and more.</p></div>
        <div><strong>Is my code stored?</strong><p>No, your code is processed in real-time and not stored on our servers.</p></div>
      </section>
    </div>
  )
}
