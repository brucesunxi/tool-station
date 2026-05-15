'use client'

import { useTranslations } from 'next-intl'
import { useState, useMemo } from 'react'
import AdBanner from '@/components/AdBanner'

type SortMode = 'az' | 'za' | 'length-asc' | 'length-desc' | 'shuffle' | 'reverse'

export default function LineSorterPage() {
  const t = useTranslations('tools.line-sorter')
  const ct = useTranslations('common')

  const [input, setInput] = useState('')
  const [mode, setMode] = useState<SortMode>('az')
  const [removeDups, setRemoveDups] = useState(false)
  const [copied, setCopied] = useState(false)

  const result = useMemo(() => {
    if (!input) return ''
    let lines = input.split('\n')

    if (removeDups) {
      lines = lines.filter((line, i) => lines.indexOf(line) === i)
    }

    switch (mode) {
      case 'az':
        return lines.sort((a, b) => a.localeCompare(b)).join('\n')
      case 'za':
        return lines.sort((a, b) => b.localeCompare(a)).join('\n')
      case 'length-asc':
        return lines.sort((a, b) => a.length - b.length).join('\n')
      case 'length-desc':
        return lines.sort((a, b) => b.length - a.length).join('\n')
      case 'shuffle': {
        const arr = [...lines]
        for (let i = arr.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [arr[i], arr[j]] = [arr[j], arr[i]]
        }
        return arr.join('\n')
      }
      case 'reverse':
        return lines.reverse().join('\n')
    }
  }, [input, mode, removeDups])

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
            { value: 'az' as const, label: 'A to Z' },
            { value: 'za' as const, label: 'Z to A' },
            { value: 'length-asc' as const, label: 'Length (short first)' },
            { value: 'length-desc' as const, label: 'Length (long first)' },
            { value: 'shuffle' as const, label: 'Shuffle' },
            { value: 'reverse' as const, label: 'Reverse' },
          ]).map(opt => (
            <button key={opt.value} onClick={() => setMode(opt.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                mode === opt.value ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}>
              {opt.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Input (one item per line)</label>
            <textarea value={input} onChange={e => setInput(e.target.value)} rows={8}
              placeholder={`Banana\nApple\nCherry`}
              className="w-full p-4 border rounded-xl resize-y text-sm dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium">{ct("output")}</label>
              {result && (
                <button onClick={handleCopy} className="text-xs px-2 py-1 border rounded hover:bg-gray-50 dark:hover:bg-gray-800">{copied ? 'Copied!' : 'Copy'}</button>
              )}
            </div>
            <textarea value={result} readOnly rows={8}
              className="w-full p-4 border rounded-xl resize-y text-sm bg-gray-50 dark:bg-gray-800 dark:border-gray-700 font-mono" placeholder="Sorted lines will appear here..."
            />
          </div>
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={removeDups} onChange={e => setRemoveDups(e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
          <span className="text-sm">Remove duplicate lines</span>
        </label>
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
