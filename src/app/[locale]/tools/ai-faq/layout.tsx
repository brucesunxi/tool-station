import { getToolMetadata } from '@/lib/tool-metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getToolMetadata(params, 'AI FAQ Generator Free Online — Frequently Asked Questions', 'Free AI FAQ generator. Generate comprehensive FAQ sections from any topic. Cover the most important questions with clear answers.', 'ai-faq')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
