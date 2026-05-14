import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Base64 Encoder & Decoder',
  description: 'Encode text or files to Base64 and decode Base64 back to text online free. Supports text input and file upload. No sign-up required.',
  keywords: ['Base64 encoder', 'Base64 decoder', 'Base64 encode online', 'Base64 decode'],
}
export default function Layout({ children }: { children: React.ReactNode }) { return children }
