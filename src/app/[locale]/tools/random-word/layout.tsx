import { getToolMetadata } from '@/lib/tool-metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getToolMetadata(params, 'Random Word Generator Free Online — Random Words & Phrases', 'Free online random word generator. Generate random English words, nouns, verbs, adjectives, or all categories. Perfect for brainstorming and creative writing.', 'random-word')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
