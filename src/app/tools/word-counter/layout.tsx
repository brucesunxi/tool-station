import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Word Counter',
  description: 'Count words, characters, sentences, paragraphs, and reading time online free. Real-time text analysis. No sign-up required.',
  keywords: ['word counter', 'character counter', 'word count tool', 'count words online'],
}
export default function Layout({ children }: { children: React.ReactNode }) { return children }
