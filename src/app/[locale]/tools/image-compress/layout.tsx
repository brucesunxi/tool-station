import { getToolMetadata } from '@/lib/tool-metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getToolMetadata(params, 'Image Compressor', 'Compress JPG, PNG, WebP images online free. Reduce file size while keeping quality. No upload — all processing happens in your browser.', 'image-compress')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
