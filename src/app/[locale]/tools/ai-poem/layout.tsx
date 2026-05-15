import { getToolMetadata } from '@/lib/tool-metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getToolMetadata(params, 'AI Poem Generator Free Online — Poetry Writer', 'Free AI poem generator. Write beautiful poems on any topic. Choose from sonnet, haiku, free verse, limerick, and acrostic styles.', 'ai-poem')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
