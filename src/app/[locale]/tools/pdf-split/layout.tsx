import { getToolMetadata } from '@/lib/tool-metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getToolMetadata(params, 'PDF Splitter Free Online — Extract Pages From PDF', 'Free online PDF splitter. Extract specific pages from PDF files. Choose individual pages or ranges. Download the extracted pages as a new PDF document.', 'pdf-split')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
