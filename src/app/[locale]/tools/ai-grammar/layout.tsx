import { getToolMetadata } from '@/lib/tool-metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getToolMetadata(params, 'AI Grammar Checker', 'Check spelling, grammar, punctuation, and style with AI. Get corrected text with explanations. Free online grammar checker for English.', 'ai-grammar')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
