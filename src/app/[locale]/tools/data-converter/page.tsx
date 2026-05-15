'use client'

import { useState } from 'react'
import AdBanner from '@/components/AdBanner'

const formats = ['JSON', 'YAML']

export default function DataConverterPage() {
  const [input, setInput] = useState('')
  const [fromFmt, setFromFmt] = useState('JSON')
  const [toFmt, setToFmt] = useState('YAML')
  const [output, setOutput] = useState('')
  const [error, setError] = useState<string | null>(null)

  const convert = async () => {
    if (!input.trim()) return
    setError(null)
    try {
      let parsed: any

      if (fromFmt === 'YAML') {
        const yaml = await import('js-yaml')
        parsed = yaml.load(input)
      } else {
        parsed = JSON.parse(input)
      }

      if (parsed === undefined || parsed === null) {
        throw new Error('Empty or invalid data')
      }

      if (toFmt === 'YAML') {
        const yaml = await import('js-yaml')
        setOutput(yaml.dump(parsed, { indent: 2, lineWidth: -1, noRefs: true }))
      } else {
        setOutput(JSON.stringify(parsed, null, 2))
      }
    } catch (e: any) {
      setError(`Conversion error: ${e.message}`)
      setOutput('')
    }
  }

  const handleCopy = () => { if (output) navigator.clipboard.writeText(output).catch(() => {}) }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Data Converter</h1>
        <p className="text-gray-500">Convert between JSON and YAML formats. Perfect for configuration files and data serialization.</p>
      </div>
      <AdBanner className="mb-8 h-20" />

      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1">
          <select value={fromFmt} onChange={e => setFromFmt(e.target.value)}
            className="w-full p-2.5 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            {formats.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
        <button onClick={() => { const t = fromFmt; setFromFmt(toFmt); setToFmt(t); setOutput(''); setError(null) }}
          className="p-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 shrink-0">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
        </button>
        <div className="flex-1">
          <select value={toFmt} onChange={e => setToFmt(e.target.value)}
            className="w-full p-2.5 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            {formats.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Input ({fromFmt})</label>
          <textarea value={input} onChange={e => setInput(e.target.value)} rows={16}
            placeholder={`Paste ${fromFmt} data here...`}
            className="w-full p-4 border rounded-xl resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-mono dark:bg-gray-800 dark:border-gray-700" />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">Output ({toFmt})</label>
            {output && <button onClick={handleCopy} className="text-xs px-2 py-1 border rounded hover:bg-gray-50 dark:hover:bg-gray-800">Copy</button>}
          </div>
          <div className={`min-h-[400px] p-4 border rounded-xl text-sm font-mono whitespace-pre-wrap ${
            output ? 'border-green-200 bg-green-50/50 dark:bg-green-900/10' : 'bg-gray-50 dark:bg-gray-800/50'
          }`}>
            {output || <p className="font-sans text-gray-400">{error || `Converted ${toFmt} will appear here...`}</p>}
          </div>
        </div>
      </div>

      <button onClick={convert} disabled={!input.trim()}
        className="w-full mt-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors">
        Convert to {toFmt}
      </button>

      {error && <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>}

      {/* SEO Content */}
      <section className="mt-12 pt-8 border-t prose dark:prose-invert max-w-none">
        <h2>How to Use</h2>
        <ol>
          <li>Select the input format (JSON or YAML) from the left dropdown menu.</li>
          <li>Select the output format (YAML or JSON) from the right dropdown menu.</li>
          <li>Paste your input data into the text area on the left side of the screen.</li>
          <li>Click "Convert to [format]" to transform your data into the selected output format.</li>
          <li>Use the "Copy" button to copy the converted output, or click the swap button to reverse the conversion direction.</li>
        </ol>
        <h2>Tips</h2>
        <ul>
          <li>Validate your JSON with a linter before converting if the conversion fails -- common issues include trailing commas and missing quotes.</li>
          <li>YAML is more readable for human-edited configuration files, while JSON is better for API data exchange and programmatic processing.</li>
          <li>Use the swap button to quickly toggle between conversion directions instead of manually changing both dropdowns.</li>
        </ul>
        <h2>FAQ</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">Does the converter support nested objects and arrays?</h3>
            <p>Yes. The converter handles deeply nested structures including objects, arrays, and mixed data types of any complexity.</p>
          </div>
          <div>
            <h3 className="font-semibold">What happens if my input data has comments?</h3>
            <p>JSON does not support comments, so they will cause a parse error. YAML supports comments, and they will be preserved during conversion.</p>
          </div>
          <div>
            <h3 className="font-semibold">Is my data uploaded to any server?</h3>
            <p>No. All conversion happens in your browser using client-side libraries. Your data never leaves your computer.</p>
          </div>
          <div>
            <h3 className="font-semibold">Why does my JSON conversion fail?</h3>
            <p>Common causes include trailing commas, unquoted keys, single quotes instead of double quotes, or missing brackets. Use a JSON validator to check your input.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
