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
