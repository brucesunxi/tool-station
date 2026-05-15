import { getToolMetadata } from '@/lib/tool-metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getToolMetadata(params, 'AI Love Letter Generator — Romantic Letter Writer', 'Free AI love letter generator. Write beautiful, romantic love letters. Express your feelings with poetic, heartfelt, or playful messages.', 'ai-love-letter')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
