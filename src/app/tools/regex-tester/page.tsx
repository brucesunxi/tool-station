'use client'

import { useState, useMemo, useCallback } from 'react'
import AdBanner from '@/components/AdBanner'

interface Match {
  text: string
  index: number
  groups: string[]
}

export default function RegexTesterPage() {
  const [pattern, setPattern] = useState('(\\w+)@(\\w+\\.\\w+)')
  const [flags, setFlags] = useState('g')
  const [testText, setTestText] = useState('alice@example.com\nbob@test.org\nhello world')
  const [error, setError] = useState<string | null>(null)

  const flagsConfig = [
    { value: 'g', label: 'g', desc: 'Global' },
    { value: 'i', label: 'i', desc: 'Ignore case' },
    { value: 'm', label: 'm', desc: 'Multiline' },
    { value: 's', label: 's', desc: 'Dotall' },
  ]

  const toggleFlag = useCallback((flag: string) => {
    setFlags(prev => prev.includes(flag) ? prev.replace(flag, '') : prev + flag)
  }, [])

  const { matches, totalMatches, highlighted } = useMemo(() => {
    if (!pattern) return { matches: [], totalMatches: 0, highlighted: testText }
    try {
      const regex = new RegExp(pattern, flags)
      const matches: Match[] = []
      let match
      let total = 0
      while ((match = regex.exec(testText)) !== null) {
        matches.push({
          text: match[0],
          index: match.index,
          groups: match.slice(1),
        })
        total++
        if (!flags.includes('g')) break
      }

      // Build highlighted text
      let highlighted = ''
      let lastIndex = 0
      matches.forEach(m => {
        highlighted += escapeHtml(testText.slice(lastIndex, m.index))
        highlighted += `<mark class="bg-yellow-300 dark:bg-yellow-700 rounded px-0.5">${escapeHtml(m.text)}</mark>`
        lastIndex = m.index + m.text.length
      })
      highlighted += escapeHtml(testText.slice(lastIndex))
      highlighted = highlighted.replace(/\n/g, '<br/>')

      return { matches, totalMatches: total, highlighted }
    } catch (e: any) {
      setError(e.message)
      return { matches: [], totalMatches: 0, highlighted: testText }
    }
  }, [pattern, flags, testText])

  const presets = [
    { label: 'Email', pattern: '([\\w.-]+)@([\\w.-]+\\.\\w+)', flags: 'g' },
    { label: 'URL', pattern: 'https?://[\\w./-]+', flags: 'g' },
    { label: 'Phone', pattern: '\\+?\\d{1,3}[-.\\s]?\\(?\\d{1,4}?[-.\\s]?\\d{1,4}[-.\\s]?\\d{1,9}', flags: 'g' },
    { label: 'IP Address', pattern: '\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b', flags: 'g' },
    { label: 'Date', pattern: '\\d{4}-\\d{2}-\\d{2}', flags: 'g' },
    { label: 'HTML Tag', pattern: '<[^>]+>', flags: 'g' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Regex Tester</h1>
        <p className="text-gray-500">Test regular expressions in real-time with highlighted matches.</p>
      </div>
      <AdBanner className="mb-8 h-20" />

      {/* Pattern */}
      <div className="mb-4">
        <label className="text-sm font-medium mb-2 block">Regular Expression</label>
        <div className="flex gap-2 items-stretch">
          <span className="flex items-center text-lg font-mono text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 rounded-l-lg border">/</span>
          <input value={pattern} onChange={e => { setPattern(e.target.value); setError(null) }}
            className="flex-1 p-3 border-y font-mono dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="pattern" />
          <span className="flex items-center text-lg font-mono text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 border-y">/</span>
          <input value={flags} onChange={e => { setFlags(e.target.value); setError(null) }}
            className="w-16 p-3 border font-mono dark:bg-gray-800 dark:border-gray-700 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="g" />
        </div>
      </div>

      {/* Flags */}
      <div className="flex gap-2 mb-4">
        {flagsConfig.map(f => (
          <button key={f.value} onClick={() => toggleFlag(f.value)}
            className={`px-3 py-1.5 border rounded-lg text-xs font-mono transition-all ${flags.includes(f.value) ? 'bg-blue-600 text-white border-blue-600' : 'hover:border-blue-400'}`}
            title={f.desc}>{f.label}</button>
        ))}
        <span className="text-xs text-gray-400 self-center ml-2">{totalMatches} match{totalMatches !== 1 ? 'es' : ''}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Test Text</label>
          <textarea value={testText} onChange={e => setTestText(e.target.value)} rows={14}
            className="w-full p-4 border rounded-xl resize-y text-sm font-mono dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">Matches {error && <span className="text-red-500 text-xs ml-2">{error}</span>}</label>
          <div className="w-full min-h-[300px] p-4 border rounded-xl text-sm font-mono bg-gray-50 dark:bg-gray-800 dark:border-gray-700 overflow-auto whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: error ? escapeHtml(testText) : highlighted }} />
        </div>
      </div>

      {/* Details */}
      {matches.length > 0 && (
        <div className="border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="text-left p-2">#</th>
                <th className="text-left p-2">Match</th>
                <th className="text-left p-2">Position</th>
                <th className="text-left p-2">Groups</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {matches.map((m, i) => (
                <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 font-mono">
                  <td className="p-2 text-gray-400">{i + 1}</td>
                  <td className="p-2">{m.text}</td>
                  <td className="p-2 text-gray-400">{m.index}</td>
                  <td className="p-2">{m.groups.length > 0 ? m.groups.map((g, j) => <span key={j} className="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded text-xs mr-1">{g}</span>) : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Presets */}
      <div className="mt-6">
        <label className="text-sm font-medium mb-2 block">Common Patterns</label>
        <div className="flex flex-wrap gap-2">
          {presets.map(p => (
            <button key={p.label} onClick={() => { setPattern(p.pattern); setFlags(p.flags); setError(null) }}
              className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">{p.label}</button>
          ))}
        </div>
      </div>

      {/* SEO Content */}
      <section className="mt-12 pt-8 border-t prose dark:prose-invert max-w-none">
        <h2>How to Use the Regex Tester</h2>
        <ol>
          <li>Type or paste your regular expression pattern in the input field between the two slashes. The tool provides a default pattern to get started.</li>
          <li>Add flags (g for global, i for case-insensitive, m for multiline, s for dotall) by toggling the buttons below the pattern field.</li>
          <li>Enter your test text in the left text area &mdash; the tool highlights all matches in real time as you type the pattern or change the flags.</li>
          <li>View the highlighted matches in the right panel, where matched portions are shown with a yellow background.</li>
          <li>Review the match details table below showing each match&rsquo;s position in the text and any captured groups.</li>
          <li>Use the common pattern presets (Email, URL, Phone, IP Address, Date, HTML Tag) to load predefined regex patterns for quick testing.</li>
        </ol>
        <h2>Tips for Better Results</h2>
        <ul>
          <li>Use the &ldquo;g&rdquo; (global) flag when you want to find all matches in the text. Without it, the tester stops after the first match.</li>
          <li>The match details table shows captured groups (text matched by parts of the pattern inside parentheses) &mdash; use groups to extract specific portions of each match.</li>
          <li>Start with simple patterns and gradually add complexity &mdash; test each addition to isolate which part of the regex causes unexpected behavior.</li>
          <li>Use the common pattern presets as a starting point and customize them for your specific use case.</li>
        </ul>
        <h2>FAQ</h2>
        <div className="space-y-4">
          <div><h3 className="font-semibold">What regex engine does this tester use?</h3><p>The tester uses JavaScript&rsquo;s built-in RegExp engine. While most standard patterns work across languages, some features like lookbehinds may behave differently in JavaScript than in PCRE or Python.</p></div>
          <div><h3 className="font-semibold">What do the flag buttons (g, i, m, s) do?</h3><p>g (global) finds all matches, i (ignore case) makes matching case-insensitive, m (multiline) changes ^ and $ to match line boundaries, and s (dotall) makes the dot match newline characters.</p></div>
          <div><h3 className="font-semibold">How do I extract part of a match using capture groups?</h3><p>Wrap the portion you want to extract in parentheses in your pattern. For example, (\w+)@(\w+\.\w+) captures the username and domain separately from an email address.</p></div>
          <div><h3 className="font-semibold">Is my data safe when using this tool?</h3><p>Yes, all regex testing happens entirely in your browser. Your patterns and test text are never sent to any server.</p></div>
        </div>
      </section>
    </div>
  )
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
