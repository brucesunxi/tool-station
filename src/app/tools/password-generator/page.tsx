'use client'

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

function calcStrength(pw: string): { label: string; color: string; width: string } {
  let score = 0
  if (pw.length >= 8) score++
  if (pw.length >= 12) score++
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++
  if (/\d/.test(pw)) score++
  if (/[^a-zA-Z0-9]/.test(pw)) score++
  const map = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong']
  const colors = ['', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-green-600']
  return { label: map[score], color: colors[score], width: `${score * 20}%` }
}

export default function PasswordGeneratorPage() {
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
        <h1 className="text-3xl font-bold mb-2">Password Generator</h1>
        <p className="text-gray-500">Generate strong, secure passwords with customizable options.</p>
      </div>
      <AdBanner className="mb-8 h-20" />

      <div className="p-6 border rounded-xl space-y-5">
        <div>
          <label className="text-sm font-medium">Length: {length}</label>
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
          <label className="text-sm font-medium">Count: {count}</label>
          <input type="range" min="1" max="10" value={count} onChange={e => setCount(Number(e.target.value))} className="w-full accent-blue-600 mt-1" />
        </div>

        <button onClick={generate}
          className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
          Generate Passwords
        </button>

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
                  <span>Strength</span>
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
        <h2>How to Use</h2>
        <ol>
          <li>Adjust the length slider -- longer passwords (16 characters or more) provide the best security.</li>
          <li>Select which character types to include: uppercase letters, lowercase letters, digits, and symbols.</li>
          <li>Set the number of passwords to generate at once using the Count slider, up to 10 at a time.</li>
          <li>Click "Generate Passwords" to create your secure passwords instantly.</li>
          <li>Click "Copy" next to any password to copy it to your clipboard, and check the strength meter to assess its security.</li>
        </ol>
        <h2>Tips</h2>
        <ul>
          <li>Use passwords of at least 16 characters with all four character types enabled for maximum security.</li>
          <li>Never reuse passwords across different accounts -- generate a unique password for each service you use.</li>
          <li>Use a password manager to store generated passwords securely instead of saving them in your browser or a text file.</li>
        </ul>
        <h2>FAQ</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">How does the password strength indicator work?</h3>
            <p>It scores passwords based on length, character variety, and use of mixed case, digits, and symbols. Scores range from Weak to Very Strong based on five criteria.</p>
          </div>
          <div>
            <h3 className="font-semibold">Are the generated passwords truly random?</h3>
            <p>Yes. The generator uses JavaScript's random number generator to select characters uniformly from your chosen character sets.</p>
          </div>
          <div>
            <h3 className="font-semibold">Can I generate multiple passwords at once?</h3>
            <p>Yes. Use the Count slider to generate up to 10 passwords simultaneously, each with the same length and character settings.</p>
          </div>
          <div>
            <h3 className="font-semibold">Are passwords saved or transmitted anywhere?</h3>
            <p>No. All passwords are generated locally in your browser and never sent to any server. Copy them to your clipboard and store them securely in a password manager.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
