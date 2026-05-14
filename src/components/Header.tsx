'use client'

import Link from 'next/link'
import { useState } from 'react'
import ThemeToggle from './ThemeToggle'

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
            <Link href="/" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300">All Tools</Link>
            <Link href="/tools/image-crop" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300">Crop</Link>
            <Link href="/tools/image-compress" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300">Image</Link>
            <Link href="/tools/doc-converter" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300">Doc</Link>
            <Link href="/tools/format-converter" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300">Convert</Link>
            <Link href="/tools/pdf-merge" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300">PDF</Link>
            <Link href="/tools/pdf-to-ppt" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300">PPT</Link>
            <Link href="/tools/ai-summary" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300">Summary</Link>
            <Link href="/tools/ai-translator" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300">Translate</Link>
            <Link href="/tools/ai-rewriter" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300">Rewrite</Link>
            <Link href="/tools/ai-assistant" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300">Chat</Link>
            <Link href="/tools/word-counter" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300">Words</Link>
            <Link href="/tools/uuid-generator" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300">UUID</Link>
            <Link href="/tools/regex-tester" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300">Regex</Link>
          </nav>

          <div className="flex items-center gap-1">
            <div className="hidden md:block">
              <ThemeToggle />
            </div>
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
        </div>

        {menuOpen && (
          <div className="md:hidden pb-4 space-y-1">
            <div className="flex items-center justify-between">
              <Link href="/" className="block py-2 text-sm font-semibold">All Tools</Link>
              <ThemeToggle />
            </div>
            <div className="grid grid-cols-2 gap-1">
              <Link href="/tools/image-crop" className="block py-1.5 text-sm text-gray-600 dark:text-gray-300">📐 Image Resize</Link>
              <Link href="/tools/image-compress" className="block py-1.5 text-sm text-gray-600 dark:text-gray-300">🗜️ Image Compress</Link>
              <Link href="/tools/doc-converter" className="block py-1.5 text-sm text-gray-600 dark:text-gray-300">📄 Doc Convert</Link>
              <Link href="/tools/format-converter" className="block py-1.5 text-sm text-gray-600 dark:text-gray-300">🔄 Format Convert</Link>
              <Link href="/tools/pdf-merge" className="block py-1.5 text-sm text-gray-600 dark:text-gray-300">📄 PDF Merger</Link>
              <Link href="/tools/pdf-to-ppt" className="block py-1.5 text-sm text-gray-600 dark:text-gray-300">📽️ PDF to PPT</Link>
              <Link href="/tools/ai-summary" className="block py-1.5 text-sm text-gray-600 dark:text-gray-300">🤖 AI Summary</Link>
              <Link href="/tools/ai-translator" className="block py-1.5 text-sm text-gray-600 dark:text-gray-300">🌐 AI Translate</Link>
              <Link href="/tools/ai-rewriter" className="block py-1.5 text-sm text-gray-600 dark:text-gray-300">✍️ AI Rewriter</Link>
              <Link href="/tools/ai-assistant" className="block py-1.5 text-sm text-gray-600 dark:text-gray-300">💬 AI Chat</Link>
              <Link href="/tools/word-counter" className="block py-1.5 text-sm text-gray-600 dark:text-gray-300">📝 Word Counter</Link>
              <Link href="/tools/json-formatter" className="block py-1.5 text-sm text-gray-600 dark:text-gray-300">{ } JSON</Link>
              <Link href="/tools/base64" className="block py-1.5 text-sm text-gray-600 dark:text-gray-300">🔐 Base64</Link>
              <Link href="/tools/url-encode" className="block py-1.5 text-sm text-gray-600 dark:text-gray-300">🌐 URL Encode</Link>
              <Link href="/tools/color-converter" className="block py-1.5 text-sm text-gray-600 dark:text-gray-300">🎨 Color Convert</Link>
              <Link href="/tools/uuid-generator" className="block py-1.5 text-sm text-gray-600 dark:text-gray-300">🔢 UUID Gen</Link>
              <Link href="/tools/regex-tester" className="block py-1.5 text-sm text-gray-600 dark:text-gray-300">🔍 Regex</Link>
              <Link href="/tools/code-beautifier" className="block py-1.5 text-sm text-gray-600 dark:text-gray-300">✨ Code Beauty</Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
