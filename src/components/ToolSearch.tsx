'use client'

import { useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n'

interface ToolData {
  title: string
  description: string
  icon: string
  href: string
  isNew: boolean
  category: string
}

interface ToolSearchProps {
  tools: ToolData[]
}

export default function ToolSearch({ tools }: ToolSearchProps) {
  const t = useTranslations()
  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    if (!query.trim()) return null
    const q = query.toLowerCase()
    return tools.filter(
      t => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.category.toLowerCase().includes(q)
    )
  }, [query, tools])

  return (
    <div className="relative mb-8">
      <div className="relative">
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={t('common.searchTools') || 'Search tools...'}
          className="w-full pl-10 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
        />
        {query && (
          <button onClick={() => setQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {results !== null && (
        <div className="mt-4">
          {results.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {results.map(tool => (
                <Link key={tool.href} href={tool.href}
                  className="flex items-center gap-3 p-3 border rounded-xl hover:border-blue-300 hover:shadow-sm transition-all bg-white dark:bg-gray-800 dark:border-gray-700">
                  <span className="text-xl shrink-0">{tool.icon}</span>
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">
                      {tool.title}
                      {tool.isNew && (
                        <span className="ml-1.5 text-[10px] bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 px-1.5 py-0.5 rounded font-medium">{t('common.new')}</span>
                      )}
                    </p>
                    <p className="text-xs text-gray-400 truncate">{tool.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-400">
              <p className="text-lg mb-1">{t('common.noToolsFor', { query })}</p>
              <p className="text-sm">{t('common.tryDifferentKeyword')}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
