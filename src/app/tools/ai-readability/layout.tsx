import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'AI Readability Checker',
  description: 'Analyze text readability with AI. Get a readability score, statistics, improvement suggestions, and a simplified version. Free online tool.',
  keywords: ['readability checker', 'text readability', 'AI readability', 'readability score'],
}
export default function Layout({ children }: { children: React.ReactNode }) { return children }
