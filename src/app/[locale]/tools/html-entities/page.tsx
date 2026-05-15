'use client'

import { useTranslations } from 'next-intl'
import { useState, useMemo } from 'react'
import AdBanner from '@/components/AdBanner'

const ENTITY_MAP: Record<string, string> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&apos;': "'",
  '&nbsp;': ' ',
  '&copy;': '©',
  '&reg;': '®',
  '&trade;': '™',
  '&euro;': '€',
  '&pound;': '£',
  '&yen;': '¥',
  '&cent;': '¢',
  '&sect;': '§',
  '&deg;': '°',
  '&plusmn;': '±',
  '&micro;': 'µ',
  '&para;': '¶',
  '&middot;': '·',
  '&frac12;': '½',
  '&frac14;': '¼',
  '&frac34;': '¾',
  '&times;': '×',
  '&divide;': '÷',
}

const REVERSE_MAP: Record<string, string> = {}
for (const [entity, char] of Object.entries(ENTITY_MAP)) {
  REVERSE_MAP[char] = entity
}

function encodeEntities(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function decodeEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&copy;/g, '©')
    .replace(/&reg;/g, '®')
    .replace(/&trade;/g, '™')
    .replace(/&euro;/g, '€')
    .replace(/&pound;/g, '£')
    .replace(/&yen;/g, '¥')
    .replace(/&cent;/g, '¢')
    .replace(/&sect;/g, '§')
    .replace(/&deg;/g, '°')
    .replace(/&plusmn;/g, '±')
    .replace(/&micro;/g, 'µ')
    .replace(/&para;/g, '¶')
    .replace(/&middot;/g, '·')
    .replace(/&frac12;/g, '½')
    .replace(/&frac14;/g, '¼')
    .replace(/&frac34;/g, '¾')
    .replace(/&times;/g, '×')
    .replace(/&divide;/g, '÷')
}

const REFERENCE_CHARS = [
  { char: '&', entity: '&amp;', name: 'Ampersand' },
  { char: '<', entity: '&lt;', name: 'Less than' },
  { char: '>', entity: '&gt;', name: 'Greater than' },
  { char: '"', entity: '&quot;', name: 'Double quote' },
  { char: "'", entity: '&#39;', name: 'Single quote / Apostrophe' },
  { char: ' ', entity: '&nbsp;', name: 'Non-breaking space' },
  { char: '©', entity: '&copy;', name: 'Copyright' },
  { char: '®', entity: '&reg;', name: 'Registered trademark' },
  { char: '™', entity: '&trade;', name: 'Trademark' },
  { char: '€', entity: '&euro;', name: 'Euro' },
  { char: '£', entity: '&pound;', name: 'Pound' },
  { char: '¥', entity: '&yen;', name: 'Yen' },
  { char: '¢', entity: '&cent;', name: 'Cent' },
  { char: '§', entity: '&sect;', name: 'Section' },
  { char: '°', entity: '&deg;', name: 'Degree' },
  { char: '±', entity: '&plusmn;', name: 'Plus-minus' },
  { char: 'µ', entity: '&micro;', name: 'Micro' },
  { char: '¶', entity: '&para;', name: 'Pilcrow / Paragraph' },
  { char: '·', entity: '&middot;', name: 'Middle dot' },
  { char: '½', entity: '&frac12;', name: 'One-half' },
  { char: '¼', entity: '&frac14;', name: 'One-quarter' },
  { char: '¾', entity: '&frac34;', name: 'Three-quarters' },
  { char: '×', entity: '&times;', name: 'Multiplication' },
  { char: '÷', entity: '&divide;', name: 'Division' },
]

export default function HtmlEntitiesPage() {
  const t = useTranslations('tools.html-entities')
  const ct = useTranslations('common')

  const [input, setInput] = useState('<div class="hello">Hello & welcome</div>')
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')

  const output = useMemo(() => {
    return mode === 'encode'
      ? encodeEntities(decodeEntities(input))
      : decodeEntities(input)
  }, [input, mode])

  const [inputCopied, setInputCopied] = useState(false)
  const [outputCopied, setOutputCopied] = useState(false)

  const copyInput = () => {
    navigator.clipboard.writeText(input).then(() => {
      setInputCopied(true)
      setTimeout(() => setInputCopied(false), 2000)
    })
  }

  const copyOutput = () => {
    navigator.clipboard.writeText(output).then(() => {
      setOutputCopied(true)
      setTimeout(() => setOutputCopied(false), 2000)
    })
  }

  const handleSwap = () => {
    setInput(output)
    setMode(mode === 'encode' ? 'decode' : 'encode')
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-2">{t('h1')}</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">{t('description')}</p>

      <AdBanner className="mb-8 h-20" />

      <div className="bg-white dark:bg-gray-800 border rounded-xl p-6 mb-8 space-y-6">
        {/* Mode Toggle */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMode('encode')}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${
              mode === 'encode'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
            }`}
          >
            Encode
          </button>
          <button
            onClick={() => setMode('decode')}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${
              mode === 'decode'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
            }`}
          >
            Decode
          </button>
          <span className="text-xs text-gray-500">
            {mode === 'encode' ? 'Convert special chars to HTML entities' : 'Convert HTML entities back to characters'}
          </span>
        </div>

        {/* Input */}
        <div>
          <label className="block text-sm font-medium mb-2">{ct("input")}</label>
          <div className="relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={5}
              className="w-full px-4 py-3 border rounded-lg font-mono text-sm dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
              placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter HTML entities to decode...'}
            />
            <button
              onClick={copyInput}
              className="absolute top-2 right-2 px-2 py-1 text-xs rounded bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500"
            >
              {inputCopied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Swap & Result */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleSwap}
            className="text-sm px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
            title="Swap input and output"
          >
            Swap &larr;&rarr;
          </button>
          <span className="text-xs text-gray-400">
            Character count: {input.length} &rarr; {output.length}
          </span>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Output ({mode === 'encode' ? 'Encoded' : 'Decoded'})
          </label>
          <div className="relative">
            <textarea
              value={output}
              readOnly
              rows={5}
              className="w-full px-4 py-3 border rounded-lg font-mono text-sm bg-gray-50 dark:bg-gray-900 dark:border-gray-600 resize-y"
            />
            <button
              onClick={copyOutput}
              className="absolute top-2 right-2 px-2 py-1 text-xs rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              {outputCopied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
      </div>

      {/* Reference Table */}
      <div className="bg-white dark:bg-gray-800 border rounded-xl p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">Common HTML Entities Reference</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 pr-4">Character</th>
                <th className="text-left py-2 pr-4">Entity</th>
                <th className="text-left py-2">Name</th>
              </tr>
            </thead>
            <tbody>
              {REFERENCE_CHARS.map(({ char, entity, name }) => (
                <tr key={entity} className="border-b dark:border-gray-700 last:border-0">
                  <td className="py-2 pr-4 text-lg">
                    {char === ' ' ? (
                      <span className="text-gray-400">[space]</span>
                    ) : (
                      char
                    )}
                  </td>
                  <td className="py-2 pr-4 font-mono text-blue-600 dark:text-blue-400">
                    {entity}
                  </td>
                  <td className="py-2 text-gray-600 dark:text-gray-400">{name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <section className="prose dark:prose-invert max-w-none">
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
