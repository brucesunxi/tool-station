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

      {/* SEO Content */}
      <section className="mt-12 pt-8 border-t prose dark:prose-invert max-w-none">
        <h2>How to Use the Base64 Encoder / Decoder</h2>
        <ol>
          <li>Type or paste your input text into the left text area &mdash; this can be plain text to encode or a Base64 string to decode.</li>
          <li>Click &ldquo;Encode&rdquo; to convert text to a Base64-encoded string, or click &ldquo;Decode&rdquo; to convert a Base64 string back to readable text.</li>
          <li>Upload a file using the &ldquo;Upload File&rdquo; button to convert it to a Base64 data URL &mdash; useful for embedding images in HTML or CSS.</li>
          <li>View the output in the right panel. For file uploads, a download link appears to save the decoded content.</li>
          <li>Use the Copy button to copy the result to your clipboard, or click &ldquo;Download&rdquo; for file data URLs.</li>
          <li>Click &ldquo;Clear&rdquo; to reset both input and output fields and start a new conversion.</li>
        </ol>
        <h2>Tips for Better Results</h2>
        <ul>
          <li>Use the file upload feature for binary files like images, PDFs, or audio files &mdash; the tool converts them to Base64 data URLs that work directly in HTML src attributes.</li>
          <li>When decoding, ensure the input contains only valid Base64 characters (A&ndash;Z, a&ndash;z, 0&ndash;9, +, /, =) to avoid errors.</li>
          <li>For large files, Base64 encoding increases size by approximately 33% &mdash; consider this when embedding data URLs in web pages.</li>
          <li>All processing happens entirely in your browser &mdash; no data is uploaded to any server, making it safe for sensitive content.</li>
        </ul>
        <h2>FAQ</h2>
        <div className="space-y-4">
          <div><h3 className="font-semibold">What is Base64 used for?</h3><p>Base64 encoding is commonly used to transmit binary data over text-based protocols like HTTP and SMTP. Web developers use it for data URLs in HTML and CSS, email attachments, and API payloads.</p></div>
          <div><h3 className="font-semibold">Does the tool handle file encoding?</h3><p>Yes, use the &ldquo;Upload File&rdquo; button to select any file (image, PDF, audio, etc.). The tool converts it to a Base64 data URL that can be used directly in HTML, CSS, or JavaScript.</p></div>
          <div><h3 className="font-semibold">Is my data safe when using this tool?</h3><p>Yes, all encoding and decoding operations run entirely in your browser using JavaScript&rsquo;s built-in btoa() and atob() functions. No data is sent to any server.</p></div>
          <div><h3 className="font-semibold">What does the error &ldquo;Invalid Base64 string&rdquo; mean?</h3><p>This means the input contains characters that aren&rsquo;t valid in Base64 encoding. Base64 strings should only contain A&ndash;Z, a&ndash;z, 0&ndash;9, +, /, and = characters.</p></div>
        </div>
      </section>
    </div>
  )
}
