import { getToolMetadata } from '@/lib/tool-metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getToolMetadata(params, 'AI Code Explainer Free Online — Code Explanation Tool', 'Free AI code explainer. Get plain-English explanations of any code. Understand complex programming concepts with simple breakdowns.', 'ai-code-explainer')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
