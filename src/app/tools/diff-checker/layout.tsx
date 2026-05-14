import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Diff Checker',
  description: 'Compare text and code differences side by side online free. See line-level additions and removals highlighted. Perfect for code reviews.',
  keywords: ['diff checker', 'text diff', 'compare text', 'code comparison tool'],
}
export default function Layout({ children }: { children: React.ReactNode }) { return children }
