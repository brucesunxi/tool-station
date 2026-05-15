import { getToolMetadata } from '@/lib/tool-metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getToolMetadata(params, 'AI Readability Checker', 'Analyze text readability with AI. Get a readability score, statistics, improvement suggestions, and a simplified version. Free online tool.', 'ai-readability')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
