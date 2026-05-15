import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Image to PDF Converter Free Online — Convert Images to PDF',
  description: 'Free online image to PDF converter. Convert JPG, PNG, WebP, and other images to PDF documents. Choose page size and orientation. No upload required, all done in browser.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
