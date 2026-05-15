import { getToolMetadata } from '@/lib/tool-metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getToolMetadata(params, 'PDF Merger', 'Merge multiple PDF files into one document online free. Combine PDFs in any order. No sign-up, no upload limits. Secure browser-based processing.', 'pdf-merge')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
