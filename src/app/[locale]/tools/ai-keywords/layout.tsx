import { getToolMetadata } from '@/lib/tool-metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getToolMetadata(params, 'AI Keyword Extractor', 'Extract primary keywords, secondary keywords, and long-tail phrases from any text. Perfect for SEO research and content optimization. Free AI tool.', 'ai-keywords')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
