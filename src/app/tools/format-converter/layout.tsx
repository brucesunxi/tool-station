import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Image Format Converter',
  description: 'Convert images between JPG, PNG, WebP, GIF, and AVIF formats online free. Batch convert with quality control. No sign-up or upload required.',
  keywords: ['image converter', 'convert JPG to PNG', 'convert to WebP', 'image format converter'],
}
export default function Layout({ children }: { children: React.ReactNode }) { return children }
