'use client'

import { useTranslations } from 'next-intl'
import { useState, useMemo, useCallback, useRef } from 'react'
import AdBanner from '@/components/AdBanner'

const MORSE_MAP: Record<string, string> = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
  'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
  'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
  'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
  'Y': '-.--', 'Z': '--..',
  '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
  '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
  '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.', '!': '-.-.--',
  '/': '-..-.', '(': '-.--.', ')': '-.--.-', '&': '.-...', ':': '---...',
  ';': '-.-.-.', '=': '-...-', '+': '.-.-.', '-': '-....-', '_': '..--.-',
  '"': '.-..-.', '$': '...-..-', '@': '.--.-.',
}

const REVERSE_MORSE: Record<string, string> = {}
for (const [char, code] of Object.entries(MORSE_MAP)) {
  REVERSE_MORSE[code] = char
}

type MorseMode = 'encode' | 'decode'

export default function MorseCodePage() {
  const t = useTranslations('tools.morse-code')
  const ct = useTranslations('common')

  const [input, setInput] = useState('')
  const [mode, setMode] = useState<MorseMode>('encode')
  const [copied, setCopied] = useState(false)
  const [playing, setPlaying] = useState(false)
  const audioCtxRef = useRef<AudioContext | null>(null)

  const result = useMemo(() => {
    if (!input.trim()) return ''

    if (mode === 'encode') {
      const chars = input.toUpperCase().split('')
      return chars.map(c => {
        if (c === ' ') return '/'
        return MORSE_MAP[c] || ''
      }).filter(Boolean).join(' ')
    } else {
      return input.trim().split(/\s+/).map(code => {
        if (code === '/') return ' '
        return REVERSE_MORSE[code] || '?'
      }).join('')
    }
  }, [input, mode])

  const playMorse = useCallback(() => {
    if (!result || playing) return

    const morseChars = mode === 'encode' ? result : input
    const dots = morseChars.split('').filter(c => c === '.' || c === '-')

    if (dots.length === 0) return

    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    }

    const ctx = audioCtxRef.current
    const dotDuration = 0.08
    const freq = 700
    setPlaying(true)

    let time = ctx.currentTime
    let dotIndex = 0

    for (const char of morseChars) {
      if (char === '.') {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.value = freq
        gain.gain.setValueAtTime(0.5, time)
        gain.gain.setValueAtTime(0, time + dotDuration)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(time)
        osc.stop(time + dotDuration)
        time += dotDuration * 1.5
        dotIndex++
      } else if (char === '-') {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.value = freq
        gain.gain.setValueAtTime(0.5, time)
        gain.gain.setValueAtTime(0, time + dotDuration * 3)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(time)
        osc.stop(time + dotDuration * 3)
        time += dotDuration * 1.5
        dotIndex++
      } else if (char === ' ') {
        time += dotDuration * 2
      } else if (char === '/') {
        time += dotDuration * 4
      }
    }

    setTimeout(() => setPlaying(false), (time - ctx.currentTime) * 1000 + 100)
  }, [result, mode, input, playing])

  const handleCopy = () => {
    if (!result) return
    navigator.clipboard.writeText(result).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-2">{t('h1')}</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">{t('description')}</p>
      <AdBanner className="mb-8 h-20" />

      <div className="bg-white dark:bg-gray-800 border rounded-xl p-6 mb-8">
        <div className="flex gap-2 mb-4">
          <button onClick={() => setMode('encode')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              mode === 'encode' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}>
            Text to Morse
          </button>
          <button onClick={() => setMode('decode')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              mode === 'decode' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}>
            Morse to Text
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              {mode === 'encode' ? 'Text' : 'Morse Code'}
            </label>
            <textarea value={input} onChange={e => setInput(e.target.value)} rows={6}
              placeholder={mode === 'encode' ? 'Enter text...' : 'Enter Morse code (dots/spaces)...'}
              className="w-full p-4 border rounded-xl resize-y text-sm dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium">
                {mode === 'encode' ? 'Morse Code' : 'Text'}
              </label>
              {result && (
                <button onClick={handleCopy} className="text-xs px-2 py-1 border rounded hover:bg-gray-50 dark:hover:bg-gray-800">{copied ? 'Copied!' : 'Copy'}</button>
              )}
            </div>
            <textarea value={result} readOnly rows={6}
              className="w-full p-4 border rounded-xl resize-y text-sm bg-gray-50 dark:bg-gray-800 dark:border-gray-700 font-mono" placeholder="Result will appear here..."
            />
          </div>
        </div>

        {result && (
          <button onClick={playMorse} disabled={playing}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              playing ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'
            }`}>
            <span>{playing ? 'Playing...' : 'Play Sound'}</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
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
