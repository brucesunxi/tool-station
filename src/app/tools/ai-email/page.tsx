'use client'

import { useState } from 'react'
import AdBanner from '@/components/AdBanner'

const scenarios = [
  { value: 'inquiry', label: 'Inquiry', desc: 'Request information' },
  { value: 'complaint', label: 'Complaint', desc: 'Polite escalation' },
  { value: 'followup', label: 'Follow-up', desc: 'After a meeting' },
  { value: 'thank_you', label: 'Thank You', desc: 'Express gratitude' },
  { value: 'proposal', label: 'Proposal', desc: 'Business pitch' },
  { value: 'apology', label: 'Apology', desc: 'Apologize' },
  { value: 'introduction', label: 'Introduction', desc: 'Self-intro' },
  { value: 'reminder', label: 'Reminder', desc: 'Gentle reminder' },
]

export default function AiEmailPage() {
  const [scenario, setScenario] = useState('inquiry')
  const [tone, setTone] = useState('professional')
  const [recipient, setRecipient] = useState('')
  const [details, setDetails] = useState('')
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!details.trim()) return
    setLoading(true); setError(null); setEmail('')
    try {
      const res = await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario, tone, recipient, details }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Generation failed')
      setEmail(data.email)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => { if (email) navigator.clipboard.writeText(email).catch(() => {}) }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">AI Email Generator</h1>
        <p className="text-gray-500">Generate professional emails in seconds. Choose a scenario, set the tone, and add your key points.</p>
      </div>

      <AdBanner className="mb-8 h-20" />

      {/* Scenario */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Scenario</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {scenarios.map(s => (
            <button key={s.value} onClick={() => setScenario(s.value)}
              className={`p-2.5 rounded-lg border text-center text-sm transition-all ${
                scenario === s.value
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-200'
                  : 'hover:border-blue-300'
              }`}>
              <p className="font-medium">{s.label}</p>
              <p className="text-xs text-gray-400">{s.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Tone + Recipient */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-2">Tone</label>
          <select value={tone} onChange={e => setTone(e.target.value)}
            className="w-full p-2.5 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="professional">Professional</option>
            <option value="friendly">Friendly</option>
            <option value="direct">Direct</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Recipient (optional)</label>
          <input type="text" value={recipient} onChange={e => setRecipient(e.target.value)}
            placeholder="e.g. Hiring Manager, Support Team"
            className="w-full p-2.5 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Key Points</label>
          <textarea value={details} onChange={e => setDetails(e.target.value)}
            placeholder="Describe what the email should say. Include key details, questions, or points to cover..."
            rows={10}
            className="w-full p-4 border rounded-xl resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm dark:bg-gray-800 dark:border-gray-700"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">Generated Email</label>
            {email && (
              <button onClick={handleCopy} className="text-xs px-2 py-1 border rounded hover:bg-gray-50 dark:hover:bg-gray-800">Copy</button>
            )}
          </div>
          <div className={`min-h-[260px] p-4 border rounded-xl text-sm whitespace-pre-wrap ${
            email ? 'border-green-200 bg-green-50/50 dark:bg-green-900/10' : 'bg-gray-50 dark:bg-gray-800/50'
          }`}>
            {email || <p className="text-gray-400">{loading ? 'Writing...' : 'Email draft will appear here...'}</p>}
          </div>
        </div>
      </div>

      <button onClick={handleGenerate} disabled={loading || !details.trim()}
        className="w-full mt-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors">
        {loading ? '🤖 Writing email...' : '✉️ Generate Email'}
      </button>

      {error && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>
      )}

      <div className="mt-12 pt-8 border-t">
        <h2 className="text-xl font-bold mb-4">Free AI Email Generator</h2>
        <p className="text-sm text-gray-500">
          Generate professional emails for any business scenario. Choose from 8 scenarios, customize the tone,
          and add your key points. AI writes a complete draft with subject line, salutation, and closing.
        </p>
      </div>
    </div>
  )
}
