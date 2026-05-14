import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'AI Bio Generator',
  description: 'Generate professional bios for LinkedIn, Twitter, Instagram, and websites. Choose from professional, creative, or casual tones. Free AI tool.',
  keywords: ['AI bio generator', 'professional bio', 'LinkedIn bio', 'social media bio'],
}
export default function Layout({ children }: { children: React.ReactNode }) { return children }
