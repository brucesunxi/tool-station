import { getToolMetadata } from '@/lib/tool-metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getToolMetadata(params, 'AI Email Generator', 'Generate professional emails with AI. Choose from 8 scenarios: inquiry, complaint, follow-up, thank you, proposal, and more. Free online tool.', 'ai-email')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
