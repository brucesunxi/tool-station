import { getToolMetadata } from '@/lib/tool-metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getToolMetadata(params, 'Reverse Text Free Online — Reverse String, Words & Letters', 'Free online text reverser. Reverse entire strings, words, or letters instantly. Perfect for creating palindromes, puzzles, and fun text effects.', 'reverse-text')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
