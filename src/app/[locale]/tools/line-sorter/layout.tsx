import { getToolMetadata } from '@/lib/tool-metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getToolMetadata(params, 'Line Sorter Free Online — Sort Lines Alphabetically & by Length', 'Free online line sorter. Sort text lines A-Z, Z-A, by length, or shuffle randomly. Remove duplicates and organize your text instantly.', 'line-sorter')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
