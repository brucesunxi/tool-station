import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'QR Code Reader Free Online — Decode QR Codes From Images',
  description: 'Free online QR code reader. Upload a QR code image and instantly decode it. Read QR codes from screenshots, photos, and downloaded images. No app needed.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
