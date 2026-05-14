import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'AI Text Summarizer',
  description: 'Summarize articles and text with AI. Get short, medium, or detailed summaries in paragraph or bullet point format. Free, no sign-up.',
  keywords: ['AI summarizer', 'text summarizer', 'article summarizer', 'AI summary generator'],
}
export default function Layout({ children }: { children: React.ReactNode }) { return children }
