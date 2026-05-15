import { getToolMetadata } from '@/lib/tool-metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getToolMetadata(params, 'UUID Generator', 'Generate UUID v4 and v7 identifiers online free. Bulk generate up to 1000 UUIDs at once. Copy with one click. No sign-up required.', 'uuid-generator')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
