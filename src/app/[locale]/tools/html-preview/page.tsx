'use client'

import { useTranslations } from 'next-intl'
import { useState, useRef, useEffect } from 'react'
import AdBanner from '@/components/AdBanner'

export default function HtmlPreviewPage() {
  const t = useTranslations('tools.html-preview')
  const ct = useTranslations('common')

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
  <h1 className="text-3xl font-bold mb-2">{t('h1')}</h1>
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
      <p className="text-gray-600 dark:text-gray-400 mb-6">{t('description')}</p>

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
            <label className="block text-sm font-medium mb-2">{ct("preview")}</label>
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
        <h2>{t('howto.heading')}</h2>
        <ol>
          {(t.raw('howto.steps') as string[]).map((step, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: step }} />
          ))}
        </ol>

        <h2>{t('tips.heading')}</h2>
        <ul>
          {(t.raw('tips.items') as string[]).map((item, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
          ))}
        </ul>

        <h2>{t('faq.heading')}</h2>
        <div className="space-y-4">
          {(t.raw('faq.items') as { q: string; a: string }[]).map((item, i) => (
            <div key={i}>
              <h3 className="font-semibold">{item.q}</h3>
              <p>{item.a}</p>
            </div>
          ))}
        </div></section>
    </div>
  )
}
