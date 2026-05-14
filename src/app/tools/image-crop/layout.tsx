import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Image Resizer & Cropper',
  description: 'Resize and crop images to exact dimensions online free. Upload, adjust, and download. No sign-up required. All processing in your browser.',
  keywords: ['image resizer', 'crop image', 'resize image online', 'image cropper'],
}
export default function Layout({ children }: { children: React.ReactNode }) { return children }
