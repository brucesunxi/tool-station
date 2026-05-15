import { getToolMetadata } from '@/lib/tool-metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getToolMetadata(params, 'Image Format Converter', 'Convert images between JPG, PNG, WebP, GIF, and AVIF formats online free. Batch convert with quality control. No sign-up or upload required.', 'format-converter')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
