import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Line Sorter Free Online — Sort Lines Alphabetically & by Length',
  description: 'Free online line sorter. Sort text lines A-Z, Z-A, by length, or shuffle randomly. Remove duplicates and organize your text instantly.',
  keywords: ['line sorter', 'sort lines', 'alphabetical order sorter', 'sort text online', 'remove duplicate lines'],
}
export default function Layout({ children }: { children: React.ReactNode }) { return children }
