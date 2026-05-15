'use client'

import { useState, useMemo } from 'react'
import AdBanner from '@/components/AdBanner'

const sample = `# Hello Markdown

## Text Formatting

**Bold**, *italic*, ~~strikethrough~~, \`inline code\`

## Lists

- Item 1
- Item 2
  - Nested item

1. First
2. Second

## Links & Images

[Visit ToolStation](https://toolstation.top)

## Code

\`\`\`javascript
function hello() {
  console.log("Hello World!");
}
\`\`\`

## Blockquotes

> This is a blockquote.
> Multiple lines supported.

## Tables

| Name | Type | Default |
|------|------|---------|
| size | number | 16 |
| theme | string | light |

---

Start typing on the left to see the preview →
`

export default function MarkdownEditorPage() {
  const [text, setText] = useState(sample)
  const [html, setHtml] = useState('')
  const [error, setError] = useState<string | null>(null)

  useMemo(async () => {
    try {
      const { marked } = await import('marked')
      const rendered = await marked.parse(text, { breaks: true, gfm: true })
      setHtml(rendered)
      setError(null)
    } catch (e: any) {
      setError(e.message)
    }
  }, [text])

  const handleCopyHtml = () => { navigator.clipboard.writeText(html).catch(() => {}) }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Markdown Editor</h1>
        <p className="text-gray-500">Write and preview Markdown in real-time. Supports GFM tables, code blocks, and more.</p>
      </div>
      <AdBanner className="mb-8 h-20" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Markdown</label>
          <textarea value={text} onChange={e => setText(e.target.value)} rows={20}
            className="w-full p-4 border rounded-xl resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-mono dark:bg-gray-800 dark:border-gray-700" />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">Preview</label>
            {html && <button onClick={handleCopyHtml} className="text-xs px-2 py-1 border rounded hover:bg-gray-50 dark:hover:bg-gray-800">Copy HTML</button>}
          </div>
          <div className="min-h-[520px] p-4 border rounded-xl bg-white dark:bg-gray-800/50 prose prose-sm dark:prose-invert max-w-none overflow-auto">
            {error ? (
              <p className="text-red-500 text-sm">{error}</p>
            ) : (
              <div dangerouslySetInnerHTML={{ __html: html }} />
            )}
          </div>
        </div>
      </div>

      <section className="mt-12 pt-8 border-t prose dark:prose-invert max-w-none">
        <h2>How to Use</h2>
        <ol>
          <li>Type or paste Markdown syntax in the left editor panel &mdash; a sample document is provided to get started.</li>
          <li>Watch the live HTML preview update in the right panel as you type.</li>
          <li>Use standard Markdown elements: headings, bold, italic, lists, links, and images.</li>
          <li>Try GFM features: tables, fenced code blocks, strikethrough, and blockquotes.</li>
          <li>Click <strong>Copy HTML</strong> above the preview panel to copy the rendered HTML to your clipboard.</li>
          <li>Paste your Markdown source into a .md file or the HTML into your CMS or website.</li>
        </ol>
        <h2>Tips</h2>
        <ul>
          <li>The sample text demonstrates all major Markdown features &mdash; use it as a reference for syntax.</li>
          <li>Tables must have header rows separated by dashes (<code>| --- |</code>) to render correctly.</li>
          <li>Code blocks with a language identifier (e.g., <code>```javascript</code>) receive syntax highlighting in the preview.</li>
          <li>Strikethrough text is created by wrapping words in double tildes: <code>~~text~~</code>.</li>
        </ul>
        <h2>FAQ</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">What is GFM?</h3>
            <p>GFM stands for GitHub Flavored Markdown. It extends standard Markdown with tables, task lists, strikethrough, and automatic URL linking.</p>
          </div>
          <div>
            <h3 className="font-semibold">Can I copy the HTML output?</h3>
            <p>Yes, click the <strong>Copy HTML</strong> button above the preview panel to copy the rendered HTML to your clipboard.</p>
          </div>
          <div>
            <h3 className="font-semibold">Is the rendering done server-side?</h3>
            <p>No, Markdown is rendered entirely in your browser using the marked.js library. No data is sent to any server.</p>
          </div>
          <div>
            <h3 className="font-semibold">Can I save my work?</h3>
            <p>The editor does not include built-in save functionality. Copy the Markdown source from the left panel and save it as a .md file on your computer.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
