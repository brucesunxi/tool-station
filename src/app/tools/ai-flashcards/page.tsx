'use client'

import { useState } from 'react'
import AdBanner from '@/components/AdBanner'

export default function AiFlashcardsPage() {
  const [text, setText] = useState('')
  const [count, setCount] = useState(10)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!text.trim()) return
    setLoading(true); setError(null); setResult('')
    try {
      const res = await fetch('/api/flashcards', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, count }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Generation failed')
      setResult(data.result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed')
    } finally { setLoading(false) }
  }

  const handleCopy = () => { if (result) navigator.clipboard.writeText(result).catch(() => {}) }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">AI Flashcard Generator</h1>
        <p className="text-gray-500">Turn any text into Q&A flashcards for studying. Perfect for students and lifelong learners.</p>
      </div>
      <AdBanner className="mb-8 h-20" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Source Text</label>
          <textarea value={text} onChange={e => setText(e.target.value)} rows={14}
            placeholder="Paste textbook content, article, lecture notes, or any material you want to study..."
            className="w-full p-4 border rounded-xl resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm dark:bg-gray-800 dark:border-gray-700"
          />
          <div className="mt-1 flex items-center justify-between text-xs text-gray-400">
            <span>{text.length} chars</span>
            <label className="flex items-center gap-2">
              Cards: {count}
              <input type="range" min="5" max="20" value={count} onChange={e => setCount(Number(e.target.value))} className="w-20 accent-blue-600" />
            </label>
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">Flashcards</label>
            {result && <button onClick={handleCopy} className="text-xs px-2 py-1 border rounded hover:bg-gray-50 dark:hover:bg-gray-800">Copy</button>}
          </div>
          <div className={`min-h-[370px] p-4 border rounded-xl text-sm whitespace-pre-wrap leading-relaxed ${
            result ? 'border-green-200 bg-green-50/50 dark:bg-green-900/10' : 'bg-gray-50 dark:bg-gray-800/50'
          }`}>
            {result || <p className="text-gray-400">{loading ? 'Generating...' : 'Flashcards will appear here...'}</p>}
          </div>
        </div>
      </div>
      <button onClick={handleGenerate} disabled={loading || !text.trim()}
        className="w-full mt-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors">
        {loading ? '🤖 Generating...' : '📇 Generate Flashcards'}
      </button>
      {error && <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>}
      {/* SEO Content */}
      <section className="mt-12 pt-8 border-t prose dark:prose-invert max-w-none">
        <h2>How to Use the AI Flashcard Generator</h2>
        <ol>
          <li>Paste your study material into the text area &mdash; this can be textbook content, lecture notes, articles, documentation, or any educational text.</li>
          <li>Adjust the number of flashcards using the slider (5 to 20 cards) to control how many concepts the AI extracts.</li>
          <li>Click &ldquo;Generate Flashcards&rdquo; to submit the text. The AI identifies key concepts and creates question-and-answer pairs.</li>
          <li>Review the generated flashcards in the right panel. Each card has a clear question on one side and a concise answer on the other.</li>
          <li>Use the Copy button to transfer all cards to your clipboard and paste them into your preferred flashcard app (Anki, Quizlet, etc.).</li>
          <li>Study the cards and generate new sets from different sections of your material for comprehensive exam preparation.</li>
        </ol>
        <h2>Tips for Better Results</h2>
        <ul>
          <li>Paste focused text on a single topic rather than a broad chapter &mdash; this helps the AI generate more specific, high-quality question-answer pairs.</li>
          <li>For technical subjects, include code snippets, formulas, or definitions in the source text so the flashcards capture precise technical knowledge.</li>
          <li>Use 10&ndash;15 cards per study session for optimal retention. Too many cards at once reduces recall effectiveness.</li>
          <li>Combine multiple shorter flashcard sets from different topics rather than one large set for better spaced repetition learning.</li>
        </ul>
        <h2>FAQ</h2>
        <div className="space-y-4">
          <div><h3 className="font-semibold">What types of source material work best?</h3><p>Textbook chapters, lecture notes, research papers, technical documentation, and article summaries all work well. The AI extracts concepts, definitions, processes, and key facts.</p></div>
          <div><h3 className="font-semibold">Can I export these flashcards to other apps?</h3><p>Yes, use the Copy button to copy all question-answer pairs as formatted text. You can then paste them into Anki, Quizlet, Notion, or any study tool that supports Q&amp;A import.</p></div>
          <div><h3 className="font-semibold">How does the AI decide what to turn into a flashcard?</h3><p>The AI identifies key concepts, definitions, important facts, processes, and relationships in the text, then formulates each as a question with a clear, concise answer.</p></div>
          <div><h3 className="font-semibold">Is there a limit on how much text I can submit?</h3><p>The tool handles paragraphs to several pages of text. For very long documents, split the content into logical sections and generate separate flashcard sets for each section.</p></div>
        </div>
      </section>
    </div>
  )
}
