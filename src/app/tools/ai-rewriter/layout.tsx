import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'AI Rewriter',
  description: 'Rewrite text in different styles: formal, casual, concise, or marketing. Change tone while preserving meaning. Free online tool.',
  keywords: ['AI rewriter', 'text rewriter', 'paraphrasing tool', 'rewrite text online'],
}
export default function Layout({ children }: { children: React.ReactNode }) { return children }
