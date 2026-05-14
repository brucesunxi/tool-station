import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'PDF Merger',
  description: 'Merge multiple PDF files into one document online free. Combine PDFs in any order. No sign-up, no upload limits. Secure browser-based processing.',
  keywords: ['PDF merger', 'merge PDF', 'combine PDFs', 'join PDF files'],
}
export default function Layout({ children }: { children: React.ReactNode }) { return children }
