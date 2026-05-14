import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'AI Blog Generator',
  description: 'Generate blog outlines, introductions, or full blog posts with AI. Choose tone (professional, conversational, persuasive) and include SEO keywords.',
  keywords: ['AI blog generator', 'blog post generator', 'AI writing', 'content generator'],
}
export default function Layout({ children }: { children: React.ReactNode }) { return children }
