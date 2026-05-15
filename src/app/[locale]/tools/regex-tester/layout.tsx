import { getToolMetadata } from '@/lib/tool-metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getToolMetadata(params, 'Regex Tester', 'Test regular expressions online free with live highlighting. Supports JavaScript regex syntax with flags. Match, replace, and split modes. No sign-up.', 'regex-tester')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
