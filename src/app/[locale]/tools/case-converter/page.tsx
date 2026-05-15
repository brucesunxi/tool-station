'use client'

import { useState } from 'react'
import AdBanner from '@/components/AdBanner'

type CaseType = 'upper' | 'lower' | 'title' | 'sentence' | 'camel' | 'pascal' | 'snake' | 'kebab' | 'constant' | 'alternating' | 'inverse' | 'capitalize'

interface CaseOption { value: CaseType; label: string; icon: string }

const cases: CaseOption[] = [
  { value: 'upper', label: 'UPPER CASE', icon: 'AA' },
  { value: 'lower', label: 'lower case', icon: 'aa' },
  { value: 'title', label: 'Title Case', icon: 'Aa' },
  { value: 'sentence', label: 'Sentence case', icon: 'A.' },
  { value: 'camel', label: 'camelCase', icon: 'aA' },
  { value: 'pascal', label: 'PascalCase', icon: 'AA' },
  { value: 'snake', label: 'snake_case', icon: 'a_a' },
  { value: 'kebab', label: 'kebab-case', icon: 'a-a' },
  { value: 'constant', label: 'CONSTANT_CASE', icon: 'A_A' },
  { value: 'alternating', label: 'aLtErNaTiNg', icon: 'aA' },
  { value: 'inverse', label: 'InVeRsE CaSe', icon: 'Aa' },
]

function applyCase(text: string, type: CaseType): string {
  const words = text.split(/(\s+)/)
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
        <h1 className="text-3xl font-bold mb-2">Case Converter</h1>
        <p className="text-gray-500">Convert text between uppercase, lowercase, title case, camelCase, snake_case, and more.</p>
      </div>
      <AdBanner className="mb-8 h-20" />

      <textarea value={text} onChange={e => setText(e.target.value)} rows={8}
        placeholder="Type or paste text to convert..."
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
            <span className="text-xs font-medium text-gray-500">Result</span>
            <button onClick={handleCopy} className="text-xs px-2 py-1 border rounded hover:bg-white dark:hover:bg-gray-700 transition-colors">
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <p className="text-sm break-all">{result}</p>
        </div>
      )}

      <section className="mt-12 pt-8 border-t prose dark:prose-invert max-w-none">
        <h2>How to Use</h2>
        <ol>
          <li>Type or paste your text into the input text area.</li>
          <li>Click any case format button to apply it &mdash; the result appears instantly below.</li>
          <li>Review the converted text in the green result box.</li>
          <li>Click <strong>Copy</strong> to copy the result to your clipboard.</li>
          <li>Continue editing your text and switching between cases as needed.</li>
          <li>Paste the result into your document, code editor, or application.</li>
        </ol>
        <h2>Tips</h2>
        <ul>
          <li><strong>camelCase</strong> and <strong>PascalCase</strong> are commonly used for programming variable and class names.</li>
          <li><strong>snake_case</strong> and <strong>CONSTANT_CASE</strong> are popular in Python and database column naming conventions.</li>
          <li><strong>Title Case</strong> is ideal for headlines, article titles, and document headings.</li>
          <li><strong>Alternating</strong> and <strong>Inverse</strong> cases are primarily decorative &mdash; use them sparingly.</li>
        </ul>
        <h2>FAQ</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">Does the tool work with special characters and numbers?</h3>
            <p>Yes, special characters and numbers are preserved in most case modes. camelCase and PascalCase strip non-alphanumeric characters during conversion.</p>
          </div>
          <div>
            <h3 className="font-semibold">Is my text sent to a server?</h3>
            <p>No, all text processing happens locally in your browser. Nothing is transmitted over the network.</p>
          </div>
          <div>
            <h3 className="font-semibold">What is the difference between camelCase and PascalCase?</h3>
            <p>camelCase starts with a lowercase letter (e.g., &quot;myVariable&quot;), while PascalCase starts with an uppercase letter (e.g., &quot;MyVariable&quot;).</p>
          </div>
          <div>
            <h3 className="font-semibold">Is there a character limit?</h3>
            <p>There is no character limit &mdash; the tool runs entirely in your browser with no restrictions on text length.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
