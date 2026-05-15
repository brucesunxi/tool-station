'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'
import AdBanner from '@/components/AdBanner'

export default function CoverLetterPage() {
  const t = useTranslations('tools.cover-letter')
  const ct = useTranslations('common')

  const [jobTitle, setJobTitle] = useState('')
  const [company, setCompany] = useState('')
  const [skills, setSkills] = useState('')
  const [tone, setTone] = useState('professional')
  const [loading, setLoading] = useState(false)
  const [letter, setLetter] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!jobTitle.trim() || !company.trim()) return
    setLoading(true); setError(null); setLetter('')
    try {
      const res = await fetch('/api/cover-letter', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobTitle, company, skills, tone }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || ct("generationFailed"))
      setLetter(data.letter)
    } catch (err) {
      setError(err instanceof Error ? err.message : ct("generationFailed"))
    } finally { setLoading(false) }
  }

  const handleCopy = () => { if (letter) navigator.clipboard.writeText(letter).catch(() => {}) }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('h1')}</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{t('description')}</p>
      </div>
      <AdBanner className="mb-8 h-20" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Job Title *</label>
              <input type="text" value={jobTitle} onChange={e => setJobTitle(e.target.value)}
                placeholder="e.g. Senior Frontend Developer"
                className="w-full p-3 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Company Name *</label>
              <input type="text" value={company} onChange={e => setCompany(e.target.value)}
                placeholder="e.g. Google, Stripe, Airbnb"
                className="w-full p-3 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Your Skills & Experience</label>
              <textarea value={skills} onChange={e => setSkills(e.target.value)} rows={5}
                placeholder="Describe your relevant experience, key achievements, and skills..."
                className="w-full p-3 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{ct("tone")}</label>
              <select value={tone} onChange={e => setTone(e.target.value)}
                className="w-full p-2.5 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="professional">{ct("toneProfessional")}</option>
                <option value="enthusiastic">{ct("toneEnthusiastic")}</option>
                <option value="direct">{ct("toneDirectConcise")}</option>
              </select>
            </div>
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">Cover Letter</label>
            {letter && <button onClick={handleCopy} className="text-xs px-2 py-1 border rounded hover:bg-gray-50 dark:hover:bg-gray-800">{ct("copy")}</button>}
          </div>
          <div className={`min-h-[400px] p-4 border rounded-xl text-sm whitespace-pre-wrap leading-relaxed ${
            letter ? 'border-green-200 bg-green-50/50 dark:bg-green-900/10' : 'bg-gray-50 dark:bg-gray-800/50'
          }`}>
            {letter || <p className="text-gray-400">{loading ? ct("writing") : 'Your cover letter will appear here...'}</p>}
          </div>
        </div>
      </div>

      <button onClick={handleGenerate} disabled={loading || !jobTitle.trim() || !company.trim()}
        className="w-full mt-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors">
        {loading ? ct("aiWriting") : '✍️ Generate Cover Letter'}
      </button>

      {error && <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>}

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
