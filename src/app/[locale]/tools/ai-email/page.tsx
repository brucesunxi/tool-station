'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'
import AdBanner from '@/components/AdBanner'

export default function AiEmailPage() {
  const t = useTranslations('tools.ai-email')
  const ct = useTranslations('common')

  const scenarios = [
    { value: 'inquiry', label: t('scenarioInquiry'), desc: t('scenarioInquiryDesc') },
    { value: 'complaint', label: t('scenarioComplaint'), desc: t('scenarioComplaintDesc') },
    { value: 'followup', label: t('scenarioFollowup'), desc: t('scenarioFollowupDesc') },
    { value: 'thank_you', label: t('scenarioThankYou'), desc: t('scenarioThankYouDesc') },
    { value: 'proposal', label: t('scenarioProposal'), desc: t('scenarioProposalDesc') },
    { value: 'apology', label: t('scenarioApology'), desc: t('scenarioApologyDesc') },
    { value: 'introduction', label: t('scenarioIntroduction'), desc: t('scenarioIntroductionDesc') },
    { value: 'reminder', label: t('scenarioReminder'), desc: t('scenarioReminderDesc') },
  ]

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
      if (!res.ok) throw new Error(data.error || ct("generationFailed"))
      setEmail(data.email)
    } catch (err) {
      setError(err instanceof Error ? err.message : ct("generationFailed"))
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => { if (email) navigator.clipboard.writeText(email).catch(() => {}) }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('h1')}</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{t('description')}</p>
      </div>

      <AdBanner className="mb-8 h-20" />

      {/* Scenario */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">{ct("scenario")}</label>
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
          <label className="block text-sm font-medium mb-2">{ct("tone")}</label>
          <select value={tone} onChange={e => setTone(e.target.value)}
            className="w-full p-2.5 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="professional">{ct("toneProfessional")}</option>
            <option value="friendly">{ct("toneFriendly")}</option>
            <option value="direct">{ct("toneDirect")}</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">{ct("recipient")}</label>
          <input type="text" value={recipient} onChange={e => setRecipient(e.target.value)}
            placeholder={ct("placeholderRecipient")}
            className="w-full p-2.5 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">{ct("keyPoints")}</label>
          <textarea value={details} onChange={e => setDetails(e.target.value)}
            placeholder={ct("placeholderEmailDetails")}
            rows={10}
            className="w-full p-4 border rounded-xl resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm dark:bg-gray-800 dark:border-gray-700"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">{ct("generatedContent")}</label>
            {email && (
              <button onClick={handleCopy} className="text-xs px-2 py-1 border rounded hover:bg-gray-50 dark:hover:bg-gray-800">{ct("copy")}</button>
            )}
          </div>
          <div className={`min-h-[260px] p-4 border rounded-xl text-sm whitespace-pre-wrap ${
            email ? 'border-green-200 bg-green-50/50 dark:bg-green-900/10' : 'bg-gray-50 dark:bg-gray-800/50'
          }`}>
            {email || <p className="text-gray-400">{loading ? ct("writing") : ct("placeholderEmailDraft")}</p>}
          </div>
        </div>
      </div>

      <button onClick={handleGenerate} disabled={loading || !details.trim()}
        className="w-full mt-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors">
        {loading ? ct("writing") : '✉️ Generate Email'}
      </button>

      {error && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>
      )}

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
