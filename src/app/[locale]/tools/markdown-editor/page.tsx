'use client'

import { useTranslations } from 'next-intl'
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
  const t = useTranslations('tools.markdown-editor')
  const ct = useTranslations('common')

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
        <h1 className="text-3xl font-bold mb-2">{t('h1')}</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{t('description')}</p>
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
            <label className="text-sm font-medium">{ct("preview")}</label>
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
