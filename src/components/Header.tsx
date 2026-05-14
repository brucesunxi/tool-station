'use client'

import Link from 'next/link'
import { useState } from 'react'
import ThemeToggle from './ThemeToggle'
import NavDropdown from './NavDropdown'

const imageTools = [
  { label: 'Image Compress', href: '/tools/image-compress', icon: '🗜️' },
  { label: 'Image Resize', href: '/tools/image-crop', icon: '📐' },
  { label: 'Format Converter', href: '/tools/format-converter', icon: '🔄' },
]

const pdfTools = [
  { label: 'PDF Merge', href: '/tools/pdf-merge', icon: '📑' },
  { label: 'PDF to PPT', href: '/tools/pdf-to-ppt', icon: '📽️' },
  { label: 'Doc Converter', href: '/tools/doc-converter', icon: '📄' },
]

const aiTools = [
  { label: 'AI Summary', href: '/tools/ai-summary', icon: '🤖' },
  { label: 'AI Translator', href: '/tools/ai-translator', icon: '🌐' },
  { label: 'AI Rewriter', href: '/tools/ai-rewriter', icon: '✍️' },
  { label: 'AI Chat', href: '/tools/ai-assistant', icon: '💬' },
  { label: 'AI Grammar', href: '/tools/ai-grammar', icon: '✓' },
  { label: 'AI Email', href: '/tools/ai-email', icon: '✉️' },
  { label: 'AI Titles', href: '/tools/ai-title', icon: '🏷️' },
  { label: 'AI Keywords', href: '/tools/ai-keywords', icon: '🔑' },
  { label: 'AI Blog', href: '/tools/ai-blog', icon: '📝' },
  { label: 'AI Pros & Cons', href: '/tools/ai-pros-cons', icon: '⚖️' },
]

const devTools = [
  { label: 'AI Regex', href: '/tools/ai-regex', icon: '🔍' },
  { label: 'JSON Formatter', href: '/tools/json-formatter', icon: '{}' },
  { label: 'Base64', href: '/tools/base64', icon: '🔐' },
  { label: 'URL Encode', href: '/tools/url-encode', icon: '🌐' },
  { label: 'UUID Generator', href: '/tools/uuid-generator', icon: '🔢' },
  { label: 'Regex Tester', href: '/tools/regex-tester', icon: '🔍' },
  { label: 'Code Beautifier', href: '/tools/code-beautifier', icon: '✨' },
  { label: 'Word Counter', href: '/tools/word-counter', icon: '📝' },
  { label: 'Color Converter', href: '/tools/color-converter', icon: '🎨' },
]

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
            <Link href="/" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">
              All Tools
            </Link>
            <NavDropdown label="Image" items={imageTools} />
            <NavDropdown label="PDF" items={pdfTools} />
            <NavDropdown label="AI" items={aiTools} />
            <NavDropdown label="Dev" items={devTools} />
            <div className="pl-2 border-l border-gray-200 dark:border-gray-700">
              <ThemeToggle />
            </div>
          </nav>

          <div className="flex items-center gap-1 md:hidden">
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
            <Link href="/" className="block py-2 text-sm font-semibold">All Tools</Link>
            <div className="grid grid-cols-2 gap-1">
              <Link href="/tools/image-compress" className="block py-1.5 text-sm text-gray-600 dark:text-gray-300">🗜️ Image Compress</Link>
              <Link href="/tools/image-crop" className="block py-1.5 text-sm text-gray-600 dark:text-gray-300">📐 Image Resize</Link>
              <Link href="/tools/format-converter" className="block py-1.5 text-sm text-gray-600 dark:text-gray-300">🔄 Format Convert</Link>
              <Link href="/tools/pdf-merge" className="block py-1.5 text-sm text-gray-600 dark:text-gray-300">📑 PDF Merge</Link>
              <Link href="/tools/pdf-to-ppt" className="block py-1.5 text-sm text-gray-600 dark:text-gray-300">📽️ PDF to PPT</Link>
              <Link href="/tools/doc-converter" className="block py-1.5 text-sm text-gray-600 dark:text-gray-300">📄 Doc Convert</Link>
              <Link href="/tools/ai-summary" className="block py-1.5 text-sm text-gray-600 dark:text-gray-300">🤖 AI Summary</Link>
              <Link href="/tools/ai-translator" className="block py-1.5 text-sm text-gray-600 dark:text-gray-300">🌐 AI Translate</Link>
              <Link href="/tools/ai-rewriter" className="block py-1.5 text-sm text-gray-600 dark:text-gray-300">✍️ AI Rewriter</Link>
              <Link href="/tools/ai-assistant" className="block py-1.5 text-sm text-gray-600 dark:text-gray-300">💬 AI Chat</Link>
              <Link href="/tools/ai-grammar" className="block py-1.5 text-sm text-gray-600 dark:text-gray-300">✓ AI Grammar</Link>
              <Link href="/tools/ai-email" className="block py-1.5 text-sm text-gray-600 dark:text-gray-300">✉️ AI Email</Link>
              <Link href="/tools/ai-title" className="block py-1.5 text-sm text-gray-600 dark:text-gray-300">🏷️ AI Titles</Link>
              <Link href="/tools/ai-keywords" className="block py-1.5 text-sm text-gray-600 dark:text-gray-300">🔑 AI Keywords</Link>
              <Link href="/tools/json-formatter" className="block py-1.5 text-sm text-gray-600 dark:text-gray-300">{ } JSON</Link>
              <Link href="/tools/base64" className="block py-1.5 text-sm text-gray-600 dark:text-gray-300">🔐 Base64</Link>
              <Link href="/tools/url-encode" className="block py-1.5 text-sm text-gray-600 dark:text-gray-300">🌐 URL Encode</Link>
              <Link href="/tools/uuid-generator" className="block py-1.5 text-sm text-gray-600 dark:text-gray-300">🔢 UUID Gen</Link>
              <Link href="/tools/regex-tester" className="block py-1.5 text-sm text-gray-600 dark:text-gray-300">🔍 Regex</Link>
              <Link href="/tools/code-beautifier" className="block py-1.5 text-sm text-gray-600 dark:text-gray-300">✨ Code Beauty</Link>
              <Link href="/tools/word-counter" className="block py-1.5 text-sm text-gray-600 dark:text-gray-300">📝 Word Counter</Link>
              <Link href="/tools/color-converter" className="block py-1.5 text-sm text-gray-600 dark:text-gray-300">🎨 Color Convert</Link>
              <Link href="/tools/ai-blog" className="block py-1.5 text-sm text-gray-600 dark:text-gray-300">📝 AI Blog</Link>
              <Link href="/tools/ai-regex" className="block py-1.5 text-sm text-gray-600 dark:text-gray-300">🔍 AI Regex</Link>
              <Link href="/tools/ai-pros-cons" className="block py-1.5 text-sm text-gray-600 dark:text-gray-300">⚖️ AI Pros/Cons</Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
