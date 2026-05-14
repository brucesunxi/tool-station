import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'AI Keyword Extractor',
  description: 'Extract primary keywords, secondary keywords, and long-tail phrases from any text. Perfect for SEO research and content optimization. Free AI tool.',
  keywords: ['keyword extractor', 'SEO keywords', 'keyword research tool', 'AI keyword generator'],
}
export default function Layout({ children }: { children: React.ReactNode }) { return children }
