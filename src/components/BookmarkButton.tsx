'use client'

import { useState, useEffect } from 'react'

export interface BookmarkItem {
  href: string
  title: string
  icon: string
  category: string
}

const STORAGE_KEY = 'toolstation_bookmarks'

function getBookmarks(): BookmarkItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

function setBookmarks(items: BookmarkItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch { /* ignore */ }
}

function isBookmarked(href: string): boolean {
  return getBookmarks().some(b => b.href === href)
}

function toggleBookmark(item: BookmarkItem): boolean {
  const bookmarks = getBookmarks()
  const idx = bookmarks.findIndex(b => b.href === item.href)
  if (idx >= 0) {
    bookmarks.splice(idx, 1)
    setBookmarks(bookmarks)
    return false
  } else {
    bookmarks.unshift(item)
    setBookmarks(bookmarks)
    return true
  }
}

export { getBookmarks, isBookmarked }

interface BookmarkButtonProps {
  href: string
  title: string
  icon: string
  category: string
}

export default function BookmarkButton({ href, title, icon, category }: BookmarkButtonProps) {
  const [bookmarked, setBookmarked] = useState(false)

  useEffect(() => {
    setBookmarked(isBookmarked(href))
  }, [href])

  const handleToggle = () => {
    const now = toggleBookmark({ href, title, icon, category })
    setBookmarked(now)
  }

  return (
    <button onClick={handleToggle}
      className={`p-2 rounded-lg border transition-colors ${
        bookmarked
          ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 text-yellow-500'
          : 'hover:bg-gray-50 dark:hover:bg-gray-800'
      }`}
      title={bookmarked ? 'Remove bookmark' : 'Bookmark this tool'}
    >
      <svg className="w-5 h-5" fill={bookmarked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
      </svg>
    </button>
  )
}
