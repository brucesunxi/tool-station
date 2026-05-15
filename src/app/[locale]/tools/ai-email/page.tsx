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

      {/* SEO Content */}
      <section className="mt-12 pt-8 border-t prose dark:prose-invert max-w-none">
        <h2>How to Use the AI Email Generator</h2>
        <ol>
          <li>Select an email scenario from the available options &mdash; Inquiry, Complaint, Follow-up, Thank You, Proposal, Apology, Introduction, or Reminder.</li>
          <li>Choose the desired tone &mdash; Professional, Friendly, or Direct.</li>
          <li>Optionally enter the recipient name or title (e.g., &quot;Hiring Manager,&quot; &quot;Support Team&quot;).</li>
          <li>Describe the key points and details your email should cover in the text area.</li>
          <li>Click &quot;Generate Email&quot; and the AI will produce a complete draft with subject line, salutation, body, and closing.</li>
        </ol>

        <h2>Tips for Great Emails</h2>
        <ul>
          <li>Provide specific details in the key points field &mdash; names, dates, order numbers, and relevant context produce more accurate emails.</li>
          <li>Use the Friendly tone for internal team communication and the Professional tone for external clients and formal correspondence.</li>
          <li>Review and personalize the generated email before sending &mdash; small tweaks make it sound authentically like you.</li>
        </ul>

        <h2>Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div><h3 className="font-semibold">Can I generate emails in different languages?</h3><p>The email generator works best for English, but you can describe your key points in other languages and the AI will produce an email accordingly.</p></div>
          <div><h3 className="font-semibold">Does the generated email include a subject line?</h3><p>Yes, every generated email includes a complete draft with a subject line, salutation, body paragraphs, and a professional closing.</p></div>
          <div><h3 className="font-semibold">What if I need to adjust the generated email?</h3><p>Simply modify the key points and regenerate, or copy the draft and edit it manually. You can also change the scenario or tone and try again.</p></div>
        </div>
      </section>
    </div>
  )
}
