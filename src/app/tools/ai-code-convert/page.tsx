'use client'

import { useState } from 'react'
import AdBanner from '@/components/AdBanner'

const languages = [
  'Python', 'JavaScript', 'TypeScript', 'Java', 'Go', 'Rust',
  'C', 'C++', 'C#', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'Scala',
  'R', 'Dart', 'Lua', 'Perl', 'Haskell',
]

export default function AiCodeConvertPage() {
  const [code, setCode] = useState('')
  const [fromLang, setFromLang] = useState('Python')
  const [toLang, setToLang] = useState('JavaScript')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleConvert = async () => {
    if (!code.trim()) return
    setLoading(true); setError(null); setResult('')
    try {
      const res = await fetch('/api/code-convert', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, fromLang, toLang }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Conversion failed')
      setResult(data.result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Conversion failed')
    } finally { setLoading(false) }
  }

  const handleCopy = () => { if (result) navigator.clipboard.writeText(result).catch(() => {}) }
  const handleSwap = () => { const t = fromLang; setFromLang(toLang); setToLang(t); setCode(result || ''); setResult('') }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">AI Code Converter</h1>
        <p className="text-gray-500">Convert code between programming languages. Preserves logic, comments, and structure.</p>
      </div>
      <AdBanner className="mb-8 h-20" />
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">From</label>
          <select value={fromLang} onChange={e => setFromLang(e.target.value)}
            className="w-full p-2.5 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            {languages.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
        <button onClick={handleSwap} className="mt-6 p-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 shrink-0">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
        </button>
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">To</label>
          <select value={toLang} onChange={e => setToLang(e.target.value)}
            className="w-full p-2.5 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            {languages.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Source Code</label>
          <textarea value={code} onChange={e => setCode(e.target.value)} rows={14}
            placeholder="Paste your code here..."
            className="w-full p-4 border rounded-xl resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-mono dark:bg-gray-800 dark:border-gray-700"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">Converted</label>
            {result && <button onClick={handleCopy} className="text-xs px-2 py-1 border rounded hover:bg-gray-50 dark:hover:bg-gray-800">Copy</button>}
          </div>
          <div className={`min-h-[370px] p-4 border rounded-xl text-sm whitespace-pre-wrap font-mono leading-relaxed ${
            result ? 'border-green-200 bg-green-50/50 dark:bg-green-900/10' : 'bg-gray-50 dark:bg-gray-800/50'
          }`}>
            {result || <p className="text-gray-400 font-sans">{loading ? 'Converting...' : 'Converted code will appear here...'}</p>}
          </div>
        </div>
      </div>
      <button onClick={handleConvert} disabled={loading || !code.trim()}
        className="w-full mt-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors">
        {loading ? '🤖 Converting...' : '🔄 Convert Code'}
      </button>
      {error && <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>}
      <div className="mt-12 pt-8 border-t">
        <h2 className="text-xl font-bold mb-4">Free AI Code Converter</h2>
        <p className="text-sm text-gray-500">Convert code between 19 programming languages. Preserves logic, comments, and structure.</p>
      </div>
    </div>
  )
}
