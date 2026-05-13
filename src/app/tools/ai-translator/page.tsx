'use client'

import { useState } from 'react'
import AdBanner from '@/components/AdBanner'

const languages = [
  { value: 'auto', label: 'Auto Detect' },
  { value: 'en', label: 'English' },
  { value: 'zh', label: 'Chinese' },
  { value: 'ja', label: 'Japanese' },
  { value: 'ko', label: 'Korean' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'es', label: 'Spanish' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'ru', label: 'Russian' },
  { value: 'ar', label: 'Arabic' },
  { value: 'hi', label: 'Hindi' },
  { value: 'it', label: 'Italian' },
  { value: 'vi', label: 'Vietnamese' },
  { value: 'th', label: 'Thai' },
  { value: 'id', label: 'Indonesian' },
  { value: 'tr', label: 'Turkish' },
  { value: 'nl', label: 'Dutch' },
  { value: 'pl', label: 'Polish' },
]

export default function AiTranslatorPage() {
  const [text, setText] = useState('')
  const [sourceLang, setSourceLang] = useState('auto')
  const [targetLang, setTargetLang] = useState('en')
  const [loading, setLoading] = useState(false)
  const [translated, setTranslated] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSwap = () => {
    if (sourceLang === 'auto') return
    setSourceLang(targetLang)
    setTargetLang(sourceLang)
    setText(translated)
    setTranslated('')
  }

  const handleTranslate = async () => {
    if (!text.trim()) return
    setLoading(true)
    setError(null)
    setTranslated('')

    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, sourceLang, targetLang }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Translation failed')
      setTranslated(data.translatedText)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Translation failed')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    if (translated) navigator.clipboard.writeText(translated).catch(() => {})
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">AI Translator</h1>
        <p className="text-gray-500">Translate text between 20+ languages with AI. Preserves formatting and natural expression.</p>
      </div>

      <AdBanner className="mb-8 h-20" />

      {/* Language Selectors */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1">
          <select value={sourceLang} onChange={e => setSourceLang(e.target.value)}
            className="w-full p-2.5 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            {languages.map(l => (
              <option key={l.value} value={l.value}>{l.label}</option>
            ))}
          </select>
        </div>
        <button onClick={handleSwap}
          className="p-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shrink-0"
          title="Swap languages">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
        </button>
        <div className="flex-1">
          <select value={targetLang} onChange={e => setTargetLang(e.target.value)}
            className="w-full p-2.5 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            {languages.filter(l => l.value !== 'auto').map(l => (
              <option key={l.value} value={l.value}>{l.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Text Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Source Text</label>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Enter text to translate..."
            rows={12}
            className="w-full p-4 border rounded-xl resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm dark:bg-gray-800 dark:border-gray-700"
          />
          <div className="mt-1 text-xs text-gray-400 text-right">{text.length} chars</div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">Translation</label>
            {translated && (
              <button onClick={handleCopy}
                className="text-xs px-2 py-1 border rounded hover:bg-gray-50 dark:hover:bg-gray-800">Copy</button>
            )}
          </div>
          <div className={`min-h-[310px] p-4 border rounded-xl text-sm whitespace-pre-wrap ${
            translated ? 'border-green-200 bg-green-50/50 dark:bg-green-900/10' : 'bg-gray-50 dark:bg-gray-800/50'
          }`}>
            {translated || (
              <p className="text-gray-400">{loading ? 'Translating...' : 'Translation will appear here...'}</p>
            )}
          </div>
        </div>
      </div>

      {/* Translate Button */}
      <button onClick={handleTranslate} disabled={loading || !text.trim()}
        className="w-full mt-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors">
        {loading ? '🤖 Translating...' : '🌐 Translate with AI'}
      </button>

      {error && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>
      )}

      {/* SEO */}
      <div className="mt-12 pt-8 border-t">
        <h2 className="text-xl font-bold mb-4">Free AI Translator — 20+ Languages</h2>
        <p className="text-sm text-gray-500">
          Translate text between English, Chinese, Japanese, Korean, French, German, Spanish, and more.
          AI-powered natural translations that preserve formatting and meaning.
        </p>
      </div>
    </div>
  )
}
