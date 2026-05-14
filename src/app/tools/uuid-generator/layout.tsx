import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'UUID Generator',
  description: 'Generate UUID v4 and v7 identifiers online free. Bulk generate up to 1000 UUIDs at once. Copy with one click. No sign-up required.',
  keywords: ['UUID generator', 'generate UUID', 'UUID v4', 'UUID v7', 'unique ID generator'],
}
export default function Layout({ children }: { children: React.ReactNode }) { return children }
