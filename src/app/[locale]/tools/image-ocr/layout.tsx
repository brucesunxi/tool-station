import { getToolMetadata } from '@/lib/tool-metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getToolMetadata(params, 'Image to Text Converter (OCR)', 'Extract text from images with OCR. Supports JPG, PNG, WebP. No upload needed — all processing runs in your browser using Tesseract.js.', 'image-ocr')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
