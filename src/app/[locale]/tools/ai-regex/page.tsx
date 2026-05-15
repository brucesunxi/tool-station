'use client'

import { useState } from 'react'
import Link from 'next/link'
import AdBanner from '@/components/AdBanner'

export default function AiRegexPage() {
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!description.trim()) return
    setLoading(true); setError(null); setResult('')
    try {
      const res = await fetch('/api/regex-gen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Generation failed')
      setResult(data.result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => { if (result) navigator.clipboard.writeText(result).catch(() => {}) }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">AI Regex Generator</h1>
        <p className="text-gray-500">Describe what you need to match, and AI will write the regex for you.</p>
      </div>

      <AdBanner className="mb-8 h-20" />

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Describe what you need to match</label>
        <textarea value={description} onChange={e => setDescription(e.target.value)}
          placeholder="e.g. Match email addresses, Extract all URLs from text, Validate phone numbers in US format..."
          rows={4}
          className="w-full p-4 border rounded-xl resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm dark:bg-gray-800 dark:border-gray-700"
        />
      </div>

      <button onClick={handleGenerate} disabled={loading || !description.trim()}
        className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors">
        {loading ? '🤖 Generating...' : '🔍 Generate Regex'}
      </button>

      {error && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>
      )}

      {result && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-sm">Result</h3>
            <button onClick={handleCopy} className="text-xs px-2 py-1 border rounded hover:bg-gray-50 dark:hover:bg-gray-800">Copy</button>
          </div>
          <div className="p-4 border rounded-xl bg-green-50/50 dark:bg-green-900/10 dark:border-green-900/30 text-sm whitespace-pre-wrap leading-relaxed">
            {result}
          </div>
          <p className="mt-3 text-xs text-gray-400">
            Test your regex with our{' '}
            <Link href="/tools/regex-tester" className="text-blue-600 dark:text-blue-400 hover:underline">Regex Tester</Link>.
          </p>
        </div>
      )}

      {/* SEO Content */}
      <section className="mt-12 pt-8 border-t prose dark:prose-invert max-w-none">
        <h2>How to Use the AI Regex Generator</h2>
        <ol>
          <li>Type a plain English description of the text pattern you want to match into the text area &mdash; for example, &ldquo;Match email addresses&rdquo; or &ldquo;Extract all URLs from text.&rdquo;</li>
          <li>Click the &ldquo;Generate Regex&rdquo; button to submit your description to the AI and receive a complete regular expression.</li>
          <li>Review the generated pattern, which includes the regex itself, a plain English explanation, and example matches.</li>
          <li>Click the Copy button to copy the regex to your clipboard for use in your code, editor, or command line.</li>
          <li>Test the generated regex against your actual text samples using the built-in Regex Tester to verify it matches as expected.</li>
          <li>Refine your description and regenerate if the result doesn&rsquo;t capture all desired matches or misses edge cases.</li>
        </ol>
        <h2>Tips for Better Results</h2>
        <ul>
          <li>Be as specific as possible &mdash; include details about character types (digits, letters, whitespace) and whether matching should be case-sensitive.</li>
          <li>Mention which regex flavor you use (PCRE, JavaScript, Python, etc.) so the generated pattern uses compatible syntax and features.</li>
          <li>Describe edge cases explicitly, such as optional characters, repeating patterns, empty strings, or nested structures you need to handle.</li>
          <li>Always test AI-generated regex against representative sample data before using it in production systems.</li>
        </ul>
        <h2>FAQ</h2>
        <div className="space-y-4">
          <div><h3 className="font-semibold">What regex flavors does the AI support?</h3><p>The AI generates regex compatible with PCRE, JavaScript, Python, Java, .NET, and most other major regex engines. Specify your preferred flavor in the description for best results.</p></div>
          <div><h3 className="font-semibold">Can the AI explain what each part of the regex does?</h3><p>Yes, along with the pattern the AI provides a plain English breakdown of each component &mdash; anchors, character classes, quantifiers, groups, and flags &mdash; so you understand how it works.</p></div>
          <div><h3 className="font-semibold">How accurate is AI-generated regex?</h3><p>The AI produces functional patterns for most common use cases. Complex nested patterns or those with many overlapping conditions should always be tested thoroughly before deployment.</p></div>
          <div><h3 className="font-semibold">Is my data sent to a server when generating regex?</h3><p>Yes, your description is sent to the AI API to generate the regex. Avoid submitting sensitive or proprietary pattern descriptions.</p></div>
        </div>
      </section>
    </div>
  )
}
