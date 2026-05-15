import { getToolMetadata } from '@/lib/tool-metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getToolMetadata(params, 'AI Social Media Post Generator — Content Creator', 'Free AI social media post generator. Create engaging content for Twitter, LinkedIn, Instagram, Facebook, and TikTok. Includes hashtags.', 'ai-social')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
