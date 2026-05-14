import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'AI Regex Generator',
  description: 'Describe your pattern in plain English and get the perfect regex. Includes explanation, examples, and flags. Free AI-powered regex generator online.',
  keywords: ['regex generator', 'AI regex', 'regular expression generator', 'regex from text'],
}
export default function Layout({ children }: { children: React.ReactNode }) { return children }
