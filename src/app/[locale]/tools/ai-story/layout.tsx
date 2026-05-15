import { getToolMetadata } from '@/lib/tool-metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getToolMetadata(params, 'AI Story Generator Free Online — Creative Story Writer', 'Free AI story generator. Write creative stories on any topic. Choose from fantasy, sci-fi, mystery, romance, and adventure genres.', 'ai-story')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
