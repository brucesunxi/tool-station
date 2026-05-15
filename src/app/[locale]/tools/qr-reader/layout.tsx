import { getToolMetadata } from '@/lib/tool-metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getToolMetadata(params, 'QR Code Reader Free Online — Decode QR Codes From Images', 'Free online QR code reader. Upload a QR code image and instantly decode it. Read QR codes from screenshots, photos, and downloaded images. No app needed.', 'qr-reader')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
