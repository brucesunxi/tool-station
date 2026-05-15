'use client'

import { useState, useMemo } from 'react'
import AdBanner from '@/components/AdBanner'

export default function PalindromeCheckerPage() {
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
      <h1 className="text-3xl font-bold mb-2">Palindrome Checker</h1>
      <p className="text-gray-500 mb-6">Check if any word, phrase, or sentence reads the same forwards and backwards.</p>
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
        <h2>How to Use</h2>
        <ol>
          <li>Type or paste any word, phrase, or sentence into the text box.</li>
          <li>The tool automatically analyzes the text and tells you if it is a palindrome.</li>
          <li>Toggle <strong>Case sensitive</strong> if you want to distinguish uppercase and lowercase.</li>
          <li>View the forward and backward character comparison with color-coded matching.</li>
          <li>Non-alphanumeric characters (spaces, punctuation) are ignored during the check.</li>
        </ol>

        <h2>Tips</h2>
        <ul>
          <li>Try famous palindromes like &quot;racecar&quot;, &quot;madam&quot;, or &quot;A man, a plan, a canal: Panama&quot;.</li>
          <li>Enable case sensitivity to check for exact character-by-character palindromes.</li>
          <li>The color-coded view shows exactly which characters match (green) and which do not (red).</li>
        </ul>

        <h2>FAQ</h2>
        <div className="space-y-4 not-prose">
          <div>
            <h3 className="font-semibold">What is a palindrome?</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">A palindrome is a word, phrase, or sequence that reads the same forwards and backwards, ignoring spaces, punctuation, and capitalization. Examples: &quot;racecar&quot;, &quot;level&quot;, &quot;A man, a plan, a canal: Panama&quot;.</p>
          </div>
          <div>
            <h3 className="font-semibold">Does the checker ignore spaces and punctuation?</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Yes. By default, only alphanumeric characters are compared. Spaces, punctuation, and special characters are ignored to focus on the actual word or phrase.</p>
          </div>
          <div>
            <h3 className="font-semibold">What does case-sensitive mode do?</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">When case-sensitive mode is off (default), &quot;A&quot; matches &quot;a&quot;. When on, the characters must be exactly the same case — so &quot;Racecar&quot; would not match &quot;racecaR&quot;.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
