'use client'

import { useState } from 'react'
import AdBanner from '@/components/AdBanner'

export default function AiBioPage() {
  const [role, setRole] = useState('')
  const [details, setDetails] = useState('')
  const [tone, setTone] = useState('professional')
  const [platform, setPlatform] = useState('linkedin')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!role.trim()) return
    setLoading(true); setError(null); setResult('')
    try {
      const res = await fetch('/api/bio', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, details, tone, platform }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Generation failed')
      setResult(data.result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed')
    } finally { setLoading(false) }
  }

  const handleCopy = () => { if (result) navigator.clipboard.writeText(result).catch(() => {}) }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">AI Bio Generator</h1>
        <p className="text-gray-500">Generate professional bios for LinkedIn, Twitter, Instagram, and personal websites.</p>
      </div>
      <AdBanner className="mb-8 h-20" />
      <input type="text" value={role} onChange={e => setRole(e.target.value)}
        placeholder="e.g. Senior Software Engineer, Freelance Designer, Digital Marketing Manager"
        className="w-full p-3 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
      />
      <textarea value={details} onChange={e => setDetails(e.target.value)} rows={3}
        placeholder="Key details to include: skills, achievements, interests, etc. (optional)"
        className="w-full p-4 border rounded-xl resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm dark:bg-gray-800 dark:border-gray-700 mb-4"
      />
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-2">Tone</label>
          <select value={tone} onChange={e => setTone(e.target.value)}
            className="w-full p-2.5 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="professional">Professional</option>
            <option value="creative">Creative</option>
            <option value="fun">Fun & Casual</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Platform</label>
          <select value={platform} onChange={e => setPlatform(e.target.value)}
            className="w-full p-2.5 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="linkedin">LinkedIn</option>
            <option value="twitter">Twitter / X</option>
            <option value="instagram">Instagram</option>
            <option value="website">Personal Website</option>
          </select>
        </div>
      </div>
      <button onClick={handleGenerate} disabled={loading || !role.trim()}
        className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors">
        {loading ? '🤖 Writing...' : '👤 Generate Bio'}
      </button>
      {error && <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>}
      {result && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-sm">Generated Bios</h3>
            <button onClick={handleCopy} className="text-xs px-2 py-1 border rounded hover:bg-gray-50 dark:hover:bg-gray-800">Copy</button>
          </div>
          <div className="p-4 border rounded-xl bg-green-50/50 dark:bg-green-900/10 dark:border-green-900/30 text-sm whitespace-pre-wrap leading-relaxed">{result}</div>
        </div>
      )}
      <div className="mt-12 pt-8 border-t">
        <h2 className="text-xl font-bold mb-4">Free AI Bio Generator</h2>
        <p className="text-sm text-gray-500">Generate professional bios for any platform. Choose from professional, creative, or casual tones.</p>
      </div>
    </div>
  )
}
