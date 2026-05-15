import { getToolMetadata } from '@/lib/tool-metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getToolMetadata(params, 'PDF Compressor', 'Compress PDF files online free. Reduce file size while maintaining quality. No sign-up required. Secure — files are processed in memory and auto-deleted.', 'pdf-compress')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
