'use client'

import { useState, useCallback } from 'react'
import AdBanner from '@/components/AdBanner'

export default function Base64Page() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')
  const [copyText, setCopyText] = useState('Copy')

  const handleEncode = useCallback(() => {
    try {
      setOutput(btoa(input))
      setMode('encode')
    } catch {
      setOutput('Error: Cannot encode - invalid characters')
    }
  }, [input])

  const handleDecode = useCallback(() => {
    try {
      setOutput(atob(input))
      setMode('decode')
    } catch {
      setOutput('Error: Invalid Base64 string')
    }
  }, [input])

  const handleFileToBase64 = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setOutput(reader.result as string)
    reader.readAsDataURL(file)
  }, [])

  const handleCopy = async () => {
    if (!output) return
    try {
      await navigator.clipboard.writeText(output)
      setCopyText('Copied!')
      setTimeout(() => setCopyText('Copy'), 2000)
    } catch { /* ignore */ }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Base64 Encoder / Decoder</h1>
        <p className="text-gray-500">Encode text or files to Base64, or decode Base64 back to text.</p>
      </div>
      <AdBanner className="mb-8 h-20" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Input</label>
          <textarea value={input} onChange={e => setInput(e.target.value)} rows={10}
            placeholder="Enter text to encode / decode..."
            className="w-full p-4 border rounded-xl resize-y text-sm font-mono dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">Output</label>
            {output && !output.startsWith('data:') && (
              <button onClick={handleCopy} className="text-xs px-2 py-1 border rounded hover:bg-gray-50 dark:hover:bg-gray-800">{copyText}</button>
            )}
          </div>
          <textarea value={output} readOnly rows={10}
            className="w-full p-4 border rounded-xl resize-y text-sm font-mono bg-gray-50 dark:bg-gray-800 dark:border-gray-700" placeholder="Result will appear here..." />
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mt-4">
        <button onClick={handleEncode} className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Encode →</button>
        <button onClick={handleDecode} className="px-6 py-2.5 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">← Decode</button>
        <button onClick={() => { setInput(''); setOutput('') }} className="px-6 py-2.5 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Clear</button>
        <label className="px-6 py-2.5 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
          Upload File
          <input type="file" onChange={handleFileToBase64} className="hidden" />
        </label>
        {output.startsWith('data:') && (
          <a href={output} download="file" className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">Download</a>
        )}
      </div>

      <div className="mt-12 pt-8 border-t">
        <h2 className="text-xl font-bold mb-4">Free Online Base64 Encoder &amp; Decoder</h2>
        <p className="text-sm text-gray-500">Encode text to Base64, decode Base64 strings, or convert files to data URLs. All processing is done in your browser.</p>
      </div>
    </div>
  )
}
