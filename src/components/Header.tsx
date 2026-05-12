'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <span className="font-bold text-xl">ToolStation</span>
          </Link>

          <nav className="hidden md:flex items-center gap-4">
            <Link href="/" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300">
              All Tools
            </Link>
            <Link href="/tools/image-compress" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300">
              Image
            </Link>
            <Link href="/tools/format-converter" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300">
              Convert
            </Link>
            <Link href="/tools/pdf-merge" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300">
              PDF
            </Link>
            <Link href="/tools/ai-summary" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300">
              AI
            </Link>
            <Link href="/tools/word-counter" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300">
              Words
            </Link>
            <Link href="/tools/json-formatter" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300">
              JSON
            </Link>
          </nav>

          <button
            className="md:hidden p-2"
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

        {menuOpen && (
          <div className="md:hidden pb-4 space-y-1">
            <Link href="/" className="block py-2 text-sm text-gray-600">All Tools</Link>
            <Link href="/tools/image-compress" className="block py-2 text-sm text-gray-600">Image Compress</Link>
            <Link href="/tools/format-converter" className="block py-2 text-sm text-gray-600">Format Converter</Link>
            <Link href="/tools/pdf-merge" className="block py-2 text-sm text-gray-600">PDF Merger</Link>
            <Link href="/tools/ai-summary" className="block py-2 text-sm text-gray-600">AI Summary</Link>
            <Link href="/tools/word-counter" className="block py-2 text-sm text-gray-600">Word Counter</Link>
            <Link href="/tools/json-formatter" className="block py-2 text-sm text-gray-600">JSON Formatter</Link>
          </div>
        )}
      </div>
    </header>
  )
}
