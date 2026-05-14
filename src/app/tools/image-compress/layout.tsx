import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Image Compressor',
  description: 'Compress JPG, PNG, WebP images online free. Reduce file size while keeping quality. No upload — all processing happens in your browser.',
  keywords: ['image compressor', 'compress image', 'reduce image size', 'image optimizer'],
}
export default function Layout({ children }: { children: React.ReactNode }) { return children }
