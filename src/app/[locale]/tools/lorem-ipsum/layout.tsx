import { getToolMetadata } from '@/lib/tool-metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getToolMetadata(params, 'Lorem Ipsum Generator Free Online — Dummy Text Generator', 'Free online Lorem Ipsum generator. Generate placeholder text for your designs, mockups, and layouts. Choose paragraphs, words, or sentences.', 'lorem-ipsum')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
