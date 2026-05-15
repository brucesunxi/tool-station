import { getToolMetadata } from '@/lib/tool-metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getToolMetadata(params, 'AI Slogan Generator Free Online — Catchy Tagline Maker', 'Free AI slogan generator. Create catchy, memorable taglines for your brand, business, or campaign. Get multiple options to choose from.', 'ai-slogan')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
