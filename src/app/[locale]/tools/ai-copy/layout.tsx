import { getToolMetadata } from '@/lib/tool-metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getToolMetadata(params, 'AI Copywriter', 'Generate ad copy, product descriptions, and social media posts with AI. Choose format and tone. Free marketing copy generator for businesses.', 'ai-copy')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
