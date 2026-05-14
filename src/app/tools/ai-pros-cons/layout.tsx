import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'AI Pros & Cons Analyzer',
  description: 'Get balanced pros and cons analysis for any decision, product, or idea. AI evaluates both sides with specific details. Free online tool.',
  keywords: ['pros and cons', 'decision maker', 'AI analysis', 'decision making tool'],
}
export default function Layout({ children }: { children: React.ReactNode }) { return children }
