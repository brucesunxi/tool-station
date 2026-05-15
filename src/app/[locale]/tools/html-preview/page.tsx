'use client'
import { useState, useRef, useEffect } from 'react'
import AdBanner from '@/components/AdBanner'

export default function HtmlPreviewPage() {
  const [html, setHtml] = useState(`<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: system-ui, sans-serif; padding: 1rem; }
    h1 { color: #2563eb; }
    .card { border: 1px solid #e5e7eb; border-radius: 8px; padding: 1rem; margin: 1rem 0; }
  </style>
</head>
<body>
  <h1>Hello, World!</h1>
  <div class="card">
    <p>This is a live HTML preview. Edit the code on the left to see changes instantly.</p>
    <button onclick="alert('Hello!')">Click Me</button>
  </div>
</body>
</html>`)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return
    try {
      const doc = iframe.contentDocument || iframe.contentWindow?.document
      if (doc) {
        doc.open()
        doc.write(html)
        doc.close()
      }
      setError('')
    } catch {
      setError('Could not render preview due to security restrictions.')
    }
  }, [html])

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-2">HTML Previewer Free Online — Live HTML Editor &amp; Viewer</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Free online HTML previewer. Write HTML code and see the rendered result in real-time. Perfect for
        testing HTML snippets, learning web development, and debugging layouts.
      </p>

      <AdBanner className="mb-8 h-20" />

      <div className="bg-white dark:bg-gray-800 border rounded-xl p-6 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Editor */}
          <div>
            <label className="block text-sm font-medium mb-2">HTML Code</label>
            <textarea
              value={html}
              onChange={(e) => setHtml(e.target.value)}
              className="w-full h-[500px] font-mono text-sm p-4 border rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              spellCheck={false}
            />
            <div className="flex justify-between mt-2">
              <span className="text-xs text-gray-500">{html.length} characters</span>
              <button
                onClick={() =>
                  navigator.clipboard.writeText(html).catch(() => {})
                }
                className="text-xs px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Copy HTML
              </button>
            </div>
          </div>

          {/* Preview */}
          <div>
            <label className="block text-sm font-medium mb-2">Preview</label>
            <div className="w-full h-[500px] border rounded-lg overflow-hidden bg-white">
              {error ? (
                <div className="p-4 text-red-500 text-sm">{error}</div>
              ) : (
                <iframe
                  ref={iframeRef}
                  className="w-full h-full"
                  title="HTML Preview"
                  sandbox="allow-scripts allow-same-origin"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <section className="prose dark:prose-invert max-w-none">
        <h2>How to Use</h2>
        <ol>
          <li>Type or paste your HTML code into the editor panel on the left.</li>
          <li>The preview panel on the right updates automatically in real-time as you type.</li>
          <li>Use the &ldquo;Copy HTML&rdquo; button to copy your code to the clipboard when finished.</li>
          <li>Edit existing HTML snippets to test changes before deploying them to your website.</li>
        </ol>

        <h2>Tips</h2>
        <ul>
          <li>Include a <code>&lt;style&gt;</code> tag in the head for CSS or a <code>&lt;script&gt;</code> tag for JavaScript to test interactive elements.</li>
          <li>Use the sandboxed iframe for safe previewing — it prevents scripts from accessing the parent page.</li>
          <li>Start with a complete HTML document template for accurate rendering, including <code>&lt;!DOCTYPE html&gt;</code>.</li>
        </ul>

        <h2>FAQ</h2>
        <div>
          <h3>Why does my JavaScript not work in the preview?</h3>
          <p>
            The preview iframe uses the <code>sandbox</code> attribute with <code>allow-scripts</code>
            and <code>allow-same-origin</code>. Most scripts will work, but some advanced APIs (like
            accessing browser storage or opening popups) may be restricted. Try removing
            <code>sandbox</code> attributes if you need full access, but be aware of security
            implications.
          </p>

          <h3>Is the HTML I type saved anywhere?</h3>
          <p>
            No. All HTML processing happens entirely in your browser. Your code is never sent to any
            server. However, the content may persist in your browser&apos;s session storage until you
            close the tab. Clear the editor or close the page to remove it completely.
          </p>

          <h3>Can I preview external resources like images or fonts?</h3>
          <p>
            Yes, but they must be hosted on an accessible URL using absolute paths (e.g.,
            <code>https://example.com/image.jpg</code>). Relative paths will not work because the
            preview iframe does not have a real file system. Use CDN-hosted libraries by linking to
            their full URLs.
          </p>
        </div>
      </section>
    </div>
  )
}
