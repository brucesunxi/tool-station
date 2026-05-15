import { getToolMetadata } from '@/lib/tool-metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getToolMetadata(params, 'Base64 Encoder & Decoder', 'Encode text or files to Base64 and decode Base64 back to text online free. Supports text input and file upload. No sign-up required.', 'base64')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
