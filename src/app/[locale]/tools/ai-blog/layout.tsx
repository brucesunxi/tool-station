import { getToolMetadata } from '@/lib/tool-metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getToolMetadata(params, 'AI Blog Generator', 'Generate blog outlines, introductions, or full blog posts with AI. Choose tone (professional, conversational, persuasive) and include SEO keywords.', 'ai-blog')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
