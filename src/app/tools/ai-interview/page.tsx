'use client'

import { useState } from 'react'
import AdBanner from '@/components/AdBanner'

export default function AiInterviewPage() {
  const [role, setRole] = useState('')
  const [type, setType] = useState('technical')
  const [count, setCount] = useState(5)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!role.trim()) return
    setLoading(true); setError(null); setResult('')
    try {
      const res = await fetch('/api/interview', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, count, type }),
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
        <h1 className="text-3xl font-bold mb-2">AI Interview Question Generator</h1>
        <p className="text-gray-500">Generate interview questions for any role. Includes what interviewers look for and answering tips.</p>
      </div>
      <AdBanner className="mb-8 h-20" />
      <input type="text" value={role} onChange={e => setRole(e.target.value)}
        placeholder="e.g. Frontend Developer, Product Manager, Data Scientist, Marketing Lead..."
        className="w-full p-3 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
      />
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-2">Question Type</label>
          <select value={type} onChange={e => setType(e.target.value)}
            className="w-full p-2.5 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="technical">Technical / Skills</option>
            <option value="behavioral">Behavioral</option>
            <option value="mixed">Mixed</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Number: {count}</label>
          <input type="range" min="3" max="15" value={count} onChange={e => setCount(Number(e.target.value))} className="w-full accent-blue-600" />
        </div>
      </div>
      <button onClick={handleGenerate} disabled={loading || !role.trim()}
        className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors">
        {loading ? '🤖 Generating...' : '💼 Generate Questions'}
      </button>
      {error && <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>}
      {result && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-sm">Interview Questions</h3>
            <button onClick={handleCopy} className="text-xs px-2 py-1 border rounded hover:bg-gray-50 dark:hover:bg-gray-800">Copy</button>
          </div>
          <div className="p-4 border rounded-xl bg-green-50/50 dark:bg-green-900/10 dark:border-green-900/30 text-sm whitespace-pre-wrap leading-relaxed">{result}</div>
        </div>
      )}
      {/* SEO Content */}
      <section className="mt-12 pt-8 border-t prose dark:prose-invert max-w-none">
        <h2>How to Use the AI Interview Question Generator</h2>
        <ol>
          <li>Enter the job role you&rsquo;re hiring for &mdash; for example, &ldquo;Frontend Developer,&rdquo; &ldquo;Product Manager,&rdquo; &ldquo;Data Scientist,&rdquo; or &ldquo;Marketing Lead.&rdquo;</li>
          <li>Choose the type of questions: Technical/Skills to assess hard skills, Behavioral to evaluate soft skills and past experience, or Mixed for a balanced set.</li>
          <li>Adjust the number of questions using the slider &mdash; anywhere from 3 to 15 questions per set.</li>
          <li>Click &ldquo;Generate Questions&rdquo; to receive a curated list of interview questions tailored to the role.</li>
          <li>Review each question along with what interviewers look for in a strong answer and tips for candidates preparing responses.</li>
          <li>Use the Copy button to save the question set for your interview panel or share it with your hiring team.</li>
        </ol>
        <h2>Tips for Better Results</h2>
        <ul>
          <li>Be specific about the role level &mdash; include &ldquo;junior,&rdquo; &ldquo;senior,&rdquo; or &ldquo;lead&rdquo; in the role description to get questions calibrated to experience level.</li>
          <li>For technical roles, mention specific technologies or frameworks (e.g., &ldquo;React + Node.js developer&rdquo; instead of just &ldquo;web developer&rdquo;) for more relevant questions.</li>
          <li>Use Mixed mode to create well-rounded interviews that assess both technical competence and cultural fit.</li>
          <li>Generate multiple sets for different interview stages &mdash; phone screen, technical round, and final panel &mdash; each with different focus areas.</li>
        </ul>
        <h2>FAQ</h2>
        <div className="space-y-4">
          <div><h3 className="font-semibold">Can I generate questions for non-technical roles?</h3><p>Yes, the generator works for any role. Enter the job title and select Behavioral or Mixed question types. It covers everything from marketing and sales to HR and operations.</p></div>
          <div><h3 className="font-semibold">What information is included with each question?</h3><p>Every question includes context about what the interviewer should look for in a good answer, common pitfalls to watch for, and tips for candidates on how to structure their response.</p></div>
          <div><h3 className="font-semibold">How many questions should I generate for an interview?</h3><p>For a 45&ndash;60 minute interview, 5&ndash;8 questions is ideal. For phone screens, 3&ndash;5 questions work well. Use the slider to find the right quantity for your format.</p></div>
          <div><h3 className="font-semibold">Can I use these questions for self-practice?</h3><p>Absolutely. Candidates can use this tool to practice answering role-specific questions, review what interviewers look for, and prepare stronger responses before the actual interview.</p></div>
        </div>
      </section>
    </div>
  )
}
