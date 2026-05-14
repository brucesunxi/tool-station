import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'AI Translator',
  description: 'Translate text between 20+ languages with AI. Auto-detect source language. Free online translator with natural translations.',
  keywords: ['AI translator', 'online translator', 'language translator', 'translate text'],
}
export default function Layout({ children }: { children: React.ReactNode }) { return children }
