import { getToolMetadata } from '@/lib/tool-metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getToolMetadata(params, 'AI Rewriter', 'Rewrite text in different styles: formal, casual, concise, or marketing. Change tone while preserving meaning. Free online tool.', 'ai-rewriter')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
