import { getToolMetadata } from '@/lib/tool-metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getToolMetadata(params, 'Unicode Converter Free Online — Text to Unicode Escape', 'Free online Unicode converter. Convert text to Unicode escape sequences and back. Support for all Unicode characters including emoji and special symbols.', 'unicode-converter')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
