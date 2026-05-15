import { getToolMetadata } from '@/lib/tool-metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getToolMetadata(params, 'AI Interview Question Generator', 'Generate interview questions for any role with AI. Technical, behavioral, or mixed questions with answering tips. Free tool for job preparation.', 'ai-interview')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
