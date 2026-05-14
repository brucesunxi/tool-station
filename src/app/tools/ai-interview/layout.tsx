import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'AI Interview Question Generator',
  description: 'Generate interview questions for any role with AI. Technical, behavioral, or mixed questions with answering tips. Free tool for job preparation.',
  keywords: ['interview questions', 'AI interview', 'interview prep', 'job interview questions'],
}
export default function Layout({ children }: { children: React.ReactNode }) { return children }
