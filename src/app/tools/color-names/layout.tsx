import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Color Name Finder Free Online — Find Color Names',
  description: 'Free online color name finder. Enter any HEX or RGB color and find its closest named CSS color. Browse common color names with previews.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
