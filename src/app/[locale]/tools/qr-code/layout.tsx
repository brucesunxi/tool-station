import { getToolMetadata } from '@/lib/tool-metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getToolMetadata(params, 'QR Code Generator', 'Generate QR codes online free. Customize colors and size. Download as PNG. For URLs, text, and more. No sign-up required.', 'qr-code')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
