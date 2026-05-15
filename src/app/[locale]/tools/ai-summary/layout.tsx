import { getToolMetadata } from '@/lib/tool-metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getToolMetadata(params, 'AI Text Summarizer', 'Summarize articles and text with AI. Get short, medium, or detailed summaries in paragraph or bullet point format. Free, no sign-up.', 'ai-summary')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
