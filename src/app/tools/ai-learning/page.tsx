'use client'
import { useState } from 'react'
import AdBanner from '@/components/AdBanner'

export default function LearningPage() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [level, setLevel] = useState('')

  async function handleSubmit() {
    if (!input.trim()) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/ai-learning', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input, level: level || undefined }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setOutput(data.content)
    } catch (err: any) { setError(err.message) }
    finally { setLoading(false) }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-2">AI Learning Path Generator — Personalized Roadmap</h1>
      <p className="text-gray-500 mb-6">Free AI learning path generator. Create personalized learning roadmaps for any skill. Beginner to advanced stages with resources.</p>
      <AdBanner className="mb-8 h-20" />
      <div className="bg-white dark:bg-gray-800 border rounded-xl p-6 mb-8">
        <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="What skill or subject do you want to learn?" className="w-full p-4 border rounded-xl text-sm min-h-[120px] dark:bg-gray-700 dark:border-gray-600 mb-4" />
        <div className="flex flex-wrap gap-4 mb-4">
          <select value={level} onChange={e => setLevel(e.target.value)} className="px-3 py-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600">
            <option value="">Any Level</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
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
        <h2>How to Use</h2><ol><li>Enter the skill or subject</li><li>Choose your experience level</li><li>Click Generate</li><li>Follow your personalized roadmap</li></ol>
        <h2>Tips</h2><ul><li>Be specific about the skill area for more relevant roadmaps</li><li>Select your level to get appropriate resources</li></ul>
        <h2>FAQ</h2>
        <div><strong>What is an AI learning path generator?</strong><p>It creates personalized learning roadmaps with stages, resources, and milestones for any skill or subject you want to master.</p></div>
        <div><strong>Does it include resources?</strong><p>Yes, the roadmap includes recommended resources, courses, and practice activities.</p></div>
        <div><strong>Can I get a roadmap for any skill?</strong><p>Yes, from programming to cooking to music — any skill or subject works.</p></div>
      </section>
    </div>
  )
}
