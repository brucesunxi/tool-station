'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'
import AdBanner from '@/components/AdBanner'

interface SummaryResult {
  summary: string
  wordCount: number
  originalLength: number
  length: string
  style: string
}

export default function AiSummaryPage() {
  const t = useTranslations('tools.ai-summary')
  const ct = useTranslations('common')

  const [text, setText] = useState('')
  const [length, setLength] = useState('medium')
  const [style, setStyle] = useState('paragraph')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<SummaryResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSummarize = async () => {
    if (!text.trim()) return
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, length, style }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || ct("generationFailed"))
      setResult(data)
    } catch (err) {
      const msg = err instanceof Error ? err.message : ''
      // "Failed to fetch" usually means the serverless function timed out
      if (msg === 'Failed to fetch') {
        setError(ct("requestTimedOut"))
      } else {
        setError(msg || ct("somethingWentWrong"))
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    if (!result) return
    try {
      await navigator.clipboard.writeText(result.summary)
    } catch { /* ignore */ }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('h1')}</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{t('description')}</p>
      </div>

      <AdBanner className="mb-8 h-20" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input */}
        <div>
          <label className="block text-sm font-medium mb-2">{ct("textToSummarize")}</label>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder={ct("placeholderSummaryInput")}
            rows={16}
            className="w-full p-4 border rounded-xl resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm dark:bg-gray-800 dark:border-gray-700"
          />
          <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
            <span>{ct("characters", { count: text.length })}</span>
            {text.length > 0 && (
              <span>{ct("approxWords", { count: Math.max(1, Math.round(text.trim().split(/\s+/).length)) })}</span>
            )}
          </div>
        </div>

        {/* Output */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">{ct("summary")}</label>
            {result && (
              <button onClick={handleCopy}
                className="text-xs px-2 py-1 border rounded hover:bg-gray-50 dark:hover:bg-gray-800">{ct("copy")}</button>
            )}
          </div>
          <div className={`min-h-[400px] p-4 border rounded-xl text-sm ${
            result ? 'border-green-200 bg-green-50/50 dark:bg-green-900/10' : 'bg-gray-50 dark:bg-gray-800/50'
          }`}>
            {result ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-0.5 rounded">
                    {ct("words", { count: result.wordCount })}
                  </span>
                  <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                    {ct("percentReduction", { percent: Math.round((1 - result.summary.length / result.originalLength) * 100) })}
                  </span>
                </div>
                <p className="leading-relaxed whitespace-pre-wrap">{result.summary}</p>
              </div>
            ) : (
              <p className="text-gray-400">{ct("placeholderSummary")}</p>
            )}
          </div>
        </div>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <div>
          <label className="block text-sm font-medium mb-2">{ct("summaryLength")}</label>
          <div className="flex gap-2">
            {[
              { value: 'short', label: ct("short"), desc: ct("descShortSummary") },
              { value: 'medium', label: ct("medium"), desc: ct("paragraph") },
              { value: 'long', label: ct("long"), desc: ct("descLongSummary") },
            ].map(opt => (
              <button key={opt.value} onClick={() => setLength(opt.value)}
                className={`flex-1 p-3 rounded-lg border text-center transition-all ${
                  length === opt.value
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-200'
                    : 'hover:border-blue-300'
                }`}>
                <p className="font-semibold text-sm">{opt.label}</p>
                <p className="text-xs text-gray-400">{opt.desc}</p>
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">{ct("outputStyle")}</label>
          <div className="flex gap-2">
            {[
              { value: 'paragraph', label: ct("paragraph"), desc: ct("descFlowingText") },
              { value: 'bullet', label: ct("bulletPoints"), desc: ct("descKeyPoints") },
              { value: 'one-sentence', label: ct("oneSentence"), desc: ct("descUltraShort") },
            ].map(opt => (
              <button key={opt.value} onClick={() => setStyle(opt.value)}
                className={`flex-1 p-3 rounded-lg border text-center transition-all ${
                  style === opt.value
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-200'
                    : 'hover:border-blue-300'
                }`}>
                <p className="font-semibold text-sm">{opt.label}</p>
                <p className="text-xs text-gray-400">{opt.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Submit */}
      <button onClick={handleSummarize} disabled={loading || !text.trim()}
        className="w-full mt-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors">
        {loading ? ct("aiThinking") : ct("summarizeWithAI")}
      </button>

      {error && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>
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
