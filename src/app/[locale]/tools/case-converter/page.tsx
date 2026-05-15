'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'
import AdBanner from '@/components/AdBanner'

type CaseType = 'upper' | 'lower' | 'title' | 'sentence' | 'camel' | 'pascal' | 'snake' | 'kebab' | 'constant' | 'alternating' | 'inverse' | 'capitalize'

interface CaseOption { value: CaseType; label: string; icon: string }

function applyCase(text: string, type: CaseType): string {
  switch (type) {
    case 'upper': return text.toUpperCase()
    case 'lower': return text.toLowerCase()
    case 'title': return text.replace(/\w\S*/g, w => w[0].toUpperCase() + w.slice(1).toLowerCase())
    case 'sentence': return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
    case 'camel': {
      const cleaned = text.replace(/[^a-zA-Z0-9]+/g, ' ').trim().toLowerCase().split(/\s+/)
      return cleaned[0] + cleaned.slice(1).map(w => w[0].toUpperCase() + w.slice(1)).join('')
    }
    case 'pascal': return text.replace(/[^a-zA-Z0-9]+/g, ' ').trim().split(/\s+/).map(w => w[0].toUpperCase() + w.slice(1).toLowerCase()).join('')
    case 'snake': return text.replace(/[^a-zA-Z0-9]+/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '').toLowerCase()
    case 'kebab': return text.replace(/[^a-zA-Z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').toLowerCase()
    case 'constant': return text.replace(/[^a-zA-Z0-9]+/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '').toUpperCase()
    case 'alternating': return text.split('').map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join('')
    case 'inverse': return text.split('').map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join('')
    default: return text
  }
}

export default function CaseConverterPage() {
  const t = useTranslations('tools.case-converter')
  const ct = useTranslations('common')

  const cases: CaseOption[] = [
    { value: 'upper', label: ct('caseUpper'), icon: 'AA' },
    { value: 'lower', label: ct('caseLower'), icon: 'aa' },
    { value: 'title', label: ct('caseTitle'), icon: 'Aa' },
    { value: 'sentence', label: ct('caseSentence'), icon: 'A.' },
    { value: 'camel', label: ct('caseCamel'), icon: 'aA' },
    { value: 'pascal', label: ct('casePascal'), icon: 'AA' },
    { value: 'snake', label: ct('caseSnake'), icon: 'a_a' },
    { value: 'kebab', label: ct('caseKebab'), icon: 'a-a' },
    { value: 'constant', label: ct('caseConstant'), icon: 'A_A' },
    { value: 'alternating', label: ct('caseAlternating'), icon: 'aA' },
    { value: 'inverse', label: ct('caseInverse'), icon: 'Aa' },
  ]

  const [text, setText] = useState('')
  const [activeCase, setActiveCase] = useState<CaseType>('lower')
  const [copied, setCopied] = useState(false)

  const result = text ? applyCase(text, activeCase) : ''

  const handleCopy = () => {
    navigator.clipboard.writeText(result).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('h1')}</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{t('description')}</p>
      </div>
      <AdBanner className="mb-8 h-20" />

      <textarea value={text} onChange={e => setText(e.target.value)} rows={8}
        placeholder={ct("pasteHere")}
        className="w-full p-4 border rounded-xl resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm dark:bg-gray-800 dark:border-gray-700 mb-4"
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-4">
        {cases.map(c => (
          <button key={c.value} onClick={() => setActiveCase(c.value)}
            className={`p-3 rounded-lg border text-center text-sm transition-all ${
              activeCase === c.value ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-200' : 'hover:border-blue-300'
            }`}>
            <p className="font-mono text-xs mb-0.5">{c.icon}</p>
            <p className="text-xs">{c.label}</p>
          </button>
        ))}
      </div>

      {result && (
        <div className="p-4 border rounded-xl bg-green-50/50 dark:bg-green-900/10 dark:border-green-900/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-500">{ct("result")}</span>
            <button onClick={handleCopy} className="text-xs px-2 py-1 border rounded hover:bg-white dark:hover:bg-gray-700 transition-colors">
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <p className="text-sm break-all">{result}</p>
        </div>
      )}

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
