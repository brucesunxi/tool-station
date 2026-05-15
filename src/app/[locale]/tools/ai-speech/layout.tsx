import { getToolMetadata } from '@/lib/tool-metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getToolMetadata(params, 'AI Speech Writer Free Online — Speech Generator', 'Free AI speech writer. Write compelling speeches for weddings, business events, graduation, awards, and any occasion.', 'ai-speech')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
