import { getToolMetadata } from '@/lib/tool-metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getToolMetadata(params, 'Upside Down Text Generator Free Online — Flip Text Upside Down', 'Free upside-down text generator using Unicode characters to flip text. Create fun flipped text for social media bios, messages, and creative content.', 'upside-down-text')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
