'use client'
import { useState } from 'react'
import AdBanner from '@/components/AdBanner'

export default function StoryPage() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [genre, setGenre] = useState('')
  const [tone, setTone] = useState('')

  async function handleSubmit() {
    if (!input.trim()) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/ai-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input, genre: genre || undefined, tone: tone || undefined }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setOutput(data.content)
    } catch (err: any) { setError(err.message) }
    finally { setLoading(false) }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-2">AI Story Generator Free Online — Creative Story Writer</h1>
      <p className="text-gray-500 mb-6">Free AI story generator. Write creative stories on any topic. Choose from fantasy, sci-fi, mystery, romance, and adventure genres.</p>
      <AdBanner className="mb-8 h-20" />
      <div className="bg-white dark:bg-gray-800 border rounded-xl p-6 mb-8">
        <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Enter your story topic or prompt..." className="w-full p-4 border rounded-xl text-sm min-h-[120px] dark:bg-gray-700 dark:border-gray-600 mb-4" />
        <div className="flex flex-wrap gap-4 mb-4">
          <select value={genre} onChange={e => setGenre(e.target.value)} className="px-3 py-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600">
            <option value="">Any Genre</option>
            <option value="fantasy">Fantasy</option>
            <option value="sci-fi">Sci-Fi</option>
            <option value="mystery">Mystery</option>
            <option value="romance">Romance</option>
            <option value="adventure">Adventure</option>
          </select>
          <select value={tone} onChange={e => setTone(e.target.value)} className="px-3 py-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600">
            <option value="">Any Tone</option>
            <option value="whimsical">Whimsical</option>
            <option value="dark">Dark</option>
            <option value="humorous">Humorous</option>
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
        <h2>How to Use</h2><ol><li>Enter your story topic or prompt</li><li>Choose a genre and tone</li><li>Click Generate</li><li>Copy the result</li></ol>
        <h2>Tips</h2><ul><li>Be specific in your input for better results</li><li>Try different genres and tones for variety</li></ul>
        <h2>FAQ</h2>
        <div><strong>What is an AI story generator?</strong><p>An AI story generator uses artificial intelligence to create narrative stories based on your prompts, helping overcome writer&apos;s block and spark creativity.</p></div>
        <div><strong>Can I use these stories commercially?</strong><p>Yes, the generated stories are free to use for personal or commercial purposes.</p></div>
        <div><strong>How long are the generated stories?</strong><p>Stories are typically a few paragraphs to a page long, depending on the complexity of your prompt.</p></div>
      </section>
    </div>
  )
}
