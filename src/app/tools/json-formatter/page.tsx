'use client'

import { useState, useCallback } from 'react'
import AdBanner from '@/components/AdBanner'

type ResultStatus = 'idle' | 'success' | 'error'

export default function JsonFormatterPage() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [status, setStatus] = useState<ResultStatus>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [copyText, setCopyText] = useState('Copy')

  const format = useCallback((mode: 'format' | 'minify') => {
    if (!input.trim()) {
      setStatus('error')
      setErrorMsg('Please enter JSON to format')
      return
    }

    try {
      const parsed = JSON.parse(input)
      const result = mode === 'format'
        ? JSON.stringify(parsed, null, 2)
        : JSON.stringify(parsed)
      setOutput(result)
      setStatus('success')
      setErrorMsg('')
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Invalid JSON'
      setStatus('error')
      setErrorMsg(msg)
      setOutput('')
    }
  }, [input])

  const handleCopy = useCallback(async () => {
    if (!output) return
    try {
      await navigator.clipboard.writeText(output)
      setCopyText('Copied!')
      setTimeout(() => setCopyText('Copy'), 2000)
    } catch {
      setCopyText('Failed')
      setTimeout(() => setCopyText('Copy'), 2000)
    }
  }, [output])

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">JSON Formatter</h1>
        <p className="text-gray-500">
          Format, validate, and minify JSON data. Works entirely in your browser.
        </p>
      </div>

      <AdBanner className="mb-8 h-20" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">Input JSON</label>
            <span className="text-xs text-gray-400">{input.length} chars</span>
          </div>
          <textarea
            value={input}
            onChange={e => { setInput(e.target.value); setStatus('idle') }}
            placeholder='{"key": "value", "array": [1, 2, 3]}'
            rows={16}
            className="w-full p-4 border rounded-xl resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm dark:bg-gray-800 dark:border-gray-700"
          />
        </div>

        {/* Output */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">Output</label>
            {output && (
              <button
                onClick={handleCopy}
                className="text-xs px-2 py-1 border rounded hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                {copyText}
              </button>
            )}
          </div>
          <div className="relative">
            <textarea
              value={output}
              readOnly
              rows={16}
              className={`w-full p-4 border rounded-xl resize-y font-mono text-sm dark:bg-gray-800 dark:border-gray-700 ${
                status === 'success'
                  ? 'border-green-300 bg-green-50/50 dark:bg-green-900/10'
                  : status === 'error'
                  ? 'border-red-300 bg-red-50/50 dark:bg-red-900/10'
                  : ''
              }`}
              placeholder="Formatted JSON will appear here..."
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 mt-4">
        <button
          onClick={() => format('format')}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Format
        </button>
        <button
          onClick={() => format('minify')}
          className="px-6 py-2.5 border rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          Minify
        </button>
        <button
          onClick={() => { setInput(''); setOutput(''); setStatus('idle'); setErrorMsg('') }}
          className="px-6 py-2.5 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          Clear
        </button>
        <div className="flex items-center gap-2 ml-auto text-sm">
          {status === 'success' && (
            <span className="text-green-600">
              ✓ Valid JSON ({output.length} bytes)
            </span>
          )}
        </div>
      </div>

      {/* Error */}
      {status === 'error' && errorMsg && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-lg text-red-600 text-sm font-mono">
          ✗ {errorMsg}
        </div>
      )}

      {/* Examples */}
      <div className="mt-8">
        <h2 className="text-lg font-bold mb-3">Try an example</h2>
        <div className="flex flex-wrap gap-2">
          {examples.map((ex, i) => (
            <button
              key={i}
              onClick={() => setInput(ex)}
              className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              {exLabels[i]}
            </button>
          ))}
        </div>
      </div>

      {/* SEO Content */}
      <div className="mt-12 pt-8 border-t">
        <h2 className="text-xl font-bold mb-4">Online JSON Formatter &amp; Validator</h2>
        <div className="text-sm text-gray-500 space-y-3">
          <p>
            A free online tool to format, validate, and minify JSON data. Perfect for developers
            working with APIs, configuration files, or any JSON data structure.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Format messy JSON into readable, indented structure</li>
            <li>Minify JSON to reduce file size for production</li>
            <li>Validate JSON syntax with detailed error messages</li>
            <li>All processing happens in your browser &mdash; no data is sent to any server</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

const examples = [
  JSON.stringify({ name: 'John', age: 30, city: 'New York', hobbies: ['reading', 'coding', 'hiking'] }),
  JSON.stringify({
    users: [
      { id: 1, name: 'Alice', email: 'alice@example.com', role: 'admin' },
      { id: 2, name: 'Bob', email: 'bob@example.com', role: 'user' },
      { id: 3, name: 'Charlie', email: 'charlie@example.com', role: 'user' },
    ],
    total: 3,
    page: 1,
  }),
  JSON.stringify({
    apiVersion: 'v2',
    endpoints: {
      posts: '/api/posts',
      comments: '/api/comments',
      users: '/api/users',
    },
    rateLimit: { requests: 100, period: 60, unit: 'seconds' },
    caching: { enabled: true, ttl: 300 },
  }),
]

const exLabels = ['Simple Object', 'Array of Users', 'API Config']
