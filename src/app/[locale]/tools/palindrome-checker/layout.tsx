import { getToolMetadata } from '@/lib/tool-metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getToolMetadata(params, 'Palindrome Checker Free Online — Check Text & Phrases', 'Free online palindrome checker. Check if any word, phrase, or sentence reads the same forwards and backwards. Test ', 'palindrome-checker')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
