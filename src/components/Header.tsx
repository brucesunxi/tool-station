'use client'

import { Link } from '@/i18n'
import { useTranslations } from 'next-intl'
import { useState, useMemo } from 'react'
import ThemeToggle from './ThemeToggle'
import NavDropdown from './NavDropdown'
import LocaleSwitcher from './LocaleSwitcher'
import { tools } from '@/lib/tools'

export default function Header() {
  const t = useTranslations('site')
  const navT = useTranslations('nav')
  const toolsT = useTranslations('tools')
  const [menuOpen, setMenuOpen] = useState(false)

  const getToolKey = (href: string) => href.replace('/tools/', '')
  const buildItems = (category: string) =>
    tools.filter(t => t.category === category).map(t => ({
      label: toolsT(`${getToolKey(t.href)}.title`),
      href: t.href,
      icon: t.icon,
    }))

  const imageTools = useMemo(() => buildItems('image'), [toolsT])
  const pdfTools = useMemo(() => buildItems('pdf'), [toolsT])
  const aiTools = useMemo(() => buildItems('ai'), [toolsT])
  const devTools = useMemo(() => buildItems('dev'), [toolsT])
  const textTools = useMemo(() => buildItems('text'), [toolsT])
  const colorTools = useMemo(() => buildItems('color'), [toolsT])

  return (
    <header className="border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <span className="font-bold text-xl">ToolStation</span>
          </Link>

          <nav className="hidden md:flex items-center gap-5">
            <Link href="/search" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">{t('search')}</Link>
            <Link href="/" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">{t('allTools')}</Link>
            <Link href="/bookmarks" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">{t('bookmarks')}</Link>
            <NavDropdown label={navT('image')} items={imageTools} />
            <NavDropdown label={navT('pdf')} items={pdfTools} />
            <NavDropdown label={navT('ai')} items={aiTools} />
            <NavDropdown label={navT('dev')} items={devTools} />
            <NavDropdown label={navT('text')} items={textTools} />
            <NavDropdown label={navT('color')} items={colorTools} />
            <div className="flex items-center gap-2 pl-2 border-l border-gray-200 dark:border-gray-700">
              <LocaleSwitcher />
              <ThemeToggle />
            </div>
          </nav>

          <div className="flex items-center gap-1 md:hidden">
            <LocaleSwitcher />
            <ThemeToggle />
            <button
              className="p-2"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-4 space-y-1">
            <Link href="/search" className="block py-2 text-sm font-semibold text-blue-600">{t('search')}</Link>
            <Link href="/" className="block py-2 text-sm font-semibold">{t('allTools')}</Link>
            <Link href="/bookmarks" className="block py-2 text-sm font-semibold">{t('bookmarks')}</Link>
            <div className="grid grid-cols-2 gap-1">
              {tools.map(t => (
                <Link key={t.href} href={t.href} className="block py-1.5 text-sm text-gray-600 dark:text-gray-300">{t.icon} {toolsT(`${getToolKey(t.href)}.title`)}</Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
