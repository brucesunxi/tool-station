import { getToolMetadata } from '@/lib/tool-metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getToolMetadata(params, 'Image to PDF Converter Free Online — Convert Images to PDF', 'Free online image to PDF converter. Convert JPG, PNG, WebP, and other images to PDF documents. Choose page size and orientation. No upload required, all done in browser.', 'image-to-pdf')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
