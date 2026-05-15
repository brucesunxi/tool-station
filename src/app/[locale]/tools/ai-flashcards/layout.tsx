import { getToolMetadata } from '@/lib/tool-metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getToolMetadata(params, 'AI Flashcard Generator', 'Turn any text into Q&A study flashcards with AI. Perfect for students and lifelong learners. Generate unlimited flashcards from textbooks and notes.', 'ai-flashcards')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
