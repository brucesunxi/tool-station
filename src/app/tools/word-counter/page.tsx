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
      <div className="mt-12 pt-8 border-t">
        <h2 className="text-xl font-bold mb-4">Free Online Word Counter Tool</h2>
        <div className="text-sm text-gray-500 space-y-3">
          <p>
            Our word counter is a free online tool that instantly provides accurate word and character counts
            for any text. Perfect for writers, students, content creators, and SEO professionals who need to
            track text length requirements.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Check word count for essays, articles, and blog posts</li>
            <li>Monitor character limits for social media posts and meta descriptions</li>
            <li>Estimate reading time for better content planning</li>
            <li>Track keyword density for SEO optimization</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
