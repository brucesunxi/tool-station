'use client'

import { useState, useMemo } from 'react'
import AdBanner from '@/components/AdBanner'

const UPSIDE_DOWN_MAP: Record<string, string> = {
  a: 'ɐ', b: 'q', c: 'ɔ', d: 'p', e: 'ǝ', f: 'ɟ', g: 'ɓ',
  h: 'ɥ', i: 'ᴉ', j: 'ɾ', k: 'ʞ', l: 'l', m: 'ɯ', n: 'u',
  o: 'o', p: 'd', q: 'b', r: 'ɹ', s: 's', t: 'ʇ', u: 'n',
  v: 'ʌ', w: 'ʍ', x: 'x', y: 'ʎ', z: 'z',
  A: '∀', B: '𐐒', C: 'Ɔ', D: '◖', E: 'Ǝ', F: 'Ⅎ', G: '⅁',
  H: 'H', I: 'I', J: 'ſ', K: '⋊', L: '⅂', M: 'W', N: 'N',
  O: 'O', P: 'Ԁ', Q: 'Ό', R: 'ᴚ', S: 'S', T: '⊥', U: '∩',
  V: 'Λ', W: 'M', X: 'X', Y: '⅄', Z: 'Z',
  '0': '0', '1': 'Ɩ', '2': '2', '3': 'Ɛ', '4': 'ᔭ', '5': '5',
  '6': '9', '7': 'ㄥ', '8': '8', '9': '6',
  '.': '˙', '?': '¿', '!': '¡', '(': ')', ')': '(', '[': ']', ']': '[',
  '{': '}', '}': '{', '<': '>', '>': '<', '&': '⅋',
}

function flipText(text: string): string {
  const reversed = text.split('').reverse()
  return reversed.map(ch => UPSIDE_DOWN_MAP[ch] || ch).join('')
}

export default function UpsideDownTextPage() {
  const [input, setInput] = useState('')

  const output = useMemo(() => flipText(input), [input])

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-2">Upside Down Text Generator</h1>
      <p className="text-gray-500 mb-6">Flip text upside down using Unicode characters for fun social media effects.</p>
      <AdBanner className="mb-8 h-20" />

      <div className="bg-white dark:bg-gray-800 border rounded-xl p-6 mb-8 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1.5">Enter your text</label>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type something here..."
            className="w-full p-4 border rounded-xl text-sm min-h-[120px] dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Flipped result</label>
          <div className="w-full p-4 bg-gray-50 dark:bg-gray-700 rounded-xl text-sm break-words min-h-[60px]">
            {output || 'Result will appear here'}
          </div>
        </div>
        {output && (
          <button
            onClick={() => navigator.clipboard.writeText(output)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
          >
            Copy to clipboard
          </button>
        )}
      </div>

      <section className="prose dark:prose-invert max-w-none">
        <h2>How to Use</h2>
        <ol>
          <li>Type or paste your text into the input box</li>
          <li>The flipped version appears instantly as you type</li>
          <li>Click the copy button to copy the result</li>
          <li>Paste it anywhere — social media, messages, or bios</li>
        </ol>

        <h2>Tips</h2>
        <ul>
          <li>Works best with standard letters and common punctuation</li>
          <li>Not all characters have an upside-down equivalent — some stay the same</li>
          <li>Great for standing out in social media profiles and comments</li>
        </ul>

        <h2>FAQ</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">How does upside down text work?</h3>
            <p>This tool uses Unicode characters that visually resemble upside-down versions of regular letters and symbols, then reverses the order of the text.</p>
          </div>
          <div>
            <h3 className="font-semibold">Why do some characters not change?</h3>
            <p>Some characters (like 'o', 'l', 's') look the same when flipped due to their symmetry. The Unicode standard doesn&apos;t have upside-down equivalents for every character.</p>
          </div>
          <div>
            <h3 className="font-semibold">Will this work on all platforms?</h3>
            <p>Yes, these are standard Unicode characters supported on all modern devices and platforms including iOS, Android, Windows, and Mac.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
