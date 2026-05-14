import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'AI Grammar Checker',
  description: 'Check spelling, grammar, punctuation, and style with AI. Get corrected text with explanations. Free online grammar checker for English.',
  keywords: ['grammar checker', 'AI grammar check', 'spell checker', 'writing assistant'],
}
export default function Layout({ children }: { children: React.ReactNode }) { return children }
