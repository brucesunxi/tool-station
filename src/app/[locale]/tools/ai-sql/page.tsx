'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'
import AdBanner from '@/components/AdBanner'

export default function AiSqlPage() {
  const t = useTranslations('tools.ai-sql')
  const ct = useTranslations('common')

  const [question, setQuestion] = useState('')
  const [dialect, setDialect] = useState('standard')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!question.trim()) return
    setLoading(true); setError(null); setResult('')
    try {
      const res = await fetch('/api/sql', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, dialect }),
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
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('h1')}</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{t('description')}</p>
      </div>
      <AdBanner className="mb-8 h-20" />
      <textarea value={question} onChange={e => setQuestion(e.target.value)} rows={5}
        placeholder={ct("placeholderSqlPrompt")}
        className="w-full p-4 border rounded-xl resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm dark:bg-gray-800 dark:border-gray-700 mb-3"
      />
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">{ct("sqlDialect")}</label>
        <select value={dialect} onChange={e => setDialect(e.target.value)}
          className="w-full p-2.5 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="standard">{ct("sqlStandard")}</option>
          <option value="postgresql">{ct("sqlPostgresql")}</option>
          <option value="mysql">{ct("sqlMysql")}</option>
          <option value="sqlite">{ct("sqlSqlite")}</option>
          <option value="mssql">{ct("sqlSqlServer")}</option>
        </select>
      </div>
      <button onClick={handleGenerate} disabled={loading || !question.trim()}
        className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors">
        {loading ? ct("generating") : ct("generateSql")}
      </button>
      {error && <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>}
      {result && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-sm">{ct("sqlQuery")}</h3>
            <button onClick={handleCopy} className="text-xs px-2 py-1 border rounded hover:bg-gray-50 dark:hover:bg-gray-800">{ct("copy")}</button>
          </div>
          <div className="p-4 border rounded-xl bg-green-50/50 dark:bg-green-900/10 dark:border-green-900/30 text-sm whitespace-pre-wrap leading-relaxed font-mono">{result}</div>
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
