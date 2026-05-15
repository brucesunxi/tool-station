import { getToolMetadata } from '@/lib/tool-metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getToolMetadata(params, 'AI Pros & Cons Analyzer', 'Get balanced pros and cons analysis for any decision, product, or idea. AI evaluates both sides with specific details. Free online tool.', 'ai-pros-cons')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
