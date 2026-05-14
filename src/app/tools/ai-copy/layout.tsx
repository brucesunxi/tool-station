import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'AI Copywriter',
  description: 'Generate ad copy, product descriptions, and social media posts with AI. Choose format and tone. Free marketing copy generator for businesses.',
  keywords: ['AI copywriter', 'copywriting tool', 'ad copy generator', 'product description generator'],
}
export default function Layout({ children }: { children: React.ReactNode }) { return children }
