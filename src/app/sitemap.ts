import type { MetadataRoute } from 'next'
import { tools } from '@/lib/tools'

const BASE_URL = 'https://toolstation.top'
const locales = ['', 'zh/'] as const

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 1 },
    { url: `${BASE_URL}/zh`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${BASE_URL}/privacy`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.3 },
    { url: `${BASE_URL}/terms`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.3 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${BASE_URL}/search`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.6 },
  ] as MetadataRoute.Sitemap

  const toolPages: MetadataRoute.Sitemap = []
  for (const prefix of locales) {
    for (const t of tools) {
      toolPages.push({
        url: `${BASE_URL}/${prefix}${t.href.replace(/^\//, '')}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      })
    }
  }

  return [...staticPages, ...toolPages]
}
