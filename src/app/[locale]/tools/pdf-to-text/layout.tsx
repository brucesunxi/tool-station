import { getToolMetadata } from '@/lib/tool-metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getToolMetadata(params, 'PDF to Text Extractor Free Online — Extract Text From PDF', 'Free online PDF text extractor. Extract all text content from PDF files. Perfect for copying text from scanned documents, reports, and academic papers.', 'pdf-to-text')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
