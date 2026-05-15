import { getToolMetadata } from '@/lib/tool-metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getToolMetadata(params, 'AI Learning Path Generator — Personalized Roadmap', 'Free AI learning path generator. Create personalized learning roadmaps for any skill. Beginner to advanced stages with resources.', 'ai-learning')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
