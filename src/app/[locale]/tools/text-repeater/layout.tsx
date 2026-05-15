import { getToolMetadata } from '@/lib/tool-metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getToolMetadata(params, 'Text Repeater Free Online — Repeat Text Multiple Times', 'Free online text repeater. Repeat any text multiple times with custom separators. Great for testing layouts, generating patterns, and filling templates.', 'text-repeater')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
