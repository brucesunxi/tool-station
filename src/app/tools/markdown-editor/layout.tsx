import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Markdown Editor',
  description: 'Write Markdown with live preview online free. Supports GFM tables, code blocks, syntax highlighting, and more. Export as HTML. No sign-up.',
  keywords: ['markdown editor', 'markdown preview', 'online markdown editor', 'MD editor'],
}
export default function Layout({ children }: { children: React.ReactNode }) { return children }
