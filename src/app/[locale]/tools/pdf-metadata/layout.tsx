import { getToolMetadata } from '@/lib/tool-metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getToolMetadata(params, 'PDF Metadata Viewer Free Online — View PDF Properties', 'Free online PDF metadata viewer. View PDF document properties including title, author, subject, keywords, and creation date.', 'pdf-metadata')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
