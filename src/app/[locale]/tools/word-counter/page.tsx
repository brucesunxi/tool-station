'use client'

import { useTranslations } from 'next-intl'
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
  const t = useTranslations('tools.word-counter')
  const ct = useTranslations('common')

  const [text, setText] = useState('')

  const result = useMemo(() => analyzeText(text), [text])

  const stats = [
    { label: ct('wordCountLabel'), value: result.words },
    { label: ct('charCountLabel'), value: result.chars },
    { label: ct('charsNoSpacesLabel'), value: result.charsNoSpaces },
    { label: ct('sentencesLabel'), value: result.sentences },
    { label: ct('paragraphsLabel'), value: result.paragraphs },
    { label: ct('readingTimeLabel'), value: result.readingTime },
    { label: ct('speakingTimeLabel'), value: result.speakingTime },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('h1')}</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{t('description')}</p>
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
        placeholder={ct("pasteHere")}
        rows={12}
        className="w-full p-4 border rounded-xl resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 font-mono text-sm"
      />

      <div className="flex items-center justify-between mt-3 text-sm text-gray-400">
        <span>{result.words > 0 ? `{ct("wordsAndChars", { words: result.words, chars: result.chars })}` : 'Start typing to see stats'}</span>
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
          <h2 className="text-lg font-bold mb-4">{ct("wordFrequency")}</h2>
          <div className="border rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="text-left p-3 font-medium">{ct("word")}</th>
                  <th className="text-left p-3 font-medium">{ct("count")}</th>
                  <th className="text-left p-3 font-medium hidden sm:table-cell">{ct("frequency")}</th>
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
        <h2>{t('howto.heading')}</h2>
        <ol>
          {(t.raw('howto.steps') as string[]).map((step, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: step }} />
          ))}
        </ol>
        <h2>{t('tips.heading')}</h2>
        <ul>
          {(t.raw('tips.items') as string[]).map((item, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
          ))}
        </ul>
        <h2>{t('faq.heading')}</h2>
        <div className="space-y-4">
          {(t.raw('faq.items') as { q: string; a: string }[]).map((item, i) => (
            <div key={i}>
              <h3 className="font-semibold">{item.q}</h3>
              <p>{item.a}</p>
            </div>
          ))}
        </div></section>
    </div>
  )
}
