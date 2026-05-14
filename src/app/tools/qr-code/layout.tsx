import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'QR Code Generator',
  description: 'Generate QR codes online free. Customize colors and size. Download as PNG. For URLs, text, and more. No sign-up required.',
  keywords: ['QR code generator', 'QR creator', 'free QR code', 'QR code online'],
}
export default function Layout({ children }: { children: React.ReactNode }) { return children }
