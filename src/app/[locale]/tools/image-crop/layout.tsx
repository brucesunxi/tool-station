import { getToolMetadata } from '@/lib/tool-metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getToolMetadata(params, 'Image Resizer & Cropper', 'Resize and crop images to exact dimensions online free. Upload, adjust, and download. No sign-up required. All processing in your browser.', 'image-crop')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
