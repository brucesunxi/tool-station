import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'PDF Compressor',
  description: 'Compress PDF files online free. Reduce file size while maintaining quality. No sign-up required. Secure — files are processed in memory and auto-deleted.',
  keywords: ['PDF compressor', 'compress PDF', 'reduce PDF size', 'PDF shrink'],
}
export default function Layout({ children }: { children: React.ReactNode }) { return children }
