import { getToolMetadata } from '@/lib/tool-metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getToolMetadata(params, 'AI Regex Generator', 'Describe your pattern in plain English and get the perfect regex. Includes explanation, examples, and flags. Free AI-powered regex generator online.', 'ai-regex')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
