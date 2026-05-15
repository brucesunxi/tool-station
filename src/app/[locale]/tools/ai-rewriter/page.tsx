'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'
import AdBanner from '@/components/AdBanner'

export default function AiRewriterPage() {
  const t = useTranslations('tools.ai-rewriter')
  const ct = useTranslations('common')

  const styles = [
    {
      value: 'formal', label: t('styleFormal'), desc: t('styleFormalDesc'),
      icon: '👔', color: 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-200',
    },
    {
      value: 'concise', label: t('styleConcise'), desc: t('styleConciseDesc'),
      icon: '✂️', color: 'border-green-500 bg-green-50 dark:bg-green-900/20 ring-2 ring-green-200',
    },
    {
      value: 'casual', label: t('styleCasual'), desc: t('styleCasualDesc'),
      icon: '😊', color: 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 ring-2 ring-orange-200',
    },
    {
      value: 'marketing', label: t('styleMarketing'), desc: t('styleMarketingDesc'),
      icon: '📢', color: 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 ring-2 ring-purple-200',
    },
  ]

  const [text, setText] = useState('')
  const [style, setStyle] = useState('formal')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ rewrittenText: string; wordCount: number } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleRewrite = async () => {
    if (!text.trim()) return
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch('/api/rewrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, style }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || ct("generationFailed"))
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : ct("generationFailed"))
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    if (result) navigator.clipboard.writeText(result.rewrittenText).catch(() => {})
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('h1')}</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{t('description')}</p>
      </div>

      <AdBanner className="mb-8 h-20" />

      {/* Style selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">{ct("writingStyle")}</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {styles.map(s => (
            <button key={s.value} onClick={() => setStyle(s.value)}
              className={`p-3 rounded-lg border text-center transition-all ${
                style === s.value ? s.color : 'hover:border-gray-300'
              }`}>
              <p className="text-lg">{s.icon}</p>
              <p className="text-sm font-semibold">{s.label}</p>
              <p className="text-xs text-gray-400">{s.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Text Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">{ct("originalText")}</label>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder={ct("placeholderRewriteText")}
            rows={14}
            className="w-full p-4 border rounded-xl resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm dark:bg-gray-800 dark:border-gray-700"
          />
          <div className="mt-1 text-xs text-gray-400 text-right">{ct("chars", { count: text.length })}</div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">{ct("rewritten")}</label>
            {result && (
              <button onClick={handleCopy}
                className="text-xs px-2 py-1 border rounded hover:bg-gray-50 dark:hover:bg-gray-800">{ct("copy")}</button>
            )}
          </div>
          <div className={`min-h-[370px] p-4 border rounded-xl text-sm whitespace-pre-wrap ${
            result ? 'border-green-200 bg-green-50/50 dark:bg-green-900/10' : 'bg-gray-50 dark:bg-gray-800/50'
          }`}>
            {result ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-0.5 rounded">
                    {ct("words", { count: result.wordCount })}
                  </span>
                </div>
                <p className="leading-relaxed">{result.rewrittenText}</p>
              </div>
            ) : (
              <p className="text-gray-400">{loading ? ct("rewriting") : ct("placeholderRewrittenText")}</p>
            )}
          </div>
        </div>
      </div>

      {/* Rewrite Button */}
      <button onClick={handleRewrite} disabled={loading || !text.trim()}
        className="w-full mt-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors">
        {loading ? ct("aiWriting") : ct("rewriteWithAi")}
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
