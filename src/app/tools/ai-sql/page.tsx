'use client'

import { useState } from 'react'
import AdBanner from '@/components/AdBanner'

export default function AiSqlPage() {
  const [question, setQuestion] = useState('')
  const [dialect, setDialect] = useState('standard')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!question.trim()) return
    setLoading(true); setError(null); setResult('')
    try {
      const res = await fetch('/api/sql', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, dialect }),
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
        <h1 className="text-3xl font-bold mb-2">AI SQL Generator</h1>
        <p className="text-gray-500">Describe what data you need, and AI writes the SQL query. Supports multiple SQL dialects.</p>
      </div>
      <AdBanner className="mb-8 h-20" />
      <textarea value={question} onChange={e => setQuestion(e.target.value)} rows={5}
        placeholder="e.g. Find all customers who made a purchase in the last 30 days, Get top 10 products by revenue this year..."
        className="w-full p-4 border rounded-xl resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm dark:bg-gray-800 dark:border-gray-700 mb-3"
      />
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">SQL Dialect</label>
        <select value={dialect} onChange={e => setDialect(e.target.value)}
          className="w-full p-2.5 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="standard">Standard SQL</option>
          <option value="postgresql">PostgreSQL</option>
          <option value="mysql">MySQL</option>
          <option value="sqlite">SQLite</option>
          <option value="mssql">SQL Server</option>
        </select>
      </div>
      <button onClick={handleGenerate} disabled={loading || !question.trim()}
        className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors">
        {loading ? '🤖 Generating...' : '💾 Generate SQL'}
      </button>
      {error && <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>}
      {result && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-sm">SQL Query</h3>
            <button onClick={handleCopy} className="text-xs px-2 py-1 border rounded hover:bg-gray-50 dark:hover:bg-gray-800">Copy</button>
          </div>
          <div className="p-4 border rounded-xl bg-green-50/50 dark:bg-green-900/10 dark:border-green-900/30 text-sm whitespace-pre-wrap leading-relaxed font-mono">{result}</div>
        </div>
      )}
      {/* SEO Content */}
      <section className="mt-12 pt-8 border-t prose dark:prose-invert max-w-none">
        <h2>How to Use the AI SQL Generator</h2>
        <ol>
          <li>Describe the data you need in plain English &mdash; for example, &ldquo;Find all customers who made a purchase in the last 30 days&rdquo; or &ldquo;Get the top 10 products by revenue this year.&rdquo;</li>
          <li>Select your SQL dialect from the dropdown (Standard SQL, PostgreSQL, MySQL, SQLite, or SQL Server) to ensure dialect-specific syntax.</li>
          <li>Click &ldquo;Generate SQL&rdquo; to submit your request to the AI.</li>
          <li>Review the generated query, including table aliases, JOIN conditions, aggregations, and filtering logic.</li>
          <li>Use the Copy button to copy the query and paste it into your database client or application code.</li>
          <li>Test the query against your actual database schema and adjust the description if column or table names don&rsquo;t match your schema.</li>
        </ol>
        <h2>Tips for Better Results</h2>
        <ul>
          <li>Include your actual table and column names in the description so the generated query references real schema objects.</li>
          <li>Specify whether you need JOINs, subqueries, CTEs, window functions, or aggregations like GROUP BY and HAVING.</li>
          <li>Mention any performance considerations such as the expected data volume or required indexes.</li>
          <li>Always review generated queries for correctness, especially DELETE, UPDATE, and DROP statements, before running them on production databases.</li>
        </ul>
        <h2>FAQ</h2>
        <div className="space-y-4">
          <div><h3 className="font-semibold">Does the generator support specific SQL dialects?</h3><p>Yes, you can choose from Standard SQL, PostgreSQL, MySQL, SQLite, and SQL Server. The AI tailors syntax, functions, and data types to the selected dialect.</p></div>
          <div><h3 className="font-semibold">Can it generate complex queries with JOINs and subqueries?</h3><p>Absolutely. Describe the relationships between tables and the data you need &mdash; the AI can produce multi-table JOINs, nested subqueries, CTEs, window functions, and more.</p></div>
          <div><h3 className="font-semibold">How should I provide table and column names?</h3><p>Include your actual schema names in the description. For example, &ldquo;From the orders table with columns id, customer_id, and total_amount&hellip;&rdquo; produces more accurate results.</p></div>
          <div><h3 className="font-semibold">Is the generated query guaranteed to be correct?</h3><p>The AI produces syntactically valid SQL, but correctness depends on your schema. Always review and test generated queries against your database before using them in production.</p></div>
        </div>
      </section>
    </div>
  )
}
