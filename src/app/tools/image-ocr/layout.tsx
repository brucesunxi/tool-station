import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Image to Text Converter (OCR)',
  description: 'Extract text from images with OCR. Supports JPG, PNG, WebP. No upload needed — all processing runs in your browser using Tesseract.js.',
  keywords: ['image to text', 'OCR', 'extract text from image', 'image OCR online'],
}
export default function Layout({ children }: { children: React.ReactNode }) { return children }
