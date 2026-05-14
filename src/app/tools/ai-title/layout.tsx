import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'AI Title Generator',
  description: 'Generate catchy titles for blog posts, YouTube videos, and ads. Choose from 5 styles: professional, clickbait, how-to, question, creative. Free.',
  keywords: ['title generator', 'AI title generator', 'blog title ideas', 'YouTube title generator'],
}
export default function Layout({ children }: { children: React.ReactNode }) { return children }
