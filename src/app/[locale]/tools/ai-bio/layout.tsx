import { getToolMetadata } from '@/lib/tool-metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getToolMetadata(params, 'AI Bio Generator', 'Generate professional bios for LinkedIn, Twitter, Instagram, and websites. Choose from professional, creative, or casual tones. Free AI tool.', 'ai-bio')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
