import { getToolMetadata } from '@/lib/tool-metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getToolMetadata(params, 'Document Converter', 'Convert between Word and PDF online free. Preserves images, text formatting, and layout. Convert PDF to Word with editable text. No sign-up.', 'doc-converter')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
