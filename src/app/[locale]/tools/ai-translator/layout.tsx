import { getToolMetadata } from '@/lib/tool-metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getToolMetadata(params, 'AI Translator', 'Translate text between 20+ languages with AI. Auto-detect source language. Free online translator with natural translations.', 'ai-translator')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
