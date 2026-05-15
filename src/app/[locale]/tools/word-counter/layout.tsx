import { getToolMetadata } from '@/lib/tool-metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getToolMetadata(params, 'Word Counter', 'Count words, characters, sentences, paragraphs, and reading time online free. Real-time text analysis. No sign-up required.', 'word-counter')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
