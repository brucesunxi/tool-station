import type { MetadataRoute } from 'next'

const BASE_URL = 'https://toolstation.top'

const tools = [
  '/tools/image-compress',
  '/tools/image-crop',
  '/tools/format-converter',
  '/tools/pdf-merge',
  '/tools/pdf-to-ppt',
  '/tools/doc-converter',
  '/tools/ai-summary',
  '/tools/ai-translator',
  '/tools/ai-rewriter',
  '/tools/ai-assistant',
  '/tools/ai-grammar',
  '/tools/ai-email',
  '/tools/ai-title',
  '/tools/ai-keywords',
  '/tools/ai-blog',
  '/tools/ai-pros-cons',
  '/tools/ai-regex',
  '/tools/ai-hashtags',
  '/tools/ai-bio',
  '/tools/ai-copy',
  '/tools/ai-sql',
  '/tools/ai-code-convert',
  '/tools/ai-readability',
  '/tools/ai-interview',
  '/tools/ai-flashcards',
  '/tools/qr-code',
  '/tools/password-generator',
  '/tools/unit-converter',
  '/tools/pdf-compress',
  '/tools/diff-checker',
  '/tools/data-converter',
  '/tools/case-converter',
  '/tools/markdown-editor',
  '/tools/image-ocr',
  '/tools/random-tools',
  '/tools/resume-builder',
  '/tools/cover-letter',
  '/tools/citation-generator',
  '/tools/loan-calculator',
  '/tools/invoice-generator',
  '/tools/json-formatter',
  '/tools/base64',
  '/tools/url-encode',
  '/tools/uuid-generator',
  '/tools/regex-tester',
  '/tools/code-beautifier',
  '/tools/word-counter',
  '/tools/color-converter',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 1 },
    { url: `${BASE_URL}/privacy`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.3 },
    { url: `${BASE_URL}/terms`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.3 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
  ] as MetadataRoute.Sitemap

  const toolPages = tools.map(path => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [...staticPages, ...toolPages]
}
