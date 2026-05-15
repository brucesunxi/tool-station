'use client'

import { useTranslations } from 'next-intl'
import { useState, useCallback } from 'react'
import AdBanner from '@/components/AdBanner'

type Mode = 'paragraphs' | 'words' | 'sentences'

const LOREM_WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'ut', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'ut', 'aliquip', 'ex', 'ea',
  'commodo', 'consequat', 'duis', 'aute', 'irure', 'dolor', 'in', 'reprehenderit',
  'in', 'voluptate', 'velit', 'esse', 'cillum', 'dolore', 'eu', 'fugiat', 'nulla',
  'pariatur', 'excepteur', 'sint', 'occaecat', 'cupidatat', 'non', 'proident',
  'sunt', 'in', 'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim', 'id',
  'est', 'laborum', 'et', 'harum', 'quidem', 'rerum', 'facilis', 'est', 'et',
  'expedita', 'distinctio', 'nam', 'libero', 'tempore', 'cum', 'soluta', 'nobis',
  'est', 'eligendi', 'optio', 'cumque', 'nihil', 'impedit', 'quo', 'minus', 'id',
  'quod', 'maxime', 'placeat', 'facere', 'possimus', 'omnis', 'voluptas', 'assumenda',
  'est', 'omnis', 'dolor', 'repellendus', 'temporibus', 'autem', 'quibusdam', 'et',
  'aut', 'officiis', 'debitis', 'aut', 'rerum', 'necessitatibus', 'saepe', 'eveniet'
]

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function randomWord(): string {
  return LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]
}

function generateWords(count: number): string {
  const words: string[] = []
  for (let i = 0; i < count; i++) {
    words.push(randomWord())
  }
  return words.join(' ')
}

function generateSentence(): string {
  const len = 5 + Math.floor(Math.random() * 15)
  const words = generateWords(len)
  return capitalize(words) + '.'
}

function generateSentences(count: number): string {
  const sents: string[] = []
  for (let i = 0; i < count; i++) {
    sents.push(generateSentence())
  }
  return sents.join(' ')
}

function generateParagraph(): string {
  const sentCount = 3 + Math.floor(Math.random() * 7)
  return generateSentences(sentCount)
}

function generateParagraphs(count: number): string[] {
  const paras: string[] = []
  for (let i = 0; i < count; i++) {
    paras.push(generateParagraph())
  }
  return paras
}

export default function LoremIpsumPage() {
  const t = useTranslations('tools.lorem-ipsum')
  const ct = useTranslations('common')

  const [mode, setMode] = useState<Mode>('paragraphs')
  const [count, setCount] = useState<number>(3)
  const [output, setOutput] = useState<string>('')
  const [copied, setCopied] = useState(false)

  const generate = useCallback(() => {
    switch (mode) {
      case 'paragraphs': {
        const paras = generateParagraphs(count)
        setOutput(paras.join('\n\n'))
        break
      }
      case 'words': {
        setOutput(generateWords(count))
        break
      }
      case 'sentences': {
        setOutput(generateSentences(count))
        break
      }
    }
    setCopied(false)
  }, [mode, count])

  const copyToClipboard = async () => {
    if (!output) return
    try {
      await navigator.clipboard.writeText(output)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback
      const ta = document.createElement('textarea')
      ta.value = output
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-2">{t('h1')}</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">{t('description')}</p>
      <AdBanner className="mb-8 h-20" />

      <div className="bg-white dark:bg-gray-800 border rounded-xl p-6 mb-8">
        <div className="flex gap-2 mb-6">
          {[
            { value: 'paragraphs' as Mode, label: ct('paragraphsLabel') },
            { value: 'words' as Mode, label: ct('wordCountLabel') },
            { value: 'sentences' as Mode, label: ct('sentencesLabel') },
          ].map(m => (
            <button key={m.value} onClick={() => setMode(m.value)}
              className={`flex-1 p-2.5 rounded-lg border text-sm font-medium transition-all ${
                mode === m.value ? 'bg-blue-600 text-white border-blue-600' : 'hover:border-blue-300'
              }`}>{m.label}</button>
          ))}
        </div>

        <div className="flex items-center gap-3 mb-6">
          <label className="text-sm font-medium">Number of {mode}:</label>
          <input type="range" min={1} max={50} value={count} onChange={e => setCount(parseInt(e.target.value))}
            className="flex-1" />
          <span className="text-lg font-semibold min-w-[2rem] text-center">{count}</span>
        </div>

        <div className="flex gap-2 mb-4">
          <button onClick={generate}
            className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Generate
          </button>
          <button onClick={copyToClipboard} disabled={!output}
            className="px-6 py-2.5 rounded-lg border font-medium hover:border-blue-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>

        {output && (
          <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
            <p className="text-sm text-gray-500 mb-2">
              Generated {count} {mode}:
            </p>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
              {output}
            </p>
          </div>
        )}
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
