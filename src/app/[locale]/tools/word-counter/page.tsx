'use client'

import { useState, useMemo } from 'react'
import AdBanner from '@/components/AdBanner'

interface WordCountResult {
  words: number
  chars: number
  charsNoSpaces: number
  sentences: number
  paragraphs: number
  readingTime: string
  speakingTime: string
  topWords: { word: string; count: number }[]
}

function analyzeText(text: string): WordCountResult {
  const trimmed = text.trim()

  const words = trimmed
    ? trimmed.split(/\s+/).filter(Boolean).length
    : 0

  const chars = trimmed.length
  const charsNoSpaces = trimmed.replace(/\s/g, '').length

  const sentences = trimmed
    ? (trimmed.match(/[.!?]+/g) || []).length || (words > 0 ? 1 : 0)
    : 0

  const paragraphs = trimmed
    ? trimmed.split(/\n\s*\n/).filter(p => p.trim()).length || 1
    : 0

  const readingTimeMin = words / 200
  const readingTime = readingTimeMin < 1
    ? '< 1 min'
    : `${Math.ceil(readingTimeMin)} min`

  const speakingTimeMin = words / 150
  const speakingTime = speakingTimeMin < 1
    ? '< 1 min'
    : `${Math.ceil(speakingTimeMin)} min`

  // Top 10 most frequent words
  const wordMap = new Map<string, number>()
  trimmed.toLowerCase().replace(/[^a-z0-9\s'-]/g, '').split(/\s+/).filter(Boolean).forEach(w => {
    wordMap.set(w, (wordMap.get(w) || 0) + 1)
  })
  const topWords = Array.from(wordMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word, count]) => ({ word, count }))

  return { words, chars, charsNoSpaces, sentences, paragraphs, readingTime, speakingTime, topWords }
}

export default function WordCounterPage() {
  const [text, setText] = useState('')

  const result = useMemo(() => analyzeText(text), [text])

  const stats = [
    { label: 'Words', value: result.words },
    { label: 'Characters', value: result.chars },
    { label: 'Characters (no spaces)', value: result.charsNoSpaces },
    { label: 'Sentences', value: result.sentences },
    { label: 'Paragraphs', value: result.paragraphs },
    { label: 'Reading Time', value: result.readingTime },
    { label: 'Speaking Time', value: result.speakingTime },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Word Counter</h1>
        <p className="text-gray-500">
          Count words, characters, sentences, paragraphs, and reading time in any text.
        </p>
      </div>

      <AdBanner className="mb-8 h-20" />

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
        {stats.map(s => (
          <div key={s.label} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
            <p className="text-lg font-bold">{s.value}</p>
            <p className="text-xs text-gray-400 truncate">{s.label}</p>
          </div>
        ))}
      </div>

      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Paste or type your text here..."
        rows={12}
        className="w-full p-4 border rounded-xl resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 font-mono text-sm"
      />

      <div className="flex items-center justify-between mt-3 text-sm text-gray-400">
        <span>{result.words > 0 ? `${result.words} words, ${result.chars} characters` : 'Start typing to see stats'}</span>
        <div className="flex gap-2">
          {text && (
            <button
              onClick={() => setText('')}
              className="px-3 py-1 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-xs"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Word Frequency */}
      {result.topWords.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-bold mb-4">Word Frequency</h2>
          <div className="border rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="text-left p-3 font-medium">Word</th>
                  <th className="text-left p-3 font-medium">Count</th>
                  <th className="text-left p-3 font-medium hidden sm:table-cell">Frequency</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {result.topWords.map(({ word, count }) => {
                  const maxCount = result.topWords[0].count
                  return (
                    <tr key={word} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="p-3 font-mono">{word}</td>
                      <td className="p-3">{count}</td>
                      <td className="p-3 hidden sm:table-cell">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-blue-500 rounded-full h-2 transition-all"
                            style={{ width: `${(count / maxCount) * 100}%` }}
                          />
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SEO Content */}
      <section className="mt-12 pt-8 border-t prose dark:prose-invert max-w-none">
        <h2>How to Use</h2>
        <ol>
          <li>Type or paste your text into the text area &mdash; statistics update in real time as you type.</li>
          <li>Review the stats panel showing word count, character count, sentences, and paragraphs.</li>
          <li>Check the estimated reading time and speaking time for your content.</li>
          <li>Scroll down to the Word Frequency table to see your most commonly used words.</li>
          <li>Click <strong>Clear</strong> to reset the text area and start fresh.</li>
          <li>Copy your text elsewhere when you are done &mdash; all analysis is instant and client-side.</li>
        </ol>
        <h2>Tips</h2>
        <ul>
          <li>Use the word frequency analysis to identify overused words and improve your writing variety.</li>
          <li>Reading time estimates help you plan blog posts and articles to match your audience's attention span.</li>
          <li>Character count (no spaces) is useful for SMS messages, tweet drafts, and form fields with strict limits.</li>
          <li>Paragraph count helps you evaluate whether your text is properly structured with adequate breaks.</li>
        </ul>
        <h2>FAQ</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">What is the difference between Characters and Characters (no spaces)?</h3>
            <p>Characters includes every character including spaces. Characters (no spaces) excludes all whitespace, which is useful for SMS character limits and certain platform constraints.</p>
          </div>
          <div>
            <h3 className="font-semibold">How are reading time and speaking time calculated?</h3>
            <p>Reading time is based on an average reading speed of 200 words per minute. Speaking time uses 150 words per minute, a standard pace for conversational delivery.</p>
          </div>
          <div>
            <h3 className="font-semibold">Is there a character limit for the text area?</h3>
            <p>No, there is no limit &mdash; the tool processes text entirely in your browser with no server-side constraints.</p>
          </div>
          <div>
            <h3 className="font-semibold">Can I use this for SEO content analysis?</h3>
            <p>Yes, the Word Frequency table helps you track keyword density to avoid over-optimization and ensure natural keyword usage in your content.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
