import { getToolMetadata } from '@/lib/tool-metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getToolMetadata(params, 'Diff Checker', 'Compare text and code differences side by side online free. See line-level additions and removals highlighted. Perfect for code reviews.', 'diff-checker')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
