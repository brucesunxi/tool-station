'use client'

import { usePathname } from 'next/navigation'
import { tools } from '@/lib/tools'
import ShareButton from './ShareButton'
import BookmarkButton from './BookmarkButton'

export default function ToolActionBar() {
  const pathname = usePathname()

  // Only show on tool pages
  if (!pathname?.includes('/tools/')) return null

  // Find the tool data for the current page
  const tool = tools.find(t => pathname.includes(t.href))

  if (!tool) return null

  return (
    <>
      {/* Floating desktop bar */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-30 hidden lg:flex flex-col gap-2">
        <ShareButton title={tool.title} description={tool.description} />
        <BookmarkButton
          href={tool.href}
          title={tool.title}
          icon={tool.icon}
          category={tool.category}
        />
      </div>

      {/* Mobile inline bar */}
      <div className="lg:hidden flex items-center justify-end gap-2 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
        <ShareButton title={tool.title} description={tool.description} />
        <BookmarkButton
          href={tool.href}
          title={tool.title}
          icon={tool.icon}
          category={tool.category}
        />
      </div>
    </>
  )
}
