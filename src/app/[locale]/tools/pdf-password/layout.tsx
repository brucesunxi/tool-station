import { getToolMetadata } from '@/lib/tool-metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getToolMetadata(params, 'PDF Password Protector Free Online — Add or Remove PDF Passwords', 'Free online PDF password tool. Add password protection to your PDF files or remove existing passwords. Keep your documents secure.', 'pdf-password')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
