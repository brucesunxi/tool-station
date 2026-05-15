'use client'

import { useTranslations } from 'next-intl'
import { useState, useMemo } from 'react'
import AdBanner from '@/components/AdBanner'

type StrikeStyle = 'unicode' | 'double' | 'slash'

const COMBINING_LONG_STROKE = '̶'
const COMBINING_SHORT_STROKE = '̵'
const COMBINING_DOUBLE_STROKE = '̷'
const COMBINING_SLASH = '̸'

export default function StrikethroughTextPage() {
  const t = useTranslations('tools.strikethrough-text')
  const ct = useTranslations('common')

  const [input, setInput] = useState('')
  const [style, setStyle] = useState<StrikeStyle>('unicode')
  const [copied, setCopied] = useState(false)

  const result = useMemo(() => {
    if (!input) return ''

    const char = style === 'unicode' ? COMBINING_LONG_STROKE
      : style === 'double' ? COMBINING_DOUBLE_STROKE
      : COMBINING_SLASH

    return input.split('').map(c => c === ' ' ? ' ' : c + char).join('')
  }, [input, style])

  const handleCopy = () => {
    if (!result) return
    navigator.clipboard.writeText(result).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-2">{t('h1')}</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">{t('description')}</p>
      <AdBanner className="mb-8 h-20" />

      <div className="bg-white dark:bg-gray-800 border rounded-xl p-6 mb-8">
        <div className="flex flex-wrap gap-2 mb-4">
          {([
            { value: 'unicode' as const, label: 'Strikethrough' },
            { value: 'double' as const, label: 'Double Strike' },
            { value: 'slash' as const, label: 'Slash' },
          ]).map(opt => (
            <button key={opt.value} onClick={() => setStyle(opt.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                style === opt.value ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}>
              {opt.label}
            </button>
          ))}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Enter Text</label>
          <textarea value={input} onChange={e => setInput(e.target.value)} rows={4}
            placeholder="Type something to strikethrough..."
            className="w-full p-4 border rounded-xl resize-y text-sm dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {result && (
          <div className="p-4 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/30 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-500">{ct("result")}</span>
              <button onClick={handleCopy} className="text-xs px-2 py-1 border rounded hover:bg-white dark:hover:bg-gray-700 transition-colors">
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <p className="text-lg break-all">{result}</p>
          </div>
        )}
      </div>

      <section className="prose dark:prose-invert max-w-none">
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
        <div className="space-y-4 not-prose">
          {(t.raw('faq.items') as { q: string; a: string }[]).map((item, i) => (
            <div key={i}>
              <h3 className="font-semibold">{item.q}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{item.a}</p>
            </div>
          ))}
        </div></section>
    </div>
  )
}
