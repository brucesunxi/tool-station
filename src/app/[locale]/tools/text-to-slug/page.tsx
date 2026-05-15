'use client'

import { useTranslations } from 'next-intl'
import { useState, useMemo } from 'react'
import AdBanner from '@/components/AdBanner'

export default function TextToSlugPage() {
  const t = useTranslations('tools.text-to-slug')
  const ct = useTranslations('common')

  const [input, setInput] = useState('')
  const [separator, setSeparator] = useState('-')
  const [lowercase, setLowercase] = useState(true)
  const [copied, setCopied] = useState(false)

  const slug = useMemo(() => {
    if (!input) return ''

    let text = input.trim()

    if (lowercase) {
      text = text.toLowerCase()
    }

    text = text.replace(/[^\w\s-]/g, '')
    text = text.replace(/[\s]+/g, separator)
    text = text.replace(new RegExp(`${separator}+`, 'g'), separator)
    text = text.replace(new RegExp(`^${separator}|${separator}$`, 'g'), '')

    return text
  }, [input, separator, lowercase])

  const previewUrl = slug ? `https://example.com/${slug}` : ''

  const handleCopy = () => {
    if (!slug) return
    navigator.clipboard.writeText(slug).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-2">{t('h1')}</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">{t('description')}</p>
      <AdBanner className="mb-8 h-20" />

      <div className="bg-white dark:bg-gray-800 border rounded-xl p-6 mb-8">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Input Text</label>
          <textarea value={input} onChange={e => setInput(e.target.value)} rows={3}
            placeholder="e.g. How to Create a Great Blog Post"
            className="w-full p-4 border rounded-xl resize-y text-sm dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Separator</label>
            <select value={separator} onChange={e => setSeparator(e.target.value)}
              className="w-full p-2.5 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="-">Hyphen (-)</option>
              <option value="_">Underscore (_)</option>
              <option value="">None (no separator)</option>
            </select>
          </div>
          <div className="flex items-end pb-2.5">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={lowercase} onChange={e => setLowercase(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span className="text-sm">Lowercase</span>
            </label>
          </div>
        </div>

        {slug && (
          <div className="p-4 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/30 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">Slug</span>
              <button onClick={handleCopy} className="text-xs px-2 py-1 border rounded hover:bg-white dark:hover:bg-gray-700 transition-colors">
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <p className="text-sm font-mono break-all">{slug}</p>
            {previewUrl && (
              <div>
                <span className="text-xs font-medium text-gray-500">Preview URL</span>
                <p className="text-sm text-blue-600 dark:text-blue-400 break-all">{previewUrl}</p>
              </div>
            )}
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
