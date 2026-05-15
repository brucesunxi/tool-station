import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Random Word Generator Free Online — Random Words & Phrases',
  description: 'Free online random word generator. Generate random English words, nouns, verbs, adjectives, or all categories. Perfect for brainstorming and creative writing.',
  keywords: ['random word generator', 'random words', 'word generator', 'random vocabulary', 'creative writing tool'],
}
export default function Layout({ children }: { children: React.ReactNode }) { return children }
