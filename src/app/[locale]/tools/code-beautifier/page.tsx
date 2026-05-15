'use client'

import { useTranslations } from 'next-intl'
import { useState, useCallback } from 'react'
import AdBanner from '@/components/AdBanner'

type Lang = 'html' | 'css' | 'javascript'

const langNames: Record<Lang, string> = {
  html: 'HTML',
  css: 'CSS',
  javascript: 'JavaScript',
}

function beautifyHtml(code: string): string {
  let result = ''
  let indent = 0
  const lines = code.replace(/>\s*</g, '>\n<').split('\n')
  const selfClosing = /^(<br|img|hr|input|meta|link|area|base|col|embed|source|track|wbr)/i

  for (let line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue

    // Closing tag decreases indent
    if (trimmed.startsWith('</')) {
      indent = Math.max(0, indent - 1)
    }

    result += '  '.repeat(indent) + trimmed + '\n'

    // Opening tag (not self-closing) increases indent
    if (trimmed.startsWith('<') && !trimmed.startsWith('</') && !trimmed.endsWith('/>') && !selfClosing.test(trimmed)) {
      indent++
    }
  }
  return result.trim()
}

function beautifyCss(code: string): string {
  let result = ''
  let indent = 0
  const lines = code
    .replace(/{/g, '{\n')
    .replace(/}/g, '\n}')
    .replace(/;/g, ';\n')
    .split('\n')

  for (let line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue

    if (trimmed.startsWith('}')) indent = Math.max(0, indent - 1)

    result += '  '.repeat(indent) + trimmed + '\n'

    if (trimmed.endsWith('{')) indent++
  }
  return result.trim()
}

function beautifyJs(code: string): string {
  let result = ''
  let indent = 0
  const lines = code
    .replace(/([{])/g, '$1\n')
    .replace(/([}])/g, '\n$1')
    .replace(/;/g, ';\n')
    .split('\n')

  for (let line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue

    if (trimmed.startsWith('}') || trimmed.startsWith(']')) indent = Math.max(0, indent - 1)

    result += '  '.repeat(indent) + trimmed + '\n'

    if (trimmed.endsWith('{') || trimmed.endsWith('[')) indent++
  }
  return result.trim()
}

export default function CodeBeautifierPage() {
  const t = useTranslations('tools.code-beautifier')
  const ct = useTranslations('common')

  const [input, setInput] = useState('<div class="container">\n  <h1>Page Title</h1>\n  <p>This is a paragraph.</p>\n</div>')
  const [output, setOutput] = useState('')
  const [lang, setLang] = useState<Lang>('html')
  const [copyText, setCopyText] = useState('Copy')

  const handleFormat = useCallback(() => {
    try {
      let result = ''
      switch (lang) {
        case 'html': result = beautifyHtml(input); break
        case 'css': result = beautifyCss(input); break
        case 'javascript': result = beautifyJs(input); break
      }
      setOutput(result)
    } catch { setOutput('Error formatting code') }
  }, [input, lang])

  const handleMinify = useCallback(() => {
    const result = input
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\/\/.*$/gm, '')
      .replace(/>\s+</g, '><')
      .replace(/\s{2,}/g, ' ')
      .replace(/\n\s*/g, '')
      .replace(/\s*{\s*/g, '{')
      .replace(/\s*}\s*/g, '}')
      .replace(/\s*;\s*/g, ';')
      .replace(/\s*:\s*/g, ':')
      .replace(/\s*,\s*/g, ',')
      .trim()
    setOutput(result)
  }, [input])

  const handleCopy = async () => {
    if (!output) return
    try { await navigator.clipboard.writeText(output); setCopyText('Copied!'); setTimeout(() => setCopyText('Copy'), 2000) } catch { /* */ }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('h1')}</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{t('description')}</p>
      </div>
      <AdBanner className="mb-8 h-20" />

      <div className="flex gap-2 mb-4">
        {(Object.entries(langNames) as [Lang, string][]).map(([key, label]) => (
          <button key={key} onClick={() => setLang(key)}
            className={`px-4 py-2 rounded-lg border text-sm transition-all ${lang === key ? 'bg-blue-600 text-white border-blue-600' : 'hover:border-blue-400'}`}>{label}</button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-2 block">{ct("input")}</label>
          <textarea value={input} onChange={e => setInput(e.target.value)} rows={14}
            className="w-full p-4 border rounded-xl resize-y text-sm font-mono dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">{ct("output")}</label>
            {output && <button onClick={handleCopy} className="text-xs px-2 py-1 border rounded hover:bg-gray-50 dark:hover:bg-gray-800">{copyText}</button>}
          </div>
          <textarea value={output} readOnly rows={14}
            className="w-full p-4 border rounded-xl resize-y text-sm font-mono bg-gray-50 dark:bg-gray-800 dark:border-gray-700" placeholder="Formatted code..." />
        </div>
      </div>

      <div className="flex gap-3 mt-4">
        <button onClick={handleFormat} className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Beautify</button>
        <button onClick={handleMinify} className="px-6 py-2.5 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">{ct("minify")}</button>
        <button onClick={() => { setInput(''); setOutput('') }} className="px-6 py-2.5 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">{ct("clear")}</button>
      </div>

      {/* SEO Content */}
      <section className="mt-12 pt-8 border-t prose dark:prose-invert max-w-none">
        <h2>{t('howto.heading')}</h2>
        <ol>
          {(t.raw('howto.steps') as string[]).map((step, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: step }} />
          ))}
        </ol>
        <h2>{t('tips.heading')}</h2>
        <ul>
          {(t.raw('tips.items') as string[]).map((item, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
          ))}
        </ul>
        <h2>{t('faq.heading')}</h2>
        <div className="space-y-4">
          {(t.raw('faq.items') as { q: string; a: string }[]).map((item, i) => (
            <div key={i}>
              <h3 className="font-semibold">{item.q}</h3>
              <p>{item.a}</p>
            </div>
          ))}
        </div></section>
    </div>
  )
}
