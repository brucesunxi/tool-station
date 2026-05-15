'use client'

import { useTranslations } from 'next-intl'
import { useState, useMemo } from 'react'
import AdBanner from '@/components/AdBanner'

export default function PalindromeCheckerPage() {
  const t = useTranslations('tools.palindrome-checker')
  const ct = useTranslations('common')

  const [input, setInput] = useState('')
  const [caseSensitive, setCaseSensitive] = useState(false)

  const analysis = useMemo(() => {
    if (!input) return null

    const cleaned = input.replace(/[^a-zA-Z0-9]/g, '')
    const testStr = caseSensitive ? cleaned : cleaned.toLowerCase()

    const isPalindrome = testStr.length > 0 && testStr === testStr.split('').reverse().join('')

    const chars = input.split('')
    const forward: { char: string; matched: boolean }[] = []
    const backward: { char: string; matched: boolean }[] = []

    const filteredChars = input.split('').filter(c => /[a-zA-Z0-9]/.test(c))
    const revFiltered = [...filteredChars].reverse()

    let fi = 0
    for (let i = 0; i < chars.length; i++) {
      if (/[a-zA-Z0-9]/.test(chars[i])) {
        const revChar = revFiltered[fi] || ''
        const fwdCompare = caseSensitive ? chars[i] : chars[i].toLowerCase()
        const revCompare = caseSensitive ? revChar : revChar.toLowerCase()
        forward.push({ char: chars[i], matched: fwdCompare === revCompare })
        fi++
      } else {
        forward.push({ char: chars[i], matched: true })
      }
    }

    const revChars = [...chars].reverse()
    let ri = 0
    for (let i = 0; i < revChars.length; i++) {
      if (/[a-zA-Z0-9]/.test(revChars[i])) {
        const fwdChar = filteredChars[ri] || ''
        const revCompare = caseSensitive ? revChars[i] : revChars[i].toLowerCase()
        const fwdCompare = caseSensitive ? fwdChar : fwdChar.toLowerCase()
        backward.push({ char: revChars[i], matched: revCompare === fwdCompare })
        ri++
      } else {
        backward.push({ char: revChars[i], matched: true })
      }
    }

    return {
      isPalindrome,
      cleaned,
      forward,
      backward,
      charCount: cleaned.length,
    }
  }, [input, caseSensitive])

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-2">{t('h1')}</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">{t('description')}</p>
      <AdBanner className="mb-8 h-20" />

      <div className="bg-white dark:bg-gray-800 border rounded-xl p-6 mb-8">
        <textarea value={input} onChange={e => setInput(e.target.value)} rows={4}
          placeholder="Type a word or phrase to check..."
          className="w-full p-4 border rounded-xl resize-y text-sm dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        />

        <label className="flex items-center gap-2 cursor-pointer mb-4">
          <input type="checkbox" checked={caseSensitive} onChange={e => setCaseSensitive(e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
          <span className="text-sm">Case sensitive (A != a)</span>
        </label>

        {analysis && input && (
          <div className={`p-4 rounded-lg border ${
            analysis.isPalindrome
              ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-900/30'
              : 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-900/30'
          }`}>
            <p className="text-lg font-semibold mb-2">
              {analysis.isPalindrome
                ? 'Yes, it is a palindrome!'
                : 'No, it is not a palindrome.'}
            </p>
            <p className="text-sm text-gray-500 mb-2">
              Cleaned text ({analysis.charCount} chars): <span className="font-mono">{analysis.cleaned}</span>
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Forward</p>
                <p className="font-mono text-sm break-all">
                  {analysis.forward.map((c, i) => (
                    <span key={i} className={c.matched ? 'text-green-600 dark:text-green-400' : 'text-red-500 font-bold'}>{c.char}</span>
                  ))}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Backward</p>
                <p className="font-mono text-sm break-all">
                  {analysis.backward.map((c, i) => (
                    <span key={i} className={c.matched ? 'text-green-600 dark:text-green-400' : 'text-red-500 font-bold'}>{c.char}</span>
                  ))}
                </p>
              </div>
            </div>
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
        <div className="space-y-4 not-prose">
          {(t.raw('faq.items') as { q: string; a: string }[]).map((item, i) => (
            <div key={i}>
              <h3 className="font-semibold">{item.q}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{item.a}</p>
            </div>
          ))}
        </div></section>
    </div>
  )
}
