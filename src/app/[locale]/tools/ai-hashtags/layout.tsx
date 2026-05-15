import { getToolMetadata } from '@/lib/tool-metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getToolMetadata(params, 'AI Hashtag Generator', 'Generate relevant hashtags for Instagram, Twitter, TikTok, and LinkedIn. Get popular, niche, and trending hashtags categorized by platform.', 'ai-hashtags')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
