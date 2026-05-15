'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'
import AdBanner from '@/components/AdBanner'

export default function AiFlashcardsPage() {
  const t = useTranslations('tools.ai-flashcards')
  const ct = useTranslations('common')

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
      if (!res.ok) throw new Error(data.error || ct("generationFailed"))
      setResult(data.result)
    } catch (err) {
      setError(err instanceof Error ? err.message : ct("generationFailed"))
    } finally { setLoading(false) }
  }

  const handleCopy = () => { if (result) navigator.clipboard.writeText(result).catch(() => {}) }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('h1')}</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{t('description')}</p>
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
            {result && <button onClick={handleCopy} className="text-xs px-2 py-1 border rounded hover:bg-gray-50 dark:hover:bg-gray-800">{ct("copy")}</button>}
          </div>
          <div className={`min-h-[370px] p-4 border rounded-xl text-sm whitespace-pre-wrap leading-relaxed ${
            result ? 'border-green-200 bg-green-50/50 dark:bg-green-900/10' : 'bg-gray-50 dark:bg-gray-800/50'
          }`}>
            {result || <p className="text-gray-400">{loading ? ct("generating") : 'Flashcards will appear here...'}</p>}
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
