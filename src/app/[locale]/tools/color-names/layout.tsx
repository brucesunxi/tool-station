import { getToolMetadata } from '@/lib/tool-metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getToolMetadata(params, 'Color Name Finder Free Online — Find Color Names', 'Free online color name finder. Enter any HEX or RGB color and find its closest named CSS color. Browse common color names with previews.', 'color-names')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
