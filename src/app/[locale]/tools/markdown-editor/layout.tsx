import { getToolMetadata } from '@/lib/tool-metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getToolMetadata(params, 'Markdown Editor', 'Write Markdown with live preview online free. Supports GFM tables, code blocks, syntax highlighting, and more. Export as HTML. No sign-up.', 'markdown-editor')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
