import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Citation Generator',
  description: 'Generate citations in MLA, APA, and Chicago style for books, websites, articles, and videos. Free academic citation tool. No sign-up required.',
  keywords: ['citation generator', 'MLA citation', 'APA citation', 'Chicago citation', 'bibliography generator'],
}
export default function Layout({ children }: { children: React.ReactNode }) { return children }
