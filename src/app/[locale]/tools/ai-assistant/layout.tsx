import { getToolMetadata } from '@/lib/tool-metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getToolMetadata(params, 'AI Chat Assistant', 'Chat with AI for writing, coding, analysis, and research. Free online AI assistant — no sign-up required. Ask anything and get instant answers.', 'ai-assistant')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
