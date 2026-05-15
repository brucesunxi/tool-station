'use client'

import { useTranslations } from 'next-intl'
import { useState, useCallback } from 'react'
import AdBanner from '@/components/AdBanner'

export default function UrlEncodePage() {
  const t = useTranslations('tools.url-encode')
  const ct = useTranslations('common')

  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [encodeWhole, setEncodeWhole] = useState(true)
  const [copyText, setCopyText] = useState('Copy')

  const handleEncode = useCallback(() => {
    try {
      const result = encodeWhole ? encodeURI(input) : encodeURIComponent(input)
      setOutput(result)
    } catch {
      setOutput('Error')
    }
  }, [input, encodeWhole])

  const handleDecode = useCallback(() => {
    try {
      const result = encodeWhole ? decodeURI(input) : decodeURIComponent(input)
      setOutput(result)
    } catch {
      setOutput('Error: Invalid URL encoding')
    }
  }, [input, encodeWhole])

  const handleCopy = async () => {
    if (!output) return
    try {
      await navigator.clipboard.writeText(output)
      setCopyText('Copied!')
      setTimeout(() => setCopyText('Copy'), 2000)
    } catch { /* */ }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('h1')}</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{t('description')}</p>
      </div>
      <AdBanner className="mb-8 h-20" />

      <div className="bg-white dark:bg-gray-800 border rounded-xl p-6 mb-8 space-y-4">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Enter URL or text to encode/decode..."
          className="w-full p-3 border rounded-lg text-sm min-h-[100px] dark:bg-gray-700 dark:border-gray-600"
        />
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={encodeWhole} onChange={e => setEncodeWhole(e.target.checked)} className="rounded" />
            Whole URL
          </label>
          <button onClick={handleEncode} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">{ct("encode")}</button>
          <button onClick={handleDecode} className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-700">{ct("decode")}</button>
          <button onClick={() => { setInput(''); setOutput('') }} className="px-4 py-2 border rounded-lg text-sm">{ct("clear")}</button>
        </div>
        <div className="relative">
          <textarea
            value={output}
            readOnly
            placeholder="Result will appear here..."
            className="w-full p-3 border rounded-lg text-sm min-h-[80px] bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
          />
          {output && (
            <button onClick={handleCopy} className="absolute top-2 right-2 px-3 py-1 bg-gray-200 dark:bg-gray-600 rounded text-xs hover:bg-gray-300 dark:hover:bg-gray-500">
              {copyText}
            </button>
          )}
        </div>
      </div>

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
