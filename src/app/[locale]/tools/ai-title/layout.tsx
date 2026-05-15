import { getToolMetadata } from '@/lib/tool-metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getToolMetadata(params, 'AI Title Generator', 'Generate catchy titles for blog posts, YouTube videos, and ads. Choose from 5 styles: professional, clickbait, how-to, question, creative. Free.', 'ai-title')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
