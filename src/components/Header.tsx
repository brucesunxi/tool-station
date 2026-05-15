'use client'

import Link from 'next/link'
import { useState } from 'react'
import ThemeToggle from './ThemeToggle'
import NavDropdown from './NavDropdown'
import LocaleSwitcher from './LocaleSwitcher'
import { tools } from '@/lib/tools'

const imageTools = tools.filter(t => t.category === 'image').map(t => ({ label: t.title, href: t.href, icon: t.icon }))
const pdfTools = tools.filter(t => t.category === 'pdf').map(t => ({ label: t.title, href: t.href, icon: t.icon }))
const aiTools = tools.filter(t => t.category === 'ai').map(t => ({ label: t.title.replace('AI ', ''), href: t.href, icon: t.icon }))
const devTools = tools.filter(t => t.category === 'dev').map(t => ({ label: t.title, href: t.href, icon: t.icon }))
const textTools = tools.filter(t => t.category === 'text').map(t => ({ label: t.title, href: t.href, icon: t.icon }))
const colorTools = tools.filter(t => t.category === 'color').map(t => ({ label: t.title, href: t.href, icon: t.icon }))

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

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
            <Link href="/search" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">Search</Link>
            <Link href="/" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">All Tools</Link>
            <NavDropdown label="Image" items={imageTools} />
            <NavDropdown label="PDF" items={pdfTools} />
            <NavDropdown label="AI" items={aiTools} />
            <NavDropdown label="Dev" items={devTools} />
            <NavDropdown label="Text" items={textTools} />
            <NavDropdown label="Color" items={colorTools} />
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
            <Link href="/search" className="block py-2 text-sm font-semibold text-blue-600">Search Tools</Link>
            <Link href="/" className="block py-2 text-sm font-semibold">All Tools</Link>
            <div className="grid grid-cols-2 gap-1">
              {tools.map(t => (
                <Link key={t.href} href={t.href} className="block py-1.5 text-sm text-gray-600 dark:text-gray-300">{t.icon} {t.title}</Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
