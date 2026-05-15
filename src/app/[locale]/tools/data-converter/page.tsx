'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'
import AdBanner from '@/components/AdBanner'

const formats = ['JSON', 'YAML']

export default function DataConverterPage() {
  const t = useTranslations('tools.data-converter')
  const ct = useTranslations('common')

  const [input, setInput] = useState('')
  const [fromFmt, setFromFmt] = useState('JSON')
  const [toFmt, setToFmt] = useState('YAML')
  const [output, setOutput] = useState('')
  const [error, setError] = useState<string | null>(null)

  const convert = async () => {
    if (!input.trim()) return
    setError(null)
    try {
      let parsed: any

      if (fromFmt === 'YAML') {
        const yaml = await import('js-yaml')
        parsed = yaml.load(input)
      } else {
        parsed = JSON.parse(input)
      }

      if (parsed === undefined || parsed === null) {
        throw new Error('Empty or invalid data')
      }

      if (toFmt === 'YAML') {
        const yaml = await import('js-yaml')
        setOutput(yaml.dump(parsed, { indent: 2, lineWidth: -1, noRefs: true }))
      } else {
        setOutput(JSON.stringify(parsed, null, 2))
      }
    } catch (e: any) {
      setError(`Conversion error: ${e.message}`)
      setOutput('')
    }
  }

  const handleCopy = () => { if (output) navigator.clipboard.writeText(output).catch(() => {}) }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('h1')}</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{t('description')}</p>
      </div>
      <AdBanner className="mb-8 h-20" />

      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1">
          <select value={fromFmt} onChange={e => setFromFmt(e.target.value)}
            className="w-full p-2.5 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            {formats.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
        <button onClick={() => { const t = fromFmt; setFromFmt(toFmt); setToFmt(t); setOutput(''); setError(null) }}
          className="p-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 shrink-0">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
        </button>
        <div className="flex-1">
          <select value={toFmt} onChange={e => setToFmt(e.target.value)}
            className="w-full p-2.5 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            {formats.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Input ({fromFmt})</label>
          <textarea value={input} onChange={e => setInput(e.target.value)} rows={16}
            placeholder={`Paste ${fromFmt} data here...`}
            className="w-full p-4 border rounded-xl resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-mono dark:bg-gray-800 dark:border-gray-700" />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">Output ({toFmt})</label>
            {output && <button onClick={handleCopy} className="text-xs px-2 py-1 border rounded hover:bg-gray-50 dark:hover:bg-gray-800">{ct("copy")}</button>}
          </div>
          <div className={`min-h-[400px] p-4 border rounded-xl text-sm font-mono whitespace-pre-wrap ${
            output ? 'border-green-200 bg-green-50/50 dark:bg-green-900/10' : 'bg-gray-50 dark:bg-gray-800/50'
          }`}>
            {output || <p className="font-sans text-gray-400">{error || `Converted ${toFmt} will appear here...`}</p>}
          </div>
        </div>
      </div>

      <button onClick={convert} disabled={!input.trim()}
        className="w-full mt-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors">
        Convert to {toFmt}
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
