'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { getBookmarks, type BookmarkItem } from '@/components/BookmarkButton'

export default function BookmarksPage() {
  const ct = useTranslations('common')
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([])

  useEffect(() => {
    setBookmarks(getBookmarks())
  }, [])

  const remove = (href: string) => {
    const updated = bookmarks.filter(b => b.href !== href)
    setBookmarks(updated)
    try {
      localStorage.setItem('toolstation_bookmarks', JSON.stringify(updated))
    } catch { /* ignore */ }
  }

  const categoryColors: Record<string, string> = {
    image: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    pdf: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
    ai: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    dev: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    text: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
    color: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{ct('bookmarksTitle')}</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{ct('bookmarksDesc')}</p>
      </div>

      {bookmarks.length === 0 ? (
        <div className="text-center py-16 border rounded-xl">
          <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          <p className="text-lg font-medium mb-1">{ct('noBookmarks')}</p>
          <p className="text-sm text-gray-400">{ct('noBookmarksHint')}</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {bookmarks.map((b, i) => (
            <div key={i}
              className="flex items-center gap-3 p-4 border rounded-xl hover:border-blue-300 transition-colors group">
              <Link href={b.href} className="flex items-center gap-3 flex-1 min-w-0">
                <span className="text-2xl shrink-0">{b.icon}</span>
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate">{b.title}</p>
                  <span className={`inline-block text-[10px] px-1.5 py-0.5 rounded-full mt-0.5 ${categoryColors[b.category] || 'bg-gray-100'}`}>
                    {b.category}
                  </span>
                </div>
              </Link>
              <button onClick={() => remove(b.href)}
                className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                title={ct('removeBookmark')}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
