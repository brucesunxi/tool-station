import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'AI Flashcard Generator',
  description: 'Turn any text into Q&A study flashcards with AI. Perfect for students and lifelong learners. Generate unlimited flashcards from textbooks and notes.',
  keywords: ['flashcard generator', 'AI flashcards', 'study flashcards', 'AI study tool'],
}
export default function Layout({ children }: { children: React.ReactNode }) { return children }
