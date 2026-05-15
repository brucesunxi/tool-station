import { getToolMetadata } from '@/lib/tool-metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getToolMetadata(params, 'PDF to JPG Converter Free Online — Convert PDF Pages to Images', 'Free online PDF to JPG converter. Convert each page of your PDF to high-quality JPG images. Perfect for sharing PDF content as images on social media.', 'pdf-to-jpg')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
