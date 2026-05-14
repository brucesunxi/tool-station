import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Regex Tester',
  description: 'Test regular expressions online free with live highlighting. Supports JavaScript regex syntax with flags. Match, replace, and split modes. No sign-up.',
  keywords: ['regex tester', 'regular expression tester', 'regex online', 'test regex pattern'],
}
export default function Layout({ children }: { children: React.ReactNode }) { return children }
