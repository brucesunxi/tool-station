'use client'

import { useState } from 'react'
import AdBanner from '@/components/AdBanner'

export default function CoverLetterPage() {
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
      if (!res.ok) throw new Error(data.error || 'Generation failed')
      setLetter(data.letter)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed')
    } finally { setLoading(false) }
  }

  const handleCopy = () => { if (letter) navigator.clipboard.writeText(letter).catch(() => {}) }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">AI Cover Letter Generator</h1>
        <p className="text-gray-500">Generate professional cover letters tailored to any job application in seconds.</p>
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
              <label className="block text-sm font-medium mb-1">Tone</label>
              <select value={tone} onChange={e => setTone(e.target.value)}
                className="w-full p-2.5 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="professional">Professional</option>
                <option value="enthusiastic">Enthusiastic</option>
                <option value="direct">Direct & Concise</option>
              </select>
            </div>
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">Cover Letter</label>
            {letter && <button onClick={handleCopy} className="text-xs px-2 py-1 border rounded hover:bg-gray-50 dark:hover:bg-gray-800">Copy</button>}
          </div>
          <div className={`min-h-[400px] p-4 border rounded-xl text-sm whitespace-pre-wrap leading-relaxed ${
            letter ? 'border-green-200 bg-green-50/50 dark:bg-green-900/10' : 'bg-gray-50 dark:bg-gray-800/50'
          }`}>
            {letter || <p className="text-gray-400">{loading ? 'Writing...' : 'Your cover letter will appear here...'}</p>}
          </div>
        </div>
      </div>

      <button onClick={handleGenerate} disabled={loading || !jobTitle.trim() || !company.trim()}
        className="w-full mt-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors">
        {loading ? '🤖 Writing...' : '✍️ Generate Cover Letter'}
      </button>

      {error && <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>}

      {/* SEO Content */}
      <section className="mt-12 pt-8 border-t prose dark:prose-invert max-w-none">
        <h2>How to Use</h2>
        <ol>
          <li>Enter the job title you are applying for in the first input field.</li>
          <li>Type the company name to personalize the cover letter for the specific organization.</li>
          <li>Describe your relevant skills, experience, and key achievements in the skills text area for the best results.</li>
          <li>Choose a tone -- Professional, Enthusiastic, or Direct and Concise -- to match the company culture and role.</li>
          <li>Click "Generate Cover Letter" and wait for the AI to write your letter, then copy the result using the Copy button.</li>
        </ol>
        <h2>Tips</h2>
        <ul>
          <li>Be specific in your skills section -- mention concrete achievements like "increased sales by 20 percent" rather than vague statements.</li>
          <li>Match the tone to the industry: Professional for corporate roles, Enthusiastic for startups and creative positions, and Direct for executive applications.</li>
          <li>Always review and customize the generated letter before sending it -- AI outputs work best as a strong starting point.</li>
        </ul>
        <h2>FAQ</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">How does the AI generate the cover letter?</h3>
            <p>The AI uses your job title, company name, skills, and selected tone to craft a tailored cover letter through our server-side API.</p>
          </div>
          <div>
            <h3 className="font-semibold">Is there a limit on how many cover letters I can generate?</h3>
            <p>No. You can generate unlimited cover letters for different job applications and companies.</p>
          </div>
          <div>
            <h3 className="font-semibold">Can I customize the generated letter before using it?</h3>
            <p>Yes. The generated letter appears in an editable text area where you can copy it and then paste it into any word processor for further editing.</p>
          </div>
          <div>
            <h3 className="font-semibold">What information should I include in the skills section for the best results?</h3>
            <p>Include your years of experience, key technical skills, notable achievements with metrics, and any relevant certifications or education.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
