'use client'

import { useTranslations } from 'next-intl'
import { useState, useCallback } from 'react'
import AdBanner from '@/components/AdBanner'

function generatePassword(len: number, useUpper: boolean, useLower: boolean, useDigits: boolean, useSymbols: boolean): string {
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const lower = 'abcdefghijklmnopqrstuvwxyz'
  const digits = '0123456789'
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?'
  let chars = ''
  if (useUpper) chars += upper
  if (useLower) chars += lower
  if (useDigits) chars += digits
  if (useSymbols) chars += symbols
  if (!chars) return ''
  return Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

export default function PasswordGeneratorPage() {
  const t = useTranslations('tools.password-generator')
  const ct = useTranslations('common')

  function calcStrength(pw: string): { label: string; color: string; width: string } {
    let score = 0
    if (pw.length >= 8) score++
    if (pw.length >= 12) score++
    if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++
    if (/\d/.test(pw)) score++
    if (/[^a-zA-Z0-9]/.test(pw)) score++
    const map = ['', ct('weak'), ct('fair'), ct('good'), ct('strong'), ct('veryStrong')]
    const colors = ['', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-green-600']
    return { label: map[score], color: colors[score], width: `${score * 20}%` }
  }

  const [length, setLength] = useState(16)
  const [useUpper, setUseUpper] = useState(true)
  const [useLower, setUseLower] = useState(true)
  const [useDigits, setUseDigits] = useState(true)
  const [useSymbols, setUseSymbols] = useState(true)
  const [count, setCount] = useState(1)
  const [passwords, setPasswords] = useState<string[]>([])
  const [copied, setCopied] = useState('')

  const generate = useCallback(() => {
    const pwds = Array.from({ length: count }, () => generatePassword(length, useUpper, useLower, useDigits, useSymbols))
    setPasswords(pwds)
  }, [length, useUpper, useLower, useDigits, useSymbols, count])

  const handleCopy = async (pw: string) => {
    await navigator.clipboard.writeText(pw).catch(() => {})
    setCopied(pw)
    setTimeout(() => setCopied(''), 1500)
  }

  const strength = passwords[0] ? calcStrength(passwords[0]) : null

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('h1')}</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{t('description')}</p>
      </div>
      <AdBanner className="mb-8 h-20" />

      <div className="p-6 border rounded-xl space-y-5">
        <div>
          <label className="text-sm font-medium">{ct("passwordLength", { count: length })}</label>
          <input type="range" min="4" max="64" value={length} onChange={e => setLength(Number(e.target.value))} className="w-full accent-blue-600 mt-1" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <label className="flex items-center gap-2 text-sm p-2 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
            <input type="checkbox" checked={useUpper} onChange={e => setUseUpper(e.target.checked)} className="accent-blue-600" /> A-Z
          </label>
          <label className="flex items-center gap-2 text-sm p-2 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
            <input type="checkbox" checked={useLower} onChange={e => setUseLower(e.target.checked)} className="accent-blue-600" /> a-z
          </label>
          <label className="flex items-center gap-2 text-sm p-2 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
            <input type="checkbox" checked={useDigits} onChange={e => setUseDigits(e.target.checked)} className="accent-blue-600" /> 0-9
          </label>
          <label className="flex items-center gap-2 text-sm p-2 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
            <input type="checkbox" checked={useSymbols} onChange={e => setUseSymbols(e.target.checked)} className="accent-blue-600" /> !@#$
          </label>
        </div>

        <div>
          <label className="text-sm font-medium">{ct("passwordCount", { count })}</label>
          <input type="range" min="1" max="10" value={count} onChange={e => setCount(Number(e.target.value))} className="w-full accent-blue-600 mt-1" />
        </div>

        <button onClick={generate}
          className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">{ct("generatePasswords")}</button>

        {passwords.length > 0 && (
          <div className="space-y-2 pt-2">
            {passwords.map((pw, i) => (
              <div key={i} className="flex items-center gap-2 p-3 border rounded-lg bg-gray-50 dark:bg-gray-800">
                <span className="font-mono text-sm flex-1 break-all">{pw}</span>
                <button onClick={() => handleCopy(pw)}
                  className="text-xs px-2.5 py-1 border rounded hover:bg-white dark:hover:bg-gray-700 transition-colors shrink-0">
                  {copied === pw ? 'Copied!' : 'Copy'}
                </button>
              </div>
            ))}
            {strength && (
              <div className="pt-2">
                <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                  <span>{ct("strength")}</span>
                  <span>{strength.label}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className={`h-2 rounded-full transition-all ${strength.color}`} style={{ width: strength.width }} />
                </div>
              </div>
            )}
          </div>
        )}
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
