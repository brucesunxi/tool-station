'use client'

import { useState, useMemo } from 'react'
import { Link } from '@/i18n'
import { useTranslations } from 'next-intl'
import AdBanner from '@/components/AdBanner'
import { tools } from '@/lib/tools'

export default function SearchPage() {
  const t = useTranslations('search')
  const n = useTranslations('nav')
  const siteT = useTranslations('site')
  const toolsT = useTranslations('tools')
  const ct = useTranslations('common')

  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')

  const getToolKey = (href: string) => href.replace('/tools/', '')
  const translateTool = (tool: typeof tools[0]) => ({
    ...tool,
    title: toolsT(`${getToolKey(tool.href)}.title`),
    description: toolsT(`${getToolKey(tool.href)}.desc`),
  })
  const translatedTools = tools.map(translateTool)

  const cats = useMemo(() => {
    const keys = ['all', ...Array.from(new Set(tools.map(t => t.category)))]
    const labels: Record<string, string> = { all: siteT('allTools'), image: n('image'), pdf: n('pdf'), ai: n('ai'), dev: n('dev'), text: n('text'), color: n('color') }
    return keys.map(k => ({ key: k, label: labels[k] || k }))
  }, [n, siteT])

  const results = useMemo(() => {
    if (!query.trim() && category === 'all') return translatedTools
    const q = query.toLowerCase().trim()
    return translatedTools.filter(t => {
      if (category !== 'all' && t.category !== category) return false
      if (!q) return true
      return t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.category.toLowerCase().includes(q)
    })
  }, [query, category, translatedTools])

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('title')}</h1>
        <p className="text-gray-500">{t('description', { count: tools.length })}</p>
      </div>
      <AdBanner className="mb-8 h-20" />

      <div className="relative mb-6">
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input type="text" value={query} onChange={e => setQuery(e.target.value)}
          placeholder={t('placeholder')}
          autoFocus
          className="w-full pl-10 pr-4 py-3.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
        />
        {query && (
          <button onClick={() => setQuery('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        )}
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {cats.map(c => (
          <button key={c.key} onClick={() => setCategory(c.key)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              category === c.key ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}>
            {c.label} {c.key !== 'all' && `(${tools.filter(t => t.category === c.key).length})`}
          </button>
        ))}
      </div>

      {/* Results */}
      {results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {results.map(tool => (
            <Link key={tool.href} href={tool.href}
              className="flex items-center gap-3 p-3 border rounded-xl hover:border-blue-300 hover:shadow-sm transition-all bg-white dark:bg-gray-800 dark:border-gray-700">
              <span className="text-xl shrink-0">{tool.icon}</span>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm truncate">
                  {tool.title}
                  {tool.isNew && <span className="ml-1.5 text-[10px] bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 px-1.5 py-0.5 rounded font-medium">{ct('new')}</span>}
                </p>
                <p className="text-xs text-gray-400 truncate">{tool.description}</p>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-500 capitalize shrink-0">{tool.category}</span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-400">
          <p className="text-xl mb-2">{t('noResults')}</p>
          <p className="text-sm">{t('tryDifferent')}</p>
        </div>
      )}

      {query && <p className="mt-4 text-xs text-gray-400 text-right">{t('resultCount', { count: results.length, total: tools.length })}</p>}

      <div className="mt-12 pt-8 border-t">
        <h2 className="text-xl font-bold mb-4">{t('browseHeading')}</h2>
        <p className="text-sm text-gray-500">
          {t('browseAll', { count: tools.length })}
        </p>
      </div>
    </div>
  )
}
