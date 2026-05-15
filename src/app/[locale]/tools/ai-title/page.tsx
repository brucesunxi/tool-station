'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'
import AdBanner from '@/components/AdBanner'

export default function AiTitlePage() {
  const t = useTranslations('tools.ai-title')
  const ct = useTranslations('common')

  const styles = [
    { value: 'professional', label: ct('toneProfessional'), desc: t('styleProfessionalDesc'), icon: '👔' },
    { value: 'clickbait', label: t('styleClickWorthy'), desc: t('styleClickWorthyDesc'), icon: '🎯' },
    { value: 'howto', label: ct('styleHowTo'), desc: t('styleHowToDesc'), icon: '📋' },
    { value: 'question', label: ct('styleQuestion'), desc: t('styleQuestionDesc'), icon: '❓' },
    { value: 'creative', label: ct('toneCreative'), desc: t('styleCreativeDesc'), icon: '✨' },
  ]

  const [topic, setTopic] = useState('')
  const [style, setStyle] = useState('professional')
  const [count, setCount] = useState(5)
  const [loading, setLoading] = useState(false)
  const [titles, setTitles] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!topic.trim()) return
    setLoading(true); setError(null); setTitles([])
    try {
      const res = await fetch('/api/title', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, style, count }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || ct("generationFailed"))
      setTitles(data.titles || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : ct("generationFailed"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('h1')}</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{t('description')}</p>
      </div>

      <AdBanner className="mb-8 h-20" />

      {/* Topic */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">{ct("topicOrSubject")}</label>
        <input type="text" value={topic} onChange={e => setTopic(e.target.value)}
          placeholder={ct("placeholderTopic")}
          className="w-full p-3 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Style */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">{ct("style")}</label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {styles.map(s => (
            <button key={s.value} onClick={() => setStyle(s.value)}
              className={`p-3 rounded-lg border text-center transition-all ${
                style === s.value
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-200'
                  : 'hover:border-blue-300'
              }`}>
              <p className="text-lg">{s.icon}</p>
              <p className="text-sm font-medium">{s.label}</p>
              <p className="text-xs text-gray-400">{s.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Count */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">{ct("numberOfTitles", { count })}</label>
        <input type="range" min="3" max="10" value={count} onChange={e => setCount(Number(e.target.value))}
          className="w-full accent-blue-600" />
      </div>

      {/* Generate */}
      <button onClick={handleGenerate} disabled={loading || !topic.trim()}
        className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors">
        {loading ? ct("aiWriting") : ct("generateTitles")}
      </button>

      {error && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>
      )}

      {/* Results */}
      {titles.length > 0 && (
        <div className="mt-6 p-4 border rounded-xl bg-green-50/50 dark:bg-green-900/10 dark:border-green-900/30">
          <h3 className="font-semibold text-sm mb-3">{ct("generatedTitles")}</h3>
          <ul className="space-y-2">
            {titles.map((title, i) => (
              <li key={i} className="flex items-start gap-3 p-2 rounded-lg hover:bg-white dark:hover:bg-gray-800 transition-colors">
                <span className="text-xs font-mono text-gray-400 mt-0.5 shrink-0">#{i + 1}</span>
                <p className="text-sm flex-1">{title}</p>
                <button onClick={() => navigator.clipboard.writeText(title).catch(() => {})}
                  className="text-xs text-blue-600 hover:underline shrink-0">{ct("copy")}</button>
              </li>
            ))}
          </ul>
          <button onClick={() => navigator.clipboard.writeText(titles.join('\n')).catch(() => {})}
            className="mt-3 text-xs text-gray-400 hover:text-gray-600 transition-colors">{ct("copyAll")}</button>
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
