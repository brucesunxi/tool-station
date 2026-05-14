import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Document Converter',
  description: 'Convert between Word and PDF online free. Preserves images, text formatting, and layout. Convert PDF to Word with editable text. No sign-up.',
  keywords: ['document converter', 'PDF to Word', 'Word to PDF', 'doc converter online'],
}
export default function Layout({ children }: { children: React.ReactNode }) { return children }
